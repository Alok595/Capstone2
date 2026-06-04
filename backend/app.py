"""TruthShield API.

SMS scam and URL phishing detection service used by the React frontend.
"""

from contextlib import asynccontextmanager
from dataclasses import dataclass
import logging
import os
import pickle
import re
from threading import Lock, Thread
import time
from pathlib import Path
from typing import Any

from fastapi import FastAPI, HTTPException, Request, Response, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field


logging.basicConfig(
    level=os.getenv("LOG_LEVEL", "INFO").upper(),
    format="%(asctime)s %(levelname)s %(name)s - %(message)s",
)
logger = logging.getLogger("truthshield")

BASE_DIR = Path(__file__).resolve().parent
PRELOAD_MODELS = os.getenv("PRELOAD_MODELS", "true").lower() in {"1", "true", "yes"}


@dataclass(frozen=True)
class SmsAssets:
    model: Any
    vectorizer: Any


@dataclass(frozen=True)
class UrlAssets:
    model: Any
    vectorizer: Any


_sms_assets: SmsAssets | None = None
_url_assets: UrlAssets | None = None
_sms_assets_lock = Lock()
_url_assets_lock = Lock()


class TextAnalyzeRequest(BaseModel):
    text: str = Field(..., min_length=1)


class UrlAnalyzeRequest(BaseModel):
    url: str = Field(..., min_length=1)


def _split_env_list(value: str | None) -> list[str]:
    if not value:
        return []
    return [item.strip().rstrip("/") for item in value.split(",") if item.strip()]


def _cors_origins() -> list[str]:
    configured_origins = _split_env_list(os.getenv("CORS_ORIGINS"))
    default_origins = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]
    return configured_origins or default_origins


def _repair_logistic_regression_compatibility(model: Any) -> None:
    """Repair older/newer sklearn pickle attribute drift used by predict_proba."""
    if model.__class__.__name__ == "LogisticRegression" and not hasattr(
        model, "multi_class"
    ):
        model.multi_class = "auto"


def _elapsed_ms(started_at: float) -> float:
    return (time.perf_counter() - started_at) * 1000


def _load_pickle(filename: str) -> Any:
    artifact_path = BASE_DIR / filename
    started_at = time.perf_counter()
    logger.info(
        "model_artifact_load_start artifact=%s size_mb=%.2f",
        filename,
        artifact_path.stat().st_size / 1024 / 1024,
    )

    try:
        with artifact_path.open("rb") as artifact_file:
            artifact = pickle.load(artifact_file)
    except FileNotFoundError as exc:
        logger.exception("Model artifact is missing: %s", exc.filename)
        raise RuntimeError(f"Missing model artifact: {exc.filename}") from exc
    except Exception as exc:
        logger.exception("Failed to load model artifact: %s", filename)
        raise RuntimeError(f"Failed to load model artifact: {filename}") from exc

    logger.info(
        "model_artifact_load_complete artifact=%s elapsed_ms=%.2f",
        filename,
        _elapsed_ms(started_at),
    )
    return artifact


def load_sms_assets() -> SmsAssets:
    global _sms_assets

    if _sms_assets is not None:
        return _sms_assets

    with _sms_assets_lock:
        if _sms_assets is not None:
            return _sms_assets

        started_at = time.perf_counter()
        logger.info("sms_model_load_start")
        sms_model = _load_pickle("model.pkl")
        sms_vectorizer = _load_pickle("vectorizer.pkl")
        _repair_logistic_regression_compatibility(sms_model)
        _sms_assets = SmsAssets(model=sms_model, vectorizer=sms_vectorizer)
        logger.info("sms_model_load_complete elapsed_ms=%.2f", _elapsed_ms(started_at))
        return _sms_assets


def load_url_assets() -> UrlAssets:
    global _url_assets

    if _url_assets is not None:
        return _url_assets

    with _url_assets_lock:
        if _url_assets is not None:
            return _url_assets

        started_at = time.perf_counter()
        logger.info("url_model_load_start")
        url_model = _load_pickle("url_model.pkl")
        url_vectorizer = _load_pickle("url_vectorizer.pkl")
        _repair_logistic_regression_compatibility(url_model)
        _url_assets = UrlAssets(model=url_model, vectorizer=url_vectorizer)
        logger.info("url_model_load_complete elapsed_ms=%.2f", _elapsed_ms(started_at))
        return _url_assets


def load_models() -> dict[str, Any]:
    """Backward-compatible loader for scripts that expect all artifacts."""
    sms_assets = load_sms_assets()
    url_assets = load_url_assets()
    return {
        "sms_model": sms_assets.model,
        "sms_vectorizer": sms_assets.vectorizer,
        "url_model": url_assets.model,
        "url_vectorizer": url_assets.vectorizer,
    }


def warm_models() -> None:
    started_at = time.perf_counter()
    logger.info("model_warmup_start")
    try:
        load_sms_assets()
        load_url_assets()
    except Exception:
        logger.exception("model_warmup_failed")
        return
    logger.info("model_warmup_complete elapsed_ms=%.2f", _elapsed_ms(started_at))


@asynccontextmanager
async def lifespan(_: FastAPI):
    started_at = time.perf_counter()
    logger.info("startup_start preload_models=%s base_dir=%s", PRELOAD_MODELS, BASE_DIR)
    logger.info("Allowed CORS origins: %s", _cors_origins())
    if PRELOAD_MODELS:
        Thread(target=warm_models, name="model-warmup", daemon=True).start()
        logger.info("startup_model_warmup_dispatched")
    logger.info("startup_complete elapsed_ms=%.2f", _elapsed_ms(started_at))
    yield


app = FastAPI(title="TruthShield API", version="1.0.0", lifespan=lifespan)


@app.middleware("http")
async def log_request_timing(request: Request, call_next):
    started_at = time.perf_counter()
    response = await call_next(request)
    logger.info(
        "request_complete method=%s path=%s status_code=%s total_ms=%.2f",
        request.method,
        request.url.path,
        response.status_code,
        _elapsed_ms(started_at),
    )
    return response


def model_status() -> dict[str, bool]:
    return {
        "sms_ready": _sms_assets is not None,
        "url_ready": _url_assets is not None,
    }

app.add_middleware(
    CORSMiddleware,
    allow_origins=_cors_origins(),
    allow_origin_regex=os.getenv(
        "CORS_ORIGIN_REGEX",
        r"https://.*\.(vercel\.app|netlify\.app)$",
    ),
    allow_credentials=False,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)


@app.get("/")
def health() -> dict[str, Any]:
    return {"status": "ok", "models": model_status()}


@app.get("/health")
def health_check() -> dict[str, Any]:
    return {"status": "ok", "models": model_status()}


@app.get("/ready")
def readiness_check(response: Response) -> dict[str, Any]:
    models = model_status()
    ready = all(models.values())
    if not ready:
        response.status_code = status.HTTP_503_SERVICE_UNAVAILABLE
    return {"status": "ready" if ready else "warming", "models": models}

# =========================
# Text Cleaner
# =========================

def normalize(text):
    text = text.lower()
    text = re.sub(r"http\S+", "", text)
    text = re.sub(r"[^a-zA-Z0-9:/._ -]", "", text)
    return text

# =========================
# Scam Keyword Detector
# =========================

def detect_red_flags(text):

    flags = []

    suspicious_words = [
        "win",
        "winner",
        "free",
        "cash",
        "prize",
        "offer",
        "urgent",
        "click",
        "bank",
        "verify",
        "account",
        "password",
        "login",
        "otp",
        "reward",
        "payment",
        "gift",
        "money",
        "limited"
    ]

    text = text.lower()

    for word in suspicious_words:
        if word in text:
            flags.append(f"contains '{word}'")

    # Number detection
    if re.search(r"\d{5,}", text):
        flags.append("contains large amount")

    return flags

# =========================
# URL Red Flag Detector
# =========================

def detect_url_flags(url):

    flags = []

    url = url.lower()

    suspicious_words = [
        "login",
        "verify",
        "secure",
        "update",
        "bank",
        "wallet",
        "payment",
        "signin",
        "account"
    ]

    for word in suspicious_words:
        if word in url:
            flags.append(f"contains '{word}'")

    if "@" in url:
        flags.append("contains @ symbol")

    if "-" in url:
        flags.append("contains hyphen")

    if len(url) > 75:
        flags.append("very long url")

    if url.count(".") > 4:
        flags.append("too many dots")

    if "http://" in url:
        flags.append("uses insecure http")

    return flags

# =========================
# Risk Level Function
# =========================

def get_risk_level(score):

    if score <= 30:
        return "Low"

    elif score <= 60:
        return "Medium"

    else:
        return "High"

# =========================
# SMS Scam Detection API
# =========================

@app.post("/analyze-text")
def analyze_text(payload: TextAnalyzeRequest):
    request_started_at = time.perf_counter()
    assets = load_sms_assets()

    try:
        normalize_started_at = time.perf_counter()
        clean = normalize(payload.text)
        normalize_ms = _elapsed_ms(normalize_started_at)

        vectorize_started_at = time.perf_counter()
        text_vec = assets.vectorizer.transform([clean])
        vectorize_ms = _elapsed_ms(vectorize_started_at)

        predict_started_at = time.perf_counter()
        prob = assets.model.predict_proba(text_vec)[0][1]
        prediction_ms = _elapsed_ms(predict_started_at)
    except Exception as exc:
        logger.exception("SMS analysis failed")
        raise HTTPException(status_code=500, detail="SMS analysis failed") from exc

    flags_started_at = time.perf_counter()
    red_flags = detect_red_flags(clean)
    flags_ms = _elapsed_ms(flags_started_at)

    score = int(prob * 80 + len(red_flags) * 10)

    if score > 100:
        score = 100

    if score > 60:
        result = "SCAM"

    elif score > 30:
        result = "SUSPICIOUS"

    else:
        result = "SAFE"

    total_ms = _elapsed_ms(request_started_at)
    logger.info(
        "analyze_text_timing normalize_ms=%.2f vectorize_ms=%.2f prediction_ms=%.2f "
        "flags_ms=%.2f total_ms=%.2f",
        normalize_ms,
        vectorize_ms,
        prediction_ms,
        flags_ms,
        total_ms,
    )

    return {
        "type": "SMS Scam Detection",
        "result": result,
        "risk_score": score,
        "risk_level": get_risk_level(score),
        "red_flags": red_flags
    }

# =========================
# URL Phishing Detection API
# =========================

@app.post("/analyze-url")
def analyze_url(payload: UrlAnalyzeRequest):
    request_started_at = time.perf_counter()
    assets = load_url_assets()

    try:
        normalize_started_at = time.perf_counter()
        clean = normalize(payload.url)
        normalize_ms = _elapsed_ms(normalize_started_at)

        vectorize_started_at = time.perf_counter()
        url_vec = assets.vectorizer.transform([clean])
        vectorize_ms = _elapsed_ms(vectorize_started_at)

        predict_started_at = time.perf_counter()
        prob = assets.model.predict_proba(url_vec)[0][1]
        prediction_ms = _elapsed_ms(predict_started_at)
    except Exception as exc:
        logger.exception("URL analysis failed")
        raise HTTPException(status_code=500, detail="URL analysis failed") from exc

    flags_started_at = time.perf_counter()
    red_flags = detect_url_flags(clean)
    flags_ms = _elapsed_ms(flags_started_at)

    score = int(prob * 80 + len(red_flags) * 10)

    if score > 100:
        score = 100

    if score > 60:
        result = "PHISHING"

    elif score > 30:
        result = "SUSPICIOUS"

    else:
        result = "SAFE"

    total_ms = _elapsed_ms(request_started_at)
    logger.info(
        "analyze_url_timing normalize_ms=%.2f vectorize_ms=%.2f prediction_ms=%.2f "
        "flags_ms=%.2f total_ms=%.2f",
        normalize_ms,
        vectorize_ms,
        prediction_ms,
        flags_ms,
        total_ms,
    )

    return {
        "type": "URL Phishing Detection",
        "result": result,
        "risk_score": score,
        "risk_level": get_risk_level(score),
        "red_flags": red_flags
    }


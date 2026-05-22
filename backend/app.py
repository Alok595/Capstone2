from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import pickle
import re
import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification


# --------------------------------------------------
# FastAPI App
# --------------------------------------------------
app = FastAPI(
    title="Truth Shield API",
    version="1.0.0",
    description="SMS Scam Detection + Fake News Detection"
)

# --------------------------------------------------
# CORS
# --------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # Restrict in production
    allow_methods=["*"],
    allow_headers=["*"],
)

# --------------------------------------------------
# Load SMS Scam Detection Model (Scikit-learn)
# --------------------------------------------------
with open("models/sms_model/model.pkl", "rb") as f:
    sms_model = pickle.load(f)

with open("vectorizer.pkl", "rb") as f:
    sms_vectorizer = pickle.load(f)

# --------------------------------------------------
# Load Fake News Detection Model (Transformers)
# Folder structure:
# backend/
#   models/
#     fake_news/
#       config.json
#       model.safetensors
#       tokenizer.json
#       tokenizer_config.json
# --------------------------------------------------
# FAKE_NEWS_PATH = "models/fake_news"   this is for loaclly

FAKE_NEWS_PATH = "Alok595/fake_news"

news_tokenizer = AutoTokenizer.from_pretrained(FAKE_NEWS_PATH)
news_model = AutoModelForSequenceClassification.from_pretrained(FAKE_NEWS_PATH)
news_model.eval()


# --------------------------------------------------
# Utility Functions
# --------------------------------------------------
def normalize(text: str) -> str:
    text = text.lower()
    text = re.sub(r"http\S+", "", text)
    text = re.sub(r"[^a-z0-9\s]", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text


scam_keywords = [
    "win", "won", "prize", "reward", "cash", "free",
    "click", "urgent", "limited", "offer", "otp",
    "upi", "bank", "account", "verify", "password"
]


def detect_red_flags(text: str):
    flags = []

    for word in scam_keywords:
        if re.search(rf"\b{re.escape(word)}\b", text):
            flags.append(f"contains '{word}'")

    if re.search(r"\b\d{4,}\b", text):
        flags.append("contains large amount")

    return flags


# --------------------------------------------------
# Home Endpoint
# --------------------------------------------------
@app.get("/")
def home():
    return {"message": "Truth Shield API Running"}


# --------------------------------------------------
# SMS Scam Detection Endpoint
# POST /analyze-text?text=You won 5000 cash reward
# --------------------------------------------------
@app.post("/analyze-text")
def analyze_text(text: str):
    clean = normalize(text)

    # ML prediction
    text_vec = sms_vectorizer.transform([clean])
    prob = float(sms_model.predict_proba(text_vec)[0][1])

    # Rule-based red flags
    red_flags = detect_red_flags(clean)

    # Hybrid score
    score = int(prob * 70 + min(len(red_flags) * 5, 20))
    score = min(score, 100)

    # Risk level
    if score <= 30:
        risk_level = "Low"
    elif score <= 50:
        risk_level = "Medium"
    else:
        risk_level = "High"

    # Final result
    result = "SCAM" if score > 50 else "SAFE"

    return {
        "input_text": text,
        "result": result,
        "risk_score": score,
        "risk_level": risk_level,
        "confidence": round(prob * 100, 2),
        "red_flags": red_flags
    }


# --------------------------------------------------
# Fake News Detection Endpoint
# POST /analyze-news?text=Breaking news...
# --------------------------------------------------
@app.post("/analyze-news")
def analyze_news(text: str):
    inputs = news_tokenizer(
        text,
        return_tensors="pt",
        truncation=True,
        padding=True,
        max_length=512
    )

    with torch.no_grad():
        outputs = news_model(**inputs)
        probabilities = torch.softmax(outputs.logits, dim=1)

    fake_prob = float(probabilities[0][1].item())
    confidence = round(fake_prob * 100, 2)

    result = "FAKE" if fake_prob > 0.5 else "REAL"

    risk_level = (
        "Low" if confidence < 30
        else "Medium" if confidence < 60
        else "High"
    )

    return {
        "input_text": text,
        "result": result,
        "confidence": confidence,
        "risk_score": int(confidence),
        "risk_level": risk_level,
        "red_flags": []
    }
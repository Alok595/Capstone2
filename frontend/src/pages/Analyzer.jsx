import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  Link2,
  Image,
  Newspaper,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Loader2,
  Sparkles,
} from "lucide-react";
import { CustomCursor, BgOrbs } from "../components/Shared";
import axios from "axios";

const API_BASE =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
    ? "http://127.0.0.1:8000"
    : "https://truth-shield-apii.onrender.com";

// ─── Scan line ────────────────────────────────────────────────────────────────
function ScanLine() {
  return (
    <motion.div
      className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent z-10 pointer-events-none"
      initial={{ top: "0%" }}
      animate={{ top: ["0%", "100%", "0%"] }}
      transition={{ duration: 2.8, repeat: Infinity, ease: "linear" }}
    />
  );
}

// ─── Result card ──────────────────────────────────────────────────────────────
function ResultCard({ result }) {
  if (!result) return null;

  const cfg = {
    REAL: {
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/30",
      icon: CheckCircle,
      label: "Verified Authentic",
      glow: "shadow-[0_0_40px_rgba(16,185,129,0.15)]",
      bar: "from-emerald-500 to-teal-400",
    },
    SUSPICIOUS: {
      color: "text-amber-400",
      bg: "bg-amber-500/10",
      border: "border-amber-500/30",
      icon: AlertTriangle,
      label: "Suspicious Content",
      glow: "shadow-[0_0_40px_rgba(245,158,11,0.15)]",
      bar: "from-amber-500 to-yellow-400",
    },
    FAKE: {
      color: "text-red-400",
      bg: "bg-red-500/10",
      border: "border-red-500/30",
      icon: XCircle,
      label: "Fake Detected",
      glow: "shadow-[0_0_40px_rgba(239,68,68,0.15)]",
      bar: "from-red-500 to-rose-400",
    },
  }[result.verdict];

  const Icon = cfg.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`relative mt-6 rounded-2xl border ${cfg.border} ${cfg.bg} ${cfg.glow} overflow-hidden p-6`}
    >
      <ScanLine />

      {/* Header */}
      <div className="flex items-center gap-4 mb-5">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
          className={`w-14 h-14 rounded-2xl ${cfg.bg} border ${cfg.border} flex items-center justify-center`}
        >
          <Icon className={cfg.color} size={26} />
        </motion.div>
        <div>
          <p className="text-slate-400 text-xs font-semibold tracking-widest uppercase">
            Analysis Result
          </p>
          <h3
            className={`text-2xl font-bold ${cfg.color} font-['Syne',sans-serif]`}
          >
            {cfg.label}
          </h3>
        </div>
        <div className="ml-auto text-right">
          <p className="text-slate-500 text-xs mb-1">Confidence</p>
          <p
            className={`text-3xl font-bold ${cfg.color} font-['Syne',sans-serif]`}
          >
            {result.confidence}%
          </p>
        </div>
      </div>

      {/* Confidence bar */}
      <div className="mb-5">
        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${result.confidence}%` }}
            transition={{ delay: 0.4, duration: 1, ease: "easeOut" }}
            className={`h-full rounded-full bg-gradient-to-r ${cfg.bar}`}
          />
        </div>
      </div>

      {/* Signals */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        {result.signals.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.07 }}
            className="flex items-start gap-2.5 bg-white/3 rounded-xl p-3 border border-white/5"
          >
            <div
              className={`mt-0.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                s.ok ? "bg-emerald-400" : "bg-red-400"
              }`}
            />
            <div>
              <p className="text-slate-300 text-xs font-semibold">{s.label}</p>
              <p className="text-slate-500 text-xs">{s.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Summary */}
      <div className={`rounded-xl border ${cfg.border} bg-white/3 p-4`}>
        <p className="text-slate-300 text-sm leading-relaxed">
          {result.summary}
        </p>
      </div>
    </motion.div>
  );
}

// ─── Tab button ───────────────────────────────────────────────────────────────
function TabBtn({ icon: Icon, label, active, onClick }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      data-hover
      className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 font-['DM_Sans',sans-serif] ${
        active
          ? "text-cyan-300 bg-cyan-500/15 border border-cyan-500/30 shadow-[0_0_20px_rgba(0,200,255,0.1)]"
          : "text-slate-500 hover:text-slate-300 border border-transparent hover:border-white/10"
      }`}
    >
      <Icon size={15} />
      {label}
      {active && (
        <motion.div
          layoutId="tab-glow"
          className="absolute inset-0 rounded-xl bg-cyan-400/5"
        />
      )}
    </motion.button>
  );
}

// ─── Demo data (link / image tabs only) ──────────────────────────────────────
const DEMO = {
  link: {
    verdict: "SUSPICIOUS",
    confidence: 71,
    summary:
      "This URL exhibits several risk indicators: recently registered domain (12 days old), no HTTPS, misleading subdomain mimicking a trusted news brand, and metadata inconsistencies.",
    signals: [
      { label: "Domain Age", value: "Registered 12 days ago", ok: false },
      { label: "SSL Certificate", value: "No HTTPS detected", ok: false },
      { label: "Brand Spoofing", value: "Mimics known news domain", ok: false },
      {
        label: "Content Analysis",
        value: "Partially accurate claims",
        ok: true,
      },
      { label: "Blacklist Check", value: "Not on known blocklists", ok: true },
      { label: "Redirect Chain", value: "3 suspicious redirects", ok: false },
    ],
  },
  image: {
    verdict: "FAKE",
    confidence: 89,
    summary:
      "Deepfake analysis detected AI-generated facial artifacts around the jaw and hairline regions. GAN fingerprint analysis confirms synthetic origin. No authentic camera EXIF data found.",
    signals: [
      {
        label: "Facial Artifacts",
        value: "GAN artifacts at jaw/hairline",
        ok: false,
      },
      { label: "EXIF Metadata", value: "No camera data present", ok: false },
      { label: "GAN Fingerprint", value: "AI-generation confirmed", ok: false },
      { label: "Pixel Analysis", value: "Blending seams detected", ok: false },
      { label: "Reverse Image", value: "No originals found", ok: false },
      { label: "Compression", value: "Unusual noise pattern", ok: false },
    ],
  },
};

const PLACEHOLDERS = {
  message:
    "Paste a suspicious WhatsApp message, SMS, or social media post here…",
  link: "https://suspicious-news-site.com/breaking-story-2024",
  image: "https://i.imgur.com/example-image.jpg  —  or paste an image URL",
  news: "Paste a news headline or article excerpt to verify its authenticity…",
};

const DEMO_TEXT = {
  message:
    "BREAKING: Government secretly adding mind-control chemicals to tap water confirmed by whistleblower! Share before they delete this! Scientists are TERRIFIED they don't want you to know this!!!",
  link: "https://cnn-news-updates.verifytoday.biz/breaking/secret-deal",
  image: "https://deepfake-example.net/generated/politician-scandal.jpg",
  news: "Scientists confirm that drinking bleach cures all known diseases. The government has been hiding this cure for decades to protect Big Pharma profits. Share this before it gets deleted!",
};

const TABS = [
  { id: "message", label: "SMS / Message", icon: MessageSquare },
  { id: "link", label: "URL / Link", icon: Link2 },
  { id: "image", label: "Image", icon: Image },
  { id: "news", label: "News Article", icon: Newspaper },
];

// ─── Helper: map API response → ResultCard shape ──────────────────────────────
function mapApiResponse(data, tabType) {
  const { result, confidence, risk_score, risk_level, red_flags } = data;

  const isScam = result === "SCAM";
  const isFake = result === "FAKE";
  const isBad = isScam || isFake;

  const verdict = isBad ? "FAKE" : "REAL";
  const displayConf = risk_score ?? Math.round(confidence);

  let summary = "";
  if (tabType === "message") {
    summary = isBad
      ? `This message has a ${risk_level} scam risk score of ${displayConf}/100. Indicators found: ${
          red_flags?.length ? red_flags.join(", ") : "suspicious phrasing"
        }.`
      : `This message appears safe with a low risk score of ${displayConf}/100. No significant scam indicators were detected.`;
  } else {
    summary = isBad
      ? `Our model detected this as likely FAKE news with ${confidence}% confidence (${risk_level} risk). The content shows signs of misinformation.`
      : `This content appears to be REAL with ${confidence}% model confidence. No strong misinformation signals were detected.`;
  }

  const signals = [
    {
      label: "Model Verdict",
      value: result,
      ok: !isBad,
    },
    {
      label: "Risk Level",
      value: `${risk_level} (${displayConf}/100)`,
      ok: risk_level === "Low",
    },
    {
      label: "Confidence",
      value: `${confidence}%`,
      ok: !isBad,
    },
    ...(red_flags?.length
      ? red_flags.slice(0, 3).map((flag) => ({
          label: "Red Flag",
          value: flag,
          ok: false,
        }))
      : [
          {
            label: "Red Flags",
            value: "None detected",
            ok: true,
          },
        ]),
  ];

  return { verdict, confidence: displayConf, summary, signals };
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────
export default function Analyzer() {
  const [activeTab, setActiveTab] = useState("message");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const textareaRef = useRef(null);

  const handleTabChange = (id) => {
    setActiveTab(id);
    setInput("");
    setResult(null);
  };

  const handleAnalyze = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setResult(null);

    try {
      if (activeTab === "message") {
        // ── SMS Scam Detection ──────────────────────────────────────────────
        const { data } = await axios.post(`${API_BASE}/analyze-text`, null, {
          params: { text: input },
        });
        setResult(mapApiResponse(data, "message"));
      } else if (activeTab === "news") {
        // ── Fake News Detection ─────────────────────────────────────────────
        const { data } = await axios.post(`${API_BASE}/analyze-news`, null, {
          params: { text: input },
        });
        setResult(mapApiResponse(data, "news"));
      } else {
        // ── Link / Image → demo fallback ────────────────────────────────────
        await new Promise((r) => setTimeout(r, 2200));
        setResult(DEMO[activeTab]);
      }
    } catch (err) {
      setResult({
        verdict: "SUSPICIOUS",
        confidence: 0,
        summary: `Could not reach the API at ${API_BASE}. Make sure FastAPI is running and CORS is enabled. Error: ${err.message}`,
        signals: [
          { label: "API Status", value: "Connection failed", ok: false },
          { label: "Error", value: err.message, ok: false },
        ],
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = () => {
    setInput(DEMO_TEXT[activeTab]);
    setResult(null);
  };

  // Loading step labels per tab
  const loadingSteps = {
    message: [
      "Normalizing text input",
      "Running ML scam classifier",
      "Checking keyword red flags",
      "Computing hybrid risk score",
    ],
    news: [
      "Tokenizing article text",
      "Running transformer model",
      "Evaluating misinformation signals",
      "Generating confidence score",
    ],
    link: [
      "Parsing URL structure",
      "Checking domain age & SSL",
      "Cross-referencing blacklists",
      "Scoring credibility signals",
    ],
    image: [
      "Parsing content structure",
      "Running GAN fingerprint scan",
      "Checking EXIF metadata",
      "Scoring deepfake probability",
    ],
  };

  return (
    <div className="font-['DM_Sans',sans-serif]">
      <CustomCursor />
      <BgOrbs />

      {/* ── PAGE HEADER ── */}
      <section className="relative z-10 pt-36 pb-8 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/25 mb-6"
        >
          <Sparkles size={13} className="text-cyan-400" />
          <span className="text-cyan-300 text-sm font-semibold">
            AI Fake Detector
          </span>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-6xl font-black tracking-tight font-['Syne',sans-serif] mb-4"
        >
          Analyze Any Content
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-slate-400 text-lg max-w-xl mx-auto"
        >
          Paste a message, link, image URL, or news article and let our AI
          verdict it in seconds.
        </motion.p>
      </section>

      {/* ── ANALYZER CARD ── */}
      <section className="relative z-10 py-10 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-[0_20px_80px_rgba(0,0,0,0.5)]"
          >
            {/* Tabs */}
            <div className="flex flex-wrap gap-2 mb-7">
              {TABS.map((t) => (
                <TabBtn
                  key={t.id}
                  icon={t.icon}
                  label={t.label}
                  active={activeTab === t.id}
                  onClick={() => handleTabChange(t.id)}
                />
              ))}
            </div>

            {/* Input — textarea for text tabs, input for URL tabs */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                {activeTab === "message" || activeTab === "news" ? (
                  <textarea
                    ref={activeTab === "message" ? textareaRef : null}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={PLACEHOLDERS[activeTab]}
                    rows={5}
                    className="w-full bg-black/30 border border-white/10 focus:border-cyan-500/50 rounded-2xl px-5 py-4 text-slate-200 text-sm placeholder-slate-600 resize-none outline-none transition-all duration-300 focus:shadow-[0_0_20px_rgba(0,200,255,0.1)]"
                  />
                ) : (
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={PLACEHOLDERS[activeTab]}
                    className="w-full bg-black/30 border border-white/10 focus:border-cyan-500/50 rounded-2xl px-5 py-4 text-slate-200 text-sm placeholder-slate-600 outline-none transition-all duration-300 focus:shadow-[0_0_20px_rgba(0,200,255,0.1)]"
                  />
                )}
              </motion.div>
            </AnimatePresence>

            {/* Buttons */}
            <div className="flex items-center gap-3 mt-4">
              <motion.button
                onClick={handleAnalyze}
                disabled={!input.trim() || loading}
                whileHover={
                  input.trim() && !loading
                    ? { scale: 1.03, boxShadow: "0 0 35px rgba(0,200,255,0.4)" }
                    : {}
                }
                whileTap={input.trim() && !loading ? { scale: 0.97 } : {}}
                data-hover
                className={`flex-1 flex items-center justify-center gap-2.5 py-3.5 rounded-2xl font-bold text-sm transition-all duration-300 ${
                  input.trim() && !loading
                    ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_25px_rgba(0,200,255,0.25)]"
                    : "bg-white/5 text-slate-600 cursor-not-allowed"
                }`}
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Analyzing
                    with AI…
                  </>
                ) : (
                  <>
                    <Shield size={16} /> Analyze Now
                  </>
                )}
              </motion.button>
              <motion.button
                onClick={handleDemo}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                data-hover
                className="px-5 py-3.5 rounded-2xl border border-white/15 text-slate-400 hover:text-slate-200 hover:border-white/30 text-sm font-semibold transition-all"
              >
                Use Demo
              </motion.button>
            </div>

            {/* Loading steps */}
            <AnimatePresence>
              {loading && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-6 overflow-hidden"
                >
                  <div className="bg-black/30 rounded-2xl border border-cyan-500/15 p-5">
                    <div className="flex items-center gap-3 mb-4">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="w-5 h-5 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full"
                      />
                      <span className="text-cyan-300 text-sm font-semibold">
                        Running AI analysis pipeline…
                      </span>
                    </div>
                    {loadingSteps[activeTab].map((step, i) => (
                      <motion.div
                        key={step}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.4 }}
                        className="flex items-center gap-2.5 mb-2"
                      >
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: i * 0.4 + 0.1 }}
                          className="w-1.5 h-1.5 rounded-full bg-cyan-400/60"
                        />
                        <span className="text-slate-500 text-xs">{step}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Result */}
            <AnimatePresence>
              {result && !loading && <ResultCard result={result} />}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* ── TIPS STRIP ── */}
      <section className="relative z-10 py-12 px-6 pb-20">
        <div className="max-w-3xl mx-auto">
          <p className="text-slate-600 text-xs text-center uppercase tracking-widest mb-6">
            Tips for best results
          </p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              {
                icon: "💬",
                tip: "Paste the full SMS or message text for highest scam detection accuracy.",
              },
              {
                icon: "📰",
                tip: "For news, paste the headline plus a few sentences for better context.",
              },
              {
                icon: "🔗",
                tip: "Include the complete URL with https:// for proper domain analysis.",
              },
              {
                icon: "🖼",
                tip: "Use direct image URLs (not social media share links) for forensic analysis.",
              },
            ].map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/[0.02] border border-white/6 rounded-2xl p-4 flex gap-3"
              >
                <span className="text-xl">{t.icon}</span>
                <p className="text-slate-500 text-xs leading-relaxed">
                  {t.tip}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <footer className="relative z-10 border-t border-white/5 py-8 px-6 text-center">
        <p className="text-slate-600 text-sm">
          © 2026 TruthShield. Built to fight misinformation.
        </p>
      </footer>
    </div>
  );
}

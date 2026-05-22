import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  MessageSquare,
  Link2,
  Image,
  Video,
  CheckCircle,
  ArrowRight,
  Cpu,
  Database,
  ShieldCheck,
  Activity,
  Layers,
  ChevronRight,
} from "lucide-react";
import { CustomCursor, BgOrbs } from "../components/shared";

// ─── Detection method data ────────────────────────────────────────────────────
const METHODS = [
  {
    id: "message",
    icon: MessageSquare,
    emoji: "💬",
    title: "Message & Text Analysis",
    subtitle: "NLP-powered disinformation detection",
    color: "from-cyan-500 to-blue-500",
    borderColor: "border-cyan-500/25",
    glowColor: "rgba(0,200,255,0.08)",
    accentText: "text-cyan-300",
    steps: [
      {
        label: "Language Parsing",
        desc: "Tokenizes the text and identifies emotionally charged, urgent, or fear-inducing language patterns common in viral disinformation.",
      },
      {
        label: "Claim Extraction",
        desc: "Extracts factual claims and cross-references them against a live database of verified and debunked information from major fact-checkers.",
      },
      {
        label: "Source Attribution",
        desc: "Checks whether sources cited (if any) exist, are credible, and actually support the stated claims.",
      },
      {
        label: "Viral Pattern Score",
        desc: "Scores the message against known templates for viral hoaxes, conspiracy theories, and coordinated inauthentic content.",
      },
    ],
    signals: [
      "Emotional intensity",
      "Urgency language",
      "Fact-check database",
      "Source credibility",
      "Viral mechanics",
      "Claim verifiability",
    ],
  },
  {
    id: "link",
    icon: Link2,
    emoji: "🔗",
    title: "URL & Link Verification",
    subtitle: "Domain intelligence and content credibility",
    color: "from-violet-500 to-purple-600",
    borderColor: "border-violet-500/25",
    glowColor: "rgba(139,92,246,0.08)",
    accentText: "text-violet-300",
    steps: [
      {
        label: "Domain Intelligence",
        desc: "Checks domain registration date, WHOIS data, hosting location, and whether it mimics or spoofs a known credible news outlet.",
      },
      {
        label: "SSL & Security Scan",
        desc: "Verifies HTTPS certificate validity, redirect chains, and cross-checks the URL against phishing and malware blacklists.",
      },
      {
        label: "Content Credibility",
        desc: "Fetches and analyzes the page content using the same NLP pipeline as the message analyzer to score the article's credibility.",
      },
      {
        label: "Reputation Check",
        desc: "Checks the domain's historical reputation, past violations, and whether it has been flagged by browser safe-browsing APIs.",
      },
    ],
    signals: [
      "Domain age",
      "HTTPS/SSL",
      "Brand spoofing",
      "Content score",
      "Blacklist status",
      "Redirect chain",
    ],
  },
  {
    id: "image",
    icon: Image,
    emoji: "🖼",
    title: "Image Forensics",
    subtitle: "Deepfake detection and metadata analysis",
    color: "from-pink-500 to-rose-500",
    borderColor: "border-pink-500/25",
    glowColor: "rgba(236,72,153,0.08)",
    accentText: "text-pink-300",
    steps: [
      {
        label: "GAN Fingerprint",
        desc: "Scans pixel-level statistical patterns unique to AI-generated images from models like DALL·E, Midjourney, and Stable Diffusion.",
      },
      {
        label: "EXIF Metadata",
        desc: "Extracts and validates camera metadata: device model, GPS, timestamp, and software. AI-generated images typically have no authentic EXIF data.",
      },
      {
        label: "Deepfake Detection",
        desc: "Uses a facial recognition pipeline to detect manipulation artifacts in the jaw, hairline, eyes, and background blending zones.",
      },
      {
        label: "Reverse Image Search",
        desc: "Cross-references the image against billions of indexed images to identify if it's been altered from an original source.",
      },
    ],
    signals: [
      "GAN artifacts",
      "EXIF data",
      "Facial analysis",
      "Pixel noise",
      "Compression artifacts",
      "Reverse match",
    ],
  },
  {
    id: "video",
    icon: Video,
    emoji: "🎬",
    title: "Video Analysis",
    subtitle: "Temporal consistency and deepfake scanning",
    color: "from-amber-500 to-orange-500",
    borderColor: "border-amber-500/25",
    glowColor: "rgba(245,158,11,0.08)",
    accentText: "text-amber-300",
    steps: [
      {
        label: "Frame Extraction",
        desc: "Samples key frames throughout the video and runs each through the image forensics pipeline to detect per-frame manipulation.",
      },
      {
        label: "Temporal Analysis",
        desc: "Analyzes consistency between frames — AI-manipulated videos often show subtle flickering, ghosting, or blending artifacts at frame boundaries.",
      },
      {
        label: "Audio-Visual Sync",
        desc: "Uses phoneme-to-lip-movement alignment to detect dubbed or synthetic speech that doesn't naturally match the speaker's facial movements.",
      },
      {
        label: "Source Verification",
        desc: "Verifies the upload source, channel age, historical credibility, and checks if the video has been previously indexed and fact-checked.",
      },
    ],
    signals: [
      "Frame consistency",
      "Temporal artifacts",
      "Lip-sync score",
      "Audio analysis",
      "Source credibility",
      "Upload metadata",
    ],
  },
];

// ─── Pipeline steps ────────────────────────────────────────────────────────────
const PIPELINE = [
  {
    icon: Layers,
    label: "Ingest",
    desc: "Content received and type identified",
  },
  { icon: Cpu, label: "Process", desc: "AI models run in parallel" },
  {
    icon: Database,
    label: "Reference",
    desc: "Cross-checked against live databases",
  },
  { icon: Activity, label: "Score", desc: "Credibility signals aggregated" },
  {
    icon: ShieldCheck,
    label: "Verdict",
    desc: "Final classification returned",
  },
];

// ─── PAGE ─────────────────────────────────────────────────────────────────────
export default function HowitWorks() {
  return (
    <div className="font-['DM_Sans',sans-serif]">
      <CustomCursor />
      <BgOrbs />

      {/* ── PAGE HEADER ── */}
      <section className="relative z-10 pt-36 pb-12 px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-cyan-400 font-semibold text-sm tracking-widest uppercase mb-4"
        >
          Under The Hood
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-7xl font-black tracking-tight font-['Syne',sans-serif] mb-5"
        >
          How It Works
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed"
        >
          Every content type requires a different detection strategy. Our
          multi-modal AI pipeline is purpose-built for messages, links, images,
          and videos.
        </motion.p>
      </section>

      {/* ── PIPELINE STRIP ── */}
      <section className="relative z-10 py-10 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {PIPELINE.map((step, i) => (
              <div key={step.label} className="flex items-center gap-3">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -4 }}
                  data-hover
                  className="flex flex-col items-center gap-2 bg-white/[0.03] border border-white/8 rounded-2xl px-5 py-4 w-28 text-center cursor-pointer transition-all hover:border-cyan-500/25"
                >
                  <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                    <step.icon size={16} className="text-cyan-400" />
                  </div>
                  <p className="text-white text-xs font-bold font-['Syne',sans-serif]">
                    {step.label}
                  </p>
                  <p className="text-slate-600 text-[10px] leading-tight">
                    {step.desc}
                  </p>
                </motion.div>
                {i < PIPELINE.length - 1 && (
                  <ChevronRight
                    size={14}
                    className="text-slate-700 flex-shrink-0 hidden sm:block"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DETECTION METHODS ── */}
      <section className="relative z-10 py-12 px-6">
        <div className="max-w-5xl mx-auto space-y-10">
          {METHODS.map((method, mi) => {
            const Icon = method.icon;
            return (
              <motion.div
                key={method.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className={`bg-white/[0.025] border ${method.borderColor} rounded-3xl overflow-hidden`}
                style={{ boxShadow: `0 0 60px ${method.glowColor}` }}
              >
                {/* Method header */}
                <div
                  className={`bg-gradient-to-r ${method.color} p-px rounded-t-3xl`}
                >
                  <div className="bg-[#050810] rounded-t-3xl px-8 py-6 flex items-center gap-5">
                    <div
                      className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${method.color} flex items-center justify-center shadow-lg flex-shrink-0`}
                    >
                      <Icon size={24} className="text-white" />
                    </div>
                    <div>
                      <p className="text-slate-500 text-xs font-semibold uppercase tracking-widest mb-1">
                        {method.subtitle}
                      </p>
                      <h2
                        className={`text-2xl font-black font-['Syne',sans-serif] ${method.accentText}`}
                      >
                        {method.emoji} {method.title}
                      </h2>
                    </div>
                  </div>
                </div>

                <div className="px-8 py-8">
                  {/* Steps */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
                    {method.steps.map((step, si) => (
                      <motion.div
                        key={si}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: si * 0.08 }}
                        className="flex gap-4"
                      >
                        <div
                          className={`w-7 h-7 rounded-lg bg-gradient-to-br ${method.color} flex items-center justify-center flex-shrink-0 mt-0.5`}
                        >
                          <span className="text-white text-xs font-bold">
                            {si + 1}
                          </span>
                        </div>
                        <div>
                          <p className="text-white text-sm font-bold mb-1 font-['Syne',sans-serif]">
                            {step.label}
                          </p>
                          <p className="text-slate-500 text-sm leading-relaxed">
                            {step.desc}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Signal chips */}
                  <div className="border-t border-white/5 pt-6">
                    <p className="text-slate-600 text-xs font-semibold uppercase tracking-widest mb-3">
                      Detection Signals
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {method.signals.map((sig) => (
                        <span
                          key={sig}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-white/4 border border-white/8 rounded-lg text-slate-400 text-xs"
                        >
                          <CheckCircle size={11} className="text-emerald-500" />
                          {sig}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── FAQ-STYLE ACCURACY SECTION ── */}
      <section className="relative z-10 py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-black text-center mb-10 font-['Syne',sans-serif]"
          >
            Accuracy Benchmarks
          </motion.h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                type: "Text",
                acc: "97.3%",
                color: "text-cyan-400",
                bg: "bg-cyan-500/10",
                border: "border-cyan-500/20",
              },
              {
                type: "Links",
                acc: "94.1%",
                color: "text-violet-400",
                bg: "bg-violet-500/10",
                border: "border-violet-500/20",
              },
              {
                type: "Images",
                acc: "96.8%",
                color: "text-pink-400",
                bg: "bg-pink-500/10",
                border: "border-pink-500/20",
              },
              {
                type: "Videos",
                acc: "91.2%",
                color: "text-amber-400",
                bg: "bg-amber-500/10",
                border: "border-amber-500/20",
              },
            ].map((b, i) => (
              <motion.div
                key={b.type}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                className={`${b.bg} border ${b.border} rounded-2xl p-5 text-center`}
              >
                <p
                  className={`text-3xl font-black font-['Syne',sans-serif] ${b.color} mb-1`}
                >
                  {b.acc}
                </p>
                <p className="text-slate-500 text-sm">{b.type} detection</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section className="relative z-10 py-16 px-6 pb-24">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border border-cyan-500/20 rounded-3xl p-12"
          >
            <h2 className="text-3xl font-black mb-4 font-['Syne',sans-serif]">
              Ready to try it yourself?
            </h2>
            <p className="text-slate-400 mb-8">
              Open the AI Analyzer and check any piece of content in under 2
              seconds.
            </p>
            <Link to="/analyzer">
              <motion.button
                whileHover={{
                  scale: 1.04,
                  boxShadow: "0 0 40px rgba(0,200,255,0.4)",
                }}
                whileTap={{ scale: 0.97 }}
                data-hover
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-base shadow-[0_0_25px_rgba(0,200,255,0.3)]"
              >
                Open AI Analyzer <ArrowRight size={18} />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      <footer className="relative z-10 border-t border-white/5 py-8 px-6 text-center">
        <p className="text-slate-600 text-sm">
          © 2025 Veriflux. Built to fight misinformation.
        </p>
      </footer>
    </div>
  );
}

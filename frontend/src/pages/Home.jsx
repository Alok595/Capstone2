import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Globe,
  TrendingUp,
  Eye,
  Brain,
  Zap,
  Lock,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { CustomCursor, BgOrbs } from "../components/Shared";

const STATS = [
  { label: "Analyses Run", value: "0+", icon: TrendingUp },
  { label: "Accuracy Rate", value: "0%", icon: Eye },
  { label: "Content Types", value: "0", icon: Brain },
  { label: "Avg Response", value: "<0s", icon: Zap },
];

export default function Home() {
  return (
    <div className="font-['DM_Sans',sans-serif]">
      <CustomCursor />
      <BgOrbs />

      {/* ── HERO ── */}
      <section className="relative z-10 pt-36 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/25 mb-8"
          >
            <motion.div
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-2 h-2 rounded-full bg-cyan-400"
            />
            <span className="text-cyan-300 text-sm font-semibold tracking-wide">
              AI-Powered Misinformation Detection
            </span>
            <Sparkles size={13} className="text-cyan-400" />
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl md:text-7xl font-black leading-[1.05] tracking-tight mb-6 font-['Syne',sans-serif]"
          >
            Detect Fake
            <span className="block bg-gradient-to-r from-cyan-300 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
              Content Instantly
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Analyze messages, URLs, images, and videos with advanced AI. Get
            instant verdicts with detailed signal breakdowns — fight
            misinformation before it spreads.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center justify-center gap-3 flex-wrap"
          >
            <Link to="/analyzer">
              <motion.button
                whileHover={{
                  scale: 1.04,
                  boxShadow: "0 0 40px rgba(0,200,255,0.4)",
                }}
                whileTap={{ scale: 0.97 }}
                data-hover
                className="flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold shadow-[0_0_25px_rgba(0,200,255,0.3)] text-base"
              >
                Start Analyzing <ArrowRight size={17} />
              </motion.button>
            </Link>
            <Link to="/how-it-works">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                data-hover
                className="flex items-center gap-2 px-7 py-3.5 rounded-2xl border border-white/15 text-slate-300 font-semibold hover:bg-white/5 transition-all text-base"
              >
                <Globe size={16} />
                How It Works
              </motion.button>
            </Link>
          </motion.div>
        </div>

        {/* Stats strip */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.7 }}
          className="max-w-4xl mx-auto mt-16 grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {STATS.map((s) => (
            <motion.div
              key={s.label}
              whileHover={{ y: -4, borderColor: "rgba(0,200,255,0.3)" }}
              transition={{ duration: 0.2 }}
              className="bg-white/3 backdrop-blur-sm border border-white/8 rounded-2xl p-5 text-center group"
            >
              <s.icon
                className="mx-auto mb-2 text-cyan-400 group-hover:scale-110 transition-transform"
                size={20}
              />
              <p className="text-2xl font-black text-white font-['Syne',sans-serif]">
                {s.value}
              </p>
              <p className="text-slate-500 text-xs mt-1">{s.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── MINI PREVIEW CARDS ── */}
      <section className="relative z-10 py-10 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center text-slate-500 text-sm font-semibold uppercase tracking-widest mb-8"
          >
            What You Can Detect
          </motion.p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                emoji: "💬",
                label: "Messages",
                desc: "WhatsApp, social posts, SMS",
                color: "from-cyan-500/20 to-blue-500/20",
                border: "border-cyan-500/20",
              },
              {
                emoji: "🔗",
                label: "URLs",
                desc: "News links, phishing sites",
                color: "from-violet-500/20 to-purple-500/20",
                border: "border-violet-500/20",
              },
              {
                emoji: "🖼",
                label: "Images",
                desc: "Deepfakes, manipulated photos",
                color: "from-pink-500/20 to-rose-500/20",
                border: "border-pink-500/20",
              },
              {
                emoji: "🎬",
                label: "Videos",
                desc: "Deepfake video, misleading clips",
                color: "from-amber-500/20 to-orange-500/20",
                border: "border-amber-500/20",
              },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                data-hover
                className={`bg-gradient-to-br ${item.color} border ${item.border} rounded-2xl p-5 text-center cursor-pointer transition-all duration-300`}
              >
                <div className="text-3xl mb-3">{item.emoji}</div>
                <p className="text-white font-bold text-sm font-['Syne',sans-serif]">
                  {item.label}
                </p>
                <p className="text-slate-500 text-xs mt-1 leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BAND ── */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border border-cyan-500/20 rounded-3xl p-12 text-center overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent pointer-events-none" />
            <Lock className="mx-auto mb-5 text-cyan-400" size={36} />
            <h2 className="text-4xl font-black mb-4 font-['Syne',sans-serif]">
              Stop Misinformation
              <br />
              <span className="text-cyan-400">Before It Spreads</span>
            </h2>
            <p className="text-slate-400 mb-8 max-w-md mx-auto">
              Join 50,000+ users protecting themselves and their communities
              with real-time AI fact-checking.
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
                Try the Analyzer Free <ChevronRight size={18} />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 py-8 px-6 text-center">
        <p className="text-slate-600 text-sm">
          © 2026 TruthShield. Built to fight misinformation.
        </p>
      </footer>
    </div>
  );
}

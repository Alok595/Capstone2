import { useState, useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

// ─── Custom Cursor ─────────────────────────────────────────────────────────────
export function CustomCursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const springX = useSpring(cursorX, { stiffness: 500, damping: 40 });
  const springY = useSpring(cursorY, { stiffness: 500, damping: 40 });
  const trailX  = useSpring(cursorX, { stiffness: 120, damping: 28 });
  const trailY  = useSpring(cursorY, { stiffness: 120, damping: 28 });

  const [hovered,  setHovered]  = useState(false);
  const [clicking, setClicking] = useState(false);

  useEffect(() => {
    const move = (e) => { cursorX.set(e.clientX); cursorY.set(e.clientY); };
    const over  = (e) => { if (e.target.closest("button, a, [data-hover]")) setHovered(true); };
    const out   = ()  => setHovered(false);
    const down  = ()  => setClicking(true);
    const up    = ()  => setClicking(false);

    window.addEventListener("mousemove",  move);
    window.addEventListener("mouseover",  over);
    window.addEventListener("mouseout",   out);
    window.addEventListener("mousedown",  down);
    window.addEventListener("mouseup",    up);
    return () => {
      window.removeEventListener("mousemove",  move);
      window.removeEventListener("mouseover",  over);
      window.removeEventListener("mouseout",   out);
      window.removeEventListener("mousedown",  down);
      window.removeEventListener("mouseup",    up);
    };
  }, []);

  return (
    <>
      {/* Trailing ring */}
      <motion.div
        className="fixed pointer-events-none z-[9999] rounded-full border border-cyan-400/30"
        style={{
          left: trailX,
          top:  trailY,
          width:  hovered ? 48 : 32,
          height: hovered ? 48 : 32,
          x: hovered ? -24 : -16,
          y: hovered ? -24 : -16,
          backgroundColor: hovered ? "rgba(0,200,255,0.06)" : "transparent",
        }}
        transition={{ width: { duration: 0.2 }, height: { duration: 0.2 } }}
      />
      {/* Dot */}
      <motion.div
        className="fixed pointer-events-none z-[9999] rounded-full bg-cyan-400"
        style={{
          left:   springX,
          top:    springY,
          width:  clicking ? 6 : 8,
          height: clicking ? 6 : 8,
          x: clicking ? -3 : -4,
          y: clicking ? -3 : -4,
          boxShadow: "0 0 10px rgba(0,200,255,0.8)",
        }}
      />
    </>
  );
}

// ─── Background orbs + grid ───────────────────────────────────────────────────
export function BgOrbs() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-cyan-500/5  blur-[120px]" />
      <div className="absolute top-1/2  -right-40 w-[500px] h-[500px] rounded-full bg-blue-600/6  blur-[100px]" />
      <div className="absolute bottom-0 left-1/3   w-[400px] h-[400px] rounded-full bg-indigo-600/5 blur-[100px]" />
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `linear-gradient(rgba(0,200,255,0.4) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(0,200,255,0.4) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />
    </div>
  );
}
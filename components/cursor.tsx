"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const scale = useMotionValue(1);
  const sx = useSpring(x, { stiffness: 420, damping: 36, mass: 0.35 });
  const sy = useSpring(y, { stiffness: 420, damping: 36, mass: 0.35 });
  const ss = useSpring(scale, { stiffness: 280, damping: 24 });

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;

    document.body.classList.add("has-cursor");
    let visible = false;

    const move = (event: MouseEvent) => {
      if (!visible) {
        visible = true;
        setEnabled(true);
      }
      x.set(event.clientX);
      y.set(event.clientY);
      const target = event.target;
      const hot =
        target instanceof Element &&
        Boolean(target.closest("a, button, input, textarea, summary, [data-cursor]"));
      scale.set(hot ? 2.5 : 1);
    };

    window.addEventListener("mousemove", move);
    return () => {
      document.body.classList.remove("has-cursor");
      window.removeEventListener("mousemove", move);
    };
  }, [scale, x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-[110] h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#f4efe6] mix-blend-difference"
      style={{ x: sx, y: sy, scale: ss }}
    />
  );
}

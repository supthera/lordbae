"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { usePathname } from "next/navigation";

import { Cursor } from "@/components/cursor";

let lenisInstance: Lenis | null = null;

export function getLenis() {
  return lenisInstance;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const instance = new Lenis({
      duration: 1.15,
      lerp: 0.085,
      smoothWheel: true,
    });
    lenisInstance = instance;

    let frame = 0;
    const loop = (time: number) => {
      instance.raf(time);
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(frame);
      instance.destroy();
      if (lenisInstance === instance) lenisInstance = null;
    };
  }, []);

  useEffect(() => {
    const id = window.location.hash.replace("#", "");
    if (!id || !lenisInstance) return;
    const target = document.getElementById(id);
    if (!target) return;
    const timer = window.setTimeout(() => {
      lenisInstance?.scrollTo(target, { offset: -12 });
    }, 80);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  return (
    <>
      <Cursor />
      {children}
    </>
  );
}

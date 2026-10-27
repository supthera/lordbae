"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

import { Logo } from "@/components/logo";
import { getLenis } from "@/components/providers";

const motes = [
  { left: "14%", top: "62%", delay: "0s", duration: "16s", size: 2 },
  { left: "28%", top: "74%", delay: "3s", duration: "18s", size: 1.5 },
  { left: "46%", top: "58%", delay: "1.4s", duration: "15s", size: 2 },
  { left: "63%", top: "70%", delay: "5s", duration: "19s", size: 1.5 },
  { left: "78%", top: "64%", delay: "2.2s", duration: "17s", size: 2 },
  { left: "88%", top: "48%", delay: "6s", duration: "21s", size: 1 },
  { left: "36%", top: "42%", delay: "4s", duration: "20s", size: 1.5 },
  { left: "54%", top: "36%", delay: "7s", duration: "18s", size: 1 },
];

export function Hero() {
  const reduce = useReducedMotion();
  const rise = reduce
    ? {}
    : {
        initial: { opacity: 0, y: 24 },
        animate: { opacity: 1, y: 0 },
      };

  function openCollection(event: React.MouseEvent<HTMLAnchorElement>) {
    const target = document.getElementById("collection");
    if (!target) return;
    event.preventDefault();
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(target, { offset: -12 });
    else target.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
    history.replaceState(null, "", "/#collection");
  }

  return (
    <section className="relative min-h-[100svh] overflow-hidden" aria-label="Introduction">
      <div className="absolute inset-0">
        <div className={reduce ? "relative h-full w-full" : "ken relative h-full w-full"}>
          <Image
            src="/images/hero.jpg"
            alt="Limestone gallery hall at dusk, with a single linen bench and tall windows onto Paris."
            fill
            preload
            sizes="100vw"
            quality={80}
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/35 to-[#0a0a0a]/25" />
        <div className={`pointer-events-none absolute inset-0 ${reduce ? "" : "leak"}`} />
        {reduce
          ? null
          : motes.map((mote) => (
              <span
                key={`${mote.left}-${mote.top}`}
                className="mote"
                style={{
                  left: mote.left,
                  top: mote.top,
                  width: mote.size,
                  height: mote.size,
                  animationDelay: mote.delay,
                  animationDuration: mote.duration,
                }}
              />
            ))}
      </div>

      <div className="relative flex min-h-[100svh] flex-col justify-between px-[6vw] pt-5 pb-16 md:pb-20">
        <motion.div
          {...rise}
          transition={{ duration: 1.1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        >
          <Logo className="h-44 w-auto max-w-[88vw] sm:h-52 md:h-60" />
        </motion.div>
        <div>
        <motion.p
          className="eyebrow mb-5"
          {...rise}
          transition={{ duration: 1, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
        >
          Private collection
        </motion.p>
        <motion.h1
          className="display max-w-5xl text-[clamp(3.1rem,8.4vw,7.6rem)]"
          {...rise}
          transition={{ duration: 1.15, delay: 0.38, ease: [0.16, 1, 0.3, 1] }}
        >
          Residences
          <span className="block italic">of unusual quiet.</span>
        </motion.h1>
        <motion.p
          className="mt-6 max-w-md text-base leading-relaxed text-[#e7e1d6] md:text-lg"
          {...rise}
          transition={{ duration: 1, delay: 0.52, ease: [0.16, 1, 0.3, 1] }}
        >
          A small portfolio of houses and pavilions, chosen for proportion, light,
          and the discipline to leave them alone.
        </motion.p>
        <motion.div
          className="mt-10 flex flex-wrap items-center gap-x-10 gap-y-5"
          {...rise}
          transition={{ duration: 1, delay: 0.66, ease: [0.16, 1, 0.3, 1] }}
        >
          <Link href="/#collection" onClick={openCollection} className="cta" data-cursor>
            View the Collection
            <i />
          </Link>
          <Link
            href="/#inquiry"
            className="text-[0.72rem] tracking-[0.22em] text-[#c6b49a] uppercase"
          >
            Request an introduction
          </Link>
        </motion.div>
        </div>
      </div>
      <p className="absolute right-[6vw] bottom-8 hidden text-[0.68rem] tracking-[0.28em] text-[#c6b49a] uppercase md:block">
        By appointment
      </p>
    </section>
  );
}

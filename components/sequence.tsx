"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";

import { properties } from "@/lib/properties";

export function Sequence() {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const smooth = useSpring(scrollYProgress, { stiffness: 80, damping: 24, mass: 0.4 });
  const x = useTransform(smooth, [0, 1], [0, -distance]);

  useEffect(() => {
    const measure = () => {
      const track = trackRef.current;
      if (!track) return;
      setDistance(Math.max(0, track.scrollWidth - window.innerWidth + window.innerWidth * 0.06));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  return (
    <section aria-label="A sequence of rooms" className="border-t border-[rgba(244,239,230,0.14)]">
      <div className="px-[6vw] pt-24 pb-8 lg:hidden motion-reduce:block">
        <p className="eyebrow">02 — Sequence</p>
        <h2 className="display mt-4 text-5xl md:text-6xl">A sequence of rooms.</h2>
      </div>
      <div className="pb-16 lg:hidden motion-reduce:block">
        <SnapTrack />
      </div>

      <div
        ref={sectionRef}
        className="relative hidden h-[420vh] lg:block motion-reduce:hidden"
        hidden={reduce === true}
      >
        <div className="sticky top-0 flex h-screen flex-col overflow-hidden">
          <div className="flex items-end justify-between px-[6vw] pt-28">
            <div>
              <p className="eyebrow">02 — Sequence</p>
              <h2 className="display mt-3 text-6xl">A sequence of rooms.</h2>
            </div>
            <Progress value={scrollYProgress} />
          </div>
          <motion.div
            ref={trackRef}
            style={reduce ? undefined : { x }}
            className="mt-8 flex h-[68vh] items-stretch gap-[3vw] pr-[8vw] pl-[6vw]"
          >
            {properties.map((property, index) => (
              <Panel key={property.slug} index={index} />
            ))}
          </motion.div>
          <div className="mx-[6vw] mt-6 h-px bg-[rgba(244,239,230,0.14)]">
            <motion.div
              className="h-px origin-left bg-[#c6b49a]"
              style={{ scaleX: scrollYProgress }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function Progress({ value }: { value: MotionValue<number> }) {
  const [index, setIndex] = useState(1);
  useMotionValueEvent(value, "change", (next) => {
    setIndex(Math.min(properties.length, Math.max(1, Math.round(next * (properties.length - 1)) + 1)));
  });
  return (
    <p className="font-sans text-sm tracking-[0.28em] text-[#c6b49a]" aria-hidden="true">
      {String(index).padStart(2, "0")}
      <span className="text-[#6f6a63]"> / {String(properties.length).padStart(2, "0")}</span>
    </p>
  );
}

function SnapTrack() {
  return (
    <div className="sequence-track">
      {properties.map((property, index) => (
        <Panel key={property.slug} index={index} />
      ))}
    </div>
  );
}

function Panel({ index }: { index: number }) {
  const property = properties[index];
  return (
    <article className="sequence-panel relative h-[70vh] min-h-[420px] overflow-hidden bg-[#141210] lg:h-full">
      <Image
        src={property.image}
        alt=""
        fill
        sizes="(max-width: 1024px) 86vw, 72vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/80 via-transparent to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
        <p className="eyebrow">{String(index + 1).padStart(2, "0")}</p>
        <h3 className="display mt-2 text-4xl md:text-5xl">{property.name}</h3>
        <p className="mt-2 text-sm tracking-[0.16em] text-[#e7e1d6] uppercase">
          {property.location}
        </p>
        <Link
          href={`/collection/${property.slug}`}
          className="cta mt-5"
          aria-label={`Enter ${property.name}`}
        >
          Enter
          <i />
        </Link>
      </div>
    </article>
  );
}

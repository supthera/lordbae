"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ViewTransition } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import type { Property } from "@/lib/properties";

export function PropertyView({ property }: { property: Property }) {
  const reduce = useReducedMotion();
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    if (active === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActive(null);
      if (event.key === "ArrowRight") {
        setActive((current) =>
          current === null ? current : (current + 1) % property.gallery.length,
        );
      }
      if (event.key === "ArrowLeft") {
        setActive((current) =>
          current === null
            ? current
            : (current - 1 + property.gallery.length) % property.gallery.length,
        );
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, property.gallery.length]);

  const frame = active === null ? null : property.gallery[active];

  return (
    <article>
      <header className="relative h-[100svh] min-h-[640px] bg-[#141210]">
        <ViewTransition name={`residence-${property.slug}`} share="morph">
          <div className="absolute inset-0">
            <Image
              src={property.image}
              alt={property.imageAlt}
              fill
              preload
              sizes="100vw"
              className="object-cover"
            />
          </div>
        </ViewTransition>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/20 to-[#0a0a0a]/20" />
        <div className="absolute inset-x-0 bottom-0 px-[6vw] pb-16 md:pb-20">
          <p className="eyebrow">{property.location}</p>
          <h1 className="display mt-4 max-w-4xl text-[clamp(3.4rem,7vw,7rem)]">{property.name}</h1>
          <p className="mt-5 text-sm tracking-[0.18em] text-[#e7e1d6] uppercase">
            {property.typology}
            <span className="mx-3 text-[#c80e0e]">·</span>
            {property.status}
          </p>
        </div>
      </header>

      <section className="grid gap-12 px-[6vw] py-24 lg:grid-cols-12 lg:py-32">
        <div className="lg:col-span-6">
          <p className="lede">{property.summary}</p>
          <p className="quiet mt-6 max-w-xl text-[1.05rem]">{property.narrative}</p>
        </div>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-8 self-start lg:col-span-4 lg:col-start-9">
          {property.facts.map((fact) => (
            <div key={fact.label} className="border-t border-[rgba(244,239,230,0.16)] pt-3">
              <dt className="text-[0.62rem] tracking-[0.22em] text-[#c6b49a] uppercase">
                {fact.label}
              </dt>
              <dd className="mt-2 text-lg text-[#f4efe6]">{fact.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="px-[6vw] pb-8" aria-label="Gallery">
        <div className="space-y-8">
          {property.gallery.map((image, index) => (
            <figure key={image.src} className="grid gap-4 lg:grid-cols-12 lg:items-end">
              <button
                type="button"
                className="relative aspect-[16/10] overflow-hidden bg-[#141210] text-left lg:col-span-10"
                onClick={() => setActive(index)}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 80vw"
                  className="object-cover transition-transform duration-700 hover:scale-[1.02]"
                />
              </button>
              <figcaption className="text-sm tracking-[0.14em] text-[#a39c92] uppercase lg:col-span-2">
                {String(index + 1).padStart(2, "0")}
                <span className="mt-2 block normal-case tracking-normal text-[#d9d2c6]">
                  {image.caption}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <aside className="mx-[6vw] mb-28 flex flex-col gap-8 border border-[rgba(244,239,230,0.16)] px-8 py-12 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="eyebrow">Introduction</p>
          <p className="display mt-3 max-w-xl text-4xl md:text-5xl">
            Particulars are shared after an introduction.
          </p>
        </div>
        <Link href={`/#inquiry?residence=${property.slug}`} className="cta shrink-0">
          Inquire
          <i />
        </Link>
      </aside>

      <AnimatePresence>
        {frame && active !== null ? (
          <motion.div
            className="fixed inset-0 z-[80] flex items-center justify-center bg-[#0a0a0a]/94 px-4"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduce ? undefined : { opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-label={`${property.name} gallery`}
          >
            <button
              type="button"
              className="absolute top-6 right-[6vw] text-[0.68rem] tracking-[0.22em] uppercase"
              onClick={() => setActive(null)}
            >
              Close
            </button>
            <button
              type="button"
              className="absolute top-1/2 left-4 -translate-y-1/2 px-3 text-[0.68rem] tracking-[0.2em] uppercase md:left-8"
              onClick={() =>
                setActive((current) =>
                  current === null
                    ? current
                    : (current - 1 + property.gallery.length) % property.gallery.length,
                )
              }
            >
              Prev
            </button>
            <button
              type="button"
              className="absolute top-1/2 right-4 -translate-y-1/2 px-3 text-[0.68rem] tracking-[0.2em] uppercase md:right-8"
              onClick={() =>
                setActive((current) =>
                  current === null ? current : (current + 1) % property.gallery.length,
                )
              }
            >
              Next
            </button>
            <div className="relative h-[72vh] w-[min(1100px,82vw)]">
              <Image
                src={frame.src}
                alt={frame.alt}
                fill
                sizes="82vw"
                className="object-contain"
              />
            </div>
            <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[0.68rem] tracking-[0.2em] uppercase">
              {String(active + 1).padStart(2, "0")} / {String(property.gallery.length).padStart(2, "0")}
              <span className="ml-4 normal-case tracking-normal text-[#c6b49a]">{frame.caption}</span>
            </p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </article>
  );
}

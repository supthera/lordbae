"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ViewTransition } from "react";
import { motion, useReducedMotion } from "framer-motion";

import {
  properties,
  regions,
  typologies,
  type Property,
  type Region,
  type Typology,
} from "@/lib/properties";

type Order = "Curated" | "Name" | "Place";

const orders: Order[] = ["Curated", "Name", "Place"];

export function Collection() {
  const reduce = useReducedMotion();
  const [typology, setTypology] = useState<Typology | "All">("All");
  const [region, setRegion] = useState<Region | "All">("All");
  const [order, setOrder] = useState<Order>("Curated");

  const visible = useMemo(() => {
    const next = properties.filter((property) => {
      const typeOk = typology === "All" || property.typology === typology;
      const regionOk = region === "All" || property.region === region;
      return typeOk && regionOk;
    });
    if (order === "Name") {
      next.sort((a, b) => a.name.localeCompare(b.name));
    } else if (order === "Place") {
      next.sort((a, b) => a.location.localeCompare(b.location));
    }
    return next;
  }, [order, region, typology]);

  return (
    <section id="collection" className="scroll-mt-8 px-[6vw] py-28 md:py-40">
      <div className="mb-14 grid items-end gap-8 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <p className="eyebrow">01 — The collection</p>
          <h2 className="display mt-4 text-[clamp(3rem,6vw,5.6rem)]">Held, not listed.</h2>
        </div>
        <p className="quiet max-w-sm lg:col-span-4 lg:col-start-9">
          Six addresses. No inventory. Each one acquired rarely, and released only
          when a more fitting hand appears.
        </p>
      </div>

      <div className="mb-12 flex flex-col gap-8 border-y border-[rgba(244,239,230,0.14)] py-5 lg:flex-row lg:items-end lg:justify-between">
        <FilterGroup label="Typology">
          {typologies.map((item) => (
            <FilterButton
              key={item}
              pressed={typology === item}
              onClick={() => setTypology(item)}
            >
              {item}
            </FilterButton>
          ))}
        </FilterGroup>
        <FilterGroup label="Region">
          {regions.map((item) => (
            <FilterButton key={item} pressed={region === item} onClick={() => setRegion(item)}>
              {item}
            </FilterButton>
          ))}
        </FilterGroup>
        <FilterGroup label="Order">
          {orders.map((item) => (
            <FilterButton key={item} pressed={order === item} onClick={() => setOrder(item)}>
              {item}
            </FilterButton>
          ))}
        </FilterGroup>
      </div>

      <p className="eyebrow mb-8" aria-live="polite">
        {String(visible.length).padStart(2, "0")} in view
      </p>

      {visible.length === 0 ? (
        <div className="border border-[rgba(244,239,230,0.14)] px-8 py-16">
          <p className="display text-4xl">Nothing matches.</p>
          <p className="quiet mt-4 max-w-md">
            The office keeps the list short. Reset the filters to return to the
            collection as it is held.
          </p>
          <button
            type="button"
            className="cta mt-8"
            onClick={() => {
              setTypology("All");
              setRegion("All");
              setOrder("Curated");
            }}
          >
            Restore the collection
            <i />
          </button>
        </div>
      ) : (
        <motion.div
          key={`${typology}-${region}-${order}`}
          className="collection-grid"
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        >
          {visible.map((property) => (
            <PropertyCard key={property.slug} property={property} />
          ))}
        </motion.div>
      )}
    </section>
  );
}

function FilterGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap items-center gap-x-5 gap-y-3">
      <span className="mr-1 text-[0.62rem] tracking-[0.22em] text-[#6f6a63] uppercase">
        {label}
      </span>
      {children}
    </div>
  );
}

function FilterButton({
  pressed,
  onClick,
  children,
}: {
  pressed: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button type="button" className="filter-btn" aria-pressed={pressed} onClick={onClick}>
      {children}
    </button>
  );
}

function PropertyCard({ property }: { property: Property }) {
  return (
    <article className="card">
      <Link href={`/collection/${property.slug}`} className="group block">
        <ViewTransition name={`residence-${property.slug}`} share="morph">
          <div className="card-media relative aspect-[4/5] overflow-hidden bg-[#141210]">
            <Image
              src={property.image}
              alt={property.imageAlt}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="card-veil absolute inset-0" />
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 md:p-6">
              <div>
                <p className="text-[0.68rem] tracking-[0.22em] text-[#c6b49a] uppercase">
                  {property.location}
                </p>
                <p className="mt-2 text-sm text-[#f4efe6]">
                  {property.typology}
                  <span className="mx-2 text-[#c80e0e]">·</span>
                  {property.status}
                </p>
              </div>
            </div>
          </div>
        </ViewTransition>
        <div className="mt-4 flex items-baseline justify-between gap-4">
          <h3 className="display text-4xl md:text-5xl">{property.name}</h3>
          <span className="hidden text-[0.68rem] tracking-[0.2em] text-[#a39c92] uppercase sm:inline">
            Enter
          </span>
        </div>
      </Link>
    </article>
  );
}

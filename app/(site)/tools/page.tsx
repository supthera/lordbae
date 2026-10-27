import type { Metadata } from "next";
import Image from "next/image";

import { siteName } from "@/lib/site";

import PropertyTaxByState from "@/components/PropertyTaxByState";

export const metadata: Metadata = {
  title: "Property Tools",
  description:
    "Effective residential property tax rates for the fifty states and the District of Columbia, computed from U.S. Census ACS medians.",
};

export default function PropertyToolsPage() {
  return (
    <main id="content" className="px-[6vw] pt-32 pb-28 md:pt-40 md:pb-40">
      <div className="grid items-end gap-12 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <p className="eyebrow">Office</p>
          <h1 className="display mt-5 max-w-3xl text-[clamp(3.2rem,7vw,6.2rem)]">Property Tools</h1>
          <div className="mt-8 h-px w-16 bg-[#c80e0e]" />
          <p className="lede mt-8 max-w-xl">
            Effective residential property tax rates for the fifty states and the District of Columbia. Median taxes paid, divided by median home value, kept with the office.
          </p>
        </div>
        <p className="text-[0.72rem] tracking-[0.22em] text-[#c6b49a] uppercase lg:col-span-4 lg:col-start-9 lg:pb-2">
          {siteName}
          <span className="mt-3 block text-sm tracking-normal text-[#a39c92] normal-case">
            The study, for the work that stays inside the office.
          </span>
        </p>
      </div>

      <div className="relative mt-16 aspect-[16/7] overflow-hidden bg-[#141210] md:mt-20">
        <Image
          src="/images/study.jpg"
          alt="An empty private study with a single oak chair, travertine, and the shadow of a window."
          fill
          sizes="88vw"
          className="object-cover"
        />
      </div>

      <section className="mt-16 md:mt-24" aria-labelledby="effective-rates">
        <p className="eyebrow">01</p>
        <h2 id="effective-rates" className="display mt-4 text-[clamp(2.4rem,5vw,4rem)]">
          Effective rates
        </h2>
        <PropertyTaxByState className="mt-10" />
      </section>
    </main>
  );
}

import type { Metadata } from "next";
import Image from "next/image";

import { siteName } from "@/lib/site";

export const metadata: Metadata = {
  title: "Property Tools",
  description:
    "Instruments kept by the office of Lord Bae for the houses in the collection: record, custody, and correspondence.",
};

const tools = [
  {
    index: "01",
    name: "Record",
    detail: "Plans, measures, and the condition of a house, kept with the residence rather than in a public file.",
  },
  {
    index: "02",
    name: "Custody",
    detail: "Who holds a house, and on what terms. Nothing here is an offering.",
  },
  {
    index: "03",
    name: "Correspondence",
    detail: "Introductions tied to a named residence. Particulars follow only after the office has read the note.",
  },
];

export default function PropertyToolsPage() {
  return (
    <main id="content" className="px-[6vw] pt-32 pb-28 md:pt-40 md:pb-40">
      <div className="grid items-end gap-12 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <p className="eyebrow">Office</p>
          <h1 className="display mt-5 max-w-3xl text-[clamp(3.2rem,7vw,6.2rem)]">Property Tools</h1>
          <div className="mt-8 h-px w-16 bg-[#c80e0e]" />
          <p className="lede mt-8 max-w-xl">
            Instruments for the houses in the collection. They are not a market, and they are not published with the rooms.
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

      <ol className="mt-16 border-t border-[rgba(244,239,230,0.16)] md:mt-24">
        {tools.map((tool) => (
          <li
            key={tool.name}
            className="grid gap-4 border-b border-[rgba(244,239,230,0.16)] py-8 md:grid-cols-12 md:items-baseline md:gap-8 md:py-10"
          >
            <p className="text-[0.68rem] tracking-[0.22em] text-[#c6b49a] md:col-span-2">{tool.index}</p>
            <h2 className="display text-[clamp(2rem,4vw,3.2rem)] md:col-span-4">{tool.name}</h2>
            <p className="quiet max-w-md text-[1.02rem] md:col-span-5 md:col-start-8">{tool.detail}</p>
          </li>
        ))}
      </ol>
    </main>
  );
}

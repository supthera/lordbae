import Image from "next/image";

export function Philosophy() {
  return (
    <section
      id="philosophy"
      className="scroll-mt-8 border-t border-[rgba(244,239,230,0.14)] px-[6vw] py-28 md:py-40"
    >
      <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="relative aspect-[3/4] overflow-hidden bg-[#141210] lg:col-span-5">
          <Image
            src="/images/study.jpg"
            alt="An empty private study with a single oak chair, travertine, and the shadow of a window."
            fill
            sizes="(max-width: 1024px) 100vw, 42vw"
            className="object-cover"
          />
        </div>
        <div className="lg:col-span-6 lg:col-start-7 lg:pt-10">
          <p className="eyebrow">03 — Philosophy</p>
          <h2 className="display mt-5 text-[clamp(3rem,5.5vw,5.4rem)]">
            Quality is a form of discretion.
          </h2>
          <div className="mt-8 h-px w-16 bg-[#c80e0e]" />
          <div className="quiet mt-8 max-w-xl space-y-6 text-[1.05rem]">
            <p>
              The collection is not a market. Houses are acquired rarely, restored
              without spectacle, and kept for the long duration. What is released
              leaves only when a more fitting custodian appears.
            </p>
            <p>
              There is no public offering and no urgency. Correspondence is read by
              the office. Particulars — plans, histories, the terms of a transfer —
              follow an introduction, and only then.
            </p>
            <p>
              Stewardship is the work: proportion, light, and the refusal to add
              what a room does not need.
            </p>
          </div>
          <p className="mt-10 text-[0.72rem] tracking-[0.24em] text-[#c6b49a] uppercase">
            The office of Lord Bae
          </p>
          <p className="mt-3 text-sm text-[#a39c92]">The study, where decisions are left to sit.</p>
        </div>
      </div>
    </section>
  );
}

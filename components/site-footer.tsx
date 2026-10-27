import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-[rgba(244,239,230,0.14)] px-[6vw] py-14">
      <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-end">
        <nav aria-label="Footer" className="flex gap-8">
          <Link href="/#collection" className="text-[0.68rem] tracking-[0.2em] uppercase">
            Collection
          </Link>
          <Link href="/#philosophy" className="text-[0.68rem] tracking-[0.2em] uppercase">
            Philosophy
          </Link>
          <Link href="/#inquiry" className="text-[0.68rem] tracking-[0.2em] uppercase">
            Inquiry
          </Link>
        </nav>
      </div>
      <div className="mt-12 flex flex-col gap-3 border-t border-[rgba(244,239,230,0.1)] pt-6 text-sm text-[#8c867d] md:flex-row md:items-center md:justify-between">
        <p>Correspondence is private. This office does not publish terms of sale.</p>
        <p>© {new Date().getFullYear()} Lord Bae</p>
      </div>
    </footer>
  );
}

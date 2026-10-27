import Link from "next/link";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main id="content" className="flex min-h-[100svh] items-end px-[6vw] pb-24">
        <div>
          <p className="eyebrow">Absent</p>
          <h1 className="display mt-4 text-[clamp(3.2rem,7vw,6.4rem)]">
            This address is not in the collection.
          </h1>
          <Link href="/#collection" className="cta mt-10">
            Return to the collection
            <i />
          </Link>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

import { Suspense } from "react";

import { Collection } from "@/components/collection";
import { Hero } from "@/components/hero";
import { Inquiry } from "@/components/inquiry";
import { Philosophy } from "@/components/philosophy";
import { Sequence } from "@/components/sequence";

export default function HomePage() {
  return (
    <main id="content">
      <Hero />
      <Collection />
      <Sequence />
      <Philosophy />
      <Suspense fallback={null}>
        <Inquiry />
      </Suspense>
    </main>
  );
}

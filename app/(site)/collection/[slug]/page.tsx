import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PropertyView } from "@/components/property-view";
import { getProperty, properties } from "@/lib/properties";

type Params = { slug: string };

export function generateStaticParams() {
  return properties.map((property) => ({ slug: property.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const property = getProperty(slug);
  if (!property) return { title: "Residence" };
  return {
    title: property.name,
    description: property.summary,
    openGraph: {
      title: property.name,
      description: property.summary,
      images: [{ url: property.image, alt: property.imageAlt }],
    },
  };
}

export default async function PropertyPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const property = getProperty(slug);
  if (!property) notFound();

  return (
    <main id="content">
      <PropertyView property={property} />
    </main>
  );
}

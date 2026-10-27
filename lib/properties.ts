export type Typology = "Residence" | "Estate" | "Pavilion" | "House";

export type Region = "Europe" | "Americas" | "Asia" | "Africa";

export type Status = "Held" | "By introduction" | "Under stewardship";

export type Property = {
  slug: string;
  name: string;
  location: string;
  region: Region;
  typology: Typology;
  status: Status;
  summary: string;
  narrative: string;
  image: string;
  imageAlt: string;
  gallery: { src: string; alt: string; caption: string }[];
  facts: { label: string; value: string }[];
};

export const properties: Property[] = [
  {
    slug: "maison-celeste",
    name: "Maison Céleste",
    location: "Paris VII",
    region: "Europe",
    typology: "Residence",
    status: "Held",
    summary:
      "A hôtel particulier turned inward, where the court is the only view that matters.",
    narrative:
      "Behind an unmarked door in the seventh, the house keeps its own weather. Limestone worn smooth by a century of quiet use, a stair whose bronze rail has gone dark at the hand, rooms sequenced toward a garden rather than the street. The restoration touched structure and light, and left the patina alone. It is held, and it is not offered.",
    image: "/images/paris.jpg",
    imageAlt:
      "Wet limestone courtyard of a Paris townhouse, with a dark carved door and ivy along the walls.",
    gallery: [
      {
        src: "/images/paris.jpg",
        alt: "Wet limestone courtyard of a Paris townhouse, with a dark carved door and ivy along the walls.",
        caption: "The court, after rain.",
      },
      {
        src: "/images/paris-detail.jpg",
        alt: "Close view of a worn bronze stair rail against pale limestone.",
        caption: "Bronze, darkened at the hand.",
      },
    ],
    facts: [
      { label: "Typology", value: "Residence" },
      { label: "Situation", value: "Held" },
      { label: "Completed", value: "1874" },
      { label: "Restored", value: "2019" },
      { label: "Interior", value: "640 m²" },
      { label: "Suites", value: "Five" },
    ],
  },
  {
    slug: "casa-vetta",
    name: "Casa Vetta",
    location: "Amalfi",
    region: "Europe",
    typology: "Pavilion",
    status: "By introduction",
    summary: "One room in width, cut into the cliff, open only to water.",
    narrative:
      "The pavilion refuses the coast road. A path ends at a door of untreated cedar; beyond it, a single volume of stone and lime, a table, and the sea at eye level. There is no terrace furniture and no invitation to linger in public. It may be introduced, when the fit is exact.",
    image: "/images/amalfi.jpg",
    imageAlt:
      "A narrow stone pavilion open to a dark sea, with a single cedar table.",
    gallery: [
      {
        src: "/images/amalfi.jpg",
        alt: "A narrow stone pavilion open to a dark sea, with a single cedar table.",
        caption: "The only room.",
      },
      {
        src: "/images/amalfi-detail.jpg",
        alt: "Lime plaster meeting a cedar edge, with the sea beyond.",
        caption: "Lime and cedar.",
      },
    ],
    facts: [
      { label: "Typology", value: "Pavilion" },
      { label: "Situation", value: "By introduction" },
      { label: "Completed", value: "1962" },
      { label: "Restored", value: "2021" },
      { label: "Interior", value: "280 m²" },
      { label: "Suites", value: "Three" },
    ],
  },
  {
    slug: "the-atelier",
    name: "The Atelier",
    location: "Tribeca",
    region: "Americas",
    typology: "Residence",
    status: "Held",
    summary: "A cast-iron floor in Tribeca, kept as one room of north light.",
    narrative:
      "The building is ordinary from the street, which is the point. Inside, the floor runs uninterrupted: white oak, a blackened column, windows that take the weather without decorating it. It functions as a studio that happens to be lived in. Held.",
    image: "/images/tribeca.jpg",
    imageAlt:
      "An empty cast-iron loft with north light, white oak floors, and a blackened steel column.",
    gallery: [
      {
        src: "/images/tribeca.jpg",
        alt: "An empty cast-iron loft with north light, white oak floors, and a blackened steel column.",
        caption: "North light, uninterrupted.",
      },
      {
        src: "/images/tribeca-detail.jpg",
        alt: "White oak floor meeting a blackened steel column.",
        caption: "Oak and steel.",
      },
    ],
    facts: [
      { label: "Typology", value: "Residence" },
      { label: "Situation", value: "Held" },
      { label: "Building", value: "1898" },
      { label: "Reorganized", value: "2018" },
      { label: "Interior", value: "520 m²" },
      { label: "Suites", value: "Four" },
    ],
  },
  {
    slug: "house-of-still-water",
    name: "House of Still Water",
    location: "Kyoto",
    region: "Asia",
    typology: "House",
    status: "Under stewardship",
    summary: "A machiya reorganized around moss, gravel, and an unstained frame.",
    narrative:
      "The street front is a plain timber wall. Inside, the plan was thinned until the garden became the largest room. Screens, a basin, a floor that asks you to slow down. The house is under stewardship: maintained, occupied rarely, altered only when the timber requires it.",
    image: "/images/kyoto.jpg",
    imageAlt:
      "View from a tatami room through open screens onto a moss garden and stone basin.",
    gallery: [
      {
        src: "/images/kyoto.jpg",
        alt: "View from a tatami room through open screens onto a moss garden and stone basin.",
        caption: "The garden is the largest room.",
      },
      {
        src: "/images/kyoto-detail.jpg",
        alt: "Moss, a stone water basin, and a timber threshold.",
        caption: "Threshold.",
      },
    ],
    facts: [
      { label: "Typology", value: "House" },
      { label: "Situation", value: "Under stewardship" },
      { label: "Origin", value: "Edo period" },
      { label: "Reorganized", value: "2016" },
      { label: "Interior", value: "410 m²" },
      { label: "Rooms", value: "Six" },
    ],
  },
  {
    slug: "pavillon-du-lac",
    name: "Pavillon du Lac",
    location: "Céligny",
    region: "Europe",
    typology: "Estate",
    status: "By introduction",
    summary:
      "A low house of gray stone, set back until the lake is heard before it is seen.",
    narrative:
      "On the quieter shore above Geneva, the house sits in a park of old trees and does not announce itself at the water. One long window, a roof that stays low, rooms finished in stone and oak with almost no metal in sight. Available by introduction.",
    image: "/images/geneva.jpg",
    imageAlt:
      "A low gray-stone house with one long window facing a misty lake at dusk.",
    gallery: [
      {
        src: "/images/geneva.jpg",
        alt: "A low gray-stone house with one long window facing a misty lake at dusk.",
        caption: "Set back from the water.",
      },
      {
        src: "/images/geneva-detail.jpg",
        alt: "Gray stone meeting a thin bronze window frame, with lake light beyond.",
        caption: "Stone and bronze.",
      },
    ],
    facts: [
      { label: "Typology", value: "Estate" },
      { label: "Situation", value: "By introduction" },
      { label: "Completed", value: "2009" },
      { label: "Park", value: "1.8 ha" },
      { label: "Interior", value: "890 m²" },
      { label: "Suites", value: "Five" },
    ],
  },
  {
    slug: "qasr-noor",
    name: "Qasr Noor",
    location: "Marrakech",
    region: "Africa",
    typology: "Estate",
    status: "Held",
    summary:
      "A courtyard organized around shade and a line of water, with no face toward the road.",
    narrative:
      "In the Palmeraie, the house turns its back on arrival. Tadelakt, cedar, a channel of water, and a single note of crimson that is replaced when it fades. The rooms are deep, cool, and sequenced for the day rather than for display. It is held.",
    image: "/images/marrakech.jpg",
    imageAlt:
      "A shaded courtyard of sand-colored plaster, a channel of water, a cedar screen, and a folded crimson cloth.",
    gallery: [
      {
        src: "/images/marrakech.jpg",
        alt: "A shaded courtyard of sand-colored plaster, a channel of water, a cedar screen, and a folded crimson cloth.",
        caption: "Shade, water, one note of crimson.",
      },
      {
        src: "/images/marrakech-detail.jpg",
        alt: "Close view of tadelakt, a line of water, and folded crimson cloth.",
        caption: "Tadelakt.",
      },
    ],
    facts: [
      { label: "Typology", value: "Estate" },
      { label: "Situation", value: "Held" },
      { label: "Completed", value: "2014" },
      { label: "Courts", value: "Three" },
      { label: "Interior", value: "1,150 m²" },
      { label: "Suites", value: "Seven" },
    ],
  },
];

export const typologies: Array<Typology | "All"> = [
  "All",
  "Residence",
  "Estate",
  "Pavilion",
  "House",
];

export const regions: Array<Region | "All"> = [
  "All",
  "Europe",
  "Americas",
  "Asia",
  "Africa",
];

export function getProperty(slug: string) {
  return properties.find((property) => property.slug === slug);
}

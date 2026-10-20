import { createFileRoute } from "@tanstack/react-router";
import { CollectionGrid, EditorialSlideshow, type EditorialSlide } from "@/components/storefront";
import { imagery } from "@/lib/catalog";

const slides: EditorialSlide[] = [
  { eyebrow: "The Latest", title: "New Arrivals", copy: "A considered edit of new season tailoring, silk, cashmere and leather.", image: imagery.hero, alt: "The latest CIAO D MILANO collection in Milan" },
  { eyebrow: "New Season", title: "Quiet Statements", copy: "Restrained silhouettes in tactile cloth, chosen to be worn far beyond one season.", image: imagery.women, alt: "New season Italian womenswear campaign" },
  { eyebrow: "Just Arrived", title: "The New Classics", copy: "Purposeful pieces refined through proportion, material and subtle detail.", image: imagery.men, alt: "New season Italian menswear campaign" },
];

export const Route = createFileRoute("/new-arrivals")({ head: () => ({ meta: [{ title: "New Arrivals — CIAO D MILANO" }, { name: "description", content: "The latest expressions from the CIAO D MILANO atelier." }, { property: "og:title", content: "New Arrivals — CIAO D MILANO" }, { property: "og:description", content: "Shop the newest Italian luxury fashion arrivals." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }), component: () => <><EditorialSlideshow label="New arrival highlights" slides={slides} /><CollectionGrid fittingRoom /></> });
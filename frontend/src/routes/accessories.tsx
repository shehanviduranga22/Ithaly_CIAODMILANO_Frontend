import { createFileRoute } from "@tanstack/react-router";
import { CollectionGrid, EditorialSlideshow, type EditorialSlide } from "@/components/storefront";
import { imagery, products } from "@/lib/catalog";

const slides: EditorialSlide[] = [
  { eyebrow: "Autumn / Winter 2026", title: "Accessories", copy: "The finishing gesture. Silk, leather and cashmere, made slowly by Italian hands.", image: imagery.stillLife, alt: "CIAO D MILANO accessories and atelier objects" },
  { eyebrow: "Objects of Permanence", title: "Made by Hand", copy: "Small pieces, exacting standards — edge-painted, hand-rolled and built to be kept.", image: imagery.hero, alt: "Italian craftsmanship in a Milan atelier" },
  { eyebrow: "The Detail", title: "Quiet Signatures", copy: "Considered leather, printed silk and pure cashmere that complete every silhouette.", image: imagery.women, alt: "Editorial portrait with luxury Italian accessories" },
];

export const Route = createFileRoute("/accessories")({ validateSearch: (search: Record<string, unknown>): { category?: string } => typeof search["category"] === "string" ? { category: search["category"] } : {}, head: () => ({ meta: [{ title: "Accessories — CIAO D MILANO" }, { name: "description", content: "Italian silk, leather and cashmere accessories, finished by hand." }, { property: "og:title", content: "Accessories — CIAO D MILANO" }, { property: "og:description", content: "Discover hand-finished Italian accessories from the CIAO D MILANO atelier." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }), component: () => <><EditorialSlideshow label="Accessories highlights" slides={slides} /><CollectionGrid fittingRoom items={products.filter((p) => p.category.startsWith("Accessories"))} /></> });

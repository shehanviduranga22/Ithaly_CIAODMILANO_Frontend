import { createFileRoute } from "@tanstack/react-router";
import { CollectionGrid, EditorialSlideshow, type EditorialSlide } from "@/components/storefront";
import { imagery, products } from "@/lib/catalog";

const slides: EditorialSlide[] = [
  { eyebrow: "Autumn / Winter 2026", title: "Men", copy: "Precision in every line. Modern tailoring, fine knitwear and enduring leather goods.", image: imagery.men, alt: "CIAO D MILANO menswear tailoring campaign" },
  { eyebrow: "The Milanese Cut", title: "Modern Tailoring", copy: "A study in structure, movement and the quiet confidence of impeccable cloth.", image: imagery.hero, alt: "Italian tailoring in a Milan setting" },
  { eyebrow: "Made to Endure", title: "Finishing Touches", copy: "Considered leather, polished details and objects shaped for a lifetime.", image: imagery.stillLife, alt: "Italian leather accessories and atelier objects" },
];

export const Route = createFileRoute("/men")({ validateSearch: (search: Record<string, unknown>): { category?: string } => typeof search["category"] === "string" ? { category: search["category"] } : {}, head: () => ({ meta: [{ title: "Men — CIAO D MILANO" }, { name: "description", content: "Italian menswear defined by precise tailoring and quiet confidence." }, { property: "og:title", content: "Men — CIAO D MILANO" }, { property: "og:description", content: "Discover refined Italian menswear and accessories." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }), component: () => <><EditorialSlideshow label="Men's collection highlights" slides={slides} /><CollectionGrid fittingRoom items={products.filter((p) => p.category.startsWith("Men"))} /></> });
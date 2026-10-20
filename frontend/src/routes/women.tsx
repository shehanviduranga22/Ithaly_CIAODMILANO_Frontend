import { createFileRoute } from "@tanstack/react-router";
import { CollectionGrid, EditorialSlideshow, type EditorialSlide } from "@/components/storefront";
import { imagery, products } from "@/lib/catalog";

const slides: EditorialSlide[] = [
  { eyebrow: "Autumn / Winter 2026", title: "Women", copy: "Sculpted tailoring and fluid silhouettes, made slowly in Italy from exceptional materials.", image: imagery.women, alt: "CIAO D MILANO womenswear campaign" },
  { eyebrow: "Atelier Study", title: "Soft Structure", copy: "Architectural form meets an ease that moves naturally from morning to evening.", image: imagery.hero, alt: "Editorial Italian fashion portrait" },
  { eyebrow: "House Icons", title: "Objects of Desire", copy: "Leather goods and lasting signatures, finished with an artisan's exacting hand.", image: imagery.stillLife, alt: "Luxury Italian handbag and atelier objects" },
];

export const Route = createFileRoute("/women")({ validateSearch: (search: Record<string, unknown>): { category?: string } => typeof search["category"] === "string" ? { category: search["category"] } : {}, head: () => ({ meta: [{ title: "Women — CIAO D MILANO" }, { name: "description", content: "Italian womenswear balancing softness, structure and timeless form." }, { property: "og:title", content: "Women — CIAO D MILANO" }, { property: "og:description", content: "Discover Italian womenswear, tailoring and leather goods." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }), component: () => <><EditorialSlideshow label="Women's collection highlights" slides={slides} /><CollectionGrid fittingRoom items={products.filter((p) => p.category.startsWith("Women"))} /></> });
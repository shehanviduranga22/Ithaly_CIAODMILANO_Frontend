import { createFileRoute } from "@tanstack/react-router";
import { CollectionGrid, EditorialSlideshow, type EditorialSlide } from "@/components/storefront";
import { useCatalogItems } from "@/lib/catalog-api";
import menSlide1 from "@/assets/men_slideshow1.png";
import menSlide2 from "@/assets/men_slideshow2.png";
import menSlide3 from "@/assets/men_slideshow3.png";
import menSlide4 from "@/assets/men_slideshow4.png";

const slides: EditorialSlide[] = [
  {
    eyebrow: "Autumn / Winter 2026",
    title: "Men",
    copy: "Precision in every line. Modern tailoring, fine knitwear and enduring leather goods.",
    image: menSlide1,
    alt: "CIAO D MILANO menswear tailoring campaign",
  },
  {
    eyebrow: "The Milanese Cut",
    title: "Modern Tailoring",
    copy: "A study in structure, movement and the quiet confidence of impeccable cloth.",
    image: menSlide2,
    alt: "Italian tailoring in a Milan setting",
  },
  {
    eyebrow: "Made to Endure",
    title: "Finishing Touches",
    copy: "Considered leather, polished details and objects shaped for a lifetime.",
    image: menSlide3,
    alt: "Italian leather accessories and atelier objects",
  },
  {
    eyebrow: "The House Standard",
    title: "Enduring Form",
    copy: "Thoughtful proportions and exceptional materials define a modern wardrobe.",
    image: menSlide4,
    alt: "CIAO D MILANO men's collection",
  },
];

export const Route = createFileRoute("/men")({
  validateSearch: (search: Record<string, unknown>): { category?: string } =>
    typeof search["category"] === "string" ? { category: search["category"] } : {},
  head: () => ({
    meta: [
      { title: "Men — CIAO D MILANO" },
      {
        name: "description",
        content: "Italian menswear defined by precise tailoring and quiet confidence.",
      },
      { property: "og:title", content: "Men — CIAO D MILANO" },
      { property: "og:description", content: "Discover refined Italian menswear and accessories." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MenPage,
});

function MenPage() {
  const { data = [], isLoading, error } = useCatalogItems("men_items");
  return (
    <>
      <EditorialSlideshow label="Men's collection highlights" slides={slides} />
      <CollectionGrid
        fittingRoom
        items={data}
        loading={isLoading}
        error={error instanceof Error ? error.message : undefined}
      />
    </>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { CollectionGrid, EditorialSlideshow, type EditorialSlide } from "@/components/storefront";
import { useCatalogItems } from "@/lib/catalog-api";
import accessoriesSlide1 from "@/assets/acc_slideshow1.png";
import accessoriesSlide2 from "@/assets/acc_slideshow2.png";
import accessoriesSlide3 from "@/assets/acc_slideshow3.png";
import accessoriesSlide4 from "@/assets/acc_slideshow4.png";

const slides: EditorialSlide[] = [
  {
    eyebrow: "Autumn / Winter 2026",
    title: "Accessories",
    copy: "The finishing gesture. Silk, leather and cashmere, made slowly by Italian hands.",
    image: accessoriesSlide1,
    alt: "CIAO D MILANO accessories and atelier objects",
  },
  {
    eyebrow: "Objects of Permanence",
    title: "Made by Hand",
    copy: "Small pieces, exacting standards — edge-painted, hand-rolled and built to be kept.",
    image: accessoriesSlide2,
    alt: "Italian craftsmanship in a Milan atelier",
  },
  {
    eyebrow: "The Detail",
    title: "Quiet Signatures",
    copy: "Considered leather, printed silk and pure cashmere that complete every silhouette.",
    image: accessoriesSlide3,
    alt: "Editorial portrait with luxury Italian accessories",
  },
  {
    eyebrow: "The Finishing Gesture",
    title: "Objects to Keep",
    copy: "Lasting materials and meticulous finishing make every detail count.",
    image: accessoriesSlide4,
    alt: "CIAO D MILANO accessories collection",
  },
];

export const Route = createFileRoute("/accessories")({
  validateSearch: (search: Record<string, unknown>): { category?: string } =>
    typeof search["category"] === "string" ? { category: search["category"] } : {},
  head: () => ({
    meta: [
      { title: "Accessories — CIAO D MILANO" },
      {
        name: "description",
        content: "Italian silk, leather and cashmere accessories, finished by hand.",
      },
      { property: "og:title", content: "Accessories — CIAO D MILANO" },
      {
        property: "og:description",
        content: "Discover hand-finished Italian accessories from the CIAO D MILANO atelier.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AccessoriesPage,
});

function AccessoriesPage() {
  const { data = [], isLoading, error } = useCatalogItems("accessories_items");
  return (
    <>
      <EditorialSlideshow label="Accessories highlights" slides={slides} />
      <CollectionGrid
        fittingRoom
        items={data}
        loading={isLoading}
        error={error instanceof Error ? error.message : undefined}
      />
    </>
  );
}

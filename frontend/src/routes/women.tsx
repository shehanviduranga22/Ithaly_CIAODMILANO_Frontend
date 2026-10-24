import { createFileRoute } from "@tanstack/react-router";
import { CollectionGrid, EditorialSlideshow, type EditorialSlide } from "@/components/storefront";
import womenSlide1 from "@/assets/women_slideshow1.png";
import womenSlide2 from "@/assets/women_slideshow2.png";
import womenSlide3 from "@/assets/women_slideshow3.png";
import womenSlide4 from "@/assets/women_slideshow4.png";

const slides: EditorialSlide[] = [
  {
    eyebrow: "Autumn / Winter 2026",
    title: "Women",
    copy: "Sculpted tailoring and fluid silhouettes, made slowly in Italy from exceptional materials.",
    image: womenSlide1,
    alt: "CIAO D MILANO womenswear campaign",
  },
  {
    eyebrow: "Atelier Study",
    title: "Soft Structure",
    copy: "Architectural form meets an ease that moves naturally from morning to evening.",
    image: womenSlide2,
    alt: "Editorial Italian fashion portrait",
  },
  {
    eyebrow: "House Icons",
    title: "Objects of Desire",
    copy: "Leather goods and lasting signatures, finished with an artisan's exacting hand.",
    image: womenSlide3,
    alt: "Luxury Italian handbag and atelier objects",
  },
  {
    eyebrow: "The New Silhouette",
    title: "A Lasting Impression",
    copy: "Considered details and refined materials bring a quiet confidence to every look.",
    image: womenSlide4,
    alt: "CIAO D MILANO women's collection",
  },
];

export const Route = createFileRoute("/women")({
  validateSearch: (search: Record<string, unknown>): { category?: string } =>
    typeof search["category"] === "string" ? { category: search["category"] } : {},
  head: () => ({
    meta: [
      { title: "Women — CIAO D MILANO" },
      {
        name: "description",
        content: "Italian womenswear balancing softness, structure and timeless form.",
      },
      { property: "og:title", content: "Women — CIAO D MILANO" },
      {
        property: "og:description",
        content: "Discover Italian womenswear, tailoring and leather goods.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: WomenPage,
});

function WomenPage() {
  return (
    <>
      <EditorialSlideshow label="Women's collection highlights" slides={slides} />
      <CollectionGrid
        fittingRoom
        pagination
        catalogCollection="women_items"
      />
    </>
  );
}

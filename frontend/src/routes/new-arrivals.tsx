import { createFileRoute } from "@tanstack/react-router";
import { CollectionGrid, EditorialSlideshow, type EditorialSlide } from "@/components/storefront";
import { mixCatalogProducts, useCatalogItems } from "@/lib/catalog-api";
import arrivalSlide1 from "@/assets/arrivel_slideshow1.png";
import arrivalSlide2 from "@/assets/arrivel_slideshow2.png";
import arrivalSlide3 from "@/assets/arrivel_slideshow3.png";
import arrivalSlide4 from "@/assets/arrivel_slideshow4.png";

const slides: EditorialSlide[] = [
  {
    eyebrow: "The Latest",
    title: "New Arrivals",
    copy: "A considered edit of new season tailoring, silk, cashmere and leather.",
    image: arrivalSlide1,
    alt: "The latest CIAO D MILANO collection in Milan",
  },
  {
    eyebrow: "New Season",
    title: "Quiet Statements",
    copy: "Restrained silhouettes in tactile cloth, chosen to be worn far beyond one season.",
    image: arrivalSlide2,
    alt: "New season Italian womenswear campaign",
  },
  {
    eyebrow: "Just Arrived",
    title: "The New Classics",
    copy: "Purposeful pieces refined through proportion, material and subtle detail.",
    image: arrivalSlide3,
    alt: "New season Italian menswear campaign",
  },
  {
    eyebrow: "The New Season Edit",
    title: "Fresh Perspectives",
    copy: "Discover considered pieces designed to become part of your wardrobe for years.",
    image: arrivalSlide4,
    alt: "New arrivals from CIAO D MILANO",
  },
];

export const Route = createFileRoute("/new-arrivals")({
  head: () => ({
    meta: [
      { title: "New Arrivals — CIAO D MILANO" },
      { name: "description", content: "The latest expressions from the CIAO D MILANO atelier." },
      { property: "og:title", content: "New Arrivals — CIAO D MILANO" },
      { property: "og:description", content: "Shop the newest Italian luxury fashion arrivals." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: NewArrivalsPage,
});

function NewArrivalsPage() {
  const men = useCatalogItems("men_items", 5);
  const women = useCatalogItems("women_items", 5);
  const accessories = useCatalogItems("accessories_items", 5);
  const products = mixCatalogProducts(men.data ?? [], women.data ?? [], accessories.data ?? []);
  const error = men.error ?? women.error ?? accessories.error;

  return (
    <>
      <EditorialSlideshow label="New arrival highlights" slides={slides} />
      <CollectionGrid
        fittingRoom
        items={products}
        loading={men.isLoading || women.isLoading || accessories.isLoading}
        error={error instanceof Error ? error.message : undefined}
      />
    </>
  );
}

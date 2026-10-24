import { createFileRoute } from "@tanstack/react-router";
import { PiecesLoading } from "@/components/pieces-loading";
import { CollectionGrid, EmptyState, useCommerce } from "@/components/storefront";
import { useProductsByIds } from "@/lib/catalog-api";
export const Route = createFileRoute("/wishlist")({
  head: () => ({
    meta: [
      { title: "Wishlist — CIAO D MILANO" },
      { name: "description", content: "Your saved CIAO D MILANO pieces." },
      { property: "og:title", content: "Wishlist — CIAO D MILANO" },
      { property: "og:description", content: "A personal edit of saved Italian fashion pieces." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Wishlist,
});

function Wishlist() {
  const { account, wishlist } = useCommerce();
  const { data: items, isLoading, error } = useProductsByIds(wishlist);

  if (!account) {
    return (
      <EmptyState title="Your Wishlist" copy="Save the pieces you love and return to them here." />
    );
  }

  if (error) {
    return (
      <section
        role="alert"
        className="flex min-h-[60vh] items-center justify-center px-6 text-center"
      >
        <p className="text-sm text-stone">
          {error instanceof Error ? error.message : "Unable to load your wishlist."}
        </p>
      </section>
    );
  }
  if (isLoading) {
    return <PiecesLoading label="Loading your wishlist" className="min-h-[60vh] px-6" />;
  }

  if (!items.length) {
    return (
      <EmptyState title="Your Wishlist" copy="Save the pieces you love and return to them here." />
    );
  }

  return (
    <>
      <div className="mx-auto max-w-[1440px] px-4 pb-10 pt-16 sm:px-6 lg:px-10">
        <h1 className="font-serif text-5xl">Your Wishlist</h1>
      </div>
      <CollectionGrid items={items} />
    </>
  );
}

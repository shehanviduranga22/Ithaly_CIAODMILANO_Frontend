import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Minus, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PiecesLoading } from "@/components/pieces-loading";
import { EmptyState, useCommerce } from "@/components/storefront";
import { money } from "@/lib/catalog";
import { useProductsByIds } from "@/lib/catalog-api";
export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Shopping Bag — CIAO D MILANO" },
      { name: "description", content: "Review your CIAO D MILANO shopping bag." },
      { property: "og:title", content: "Shopping Bag — CIAO D MILANO" },
      { property: "og:description", content: "Review your selected pieces before checkout." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Cart,
});

function Cart() {
  const { account, cart, setQty, remove, requireSignIn, clearCheckoutItems } = useCommerce();
  const navigate = useNavigate();
  const {
    data: lines,
    isLoading,
    error,
  } = useProductsByIds(Object.keys(cart).filter((id) => (cart[id] ?? 0) > 0));
  const total = lines.reduce((sum, product) => sum + product.price * (cart[product.id] ?? 0), 0);

  if (!account) {
    return (
      <EmptyState
        title="Your Bag is Empty"
        copy="Discover the latest pieces from the Milan atelier."
      />
    );
  }

  if (error) {
    return (
      <section
        role="alert"
        className="flex min-h-[60vh] items-center justify-center px-6 text-center"
      >
        <p className="text-sm text-stone">
          {error instanceof Error ? error.message : "Unable to load your shopping bag."}
        </p>
      </section>
    );
  }
  if (isLoading) {
    return <PiecesLoading label="Loading your shopping bag" className="min-h-[60vh] px-6" />;
  }

  if (!lines.length) {
    return (
      <EmptyState
        title="Your Bag is Empty"
        copy="Discover the latest pieces from the Milan atelier."
      />
    );
  }

  return (
    <section className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 lg:px-10">
      <h1 className="font-serif text-5xl">Shopping Bag</h1>
      <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="divide-y divide-border border-y border-border">
          {lines.map((product) => (
            <article
              key={product.id}
              className="grid grid-cols-[96px_minmax(0,1fr)_auto] gap-4 py-6 sm:grid-cols-[140px_minmax(0,1fr)_auto]"
            >
              <img
                src={product.image}
                alt={product.name}
                width={300}
                height={400}
                className="aspect-[3/4] w-full object-cover"
              />
              <div className="min-w-0">
                <h2 className="font-serif text-xl">{product.name}</h2>
                <p className="mt-2 text-xs text-stone">Size M · Black</p>
                <div className="mt-5 inline-grid grid-cols-3 items-center border border-border">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQty(product.id, (cart[product.id] ?? 1) - 1)}
                    aria-label="Decrease quantity"
                  >
                    <Minus />
                  </Button>
                  <span className="text-center text-sm">{cart[product.id]}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQty(product.id, (cart[product.id] ?? 1) + 1)}
                    aria-label="Increase quantity"
                  >
                    <Plus />
                  </Button>
                </div>
              </div>
              <div className="flex flex-col items-end justify-between">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => remove(product.id)}
                  aria-label="Remove"
                >
                  <X />
                </Button>
                <p className="text-sm">{money(product.price * (cart[product.id] ?? 0))}</p>
              </div>
            </article>
          ))}
        </div>
        <aside className="border-t border-ink pt-6">
          <h2 className="font-serif text-2xl">Order Summary</h2>
          <div className="mt-6 space-y-4 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{money(total)}</span>
            </div>
            <div className="flex justify-between text-stone">
              <span>Delivery</span>
              <span>Complimentary</span>
            </div>
            <div className="flex justify-between border-t border-border pt-4 font-medium">
              <span>Total</span>
              <span>{money(total)}</span>
            </div>
          </div>
          <Button
            size="lg"
            className="mt-8 w-full"
            onClick={() => {
              clearCheckoutItems();
              requireSignIn(() => void navigate({ to: "/checkout" }));
            }}
          >
            Proceed to Checkout
          </Button>
        </aside>
      </div>
    </section>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { Heart, Minus, Plus } from "lucide-react";
import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ProductCard, useCommerce } from "@/components/storefront";
import { money, products, type Product } from "@/lib/catalog";
import { mixCatalogProducts, useCatalogItems, useProductsByIds } from "@/lib/catalog-api";

export const Route = createFileRoute("/product/$id")({
  head: ({ params }) => {
    const product = products.find((item) => item.id === params.id);
    const title = product ? `${product.name} — CIAO D MILANO` : "Product — CIAO D MILANO";
    const description = product?.description ?? "Discover Italian luxury fashion by CIAO D MILANO.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: ProductPage,
});

function ProductPage() {
  const { id } = Route.useParams();
  const { data, isLoading, error } = useProductsByIds([id]);
  const product = data[0];
  const men = useCatalogItems("men_items");
  const women = useCatalogItems("women_items");
  const accessories = useCatalogItems("accessories_items");
  const { add, buyNow, toggleWish, wishlist } = useCommerce();
  const [size, setSize] = useState("M");
  const [quantity, setQuantity] = useState(1);
  const recommendationCandidates = mixCatalogProducts(
    products,
    men.data ?? [],
    women.data ?? [],
    accessories.data ?? [],
  ).filter(
    (item, index, all) =>
      item.id !== product?.id && all.findIndex(({ id: otherId }) => otherId === item.id) === index,
  );
  const recommendations = product
    ? [...recommendationCandidates]
        .sort((left, right) => compareProductSimilarity(product, left, right))
        .slice(0, 4)
    : [];
  const recommendationsLoading = men.isLoading || women.isLoading || accessories.isLoading;
  const recommendationsError = men.error ?? women.error ?? accessories.error;

  if (!product) {
    return (
      <section className="flex min-h-[60vh] items-center justify-center px-6 text-center">
        <div>
          <h1 className="font-serif text-5xl">
            {error ? "Product Unavailable" : isLoading ? "Loading Piece" : "Piece Not Found"}
          </h1>
          <p role={error ? "alert" : "status"} className="mt-4 text-sm text-stone">
            {error instanceof Error
              ? error.message
              : isLoading
                ? "Loading product details…"
                : "This piece is no longer available."}
          </p>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="mx-auto grid max-w-[1440px] gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(340px,.75fr)] lg:px-10 lg:py-16">
        <div className="grid grid-cols-2 gap-3">
          <img
            src={product.image}
            alt={product.name}
            width={1024}
            height={1280}
            className="col-span-2 aspect-[4/5] w-full object-cover sm:col-span-1"
          />
          <img
            src={product.image}
            alt={`${product.name} detail`}
            width={1024}
            height={1280}
            className="col-span-2 aspect-[4/5] w-full object-cover object-right sm:col-span-1"
          />
        </div>
        <div className="lg:sticky lg:top-24 lg:self-start">
          <p className="text-[10px] uppercase tracking-[0.18em] text-stone">{product.category}</p>
          <h1 className="mt-3 font-serif text-4xl sm:text-5xl">{product.name}</h1>
          <p className="mt-4 text-lg">{money(product.price)}</p>
          <p className="mt-7 text-sm leading-7 text-stone">{product.description}</p>

          <div className="mt-8 border-t border-border pt-6">
            <div className="mb-3 flex justify-between text-[10px] uppercase tracking-[0.16em]">
              <span>Size · {size}</span>
              <button type="button" className="underline underline-offset-4">
                Size Guide
              </button>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {["XS", "S", "M", "L", "XL"].map((option) => (
                <Button
                  key={option}
                  type="button"
                  variant={size === option ? "default" : "outline"}
                  aria-pressed={size === option}
                  onClick={() => setSize(option)}
                >
                  {option}
                </Button>
              ))}
            </div>
          </div>

          <div className="mt-6 flex items-center gap-3">
            <div className="grid h-12 shrink-0 grid-cols-3 items-center border border-border">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                aria-label="Decrease quantity"
              >
                <Minus />
              </Button>
              <span className="text-center text-sm">{quantity}</span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setQuantity(quantity + 1)}
                aria-label="Increase quantity"
              >
                <Plus />
              </Button>
            </div>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-12 w-12 shrink-0"
              onClick={() => toggleWish(product.id)}
              aria-label={
                wishlist.includes(product.id) ? "Remove from wishlist" : "Add to wishlist"
              }
              title={wishlist.includes(product.id) ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart className={wishlist.includes(product.id) ? "fill-current" : ""} />
            </Button>
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <Button
              type="button"
              size="lg"
              onClick={() => add(product.id, quantity)}
              className="w-full"
            >
              Add to Bag
            </Button>
            <Button
              type="button"
              size="lg"
              variant="outline"
              className="w-full border-ink"
              onClick={() => buyNow(product.id, quantity)}
            >
              Buy Now
            </Button>
          </div>

          <Accordion type="multiple" className="mt-8">
            <AccordionItem value="details">
              <AccordionTrigger>Product Details</AccordionTrigger>
              <AccordionContent className="leading-6 text-stone">
                Made in Italy. Relaxed tailored fit with hand-finished internal construction.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="materials">
              <AccordionTrigger>Materials &amp; Care</AccordionTrigger>
              <AccordionContent className="leading-6 text-stone">
                Premium Italian materials. Specialist dry clean only. Store in the garment bag
                provided.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="shipping">
              <AccordionTrigger>Shipping &amp; Returns</AccordionTrigger>
              <AccordionContent className="leading-6 text-stone">
                Complimentary express delivery and returns within 30 days.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>
      <section className="mx-auto max-w-[1440px] px-4 pb-24 sm:px-6 lg:px-10">
        <h2 className="mb-10 font-serif text-4xl">You May Also Like</h2>
        {recommendationsLoading && (
          <p role="status" className="mb-5 text-sm text-stone">
            Finding similar pieces…
          </p>
        )}
        {recommendationsError instanceof Error && (
          <p role="alert" className="mb-5 text-sm text-destructive">
            Unable to load the full catalog of recommendations: {recommendationsError.message}
          </p>
        )}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-6">
          {recommendations.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      </section>
    </>
  );
}

function compareProductSimilarity(product: Product, left: Product, right: Product) {
  const similarity = (candidate: Product) => {
    const [department, category] = product.category
      .toLowerCase()
      .split("·")
      .map((part) => part.trim());
    const [candidateDepartment, candidateCategory] = candidate.category
      .toLowerCase()
      .split("·")
      .map((part) => part.trim());
    const sameDepartment = department && department === candidateDepartment;
    const sameCategory = category && category === candidateCategory;
    const categoryWords = new Set(product.category.toLowerCase().match(/[a-z]+/g) ?? []);
    const sharedCategoryWords = (candidate.category.toLowerCase().match(/[a-z]+/g) ?? []).filter(
      (word) => categoryWords.has(word),
    ).length;
    const nameWords = new Set(product.name.toLowerCase().match(/[a-z]+/g) ?? []);
    const sharedNameWords = (candidate.name.toLowerCase().match(/[a-z]+/g) ?? []).filter((word) =>
      nameWords.has(word),
    ).length;

    return (
      (sameCategory ? 5 : 0) +
      (sameDepartment ? 2 : 0) +
      sharedCategoryWords +
      sharedNameWords * 0.5
    );
  };

  return similarity(right) - similarity(left) || left.id.localeCompare(right.id);
}

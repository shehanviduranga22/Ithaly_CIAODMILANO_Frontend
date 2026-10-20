import { createFileRoute } from "@tanstack/react-router";
import { Search as SearchIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { ProductCard } from "@/components/storefront";
import { products } from "@/lib/catalog";
import { mixCatalogProducts, useCatalogItems } from "@/lib/catalog-api";

export const Route = createFileRoute("/search")({
  head: () => ({
    meta: [
      { title: "Search — CIAO D MILANO" },
      { name: "description", content: "Search the CIAO D MILANO collection." },
      { property: "og:title", content: "Search — CIAO D MILANO" },
      {
        property: "og:description",
        content: "Find Italian tailoring, womenswear and accessories.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SearchPage,
});

function SearchPage() {
  const [query, setQuery] = useState("");
  const men = useCatalogItems("men_items");
  const women = useCatalogItems("women_items");
  const accessories = useCatalogItems("accessories_items");
  const searchTerm = query.trim().toLowerCase();
  const catalog = useMemo(() => {
    const combined = [
      ...products,
      ...mixCatalogProducts(men.data ?? [], women.data ?? [], accessories.data ?? []),
    ];
    const uniqueProducts = combined.filter(
      (product, index, all) => all.findIndex(({ id }) => id === product.id) === index,
    );
    const matches = searchTerm
      ? uniqueProducts.filter((product) =>
          `${product.name} ${product.category} ${product.description}`
            .toLowerCase()
            .includes(searchTerm),
        )
      : [];

    const department = (category: string) => category.split("·")[0]?.trim().toLowerCase();
    const menMatches = matches.filter((product) => department(product.category) === "men");
    const womenMatches = matches.filter((product) => department(product.category) === "women");
    const accessoryMatches = matches.filter(
      (product) => department(product.category) === "accessories",
    );
    const categorizedIds = new Set(
      [...menMatches, ...womenMatches, ...accessoryMatches].map((product) => product.id),
    );
    const otherMatches = matches.filter((product) => !categorizedIds.has(product.id));

    return [...mixCatalogProducts(menMatches, womenMatches, accessoryMatches), ...otherMatches];
  }, [accessories.data, men.data, searchTerm, women.data]);
  const isLoading = men.isLoading || women.isLoading || accessories.isLoading;
  const error = men.error ?? women.error ?? accessories.error;

  return (
    <section className="mx-auto min-h-[70vh] max-w-[1440px] px-4 py-16 sm:px-6 lg:px-10">
      <h1 className="font-serif text-5xl">Search</h1>
      <div className="mt-10 grid grid-cols-[auto_minmax(0,1fr)] items-center gap-4 border-b border-ink pb-4">
        <SearchIcon className="size-5" />
        <input
          autoFocus
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="What are you looking for?"
          className="min-w-0 bg-transparent text-xl outline-none placeholder:text-stone"
        />
      </div>
      <p className="my-10 text-[10px] uppercase tracking-[0.16em] text-stone">
        {searchTerm ? `${catalog.length} results for “${query.trim()}”` : "Enter a search term"}
      </p>
      {searchTerm && isLoading && (
        <p role="status" className="mb-6 text-sm text-stone">
          Searching the collection…
        </p>
      )}
      {searchTerm && error instanceof Error && (
        <p role="alert" className="mb-6 text-sm text-destructive">
          Unable to load the full catalog: {error.message}
        </p>
      )}
      {searchTerm && !isLoading && catalog.length === 0 && (
        <p className="text-sm text-stone">No pieces matched your search.</p>
      )}
      {searchTerm && (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
          {catalog.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}

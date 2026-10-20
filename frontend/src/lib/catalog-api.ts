import { useQuery } from "@tanstack/react-query";
import { products, type Product } from "@/lib/catalog";

export type CatalogCollection = "men_items" | "women_items" | "accessories_items";

const apiBaseUrl = import.meta.env["VITE_API_URL"] ?? "http://localhost:3001";

async function readProducts(response: Response): Promise<Product[]> {
  const result = (await response.json()) as Product[] | { message?: string };
  if (!response.ok) {
    throw new Error(
      !Array.isArray(result) && result.message
        ? result.message
        : "Unable to load catalog products.",
    );
  }
  if (!Array.isArray(result)) {
    throw new Error("The catalog service returned an invalid response.");
  }
  return result;
}

export async function fetchCatalogItems(
  collection: CatalogCollection,
  limit?: number,
): Promise<Product[]> {
  const params = new URLSearchParams({ collection });
  if (limit !== undefined) params.set("limit", String(limit));
  const response = await fetch(`${apiBaseUrl.replace(/\/$/, "")}/api/catalog?${params.toString()}`);
  return readProducts(response);
}

async function fetchProductsByIds(ids: string[]): Promise<Product[]> {
  if (ids.length === 0) return [];
  const params = new URLSearchParams({ ids: ids.join(",") });
  const response = await fetch(
    `${apiBaseUrl.replace(/\/$/, "")}/api/catalog/products?${params.toString()}`,
  );
  return readProducts(response);
}

export function useCatalogItems(collection: CatalogCollection, limit?: number) {
  return useQuery({
    queryKey: ["catalog", collection, limit],
    queryFn: () => fetchCatalogItems(collection, limit),
  });
}

export function useProductsByIds(ids: string[]) {
  const staticProducts = new Map(products.map((product) => [product.id, product]));
  const dynamicIds = ids.filter((id) => !staticProducts.has(id) && /^[a-f\d]{24}$/i.test(id));
  const query = useQuery({
    queryKey: ["catalog-products", [...dynamicIds].sort()],
    queryFn: () => fetchProductsByIds(dynamicIds),
    enabled: dynamicIds.length > 0,
  });
  const dynamicProducts = new Map((query.data ?? []).map((product) => [product.id, product]));

  return {
    ...query,
    data: ids.flatMap((id) => {
      const product = staticProducts.get(id) ?? dynamicProducts.get(id);
      return product ? [product] : [];
    }),
  };
}

export function mixCatalogProducts(...groups: Product[][]): Product[] {
  const mixed: Product[] = [];
  const maxGroupLength = Math.max(0, ...groups.map((group) => group.length));
  for (let index = 0; index < maxGroupLength; index += 1) {
    for (const group of groups) {
      const product = group[index];
      if (product) mixed.push(product);
    }
  }
  return mixed;
}

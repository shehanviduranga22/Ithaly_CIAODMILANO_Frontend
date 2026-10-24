import { useQuery } from "@tanstack/react-query";
import { products, type Product } from "@/lib/catalog";

export type CatalogCollection = "men_items" | "women_items" | "accessories_items";
export type PaginatedCatalogItems = {
  items: Product[];
  totalCount: number;
  categories: string[];
};

function isPaginatedCatalogItems(result: unknown): result is PaginatedCatalogItems {
  if (typeof result !== "object" || result === null) return false;
  const candidate = result as Record<string, unknown>;
  return (
    Array.isArray(candidate.items) &&
    typeof candidate.totalCount === "number" &&
    Number.isInteger(candidate.totalCount) &&
    candidate.totalCount >= 0 &&
    Array.isArray(candidate.categories) &&
    candidate.categories.every((value) => typeof value === "string")
  );
}

const apiBaseUrl =
  import.meta.env["VITE_API_URL"] ?? "https://ithaly-ciaodmilano-frontend.vercel.app";

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

async function fetchPaginatedCatalogItems(
  collection: CatalogCollection,
  page: number,
  pageSize: number,
  category: string | undefined,
  sort: string,
): Promise<PaginatedCatalogItems> {
  const params = new URLSearchParams({
    collection,
    page: String(page),
    pageSize: String(pageSize),
    sort,
  });
  if (category) params.set("category", category);
  const response = await fetch(`${apiBaseUrl.replace(/\/$/, "")}/api/catalog?${params.toString()}`);
  const result: unknown = await response.json();
  if (!response.ok) {
    throw new Error(
      typeof result === "object" &&
        result !== null &&
        "message" in result &&
        typeof result.message === "string"
        ? result.message
        : "Unable to load catalog products.",
    );
  }
  if (!isPaginatedCatalogItems(result)) {
    throw new Error("The catalog service returned an invalid paginated response.");
  }
  return result;
}

export function usePaginatedCatalogItems(
  collection: CatalogCollection | undefined,
  page: number,
  pageSize: number,
  category: string | undefined,
  sort: string,
) {
  return useQuery({
    queryKey: ["catalog-page", collection, page, pageSize, category, sort],
    queryFn: () => {
      if (!collection) throw new Error("A catalog collection is required.");
      return fetchPaginatedCatalogItems(collection, page, pageSize, category, sort);
    },
    enabled: collection !== undefined,
    placeholderData: (previousData) => previousData,
  });
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

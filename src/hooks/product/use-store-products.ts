import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "../use-query";
import type { Product } from "@/@types/product";

interface StoreProductsParams {
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// Definindo os tipos de retorno possíveis
type SingleProductQuery = UseQueryResult<Product, unknown>;
type MultipleProductsQuery = UseQueryResult<Product[], unknown>;

// Definindo as sobrecargas da função
export function useStoreProducts(id: string): SingleProductQuery;
export function useStoreProducts(params?: StoreProductsParams): MultipleProductsQuery;
export function useStoreProducts(
  idOrParams?: string | StoreProductsParams
): SingleProductQuery | MultipleProductsQuery {
  return useQuery<any>(
    ["store-products", typeof idOrParams === "string" ? idOrParams : idOrParams],
    async () => {
      if (typeof idOrParams === "string") {
        try {
          const response = await fetch(`/api/products/${idOrParams}`);
          if (!response.ok) throw new Error("Failed to fetch product");
          return response.json();
        } catch (error) {
          console.error("Error fetching product:", error);
          throw error;
        }
      } else {
        try {
          const params = idOrParams as StoreProductsParams;
          const searchParams = new URLSearchParams();

          if (params?.search) searchParams.set("search", params.search);
          if (params?.sortBy) searchParams.set("sortBy", params.sortBy);
          if (params?.sortOrder) searchParams.set("sortOrder", params.sortOrder);

          const queryString = searchParams.toString();
          const url = `/api/products${queryString ? `?${queryString}` : ""}`;

          const response = await fetch(url);
          if (!response.ok) throw new Error("Failed to fetch products");
          return response.json();
        } catch (error) {
          console.error("Error fetching products:", error);
          throw error;
        }
      }
    }
  );
}

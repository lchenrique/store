import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "../use-query";
import type { Product } from "@/@types/product";
import apiClient  from "@/services/api";

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
          return apiClient.getStoreProduct(idOrParams);
        } catch (error) {
          console.error("Error fetching product:", error);
          throw error;
        }
      } else {
        try {
          const params = idOrParams as StoreProductsParams;
          return apiClient.getStoreProducts(params);
        } catch (error) {
          console.error("Error fetching products:", error);
          throw error;
        }
      }
    }
  );
}

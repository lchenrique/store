import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "../use-query";
import apiClient from '@/services/api';
import { Product } from "@/services/types";

interface ProductsParams {
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  isAdmin?: boolean;
}

// Definindo os tipos de retorno possíveis
type SingleProductQuery = UseQueryResult<Product, unknown>;
type MultipleProductsQuery = UseQueryResult<Product[], unknown>;

// Definindo as sobrecargas da função
export function useProducts(id: string, isAdmin?: boolean): SingleProductQuery;
export function useProducts(params?: ProductsParams): MultipleProductsQuery;
export function useProducts(
  idOrParams?: string | ProductsParams,
  isAdmin?: boolean
): SingleProductQuery | MultipleProductsQuery {
  return useQuery<any>(
    ["products", typeof idOrParams === "string" ? idOrParams : idOrParams],
    async () => {
      if (typeof idOrParams === "string") {
        // Se for admin, usa a rota admin
        if (isAdmin) {
          return apiClient.admin.getProduct(idOrParams);
        }
        // Se não for admin, usa a rota pública
        return apiClient.getStoreProduct(idOrParams);
      } else {
        const params = idOrParams as ProductsParams;
        
        // Se for admin, usa as rotas admin
        if (params?.isAdmin) {
          const result = await apiClient.admin.getProducts({
            search: params?.search,
            sort: params?.sortBy,
            order: params?.sortOrder,
          });
          return result.items;
        }

        // Para rota pública
        const result = await apiClient.getStoreProducts({
          search: params?.search,
          sort: params?.sortBy,
          order: params?.sortOrder,
        });
        return result.items;
      }
    }
  );
}
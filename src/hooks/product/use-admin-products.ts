import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "../use-query";
import { supabase } from "@/lib/supabase/client";
import { Product } from "@/services/types";

interface AdminProductsParams {
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// Definindo os tipos de retorno possíveis
type SingleProductQuery = UseQueryResult<Product, unknown>;
type MultipleProductsQuery = UseQueryResult<Product[], unknown>;

// Definindo as sobrecargas da função
export function useAdminProducts(id: string): SingleProductQuery;
export function useAdminProducts(params?: AdminProductsParams): MultipleProductsQuery;
export function useAdminProducts(
  idOrParams?: string | AdminProductsParams
): SingleProductQuery | MultipleProductsQuery {
  return useQuery<any>(
    ["admin-products", typeof idOrParams === "string" ? idOrParams : idOrParams],
    async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error("Unauthorized");
      }

      if (typeof idOrParams === "string") {
        try {
          const response = await fetch(`/api/admin/products/${idOrParams}`, {
            headers: {
              Authorization: `Bearer ${session.access_token}`
            }
          });
          if (!response.ok) throw new Error("Failed to fetch product");
          return response.json();
        } catch (error) {
          console.error("Error fetching product:", error);
          throw error;
        }
      } else {
        try {
          const params = idOrParams as AdminProductsParams;
          const searchParams = new URLSearchParams();

          if (params?.search) searchParams.set("search", params.search);
          if (params?.sortBy) searchParams.set("sortBy", params.sortBy);
          if (params?.sortOrder) searchParams.set("sortOrder", params.sortOrder);

          const queryString = searchParams.toString();
          const url = `/api/admin/products${queryString ? `?${queryString}` : ""}`;

          const response = await fetch(url, {
            headers: {
              Authorization: `Bearer ${session.access_token}`
            }
          });
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

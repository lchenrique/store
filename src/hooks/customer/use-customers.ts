import { useQuery } from "@tanstack/react-query";

interface UseCustomersOptions {
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export function useCustomers({ search, sortBy = "updatedAt", sortOrder = "desc" }: UseCustomersOptions = {}) {
  return useQuery({
    queryKey: ["customers", search, sortBy, sortOrder],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (search) searchParams.set("search", search);
      if (sortBy) searchParams.set("sortBy", sortBy);
      if (sortOrder) searchParams.set("sortOrder", sortOrder);

      const response = await fetch(`/api/customers?${searchParams.toString()}`);
      if (!response.ok) {
        throw new Error("Erro ao carregar clientes");
      }

      return response.json();
    },
  });
}

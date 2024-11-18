"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { ProductForm, type FormValues } from "../../components/product-form";
import { useProducts } from "@/hooks/product/use-products";
import { useUpdateProduct } from "@/hooks/product/use-update-product";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { MainContainer } from "@/components/layout/main-container";
import MainHeader from "@/components/layout/main-header";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";

export default function EditProductPage() {
  const queryClient = useQueryClient();
  const { productId } = useParams();

  const { data: product, isFetching } = useProducts(productId as string, true);

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { mutateAsync, isPending } = useUpdateProduct();

  async function onSubmit({ imagesToRemove, ...data }: FormValues & { imagesToRemove?: string[] }) {
    try {
      setIsLoading(true);
      await mutateAsync({
        id: productId as string,
        data,
        imagesToRemove,
      });
      toast({
        title: "Success",
        description: "Product updated successfully",
      });
      router.push("/admin/products");
      router.refresh();
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className=" bg-gradient-to-br sm:px-6 lg:px-8">
      <div className="flex pr-8">
        <MainContainer
          className={cn({
            "opacity-50": isFetching,
          })}
        >
          <ProductForm
            onSubmit={onSubmit}
            isLoading={isLoading}
            product={product}
            title="Editar Produto"
            description="Edite os detalhes do seu produto abaixo"
          />
        </MainContainer>
      </div>
    </div>
  );
}

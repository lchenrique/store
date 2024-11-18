"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ProductForm, type FormValues } from "../components/product-form";
import { toast } from "@/hooks/use-toast";
import { useCreateProduct } from "@/hooks/product/use-create-product";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { MainContainer } from "@/components/layout/main-container";
import MainHeader from "@/components/layout/main-header";
import BackButton from "@/components/back-button";

export default function NewProductPage() {
  const router = useRouter();
  const { mutateAsync, isPending } = useCreateProduct();

  async function onSubmit(data: FormValues) {
    try {
      await mutateAsync(data);
      toast({
        title: "Sucesso",
        description: "Produto criado com sucesso",
      });
      router.push("/admin/products");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast({
        title: "Erro",
        description: "Algo deu errado",
        variant: "destructive",
      });
    }
  }

  return (
    <div className=" bg-gradient-to-br">
      <div className="flex pr-8">
        <MainContainer>
          <ProductForm
            onSubmit={onSubmit}
            isLoading={isPending}
            title="Novo Produto"
            description="Adicione um novo produto"
          />
        </MainContainer>
      </div>
    </div>
  );
}

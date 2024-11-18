"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ImageUpload } from "@/components/image-upload";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import Image from "next/image";
import { AlertTriangle, X } from "lucide-react";
import BackButton from "@/components/back-button";
import { Product } from "@/@types/product";

const productSchema = z.object({
  name: z
    .string()
    .min(2, "O nome deve ter pelo menos 2 caracteres")
    .max(100, "O nome deve ter no máximo 100 caracteres"),
  description: z
    .string()
    .min(10, "A descrição deve ter pelo menos 10 caracteres")
    .max(500, "A descrição deve ter no máximo 500 caracteres")
    .optional(),
  price: z
    .number()
    .min(0, "O preço deve ser um número positivo")
    .nonnegative("O preço deve ser um número positivo"),
  stock: z
    .number()
    .int("A quantidade em estoque deve ser um número inteiro")
    .min(0, "A quantidade em estoque deve ser um número positivo"),
  images: z
    .array(z.union([z.instanceof(File), z.string()]))
    .min(1, "Adicione pelo menos uma imagem")
    .max(5, "Máximo de 5 imagens permitido")
    .nullable()
    .optional(),
});

export type FormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
  title: string;
  description: string;
  product?: Product;
  onSubmit: (data: FormValues & { imagesToRemove?: string[] }) => Promise<void>;
  isLoading: boolean;
}

export function ProductForm({ product, onSubmit, isLoading, title, description }: ProductFormProps) {
  const [imagesToRemove, setImagesToRemove] = useState<string[]>([]);
  const [previewPrice, setPreviewPrice] = useState("");

  const form = useForm<FormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      stock: 0,
      images: [],
    },
  });

  useEffect(() => {
    if (product) {
      form.reset({
        ...product,
        price: Number(product.price),
        stock: Number(product.stock),
        images: product.images || [],
      });
      setPreviewPrice(formatPrice(product.price));
    }
  }, [product, form]);

  const formatPrice = (value: string | number) => {
    const number = typeof value === "string" ? Number(value) : value;
    if (isNaN(number)) return "";
    return new Intl.NumberFormat("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(number);
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    const numberValue = Number(value) / 100;
    
    if (!isNaN(numberValue)) {
      form.setValue("price", numberValue, { shouldValidate: true });
      setPreviewPrice(formatPrice(numberValue));
    }
  };

  const handleStockChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numberValue = Number(value);
    
    if (!isNaN(numberValue)) {
      form.setValue("stock", numberValue, { shouldValidate: true });
    }
  };

  async function handleSubmit(values: FormValues) {
    try {
      await onSubmit({ ...values, imagesToRemove });
    } catch (error) {
      toast({
        title: "Erro ao salvar produto",
        description: "Ocorreu um erro ao tentar salvar o produto. Tente novamente.",
        variant: "destructive",
      });
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className={cn("transition-all ease-in-out", {
            "opacity-50 pointer-events-none": isLoading,
          })}
        >
          <Card className="shadow-md hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center space-x-4">
              <BackButton href="/admin/products" />
              <div>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="images"
                render={({ field }) => {
                  const getImageUrl = (image: File | string) => {
                    if (image instanceof File) {
                      return URL.createObjectURL(image);
                    }
                    return image;
                  };

                  const removeImage = (indexToRemove: number) => {
                    const newImages = field.value?.filter((_, index) => index !== indexToRemove) || [];
                    const imageToRemove = field.value?.find((_, index) => index === indexToRemove);
                    if (typeof imageToRemove === "string") {
                      setImagesToRemove((toRemove) => [...toRemove, imageToRemove as string]);
                    }
                    field.onChange(newImages);
                  };

                  return (
                    <FormItem>
                      <FormLabel className="text-lg font-medium">Imagens do Produto</FormLabel>
                      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                        {field.value?.map((image, index) => (
                          <div key={index} className="relative aspect-square group">
                            <div className="relative aspect-square overflow-hidden rounded-lg border">
                              <Image
                                src={getImageUrl(image)}
                                alt={`Imagem ${index + 1}`}
                                fill
                                className="object-cover transition-transform duration-200 group-hover:scale-105"
                              />
                              <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="icon"
                                  onClick={() => removeImage(index)}
                                  className="h-8 w-8"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                        <FormControl>
                          <ImageUpload
                            value={field.value?.filter((image) => image instanceof File) || []}
                            onChange={(files) => {
                              const existingUrls = field.value?.filter((image) => typeof image === "string") || [];
                              field.onChange([...existingUrls, ...files]);
                            }}
                            maxImages={5}
                          />
                        </FormControl>
                      </div>
                      <FormDescription className="flex items-center gap-2 text-sm">
                        <AlertTriangle className="h-4 w-4 text-yellow-500" />
                        Adicione até 5 imagens do produto (PNG, JPG, JPEG, WebP)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <div className="grid gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-medium">Nome do Produto</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={isLoading}
                          className="transition-all duration-200 focus:ring-2 focus:ring-primary"
                          placeholder="Digite o nome do produto"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-medium">Descrição do Produto</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          disabled={isLoading}
                          className="min-h-[100px] transition-all duration-200 focus:ring-2 focus:ring-primary"
                          placeholder="Digite uma descrição detalhada do produto"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field: { value, ...field } }) => (
                      <FormItem>
                        <FormLabel className="text-lg font-medium">Preço</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">R$</span>
                            <Input
                              {...field}
                              disabled={isLoading}
                              className="pl-8 transition-all duration-200 focus:ring-2 focus:ring-primary"
                              placeholder="0,00"
                              value={previewPrice}
                              onChange={handlePriceChange}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="stock"
                    render={({ field: { value, onChange, ...field } }) => (
                      <FormItem>
                        <FormLabel className="text-lg font-medium">Quantidade em Estoque</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            value={value || ""}
                            onChange={handleStockChange}
                            type="number"
                            min="0"
                            step="1"
                            disabled={isLoading}
                            className="transition-all duration-200 focus:ring-2 focus:ring-primary"
                            placeholder="Digite a quantidade disponível"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full py-6 text-lg font-semibold transition-all duration-200 hover:scale-[1.02] disabled:hover:scale-100"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Salvando...
                  </span>
                ) : (
                  "Salvar Produto"
                )}
              </Button>
            </CardContent>
          </Card>
        </form>
      </Form>
    </motion.div>
  );
}

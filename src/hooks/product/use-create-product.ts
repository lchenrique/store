import { useQueryClient } from "@tanstack/react-query";
import { useMutation } from "../use-query";
import type { Product } from "@/src/@types/product";
import type { FormValues } from "@/app/admin/products/components/product-form";
import { convertToWebP } from "@/lib/utils";
import { uploadImage } from "@/services/s3";


export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation(async (data: FormValues) => {
    const imageUrls: string[] = [];


    try {
      const processImages = async () => {
        for (let index = 0; index < (data.images?.length || 0); index++) {
          const file = data.images?.[index];
          if (typeof file === "string") {
            imageUrls.push(file);
          }
          if (file instanceof File) {
            const imageWebp = await convertToWebP(file);
            const imageUrl = await uploadImage(imageWebp, `products/product`, `${file.name}.webp`);
            imageUrls.push(imageUrl);
          }
        }
      };

      await processImages();
      const uniqueImageUrls = Array.from(new Set(imageUrls));

      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          images: uniqueImageUrls
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao criar produto');
      }

      const newProduct = await response.json();
      return newProduct;
    } catch (error) {
      console.error('Erro detalhado:', error);
      throw error;
    }
  }, {
    onSuccess: (newProduct) => {
    
      queryClient.invalidateQueries({ queryKey: ['products'] });
    }
  });
};
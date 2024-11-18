import { useQueryClient } from "@tanstack/react-query";
import { useMutation } from "../use-query";
import type { FormValues } from "@/app/admin/products/components/product-form";
import { convertToWebP } from "@/lib/utils";
import { uploadImage } from "@/services/s3";
import { apiClient } from "@/services/api";

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

      const newProduct = await apiClient.admin.createProduct({
        ...data,
        images: uniqueImageUrls
      });

      return newProduct;
    } catch (error) {
      console.error('Erro detalhado:', error);
      throw error;
    }
  }, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    }
  });
};
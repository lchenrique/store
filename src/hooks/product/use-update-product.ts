import { useQueryClient } from "@tanstack/react-query";
import { useMutation } from "../use-query";
import type { FormValues } from "@/app/admin/products/components/product-form";
import { deleteImage, uploadImage } from "@/services/s3";
import { convertToWebP } from "@/lib/utils";
import  apiClient from "@/services/api";

interface UpdateProductData {
  id: string;
  data: FormValues;
  imagesToRemove?: string[];
}

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async ({ id, data, imagesToRemove }: UpdateProductData) => {
      const imageUrls: string[] = [];

      if (imagesToRemove) {
        for (const imageUrl of imagesToRemove) {
          await deleteImage(imageUrl, `products/product`);
        }
      }
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

      return apiClient.admin.updateProduct(id, {
        ...data,
        images: uniqueImageUrls
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["admin-products"] });
        queryClient.invalidateQueries({ queryKey: ["products"] });
      },
    }
  );
};

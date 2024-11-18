import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(price);
}

export const convertToWebP = async (file: File): Promise<File> => {
  // Create a canvas and load the image
  const image = new Image();
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  return new Promise((resolve, reject) => {
    image.onload = () => {
      // Set canvas dimensions to match image
      canvas.width = image.width;
      canvas.height = image.height;

      // Draw image onto canvas
      ctx?.drawImage(image, 0, 0);

      // Convert to WebP
      canvas.toBlob(
        (blob) => {
          if (blob) {
            // Create new file from blob
            const webpFile = new File([blob], `${file.name.split('.')[0]}.webp`, {
              type: 'image/webp'
            });
            resolve(webpFile);
          } else {
            reject(new Error('Failed to convert image to WebP'));
          }
        },
        'image/webp',
        0.8  // Quality setting (0-1)
      );
    };

    image.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    // Create object URL from original file
    image.src = URL.createObjectURL(file);
  });
};

"use client";
import type { Product } from "@prisma/client";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";

interface ProductImageProps {
  images: Product["images"];
}

const ProductImage: React.FC<ProductImageProps> = ({ images }) => {
  return (
    <div className="space-y-4 p-3">
      <PhotoProvider>
        <PhotoView
          key={images[0]}
          src={
            images[0] ||
            "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          }
        >
          <img
            className="object-cover hover:scale-105 transition-transform duration-300 cursor-zoom-in h-[478px] w-full rounded-lg"
            src={
              images[0] ||
              "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            }
            alt="Imagem principal do produto"
          />
        </PhotoView>
        
        {images.length > 1 && (
          <div className="grid grid-cols-4 gap-4">
            {images.slice(1, 5).map((item, index) => (
              <PhotoView
                key={index}
                src={item || "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}
              >
                <img
                  className="w-full h-[120px] object-cover cursor-zoom-in hover:scale-105 transition-transform duration-300 rounded-lg"
                  src={item || "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}
                  alt={`Imagem ${index + 2} do produto`}
                />
              </PhotoView>
            ))}
          </div>
        )}
      </PhotoProvider>
    </div>
  );
};

export default ProductImage;

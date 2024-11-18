"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  onChange: (urls: File[]) => void;
  maxImages?: number;
  value: File[];
}

export function ImageUpload({ value, onChange, maxImages = 5 }: ImageUploadProps) {
  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      try {
        onChange([...value, ...acceptedFiles]);
      } catch (error) {
        console.error("Upload error:", error);
      } finally {
        if (value.length >= maxImages) {
          console.log("Max images reached");
        }
      }
    },
    [onChange, maxImages, value]
  );

  const { getRootProps, getInputProps, isDragActive, inputRef } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".webp"],
    },
    disabled: value.length >= maxImages,
  });


  return (
    <div className="space-y-4">
        {value?.length < maxImages && (
          <div
            {...getRootProps()}
            className={cn(
              "relative  z-40 aspect-square rounded-lg border-2 border-dashed border-muted-foreground/25 p-4 hover:border-muted-foreground/50 transition-colors",
              isDragActive && "border-muted-foreground/50"
            )}
          >
            <input {...getInputProps()} ref={inputRef} />
            <div className="flex h-full flex-col items-center justify-center gap-1 text-center ">
              <UploadCloud className="h-8 w-8 text-muted-foreground" />
              <p className="text-sm font-medium">{isDragActive ? "Drop images here" : "Drag & drop images"}</p>
              <p className="text-xs text-muted-foreground">or click to select files</p>
            </div>
          </div>
        )}
    </div>
  );
}

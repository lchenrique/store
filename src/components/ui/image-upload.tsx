'use client';

import Image from 'next/image';
import { useCallback, useState } from 'react';
import { ImagePlus, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase/client';

interface ImageUploadProps {
  disabled?: boolean;
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
  value: string[];
}

export function ImageUpload({
  disabled,
  onChange,
  onRemove,
  value
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  const onUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setIsUploading(true);
      
      const file = event.target.files?.[0];
      if (!file) return;

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `images/${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from('products')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('products')
        .getPublicUrl(filePath);

      onChange(publicUrl);
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  }, [onChange]);

  const handleRemove = useCallback(async (url: string) => {
    try {
      const path = url.split('/').pop();
      if (!path) return;

      await supabase.storage
        .from('products')
        .remove([`images/${path}`]);

      onRemove(url);
    } catch (error) {
      console.error('Remove error:', error);
    }
  }, [onRemove]);

  return (
    <div>
      <div className="mb-4 flex items-center gap-4">
        {value.map((url) => (
          <div key={url} className="relative w-[200px] h-[200px] rounded-md overflow-hidden">
            <div className="z-10 absolute top-2 right-2">
              <Button
                type="button"
                onClick={() => handleRemove(url)}
                variant="destructive"
                size="icon"
                disabled={disabled}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
            <Image
              fill
              className="object-cover"
              alt="Image"
              src={url}
            />
          </div>
        ))}
      </div>
      <Button
        type="button"
        disabled={disabled || isUploading}
        variant="secondary"
        onClick={() => document.getElementById('image-upload')?.click()}
      >
        <ImagePlus className="h-4 w-4 mr-2" />
        {isUploading ? 'Uploading...' : 'Upload an Image'}
      </Button>
      <input
        id="image-upload"
        type="file"
        accept="image/*"
        onChange={onUpload}
        disabled={disabled || isUploading}
        className="hidden"
      />
    </div>
  );
}
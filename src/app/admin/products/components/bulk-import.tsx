"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';

export function BulkImport() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    try {
      setIsLoading(true);
      const file = event.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const products = JSON.parse(e.target?.result as string);
          
          const response = await fetch('/api/admin/products/bulk', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ products }),
          });

          if (!response.ok) throw new Error();

          toast({
            title: 'Products imported',
            description: 'Products have been successfully imported.',
          });
          
          router.refresh();
        } catch (error) {
          toast({
            title: 'Error',
            description: 'Failed to import products. Please check your file format.',
            variant: 'destructive',
          });
        }
      };

      reader.readAsText(file);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Upload className="mr-2 h-4 w-4" />
          Import Products
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Import Products</DialogTitle>
          <DialogDescription>
            Upload a JSON file containing product data. The file should be an array of products with the following structure:
            {`[{ "name": "Product Name", "description": "Description", "price": "99.99", "stock": "10" }]`}
          </DialogDescription>
        </DialogHeader>
        <Input
          type="file"
          accept=".json"
          onChange={handleFileUpload}
          disabled={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
}
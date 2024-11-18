'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { ChevronDown } from 'lucide-react';

interface BulkActionsProps {
  selectedOrders: string[];
  onComplete: () => void;
}

export function BulkActions({ selectedOrders, onComplete }: BulkActionsProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function updateOrdersStatus(status: string) {
    try {
      setIsLoading(true);
      
      const response = await fetch('/api/admin/orders/bulk', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderIds: selectedOrders,
          status,
        }),
      });

      if (!response.ok) throw new Error();

      toast({
        title: 'Orders updated',
        description: `Selected orders have been marked as ${status.toLowerCase()}.`,
      });
      
      router.refresh();
      onComplete();
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to update orders.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  if (selectedOrders.length === 0) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" disabled={isLoading}>
          Bulk Actions
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => updateOrdersStatus('PAID')}>
          Mark as Paid
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => updateOrdersStatus('SHIPPED')}>
          Mark as Shipped
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => updateOrdersStatus('DELIVERED')}>
          Mark as Delivered
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => updateOrdersStatus('CANCELLED')}>
          Mark as Cancelled
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
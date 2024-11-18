import Link from 'next/link';
import { XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function CheckoutFailurePage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <Card className="max-w-md mx-auto p-6 text-center">
        <div className="mb-4">
          <XCircle className="h-12 w-12 text-red-500 mx-auto" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Payment Failed</h1>
        <p className="text-muted-foreground mb-6">
          We couldn't process your payment. Please try again or contact support if the problem persists.
        </p>
        <div className="space-y-2">
          <Link href="//cart">
            <Button className="w-full">Return to Cart</Button>
          </Link>
          <Link href="/">
            <Button variant="outline" className="w-full">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
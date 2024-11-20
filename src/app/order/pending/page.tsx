import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import Link from "next/link";

export default function OrderPendingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <Clock className="w-16 h-16 text-yellow-500" />
      <h1 className="text-2xl font-bold">Pagamento Pendente</h1>
      <p className="text-muted-foreground">
        Seu pagamento está sendo processado.
      </p>
      <Link href="/orders">
        <Button>Ver Meus Pedidos</Button>
      </Link>
    </div>
  );
}

import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";
import Link from "next/link";

export default function OrderFailurePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <XCircle className="w-16 h-16 text-red-500" />
      <h1 className="text-2xl font-bold">Falha no Pagamento</h1>
      <p className="text-muted-foreground">
        Houve um problema ao processar seu pagamento.
      </p>
      <Link href="/cart">
        <Button>Voltar ao Carrinho</Button>
      </Link>
    </div>
  );
}

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function CheckoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Checkout failed");
      }

      const data = await response.json();
      
      // Redireciona para a URL de checkout do Mercado Pago
      window.location.href = data.checkoutUrl;
    } catch (error) {
      console.error("Checkout error:", error);
      // Aqui você pode adicionar uma notificação de erro para o usuário
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleCheckout} 
      disabled={loading}
      className="w-full"
    >
      {loading ? "Processando..." : "Finalizar Compra"}
    </Button>
  );
}

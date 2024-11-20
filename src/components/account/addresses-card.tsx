"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AddAddressModal } from "@/components/modals/add-address-modal";
import { useState } from "react";
import { useUserAddresses } from "@/hooks/use-user-addresses";
import { toast } from "@/hooks/use-toast";
import { Trash2 } from "lucide-react";
import { AddressesSkeleton } from "./skeletons/addresses-skeleton";

export function AddressesCard() {
  const [isAddAddressOpen, setIsAddAddressOpen] = useState(false);

  const {
    addresses,
    addAddress,
    deleteAddress,
    isAddingAddress,
    isDeletingAddress,
    isLoading
  } = useUserAddresses();

  if (isLoading) {
    return <AddressesSkeleton />;
  }

  const handleAddAddress = async (address: Omit<any, 'id' | 'userId'>) => {
    await addAddress(address);
  };

  const handleDeleteAddress = async (addressId: string) => {
    try {
      await deleteAddress(addressId);
      toast({
        title: "Endereço removido",
        description: "Endereço removido com sucesso!",
      });
    } catch (error) {
      toast({
        title: "Erro ao remover endereço",
        description: "Ocorreu um erro ao remover o endereço. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Endereços</h3>
          <Button 
            onClick={() => setIsAddAddressOpen(true)}
            disabled={isAddingAddress}
          >
            Adicionar
          </Button>
        </div>

        {addresses.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            Você ainda não tem endereços cadastrados.
          </p>
        ) : (
          <div className="space-y-4">
            {addresses.map((address:any) => (
              <div 
                key={address.id} 
                className="flex items-start justify-between p-4 rounded-lg border"
              >
                <div>
                  <p className="font-medium">
                    {address.street}, {address.number}
                    {address.complement && ` - ${address.complement}`}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {address.neighborhood} - {address.city}/{address.state}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    CEP: {address.zipCode}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={isDeletingAddress}
                  onClick={() => handleDeleteAddress(address.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        <AddAddressModal
          isOpen={isAddAddressOpen}
          onClose={() => setIsAddAddressOpen(false)}
          onSuccess={handleAddAddress}
        />
      </CardContent>
    </Card>
  );
}

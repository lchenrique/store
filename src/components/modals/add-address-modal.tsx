import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AddressForm } from '@/components/address-form';
import { toast } from '@/hooks/use-toast';
import { Address } from '@/types';

interface AddAddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (address: Omit<Address, 'id' | 'userId'>) => void;
}

export function AddAddressModal({
  isOpen,
  onClose,
  onSuccess,
}: AddAddressModalProps) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: Omit<Address, 'id' | 'userId'>) => {
    try {
      setLoading(true);
      await onSuccess(data);
      onClose();
      toast({
        title: "Endereço adicionado",
        description: "Endereço adicionado com sucesso!",
      });
    } catch (error) {
      toast({
        title: "Erro ao adicionar endereço",
        description: "Ocorreu um erro ao adicionar o endereço. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Endereço</DialogTitle>
        </DialogHeader>
        <AddressForm 
          onSubmit={handleSubmit}
          submitText="Adicionar Endereço"
        />
      </DialogContent>
    </Dialog>
  );
}

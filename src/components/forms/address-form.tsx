import { useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCEP } from '@/hooks/use-cep';
import { Loader2 } from 'lucide-react';

interface AddressFormProps {
  value: {
    zipCode: string;
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
  };
  onChange: (field: string, value: string) => void;
}

export function AddressForm({ value, onChange }: AddressFormProps) {
  const { fetchAddress, loading, error } = useCEP();

  useEffect(() => {
    // Verifica se o CEP tem 8 dígitos (removendo caracteres não numéricos)
    const cleanCEP = value.zipCode.replace(/\D/g, '');
    if (cleanCEP.length === 8) {
      handleCEPSearch(cleanCEP);
    }
  }, [value.zipCode]);

  const handleCEPSearch = async (cep: string) => {
    const address = await fetchAddress(cep);
    if (address) {
      onChange('street', address.street);
      onChange('neighborhood', address.neighborhood);
      onChange('city', address.city);
      onChange('state', address.state);
    }
  };

  // Formata o CEP para exibição (99999-999)
  const formatCEPForDisplay = (cep: string) => {
    const cleanCEP = cep.replace(/\D/g, '');
    if (cleanCEP.length > 5) {
      return cleanCEP.replace(/(\d{5})(\d{1,3})/, '$1-$2');
    }
    return cleanCEP;
  };

  // Formata o CEP enquanto o usuário digita
  const handleCEPChange = (cep: string) => {
    const cleanCEP = cep.replace(/\D/g, '');
    const formattedCEP = formatCEPForDisplay(cleanCEP);
    onChange('zipCode', formattedCEP);
  };

  return (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="zipCode">CEP</Label>
        <div className="relative">
          <Input
            id="zipCode"
            placeholder="00000-000"
            value={formatCEPForDisplay(value.zipCode)}
            onChange={(e) => handleCEPChange(e.target.value)}
            maxLength={9}
          />
          {loading && (
            <div className="absolute right-2 top-2">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          )}
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="street">Rua</Label>
        <Input
          id="street"
          value={value.street}
          onChange={(e) => onChange('street', e.target.value)}
          placeholder="Nome da rua"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="number">Número</Label>
          <Input
            id="number"
            value={value.number}
            onChange={(e) => onChange('number', e.target.value)}
            placeholder="123"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="complement">Complemento</Label>
          <Input
            id="complement"
            value={value.complement}
            onChange={(e) => onChange('complement', e.target.value)}
            placeholder="Apto 101"
          />
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="neighborhood">Bairro</Label>
        <Input
          id="neighborhood"
          value={value.neighborhood}
          onChange={(e) => onChange('neighborhood', e.target.value)}
          placeholder="Nome do bairro"
        />
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="col-span-3 grid gap-2">
          <Label htmlFor="city">Cidade</Label>
          <Input
            id="city"
            value={value.city}
            onChange={(e) => onChange('city', e.target.value)}
            placeholder="Nome da cidade"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="state">Estado</Label>
          <Input
            id="state"
            value={value.state}
            onChange={(e) => onChange('state', e.target.value)}
            placeholder="UF"
            maxLength={2}
          />
        </div>
      </div>
    </div>
  );
}

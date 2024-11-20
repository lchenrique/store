"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Settings, LayoutTemplate } from "lucide-react";
import { useRouter } from "next/navigation";
import { useHeaderStyle } from "@/hooks/use-header-style";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { toast } from "@/hooks";

interface AdminFABProps {
  isAdmin: boolean;
}

export function AdminFAB({ isAdmin }: AdminFABProps) {
  const router = useRouter();
  const { style, setStyle } = useHeaderStyle();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState(style);

  const handleStyleChange = (value: string) => {
    setSelectedStyle(value);
  };

  const handleSaveStyle = () => {
    setStyle(selectedStyle);
    setIsDialogOpen(false);
    toast({
      title: "Layout atualizado",
      description: "O estilo do header foi alterado com sucesso.",
    });
  };

  if (!isAdmin) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon" className="rounded-full h-14 w-14 shadow-lg">
            <Settings className="h-6 w-6" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Administração</DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <LayoutTemplate className="mr-2 h-4 w-4" />
                Layout
              </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Configurações de Layout</DialogTitle>
                <DialogDescription>
                  Escolha o estilo do header da sua loja.
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <Select
                  value={selectedStyle}
                  onValueChange={handleStyleChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um estilo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="minimal">
                      Minimalista
                    </SelectItem>
                    <SelectItem value="classic">
                      Clássico
                    </SelectItem>
                    <SelectItem value="mega-menu">
                      Mega Menu
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSaveStyle}>
                  Salvar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <DropdownMenuItem onClick={() => router.push("/admin")}>
            Painel Admin
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

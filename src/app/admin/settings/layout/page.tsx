"use client";

import { useHeaderStyle } from "@/hooks/use-header-style";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { headerLayouts } from "@/config/layouts";

export default function LayoutSettings() {
  const { style, setStyle } = useHeaderStyle();

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Configurações de Layout</CardTitle>
          <CardDescription>
            Personalize a aparência da sua loja alterando os estilos dos componentes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Header Style */}
          <div className="space-y-2">
            <Label htmlFor="header-style">Estilo do Header</Label>
            <Select value={style} onValueChange={setStyle}>
              <SelectTrigger id="header-style" className="w-full">
                <SelectValue placeholder="Selecione um estilo" />
              </SelectTrigger>
              <SelectContent>
                {headerLayouts.map((layout) => (
                  <SelectItem key={layout.id} value={layout.id}>
                    {layout.name}
                    <span className="text-xs text-muted-foreground ml-2">
                      {layout.description}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              {headerLayouts.find((layout) => layout.id === style)?.description}
            </p>
          </div>

          {/* Outros estilos podem ser adicionados aqui */}
        </CardContent>
      </Card>
    </div>
  );
}

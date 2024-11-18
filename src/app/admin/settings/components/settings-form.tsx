"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Store } from "@prisma/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { useStore } from "@/hooks/store/use-store";
import SingleImageButton from "@/components/ui/single-image-button";
import { Building2, Mail, Phone, Settings } from "lucide-react";

const settingsSchema = z.object({
  name: z.string().min(2).max(50),
  description: z.string().optional(),
  logo: z.string().optional().nullable(),
  logoToUpload: z.instanceof(File).optional().nullable(),
  palette: z.string().optional(),
  settings: z.object({
    email: z.string().email().optional(),
    phone: z.string().optional(),
    address: z.string().optional(),
    // Configurações da Loja
    enableReviews: z.boolean().default(true),
    enableWishlist: z.boolean().default(true),
    showOutOfStock: z.boolean().default(true),
    allowBackorders: z.boolean().default(false),
  }).default({}),
});

export type SettingsForm = z.infer<typeof settingsSchema>;

interface SettingsFormProps {
  store: Store
}

export function SettingsForm({ store }: SettingsFormProps) {
  const { updateSettings } = useStore();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<SettingsForm>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      name: store.name,
      description: store.description || "",
      logo: store.logo || "",
      logoToUpload: null,
      palette: store.palette || "",
      settings: (store.settings as any) || {},
    },
  });

  async function onSubmit(data: SettingsForm) {
    try {
      setIsLoading(true);
      await updateSettings.mutateAsync({
        data: {
          ...data,
          settings: {
            ...data.settings,
            enableReviews: data.settings?.enableReviews ?? true,
            enableWishlist: data.settings?.enableWishlist ?? true,
            showOutOfStock: data.settings?.showOutOfStock ?? true,
            allowBackorders: data.settings?.allowBackorders ?? false,
          }
        },
        logo: data.logoToUpload || undefined,
      });
      
      router.refresh();
      toast({
        title: "Configurações atualizadas",
        description: "As configurações da loja foram atualizadas com sucesso.",
      });
    } catch (error) {
      console.error("[SETTINGS_ERROR]", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao atualizar as configurações.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      {/* Informações Básicas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Informações da Loja
          </CardTitle>
          <CardDescription>
            Configure as informações principais da sua loja
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="logo">Logo da Loja</Label>
            <SingleImageButton
              onImageChange={(file) => form.setValue("logoToUpload", file)}
              imageUrl={store.logo}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Nome da Loja</Label>
            <Input id="name" {...form.register("name")} disabled={isLoading} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              {...form.register("description")}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="palette">Paleta de Cores</Label>
            <Input id="palette" {...form.register("palette")} disabled={isLoading} />
          </div>
        </CardContent>
      </Card>

      {/* Informações de Contato */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Informações de Contato
          </CardTitle>
          <CardDescription>
            Configure as informações de contato da sua loja
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="settings.email">Email</Label>
              <Input
                id="settings.email"
                type="email"
                {...form.register("settings.email")}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="settings.phone">Telefone</Label>
              <Input
                id="settings.phone"
                {...form.register("settings.phone")}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="settings.address">Endereço</Label>
              <Textarea
                id="settings.address"
                {...form.register("settings.address")}
                disabled={isLoading}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Configurações da Loja */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configurações da Loja
          </CardTitle>
          <CardDescription>
            Configure as funcionalidades da sua loja
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Avaliações de Produtos</Label>
                <p className="text-sm text-muted-foreground">
                  Permitir que clientes avaliem produtos
                </p>
              </div>
              <Switch
                checked={form.watch("settings.enableReviews")}
                onCheckedChange={(checked) =>
                  form.setValue("settings.enableReviews", checked)
                }
                disabled={isLoading}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Lista de Desejos</Label>
                <p className="text-sm text-muted-foreground">
                  Permitir que clientes criem lista de desejos
                </p>
              </div>
              <Switch
                checked={form.watch("settings.enableWishlist")}
                onCheckedChange={(checked) =>
                  form.setValue("settings.enableWishlist", checked)
                }
                disabled={isLoading}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Produtos Esgotados</Label>
                <p className="text-sm text-muted-foreground">
                  Mostrar produtos sem estoque na loja
                </p>
              </div>
              <Switch
                checked={form.watch("settings.showOutOfStock")}
                onCheckedChange={(checked) =>
                  form.setValue("settings.showOutOfStock", checked)
                }
                disabled={isLoading}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Pedidos em Espera</Label>
                <p className="text-sm text-muted-foreground">
                  Permitir pedidos de produtos sem estoque
                </p>
              </div>
              <Switch
                checked={form.watch("settings.allowBackorders")}
                onCheckedChange={(checked) =>
                  form.setValue("settings.allowBackorders", checked)
                }
                disabled={isLoading}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Salvando..." : "Salvar Alterações"}
        </Button>
      </div>
    </form>
  );
}
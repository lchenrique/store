import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Users2, Store, ShieldCheck, Truck, Heart, Mail } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="bg-muted/40">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="flex flex-col items-center text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">Sobre a Nossa Loja</h1>
          <p className="text-muted-foreground max-w-2xl">
            Somos uma loja dedicada a oferecer produtos de alta qualidade com um atendimento excepcional. 
            Nossa missão é proporcionar a melhor experiência de compra para nossos clientes.
          </p>
        </div>

        {/* História e Imagem */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Nossa História</h2>
            <p className="text-muted-foreground">
              Fundada em 2023, nossa loja nasceu do sonho de criar um espaço onde as pessoas pudessem encontrar produtos únicos e de qualidade.
              Começamos como uma pequena loja online e, graças à confiança de nossos clientes, estamos em constante crescimento.
            </p>
            <p className="text-muted-foreground">
              Nosso compromisso com a excelência e satisfação do cliente nos guia em cada decisão que tomamos.
              Buscamos constantemente inovar e melhorar nossos serviços para superar as expectativas.
            </p>
          </div>
          <div className="relative aspect-video rounded-xl overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2670&auto=format&fit=crop"
              alt="Nossa História"
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Valores */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Nossos Valores</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Users2,
                title: 'Foco no Cliente',
                description: 'Colocamos nossos clientes em primeiro lugar, sempre buscando superar suas expectativas.'
              },
              {
                icon: ShieldCheck,
                title: 'Qualidade',
                description: 'Comprometidos com a excelência em todos os aspectos de nossos produtos e serviços.'
              },
              {
                icon: Heart,
                title: 'Paixão',
                description: 'Amamos o que fazemos e isso se reflete em cada detalhe de nossa loja.'
              },
              {
                icon: Store,
                title: 'Inovação',
                description: 'Constantemente buscando novas formas de melhorar a experiência de compra.'
              },
              {
                icon: Truck,
                title: 'Entrega',
                description: 'Compromisso com entregas rápidas e seguras para todo o Brasil.'
              },
              {
                icon: Mail,
                title: 'Comunicação',
                description: 'Mantemos um diálogo aberto e transparente com nossos clientes.'
              }
            ].map((value, index) => (
              <Card key={index} className="p-6 border-delicate">
                <div className="flex flex-col items-center text-center">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <value.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="inline-flex flex-col items-center max-w-xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Faça Parte da Nossa História</h2>
            <p className="text-muted-foreground mb-8">
              Junte-se a milhares de clientes satisfeitos e descubra por que somos a escolha certa para suas compras.
            </p>
            <Button size="lg" className="rounded-xl">
              Explorar Produtos
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

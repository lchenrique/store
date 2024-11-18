import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Star, Quote } from 'lucide-react';

// Dados simulados dos depoimentos
const testimonials = [
  {
    id: 1,
    name: 'Ana Silva',
    role: 'Cliente desde 2023',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=3087&auto=format&fit=crop',
    content: 'Excelente experiência de compra! Os produtos são de alta qualidade e o atendimento é excepcional. Recomendo fortemente para todos.',
    rating: 5,
  },
  {
    id: 2,
    name: 'João Santos',
    role: 'Cliente desde 2023',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=3087&auto=format&fit=crop',
    content: 'Fiquei impressionado com a rapidez da entrega e a qualidade do produto. O suporte ao cliente é muito atencioso e prestativo.',
    rating: 5,
  },
  {
    id: 3,
    name: 'Maria Oliveira',
    role: 'Cliente desde 2023',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=3090&auto=format&fit=crop',
    content: 'Produtos incríveis e preços justos. A embalagem é muito bem feita e o produto chegou em perfeito estado. Já fiz várias compras e sempre fico satisfeita.',
    rating: 5,
  },
  {
    id: 4,
    name: 'Pedro Costa',
    role: 'Cliente desde 2023',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=3087&auto=format&fit=crop',
    content: 'O atendimento ao cliente é fantástico! Tive uma dúvida sobre um produto e fui prontamente atendido. Muito satisfeito com a experiência.',
    rating: 5,
  },
  {
    id: 5,
    name: 'Carla Mendes',
    role: 'Cliente desde 2023',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=3088&auto=format&fit=crop',
    content: 'Ótima variedade de produtos e interface muito intuitiva. O processo de compra é simples e rápido. Recomendo!',
    rating: 5,
  },
  {
    id: 6,
    name: 'Lucas Ferreira',
    role: 'Cliente desde 2023',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=3090&auto=format&fit=crop',
    content: 'Produtos de excelente qualidade e entrega sempre no prazo. A experiência de compra é muito boa do início ao fim.',
    rating: 5,
  },
];

export default function TestimonialsPage() {
  return (
    <div className="bg-muted/40">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">O Que Nossos Clientes Dizem</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Veja os depoimentos de clientes que já tiveram experiências com nossa loja. 
            Valorizamos cada feedback e trabalhamos constantemente para melhorar nossos serviços.
          </p>
        </div>

        {/* Estatísticas */}
        <div className="grid sm:grid-cols-3 gap-8 mb-16">
          {[
            { number: '1000+', label: 'Clientes Satisfeitos' },
            { number: '4.9', label: 'Avaliação Média' },
            { number: '98%', label: 'Recomendam Nossa Loja' },
          ].map((stat, index) => (
            <Card key={index} className="p-6 text-center border-delicate">
              <div className="text-3xl font-bold text-primary mb-2">{stat.number}</div>
              <div className="text-muted-foreground">{stat.label}</div>
            </Card>
          ))}
        </div>

        {/* Grid de Depoimentos */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="p-6 border-delicate">
              <div className="flex items-center gap-4 mb-6">
                <div className="relative h-12 w-12">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    fill
                    className="object-cover rounded-full"
                  />
                </div>
                <div>
                  <h3 className="font-semibold">{testimonial.name}</h3>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>

              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-primary text-primary"
                  />
                ))}
              </div>

              <div className="relative">
                <Quote className="h-8 w-8 text-primary/10 absolute -top-2 -left-2" />
                <p className="text-muted-foreground relative">
                  {testimonial.content}
                </p>
              </div>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div className="inline-flex flex-col items-center max-w-xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Faça Parte da Nossa História</h2>
            <p className="text-muted-foreground mb-8">
              Junte-se aos milhares de clientes satisfeitos e descubra por que somos a escolha certa para suas compras.
            </p>
            <div className="flex gap-4">
              <Card className="p-6 border-delicate flex-1">
                <div className="text-4xl font-bold text-primary mb-2">30+</div>
                <div className="text-muted-foreground">Produtos Disponíveis</div>
              </Card>
              <Card className="p-6 border-delicate flex-1">
                <div className="text-4xl font-bold text-primary mb-2">24h</div>
                <div className="text-muted-foreground">Suporte Online</div>
              </Card>
              <Card className="p-6 border-delicate flex-1">
                <div className="text-4xl font-bold text-primary mb-2">100%</div>
                <div className="text-muted-foreground">Satisfação</div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

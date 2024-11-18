import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

interface HeroProps {
  title?: string;
  subtitle?: string;
  imageUrl?: string;
}

export function Hero({
  title = "Descubra Produtos Incríveis",
  subtitle = "Encontre as melhores ofertas em nossa loja online",
  imageUrl = "/hero-image.jpg", // Você precisará adicionar uma imagem aqui
}: HeroProps) {
  return (
    <div className="relative overflow-hidden bg-background pt-20 md:pt-10">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-background to-background" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center py-12 md:py-16 lg:py-20">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="relative z-10 space-y-6 text-center md:text-left"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-center md:text-left"
            >
              {title}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-lg md:text-xl text-muted-foreground md:max-w-lg text-center w-full md:text-left"
            >
              {subtitle}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="flex flex-wrap gap-4 justify-center md:justify-start"
            >
              <Button size="lg" asChild>
                <Link href="/products">Explorar Produtos</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/about">Saiba Mais</Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="relative z-10 hidden md:block"
          >
            <div className="relative h-[400px] w-full lg:h-[500px]">
              <div className="absolute -right-4 top-4 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
              <div className="absolute -left-4 bottom-4 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
              <Image
                src={imageUrl}
                alt="Hero Image"
                fill
                className="object-cover rounded-2xl"
                priority
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="h-[1px] w-[100px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
      </div>
    </div>
  );
}

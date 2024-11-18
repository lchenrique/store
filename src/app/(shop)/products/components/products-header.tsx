'use client';

import { motion } from 'framer-motion';

export function ProductsHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center mb-12"
    >
      <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl mb-4">
        Nossa Coleção
      </h1>
      <p className="text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
        Explore nossa coleção completa de produtos exclusivos, cuidadosamente selecionados para você.
      </p>
    </motion.div>
  );
}

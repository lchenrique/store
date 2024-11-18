'use client';

import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { itemVariants } from './animation-variants';

interface FormCardProps {
  children: React.ReactNode;
}

export function FormCard({ children }: FormCardProps) {
  return (
    <Card className="border-0 shadow-lg">
      <CardContent className="pt-6">
        <motion.div variants={itemVariants}>
          {children}
        </motion.div>
      </CardContent>
    </Card>
  );
}

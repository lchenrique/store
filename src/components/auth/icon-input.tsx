'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { itemVariants } from './animation-variants';
import { ComponentProps, forwardRef } from 'react';

interface IconInputProps extends ComponentProps<typeof Input> {
  label: string;
  icon: React.ReactNode;
  error?: string;
}

export const IconInput = forwardRef<HTMLInputElement, IconInputProps>(({ 
  label, 
  icon, 
  error,
  className,
  required,
  ...props 
}, ref) => {
  return (
    <motion.div 
      className="space-y-2"
      variants={itemVariants}
    >
      <Label 
        htmlFor={props.id}
        className="text-sm font-medium"
      >
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      <div className="relative">
        <div className="absolute left-3 top-3 text-muted-foreground">
          {icon}
        </div>
        <Input
          ref={ref}
          className={cn(
            "pl-10 pr-4 py-2 bg-muted/50",
            error && "border-destructive focus-visible:ring-destructive",
            className
          )}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? `${props.id}-error` : undefined}
          required={required}
          {...props}
        />
      </div>
      {error && (
        <span 
          className="text-sm text-destructive"
          id={`${props.id}-error`}
        >
          {error}
        </span>
      )}
    </motion.div>
  );
});

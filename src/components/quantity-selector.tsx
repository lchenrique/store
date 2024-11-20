'use client';

import { Minus, Plus } from 'lucide-react';
import { Button, Group, Input, NumberField } from "react-aria-components";

interface QuantitySelectorProps {
  value: number;
  onChange: (value: number) => void;
  minValue?: number;
  maxValue?: number;
  className?: string;
}

export function QuantitySelector({ 
  value, 
  onChange, 
  minValue = 1, 
  maxValue = 99,
  className = "w-52"
}: QuantitySelectorProps) {
  return (
    <NumberField 
      value={value}
      onChange={onChange}
      minValue={minValue}
      maxValue={maxValue}
      className={className}
    >
      <Group className="relative inline-flex h-10 w-full items-center overflow-hidden whitespace-nowrap rounded-xl border border-input text-sm shadow-sm shadow-black/5 ring-offset-background transition-shadow data-[focus-within]:border-ring data-[disabled]:opacity-50 data-[focus-within]:outline-none data-[focus-within]:ring-2 data-[focus-within]:ring-ring/30 data-[focus-within]:ring-offset-2">
        <Button
          slot="decrement"
          className="flex aspect-square h-[inherit] items-center justify-center rounded-s-xl border-r border-input bg-background text-sm text-muted-foreground/80 ring-offset-background transition-shadow hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Minus size={16} strokeWidth={2} aria-hidden="true" />
        </Button>
        <Input className="h-[inherit] w-full grow bg-background px-3 text-center tabular-nums text-foreground focus:outline-none disabled:cursor-not-allowed" />
        <Button
          slot="increment"
          className="flex aspect-square h-[inherit] items-center justify-center rounded-e-xl border-l border-input bg-background text-sm text-muted-foreground/80 ring-offset-background transition-shadow hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus size={16} strokeWidth={2} aria-hidden="true" />
        </Button>
      </Group>
    </NumberField>
  );
}

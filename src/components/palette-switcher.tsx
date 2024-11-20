"use client";

import { useEffect, useState, useRef } from "react";
import { Check, Palette } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { usePaletteStore } from "@/store/use-palette-store";
import { useStoreMutations } from "@/hooks/store/use-store";
import { palettes } from "@/config/themes";
import { useStorePalette } from "@/hooks/store/use-store-palette";

export function PaletteSwitcher() {
  const [open, setOpen] = useState(false);
  const { updatePalette } = useStorePalette();
  const { currentPalette } = usePaletteStore();

 


  return (
    <div >
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
          >
            <Palette className="h-4 w-4" />
            <span className="sr-only">Alterar paleta de cores</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0" side="top">
          <Command>
            <CommandInput placeholder="Procurar paleta..." />
            <CommandList>
              <CommandEmpty>Nenhuma paleta encontrada.</CommandEmpty>
              <CommandGroup>
                {palettes.map((palette) => (
                  <CommandItem
                    key={palette.name}
                    value={palette.name}
                    onSelect={() => {
                      updatePalette.mutate(palette.name);
                      setOpen(false);
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="h-4 w-4 rounded-full"
                        style={{ backgroundColor: `hsl(${palette.color})` }}
                      />
                      <span>{palette.name}</span>
                    </div>
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        currentPalette?.name === palette.name
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}

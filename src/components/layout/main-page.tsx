import { cn } from "@/lib/utils";

interface MainPageProps {
  children: React.ReactNode;
  className?: string;
}

export function MainPage({ children, className }: MainPageProps) {
  return (
    <div className={cn("container mx-auto px-4 py-8 max-w-[1280px] pt-32", className)}>
      <main className="flex-1">{children}</main>
    </div>
  );
}

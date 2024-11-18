import { cn } from "@/lib/utils";

export const MainContainer = ({ children , className}: { children: React.ReactNode , className?: string }) => {
  return (
    <div className={cn("max-w-3xl w-full mx-auto", className)}>
      <main className="flex-1">{children}</main>
    </div>
  );
};

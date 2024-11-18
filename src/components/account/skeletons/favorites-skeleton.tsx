import { Skeleton } from "@/components/ui/skeleton";

export function FavoritesSkeleton() {
  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm">
      <Skeleton className="h-7 w-[180px] mb-6" />
      <div className="space-y-4">
        <div className="flex items-center gap-4 rounded-lg border p-4">
          <Skeleton className="w-16 h-16 rounded-md" />
          <div className="flex-1">
            <Skeleton className="h-4 w-[200px] mb-2" />
            <Skeleton className="h-4 w-[100px]" />
          </div>
          <Skeleton className="w-8 h-8" />
        </div>
      </div>
    </div>
  );
}

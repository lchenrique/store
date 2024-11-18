import { Skeleton } from "@/components/ui/skeleton";

export function AddressesSkeleton() {
  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <Skeleton className="h-7 w-[120px]" />
        <Skeleton className="h-10 w-[100px]" />
      </div>
      <div className="space-y-4">
        <div className="rounded-lg border p-4">
          <div className="flex justify-between">
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-4 w-[150px]" />
            </div>
            <Skeleton className="h-8 w-8" />
          </div>
        </div>
      </div>
    </div>
  );
}

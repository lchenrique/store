import { Skeleton } from "@/components/ui/skeleton";

export function ProfileSkeleton() {
  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm">
      <Skeleton className="h-7 w-[100px] mb-6" />
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-4 w-[60px]" />
          <Skeleton className="h-4 flex-1" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-4 w-[60px]" />
          <Skeleton className="h-4 flex-1" />
        </div>
        <Skeleton className="h-10 w-[120px] mt-2" />
      </div>
    </div>
  );
}

import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonCard() {
  return (
    <>
      {/* Create 6 skeleton cards that match the parent grid layout */}
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="flex flex-col space-y-3 p-4 border rounded-lg">
          {/* Main content skeleton */}
          <Skeleton className="h-[125px] w-full rounded-xl" />
          {/* Text lines skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        </div>
      ))}
    </>
  );
}
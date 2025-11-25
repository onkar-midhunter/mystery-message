import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonCard() {
  return (
    <>
      <div className="grid-cols-3 grid-flow-col p-1.5 m-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div className="flex flex-col space-y-3">
            <Skeleton className="h-[125px] w-[250px] rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

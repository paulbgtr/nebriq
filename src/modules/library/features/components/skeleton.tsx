import { Card } from "@/shared/components/ui/card";
import { cn } from "@/shared/lib/utils";

export const SkeletonHistory = () => {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none sm:min-w-[300px] h-10 bg-muted animate-pulse rounded-md" />
          <div className="h-10 w-10 bg-muted animate-pulse rounded-md" />
        </div>
        <div className="flex items-center gap-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <div className="h-4 w-4 bg-muted animate-pulse rounded" />
              <div className="h-4 w-16 bg-muted animate-pulse rounded" />
              {i < 2 && <div className="w-px h-4 bg-border" />}
            </div>
          ))}
        </div>
      </div>

      {/* Filter Buttons Skeleton */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-2 px-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-9 w-24 bg-muted animate-pulse rounded-md" />
        ))}
      </div>

      {/* Content Skeleton */}
      <div className="space-y-8">
        {[...Array(2)].map((_, groupIndex) => (
          <div key={groupIndex} className="space-y-4">
            <div className="h-7 w-32 bg-muted animate-pulse rounded" />
            <div className="grid gap-4">
              {[...Array(2)].map((_, itemIndex) => (
                <Card
                  key={itemIndex}
                  className={cn("p-4 sm:p-6", "border border-border/40")}
                >
                  <div className="flex flex-col gap-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="h-4 w-4 bg-muted animate-pulse rounded" />
                          <div className="h-6 w-48 bg-muted animate-pulse rounded" />
                        </div>
                        <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 bg-muted animate-pulse rounded" />
                        <div className="h-4 w-16 bg-muted animate-pulse rounded" />
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1.5">
                        <div className="h-3.5 w-3.5 bg-muted animate-pulse rounded" />
                        <div className="h-4 w-16 bg-muted animate-pulse rounded" />
                      </div>
                      {[...Array(3)].map((_, badgeIndex) => (
                        <div
                          key={badgeIndex}
                          className="h-5 w-20 bg-muted animate-pulse rounded-full"
                        />
                      ))}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <div className="h-3.5 w-3.5 bg-muted animate-pulse rounded" />
                      <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

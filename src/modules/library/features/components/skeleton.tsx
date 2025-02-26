import { Card } from "@/shared/components/ui/card";
import { cn } from "@/shared/lib/utils";

export const SkeletonHistory = () => {
  return (
    <div className="space-y-8">
      {/* Search and Filter Bar Skeleton */}
      <div className="grid gap-6 sm:grid-cols-[1fr,auto] items-start">
        <div className="relative flex-1">
          <div className="h-11 bg-muted animate-pulse rounded-lg" />
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-8 w-20 bg-muted animate-pulse rounded-md"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Time Filter Buttons Skeleton */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="h-9 w-28 bg-muted animate-pulse rounded-md flex-shrink-0"
          />
        ))}
      </div>

      {/* Content Skeleton */}
      <div className="space-y-12">
        {[...Array(2)].map((_, groupIndex) => (
          <div key={groupIndex} className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 bg-muted animate-pulse rounded" />
              <div className="h-7 w-32 bg-muted animate-pulse rounded" />
              <div className="h-5 w-16 bg-muted animate-pulse rounded" />
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(3)].map((_, itemIndex) => (
                <Card
                  key={itemIndex}
                  className={cn(
                    "relative overflow-hidden",
                    "border border-border/40"
                  )}
                >
                  <div className="p-5 space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0 space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="h-7 w-7 bg-muted animate-pulse rounded-md" />
                          <div className="h-6 w-3/4 bg-muted animate-pulse rounded" />
                        </div>
                        <div className="space-y-1">
                          <div className="h-4 w-full bg-muted animate-pulse rounded" />
                          <div className="h-4 w-2/3 bg-muted animate-pulse rounded" />
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="h-4 w-4 bg-muted animate-pulse rounded" />
                        <div className="h-4 w-12 bg-muted animate-pulse rounded" />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-1.5">
                        {[...Array(3)].map((_, badgeIndex) => (
                          <div
                            key={badgeIndex}
                            className="h-5 w-16 bg-muted animate-pulse rounded-full"
                          />
                        ))}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <div className="h-3.5 w-3.5 bg-muted animate-pulse rounded" />
                          <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                        </div>
                        <div className="h-4 w-4 bg-muted animate-pulse rounded" />
                      </div>
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

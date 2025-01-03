import { Skeleton } from "@/shared/components/ui/skeleton";
import { cn } from "@/shared/lib/utils";

export const SkeletonHistory = () => {
  return (
    <>
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className={cn(
            "flex justify-between items-center p-4",
            "border-b border-border",
            "hover:bg-muted/50 cursor-pointer",
            "transition-colors duration-300"
          )}
          role="button"
        >
          <div className="flex space-y-3 flex-col">
            <Skeleton className="w-48 h-4 bg-muted" />
            <Skeleton className="w-20 h-4 bg-muted" />
          </div>
        </div>
      ))}
    </>
  );
};

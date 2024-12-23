import { Skeleton } from "@/shared/components/ui/skeleton";

export const SkeletonHistory = () => {
  return (
    <>
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="flex justify-between items-center p-4 border-b border-gray-200 hover:opacity-80 cursor-pointer duration-300"
          role="button"
        >
          <div className="flex space-y-3 flex-col">
            <Skeleton className="w-48 h-4" />
            <Skeleton className="w-20 h-4" />
          </div>
        </div>
      ))}
    </>
  );
};

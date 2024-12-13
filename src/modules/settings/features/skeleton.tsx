import { Skeleton } from "@/shared/components/ui/skeleton";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/shared/components/ui/card";

export const SkeletonSettings = () => {
  return (
    <>
      <section className="grid gap-6 md:grid-cols-2 w-full">
        <Card className="w-full">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-5" />
              <Skeleton className="h-6 w-[120px]" />
            </div>
            <Skeleton className="h-4 w-[180px] mt-2" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-[80px]" />
              <Skeleton className="h-10 w-full" />
            </div>
          </CardContent>
          <CardFooter>
            <Skeleton className="h-10 w-[120px]" />
          </CardFooter>
        </Card>

        <Card className="w-full">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-5" />
              <Skeleton className="h-6 w-[140px]" />
            </div>
            <Skeleton className="h-4 w-[160px] mt-2" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-[120px]" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-[140px]" />
              <Skeleton className="h-10 w-full" />
            </div>
          </CardContent>
          <CardFooter>
            <Skeleton className="h-10 w-[140px]" />
          </CardFooter>
        </Card>
      </section>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-5" />
            <Skeleton className="h-6 w-[100px]" />
          </div>
          <Skeleton className="h-4 w-[300px] mt-2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-10 w-[140px]" />
        </CardContent>
      </Card>
    </>
  );
};

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProfileLoading() {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="w-full h-10 lg:mt-7" />
      <Card>
        <CardHeader className="border-b">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Skeleton className="w-16 h-16 rounded-full" />
                <Skeleton className="w-40 h-8" />
              </div>
              <div className="text-xs flex items-center gap-1">
                <Skeleton className="w-20 h-8" />
              </div>
            </div>
            <div className="flex pl-20 items-center justify-between">
              <div className="flex flex-col items-center gap-1">
                <Skeleton className="w-5 h-5" />
                <Skeleton className="w-10 md:w-20 h-5" />
              </div>
              <div className="flex flex-col items-center gap-1">
                <Skeleton className="w-5 h-5" />
                <Skeleton className="w-10 md:w-20 h-5" />
              </div>
              <div className="flex flex-col items-center gap-1">
                <Skeleton className="w-5 h-5" />
                <Skeleton className="w-10 md:w-20 h-5" />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <Skeleton className="w-full h-7" />
        </CardContent>
      </Card>
      <Separator />
      <div className="grid grid-cols-2 xl:grid-cols-3 gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <AspectRatio ratio={16 / 9} key={i}>
            <Skeleton key={i} className="w-full h-full rounded-none" />
          </AspectRatio>
        ))}
      </div>
    </div>
  );
}

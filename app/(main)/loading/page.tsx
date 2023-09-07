import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export default function NotificationsLoading() {
  return (
    <div className="flex flex-col gap-4 lg:mt-7">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Skeleton className="w-7 h-7 rounded-full" />
          <Skeleton className="w-40 h-7" />
        </div>
        <div className="flex items-center gap-1">
          <Skeleton className="w-20 h-7" />
          <Skeleton className="w-4 h-7" />
        </div>
      </div>
      <div>
        <AspectRatio ratio={4 / 3}>
          <Skeleton className="w-full h-full rounded-none" />
        </AspectRatio>
      </div>
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-4 mt-2">
          <Skeleton className="w-6 h-6" />
          <Skeleton className="w-6 h-6" />
          <Skeleton className="w-6 h-6" />
        </div>
        <Skeleton className="w-16 h-4" />
        <Skeleton className="w-60 h-6" />
        <Skeleton className="w-20 h-4 mt-2" />
      </div>
    </div>
  );
}

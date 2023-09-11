import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export default function NotificationsLoading() {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="w-full h-10 lg:mt-7" />
      <div className="flex items-center justify-between">
        <Skeleton className="w-20 h-5" />
        <Skeleton className="w-7 h-5" />
      </div>
      <Skeleton className="w-full h-9" />
      <div className="flex flex-col gap-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="w-full h-20" />
        ))}
      </div>
    </div>
  );
}

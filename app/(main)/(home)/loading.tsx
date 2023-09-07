import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function HomeLoading() {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="w-full h-10 lg:mt-7" />
      {Array.from({ length: 7 }).map((_, i) => (
        <Card key={i}>
          <CardHeader className="border-b py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Skeleton className="w-7 h-7 rounded-full" />
                <Skeleton className="w-40 h-6" />
              </div>
              <Skeleton className="w-10 h-4" />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <AspectRatio ratio={4 / 3}>
              <Skeleton className="w-full h-full rounded-none" />
            </AspectRatio>
          </CardContent>
          <CardContent className="flex flex-col gap-3">
            <div className="flex items-center gap-4 mt-2">
              <Skeleton className="w-6 h-6" />
              <Skeleton className="w-6 h-6" />
              <Skeleton className="w-6 h-6" />
            </div>
            <Skeleton className="w-16 h-4" />
            <Skeleton className="w-60 h-6" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

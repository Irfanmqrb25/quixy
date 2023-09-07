import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Skeleton } from "@/components/ui/skeleton";

export default function ExploreLoading() {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="w-full h-10 lg:mt-7" />
      <Skeleton className="w-full h-9" />
      <div className="grid grid-cols-3 gap-1">
        {Array.from({ length: 21 }).map((_, i) => (
          <AspectRatio ratio={16 / 9} key={i}>
            <Skeleton key={i} className="w-full h-full rounded-none" />
          </AspectRatio>
        ))}
      </div>
    </div>
  );
}

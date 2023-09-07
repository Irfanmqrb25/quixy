import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function NotificationsLoading() {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="w-full h-10 lg:mt-7" />
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i}>
          <div className="flex w-full flex-col p-2">
            <div className="flex items-center gap-4">
              <Skeleton className="w-7 h-7 rounded-full" />
              <Skeleton className="w-full h-7" />
            </div>
            <Skeleton className="w-10 h-4 mt-2 ml-11" />
            <div className="flex gap-4 pl-12 mt-4">
              <Skeleton className="w-full h-7" />
              <Skeleton className="w-full h-7" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

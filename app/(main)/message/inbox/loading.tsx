import { Skeleton } from "@/components/ui/skeleton";

const MessageInboxLoading = () => {
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
};

export default MessageInboxLoading;

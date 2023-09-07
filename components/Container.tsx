"use client";
import useConversation from "@/hooks/useConversation";

const Container = ({ children }: { children: React.ReactNode }) => {
  const { conversationId } = useConversation();
  return (
    <div
      className={`h-full lg:pl-80 lg:w-[75%] xl:w-[65%] 2xl:w-[55%] pt-24 px-4 md:px-32 lg:px-0 lg:pt-0 ${
        conversationId && "pt-4"
      }`}
    >
      {children}
    </div>
  );
};

export default Container;

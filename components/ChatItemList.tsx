"use client";

import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";

import { Avatar, AvatarImage } from "./ui/avatar";

import { cn } from "@/lib/utils";
import { FullConversationType } from "@/types";
import useOtherUser from "@/hooks/useOtherUser";

import { format } from "date-fns";
import { useSession } from "next-auth/react";
import { User } from "@prisma/client";
import { Dot } from "lucide-react";
import AvatarWithStatus from "./Avatar";

interface ChatItemListProps {
  data: FullConversationType;
}

const ChatItemList: React.FC<ChatItemListProps> = ({ data }) => {
  const router = useRouter();
  const session = useSession();
  const otherUser = useOtherUser(data);

  const handleClickChat = useCallback(() => {
    router.push(`/message/${data.id}`);
  }, [router, data]);

  const lastMessage = useMemo(() => {
    const messages = data.messages || [];

    return messages[messages.length - 1];
  }, [data.messages]);

  const userEmail = useMemo(() => {
    return session?.data?.user?.email;
  }, [session?.data?.user?.email]);

  const hasSeen = useMemo(() => {
    if (!lastMessage) {
      return false;
    }

    const seenArray = lastMessage.seen || [];

    if (!userEmail) {
      return false;
    }

    return (
      seenArray.filter((user: User) => user.email === userEmail).length !== 0
    );
  }, [lastMessage, userEmail]);

  const lastMessageText = useMemo(() => {
    if (lastMessage?.image) {
      return "Sent an image";
    }

    if (lastMessage?.body) {
      return lastMessage.body;
    }

    return "Started a conversation";
  }, [lastMessage]);

  return (
    <div
      onClick={handleClickChat}
      className={cn(
        "w-full relative flex items-center space-x-3 hover:bg-gray-400/30 rounded-lg transition cursor-pointer p-3"
      )}
    >
      <AvatarWithStatus data={otherUser} className="w-11 h-11" />
      <div className="flex-1 min-w-0">
        <div className="focus:outline-none">
          <div className="flex items-center justify-between mb-1">
            <p className="font-medium text-md">
              {data.name || otherUser.username || otherUser.name}
            </p>
            <p className="text-xs font-light text-gray-400">
              {format(new Date(lastMessage.createdAt), "p")}
            </p>
          </div>
          <div className="flex items-center justify-between">
            <p
              className={cn(
                "truncate text-sm",
                hasSeen ? "text-gray-500" : "font-medium"
              )}
            >
              {lastMessageText}
            </p>
            {!hasSeen && <Dot size={25} color="red" />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatItemList;

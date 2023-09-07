"use client";

import { Inbox } from "lucide-react";
import ChatItemList from "./ChatItemList";
import { ScrollArea } from "./ui/scroll-area";
import { FullConversationType } from "@/types";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import useConversation from "@/hooks/useConversation";
import { pusherClient } from "@/lib/pusher";
import { useSession } from "next-auth/react";
import { find } from "lodash";

interface ChatListProps {
  initialItems: FullConversationType[];
}

const ChatList: React.FC<ChatListProps> = ({ initialItems }) => {
  const session = useSession();
  const router = useRouter();
  const [items, setItems] = useState(initialItems);

  const { conversationId } = useConversation();

  const pusherKey = useMemo(() => {
    return session?.data?.user?.email;
  }, [session.data?.user?.email]);

  useEffect(() => {
    if (!pusherKey) return;

    pusherClient.subscribe(pusherKey);

    const newHandler = (conversation: FullConversationType) => {
      setItems((current) => {
        if (find(current, { id: conversation.id })) {
          return current;
        }

        return [conversation, ...current];
      });
    };

    const updateHandler = (conversation: FullConversationType) => {
      setItems((current) =>
        current.map((currentConversation) => {
          if (currentConversation.id === conversation.id) {
            return { ...currentConversation, messages: conversation.messages };
          }
          return currentConversation;
        })
      );
    };

    const removeHandler = (conversation: FullConversationType) => {
      setItems((current) => {
        return [...current.filter((convo) => convo.id !== conversation.id)];
      });
      if (conversationId === conversation.id) {
        router.push("/message/inbox");
      }
    };

    pusherClient.bind("conversation:new", newHandler);
    pusherClient.bind("conversation:update", updateHandler);
    pusherClient.bind("conversation:remove", removeHandler);

    return () => {
      pusherClient.unsubscribe(pusherKey);
      pusherClient.unbind("conversation:new", newHandler);
      pusherClient.unbind("conversation:update", updateHandler);
      pusherClient.unbind("conversation:remove", removeHandler);
    };
  }, [pusherKey, conversationId, router]);

  return (
    <aside className="flex flex-col gap-2">
      <ScrollArea className="pr-2">
        {items.map((item) => (
          <ChatItemList key={item.id} data={item} />
        ))}
      </ScrollArea>
    </aside>
  );
};

export default ChatList;

"use client";

import MessageBubble from "./bubble/MessageBubble";
import { Card } from "./ui/card";
import { FullMessageType } from "@/types";
import { useEffect, useRef, useState } from "react";
import useConversation from "@/hooks/useConversation";
import { pusherClient } from "@/lib/pusher";
import axios from "axios";
import { find } from "lodash";

interface BodyMessageProps {
  initialMessages: FullMessageType[];
}

const BodyMessage: React.FC<BodyMessageProps> = ({ initialMessages }) => {
  const { conversationId } = useConversation();
  const bottomRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState(initialMessages);

  useEffect(() => {
    axios.post(`/api/conversations/${conversationId}/seen`);
  }, [conversationId]);

  useEffect(() => {
    pusherClient.subscribe(conversationId);
    bottomRef?.current?.scrollIntoView();

    const messageHandler = (message: FullMessageType) => {
      axios.post(`/api/conversations/${conversationId}/seen`);

      setMessages((current) => {
        if (find(current, { id: message.id })) {
          return current;
        }

        return [...current, message];
      });

      bottomRef?.current?.scrollIntoView();
    };

    const updateMessageHandler = (newMessage: FullMessageType) => {
      setMessages((current) =>
        current.map((currentMessage) => {
          if (currentMessage.id === newMessage.id) {
            return newMessage;
          }

          return currentMessage;
        })
      );
    };

    pusherClient.bind("messages:new", messageHandler);
    pusherClient.bind("message:update", updateMessageHandler);

    return () => {
      pusherClient.unsubscribe(conversationId);
      pusherClient.unbind("messages:new", messageHandler);
      pusherClient.unbind("message:update", updateMessageHandler);
    };
  }, [conversationId]);

  return (
    <div className="flex-1 mt-4 rounded-md overflow-y-auto message-body-scroll lg:border-2 lg:border-black dark:border-muted-foreground">
      {messages.length === 0 ? (
        <div className="flex items-center justify-center py-4">
          Start a conversation
        </div>
      ) : (
        messages.map((message, i) => (
          <MessageBubble
            key={message.id}
            data={message}
            isLast={i === messages.length - 1}
          />
        ))
      )}
      <div ref={bottomRef} />
    </div>
  );
};

export default BodyMessage;

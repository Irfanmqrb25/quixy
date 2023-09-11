"use client";

import { cn } from "@/lib/utils";
import { format } from "date-fns";
import Image from "next/image";
import { useState } from "react";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Dot } from "lucide-react";
import { useSession } from "next-auth/react";
import { FullMessageType } from "@/types";
import { User } from "@prisma/client";
import ImageMessageModal from "../modal/ImageMessageModal";
import AvatarWithStatus from "../Avatar";

interface MessageBoxProps {
  data: FullMessageType;
  isLast?: boolean;
}

const MessageBubble: React.FC<MessageBoxProps> = ({ data, isLast }) => {
  const session = useSession();
  const [imageModalOpen, setImageModalOpen] = useState(false);

  const isOwn = session?.data?.user?.email === data?.sender?.email;

  const seenList = (data.seen || [])
    .filter((user: User) => user.email !== data?.sender?.email)
    .map((user: User) => user.username || user.name)
    .join(", ");

  const container = cn("flex gap-2 py-4 lg:px-2 px-1", isOwn && "justify-end");
  const avatar = cn(isOwn && "order-2");
  const body = cn("flex flex-col gap-1", isOwn && "items-end");
  const message = cn(
    "text-sm w-fit overflow-ellipsis max-w-xs",
    isOwn ? "bg-blue-500 text-white" : "bg-gray-100 text-black",
    data.image ? "rounded-md p-0" : "rounded-xl py-2 px-3"
  );

  return (
    <div className={container}>
      <div className={avatar}>
        <AvatarWithStatus data={data.sender} className="w-7 h-7" />
      </div>
      <div className={body}>
        {isOwn ? (
          <div className="flex items-center">
            <div className="text-xs text-gray-400">
              {format(new Date(data.createdAt), "p")}
            </div>
            <Dot size={12} />
            <div>{data.sender.username || data.sender.name}</div>
          </div>
        ) : (
          <div className="flex items-center">
            <div>{data.sender.username || data.sender.name}</div>
            <Dot size={12} />
            <div className="text-xs text-gray-400">
              {format(new Date(data.createdAt), "p")}
            </div>
          </div>
        )}
        <div className={message}>
          <ImageMessageModal
            src={data.image}
            isOpen={imageModalOpen}
            onClose={() => setImageModalOpen(false)}
          />
          {data.image ? (
            <Image
              onClick={() => setImageModalOpen(true)}
              alt="Image"
              height={150}
              width={150}
              src={data.image}
              className="object-cover cursor-pointer rounded-md"
            />
          ) : (
            <p>{data.body}</p>
          )}
        </div>
        {isLast && isOwn && seenList.length > 0 && (
          <div className="text-xs font-medium text-gray-500">seen</div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;

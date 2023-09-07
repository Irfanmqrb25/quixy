"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import NotificationBubble from "@/components/bubble/NotificationBubble";

import { pusherClient } from "@/lib/pusher";
import { User, Follow } from "@prisma/client";
import { FullNotificationType } from "@/types";

interface NotificationClientProps {
  currentUser: User & {
    following: Follow[];
  };
  initialNotifications: FullNotificationType[];
}

const NotificationClient: React.FC<NotificationClientProps> = ({
  currentUser,
  initialNotifications,
}) => {
  const router = useRouter();

  const [notifications, setNotifications] = useState(initialNotifications);

  useEffect(() => {
    if (!currentUser.id) return;

    pusherClient.subscribe(currentUser.id);

    const newHandler = (notification: FullNotificationType) => {
      setNotifications((prevNotifications) => {
        return [notification, ...prevNotifications];
      });
    };

    pusherClient.bind("follow", newHandler);
    pusherClient.bind("like", newHandler);
    pusherClient.bind("comment", newHandler);

    return () => {
      pusherClient.unsubscribe(currentUser.id);
    };
  }, [currentUser.id]);

  return (
    <div className="flex flex-col gap-4">
      {notifications.map((notification) => {
        const followed = currentUser.following.some(
          (following) => following.followingId === notification.createdById
        );

        return (
          <NotificationBubble
            key={notification.id}
            notification={notification}
            followed={followed}
            currentUser={currentUser}
          />
        );
      })}
    </div>
  );
};

export default NotificationClient;

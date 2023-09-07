"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { Button } from "../ui/button";
import { Avatar, AvatarImage } from "../ui/avatar";

import { User } from "@prisma/client";
import { FullNotificationType } from "@/types";
import { formatDateDistance } from "@/lib/utils";

import axios from "axios";
import { formatDistanceToNow } from "date-fns";
import { UserCheck2, UserPlus2 } from "lucide-react";

interface NotificationBubbleProps {
  notification: FullNotificationType;
  currentUser: User;
  followed: boolean;
}

const NotificationBubble: React.FC<NotificationBubbleProps> = ({
  notification,
  followed,
  currentUser,
}) => {
  const router = useRouter();

  const HandleFollow = async (followingId: string) => {
    try {
      await axios.post("/api/user/follow", {
        follower: currentUser.id,
        following: followingId,
      });
      router.refresh();
    } catch (error: any) {
      console.log(error.message);
    }
  };

  const handleUnfollow = async (followingId: string) => {
    try {
      await axios.delete("/api/user/follow", {
        data: {
          follower: currentUser.id,
          following: followingId,
        },
      });
      router.refresh();
    } catch (error: any) {
      console.log(error.message);
    }
  };

  return (
    <>
      {notification.type === "follow" && (
        <div className="flex w-full border rounded-sm flex-col p-2">
          <div className="flex items-center gap-4">
            <Avatar className="w-7 h-7">
              <AvatarImage
                src={notification.avatar || "/assets/default-user.jpg"}
              />
            </Avatar>
            <p>
              <span className="font-medium">{notification.createdByName}</span>{" "}
              {notification.body}
            </p>
          </div>
          <span className="text-muted-foreground text-xs pl-12">
            {formatDistanceToNow(new Date(notification?.createdAt), {
              addSuffix: true,
            })}
          </span>
          <div className="flex gap-4 pl-12 mt-4">
            <Button
              size="sm"
              variant={followed ? "outline" : "default"}
              className="flex gap-1 text-xs items-center w-full"
              onClick={
                followed
                  ? () => handleUnfollow(notification?.createdById)
                  : () => HandleFollow(notification?.createdById)
              }
            >
              {followed ? (
                <UserCheck2 size={18} className="hidden md:block" />
              ) : (
                <UserPlus2 size={18} className="hidden md:block" />
              )}
              <span>{followed ? "Following" : "Follow back"}</span>
            </Button>
            <Button variant="secondary" className="w-full text-sm" size="sm">
              Ignore
            </Button>
          </div>
        </div>
      )}
      {notification.type === "comment" && (
        <div className="w-full flex-col gap-1 flex border rounded-sm p-2">
          <div className="flex items-center gap-4">
            <Avatar className="w-7 h-7">
              <AvatarImage
                src={notification.avatar ?? "/assets/default-user.jpg"}
              />
            </Avatar>
            <div className="flex items-center justify-between w-full">
              <p>
                <span className="font-medium">
                  {notification.createdByName}
                </span>{" "}
                comment on your post
              </p>
              <span className="text-xs text-gray-400">
                {formatDateDistance(notification.createdAt)}
              </span>
            </div>
          </div>
          <div className="pl-12 w-full flex items-center gap-1 justify-between">
            <span className="line-clamp-1 italic pr-1 w-[70%]">
              {notification?.body}
            </span>
            <Link
              href={`/post/${notification.postId}`}
              className="w-[30%] flex justify-end"
            >
              <Image
                src={notification?.images!}
                alt={`post ${notification.postId}`}
                width={70}
                height={70}
              />
            </Link>
          </div>
        </div>
      )}
      {notification.type === "like" && (
        <div className="w-full flex-col gap-1 flex border rounded-sm p-2">
          <div className="flex items-center gap-4">
            <Avatar className="w-7 h-7">
              <AvatarImage
                src={notification.avatar ?? "/assets/default-user.jpg"}
              />
            </Avatar>
            <div className="flex items-center justify-between w-full">
              <p>
                <span className="font-medium">
                  {notification.createdByName}
                </span>{" "}
                {notification.body}
              </p>
              <span className="text-xs text-gray-400">
                {formatDateDistance(notification.createdAt)}
              </span>
            </div>
          </div>
          <div className="pl-12 w-full flex items-center gap-1 justify-between">
            <span className="line-clamp-1 italic pr-1 w-[70%]">
              {notification?.body}
            </span>
            <Link
              href={`/post/${notification.postId}`}
              className="w-[30%] flex justify-end"
            >
              <Image
                src={notification?.images!}
                alt={`post ${notification.postId}`}
                width={70}
                height={70}
              />
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default NotificationBubble;

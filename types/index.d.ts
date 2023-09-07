import { Image, Post, User, Like, Comment, Notification } from "@prisma/client";

export type FullPostType = Post & {
  user: User;
  likes: Like[];
  images: Image[];
  comments: Comment[];
};

export type FullNotificationType = Notification & {
  user: User;
};

export type FullConversationType = Conversation & {
  users: User[];
  messages: Message[];
};

export type FullMessageType = Message & {
  sender: User;
  seen: User[];
};

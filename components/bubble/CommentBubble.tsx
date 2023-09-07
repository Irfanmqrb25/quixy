"use client";

import { useComment } from "@/hooks/useComment";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Comment, Post, User } from "@prisma/client";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface CommentBubbleProps {
  comment: Comment & {
    user: User;
    post: Post;
  };
  currentUser: User;
}

const CommentBubble: React.FC<CommentBubbleProps> = ({
  comment,
  currentUser,
}) => {
  const router = useRouter();
  const { mutate } = useComment(comment.post.id);

  const canDeleteComment =
    currentUser.id === comment.userId || currentUser.id === comment.post.userId;

  const handleDeleteComment = async () => {
    try {
      await axios.delete(`/api/comment/${comment.id}`, {
        data: {
          postOwnerId: comment.post.userId,
          commentUserId: comment.userId,
        },
      });
      mutate();
    } catch (error: any) {
      console.log(error.message);
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <div className="flex gap-2">
        <Link
          href={
            comment.user.id === currentUser?.id
              ? "/profile"
              : `/user/${comment.user.id}`
          }
        >
          <Avatar className="w-7 h-7">
            <AvatarImage
              src={comment.user.image || "/assets/default-user.jpg"}
            />
          </Avatar>
        </Link>
        <p className="inline-block break-all text-sm">
          <Link
            href={
              comment.user.id === currentUser?.id
                ? "/profile"
                : `/user/${comment.user.id}`
            }
            className="font-medium"
          >
            {comment.user.username || comment.user.name}
          </Link>{" "}
          {comment.text}
        </p>
      </div>
      <div className="flex items-center gap-3 pl-9">
        <p className="text-xs text-gray-500">
          {formatDistanceToNow(new Date(comment.createdAt))}
        </p>
        {canDeleteComment && (
          <button
            onClick={handleDeleteComment}
            className="text-xs text-gray-500 hover:text-red-500"
          >
            delete
          </button>
        )}
      </div>
    </div>
  );
};

export default CommentBubble;

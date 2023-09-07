"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import CommentBubble from "@/components/bubble/CommentBubble";
import PostImageCarousel from "@/components/carousel/PostImageCarousel";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import useLike from "@/hooks/useLike";
import { useComment } from "@/hooks/useComment";
import { FullPostType } from "@/types";
import { Follow, Like, User } from "@prisma/client";

import axios from "axios";
import {
  Heart,
  MessageSquare,
  MoreVertical,
  Plus,
  SendHorizonal,
  Share2,
  TrashIcon,
  UserCheck2,
} from "lucide-react";
import toast from "react-hot-toast";
import { formatDistanceToNow } from "date-fns";

interface PostPageClientProps {
  post: FullPostType;
  currentUser: User & {
    following: Follow[];
    likes: Like[];
  };
}

const PostPageClient: React.FC<PostPageClientProps> = ({
  post,
  currentUser,
}) => {
  const router = useRouter();
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { mutate, data } = useComment(post.id);
  const { likes, hasLike, toggleLike } = useLike({ post, currentUser });

  const isFollowed = currentUser.following.some(
    (follow) => follow.followingId === post.user.id
  );

  const [followed, setFollowed] = useState(isFollowed);

  const uploadComment = async () => {
    setIsLoading(true);
    try {
      await axios.post("/api/comment", {
        userId: currentUser.id,
        postId: post.id,
        text,
      });
      mutate();
      setText("");
    } catch (error: any) {
      console.log(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const HandleFollow = async () => {
    setFollowed(true);
    try {
      await axios.post("/api/user/follow", {
        follower: currentUser.id,
        following: post.user.id,
      });
      toast.success("Followed");
      router.refresh();
    } catch (error: any) {
      toast.error("Something went wrong");
      throw Error(error.message);
    }
  };

  const handleUnfollow = async () => {
    setFollowed(false);
    try {
      await axios.delete("/api/user/follow", {
        data: {
          follower: currentUser.id,
          following: post.user.id,
        },
      });
      toast.success("Unfollowed");
      router.refresh();
    } catch (error: any) {
      toast.error("Something went wrong");
      throw Error(error.message);
    }
  };

  const handleDeletePost = async () => {
    try {
      await axios.delete(`/api/post/${post.id}`);
      router.push("/");
      toast.success("Post deleted");
      router.refresh();
    } catch (error: any) {
      toast.error("Something went wrong");
      throw Error(error.message);
    }
  };

  return (
    <div className="lg:mt-7 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <Link
          href={
            post.userId === currentUser.id ? "/profile" : `/user/${post.userId}`
          }
        >
          <div className="flex items-center gap-2">
            <Avatar className="w-7 h-7">
              <AvatarImage
                src={post.user.image || "/assets/default-user.jpg"}
              />
            </Avatar>
            <span>{post.user.username || post.user.name}</span>
          </div>
        </Link>
        {post.userId === currentUser.id ? null : (
          <button
            className="flex items-center gap-1 text-sm"
            onClick={followed ? handleUnfollow : HandleFollow}
          >
            {followed ? <UserCheck2 size={15} /> : <Plus size={15} />}
            {followed ? "following" : "Follow"}
          </button>
        )}
        {post.userId === currentUser.id && (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <MoreVertical size={18} />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={handleDeletePost}
                className="cursor-pointer"
              >
                <TrashIcon className="mr-2 h-4 w-4" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
      <div>
        <PostImageCarousel images={post.images.map((image) => image.url)} />
      </div>
      <div className="flex flex-col gap-2">
        <div className="space-y-1">
          <div className="flex items-center gap-4">
            {hasLike ? (
              <button onClick={toggleLike} className="hover:scale-110">
                <Heart size={22} fill="red" />
              </button>
            ) : (
              <button onClick={toggleLike} className="hover:scale-110">
                <Heart size={22} />
              </button>
            )}
            <button
              onClick={() => setDialogOpen(true)}
              type="button"
              className="hover:scale-110"
            >
              <MessageSquare size={22} />
            </button>
            <Share2 size={22} />
          </div>
          <p className="text-sm font-semibold">{likes} Likes</p>
        </div>
        <p className="inline-block break-all">
          <Link
            href={
              post.userId === currentUser.id
                ? "/profile"
                : `/user/${post.userId}`
            }
            className="font-medium"
          >
            {post.user.username || post.user.name}
          </Link>{" "}
          {post.caption}
        </p>
        <span className="text-sm text-gray-400">
          {formatDistanceToNow(new Date(post.createdAt), {
            addSuffix: true,
          })}
        </span>
      </div>
      <Dialog open={dialogOpen} onOpenChange={() => setDialogOpen(!dialogOpen)}>
        <DialogContent>
          <DialogTitle>Comments</DialogTitle>
          <ScrollArea className="h-[400px]">
            <div className="pr-3 space-y-5">
              {data?.map((comment: any) => (
                <CommentBubble
                  key={comment.id}
                  comment={comment}
                  currentUser={currentUser}
                />
              ))}
            </div>
          </ScrollArea>
          <div className="mt-2 relative">
            <Input
              placeholder="Add a comment"
              className="pr-12"
              value={text}
              onChange={(e) => setText(e.target.value)}
              disabled={isLoading}
            />
            <Button
              onClick={uploadComment}
              disabled={isLoading}
              size="icon"
              variant="ghost"
              className="absolute right-0 top-0 h-full px-3 py-2 text-white"
            >
              <SendHorizonal size={18} />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PostPageClient;

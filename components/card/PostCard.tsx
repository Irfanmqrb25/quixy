"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { FullPostType } from "@/types";
import {
  Heart,
  MessageSquare,
  MoreHorizontal,
  SendHorizonal,
  Share2,
  TrashIcon,
} from "lucide-react";
import Link from "next/link";
import PostImageCarousel from "../carousel/PostImageCarousel";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import { ScrollArea } from "../ui/scroll-area";
import CommentBubble from "../bubble/CommentBubble";
import { useState } from "react";
import { useComment } from "@/hooks/useComment";
import { Like, User } from "@prisma/client";
import { Input } from "../ui/input";
import axios from "axios";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useRouter } from "next/navigation";
import useLike from "@/hooks/useLike";

interface PostCardProps {
  post: FullPostType;
  currentUser: User & {
    likes: Like[];
  };
}

const PostCard: React.FC<PostCardProps> = ({ post, currentUser }) => {
  const router = useRouter();
  const { likes, hasLike, toggleLike } = useLike({ post, currentUser });
  const { data, mutate, isLoading } = useComment(post.id);
  const [text, setText] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const isPostOwner = post.userId === currentUser.id;

  const uploadComment = async () => {
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
    }
  };

  const handleDeletePost = async () => {
    try {
      await axios.delete(`/api/post/${post.id}`);
      router.refresh();
    } catch (error: any) {
      throw Error(error.message);
    }
  };

  return (
    <Card>
      <CardHeader className="border-b py-3">
        <div className="flex items-center justify-between">
          <Link
            href={
              post.userId === currentUser?.id
                ? "/profile"
                : `/user/${post.userId}`
            }
            className="flex items-center gap-2"
          >
            <Avatar className="w-7 h-7">
              <AvatarImage
                src={post.user.image || "/assets/default-user.jpg"}
              />
            </Avatar>
            <span>{post.user.username || post.user.name}</span>
          </Link>
          {isPostOwner && (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <MoreHorizontal size={18} />
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
      </CardHeader>
      <CardContent className="p-0">
        <PostImageCarousel images={post.images.map((image) => image.url)} />
      </CardContent>
      <CardContent className="flex flex-col py-2">
        <div className="flex gap-4 py-2">
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
            className="hover:text-white/70 hover:scale-110 transform ease-in-out"
          >
            <MessageSquare size={22} />
          </button>
          <Share2 size={20} />
        </div>
        <div className="mb-2 text-sm text-muted-foreground font-medium">
          <p>{likes} Likes</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap pb-2">
          <Link
            href={
              currentUser?.id === post.userId
                ? "/profile"
                : `/user/${post.userId}`
            }
          >
            <p className="text-sm font-medium">
              {post.user.username || post.user.name}
            </p>
          </Link>
          <p className="text-sm">{post.caption}</p>
        </div>
      </CardContent>
      <Dialog open={dialogOpen} onOpenChange={() => setDialogOpen(!dialogOpen)}>
        <DialogContent className="w-full h-full md:h-fit flex flex-col">
          <DialogTitle>Comments</DialogTitle>
          <ScrollArea className="h-full lg:min-h-[400px] lg:max-h-[450px]">
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
              disabled={isLoading}
              placeholder="Add a comment"
              className="pr-12"
              value={text}
              onChange={(e) => setText(e.target.value)}
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
    </Card>
  );
};

export default PostCard;

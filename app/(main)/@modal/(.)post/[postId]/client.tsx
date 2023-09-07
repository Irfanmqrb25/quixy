"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import CommentBubble from "@/components/bubble/CommentBubble";
import PostDetailCarousel from "@/components/carousel/postDetailCarousel";

import {
  ArrowRight,
  Heart,
  MessageSquare,
  MoreVertical,
  SendHorizonal,
  Share2,
  TrashIcon,
  UserCheck2,
  UserPlus2,
} from "lucide-react";
import Link from "next/link";
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
import toast from "react-hot-toast";

interface PostModalClientProps {
  post: FullPostType;
  currentUser: User & {
    following: Follow[];
    likes: Like[];
  };
}

const PostModalClient: React.FC<PostModalClientProps> = ({
  post,
  currentUser,
}) => {
  const router = useRouter();

  const { data, mutate, isLoading } = useComment(post?.id);
  const { likes, hasLike, toggleLike } = useLike({ post, currentUser });

  const [text, setText] = useState("");
  const [commentsClick, setIsCommentsClick] = useState(false);

  const isPostOwner = post.userId === currentUser.id;

  const isFollowed = currentUser.following.some(
    (follow) => follow.followingId === post.userId
  );

  const [followed, setFollowed] = useState(isFollowed);

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
      router.refresh();
      router.back();
      toast.success("Post deleted");
    } catch (error: any) {
      toast.error("Something went wrong");
      throw Error(error.message);
    }
  };

  return (
    <div className="flex w-full">
      <div className="w-full flex flex-col lg:w-[55%]">
        <div className="flex items-center justify-between border-b border-black p-3 lg:hidden">
          <Link
            href={
              post.userId === currentUser.id
                ? "/profile"
                : `/user/${post.userId}`
            }
          >
            <div className="flex items-center gap-2">
              <Avatar className="w-8 h-8">
                <AvatarImage
                  src={post.user.image || "/assets/default-user.jpg"}
                />
              </Avatar>
              <span className="font-medium">
                {post.user.username || post.user.name}
              </span>
            </div>
          </Link>
          {isPostOwner ? null : (
            <Button
              size="sm"
              variant="secondary"
              className="flex items-center text-xs h-7 gap-1"
              onClick={followed ? handleUnfollow : HandleFollow}
            >
              {followed ? <UserCheck2 size={15} /> : <UserPlus2 size={15} />}
              {followed ? "Following" : "Follow"}
            </Button>
          )}
          {isPostOwner && (
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
        <PostDetailCarousel images={post.images.map((image) => image.url)} />
        <div className="lg:hidden border-t p-3 border-black flex flex-col bg-white gap-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              {hasLike ? (
                <button onClick={toggleLike}>
                  <Heart size={22} fill="red" />
                </button>
              ) : (
                <button onClick={toggleLike}>
                  <Heart size={22} />
                </button>
              )}
              <button
                onClick={() => setIsCommentsClick(true)}
                className="hover:scale-110"
              >
                <MessageSquare size={22} />
              </button>
              <Share2 />
            </div>
            <button
              className="flex items-center gap-1 hover:border-b hover:border-black"
              onClick={() => window.location.reload()}
            >
              view more
              <ArrowRight size={17} />
            </button>
          </div>
          {commentsClick && (
            <div className="relative">
              <Input
                placeholder="Write a comment"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="pr-[49px] bg-white text-black rounded-sm"
                disabled={isLoading}
              />
              <Button
                onClick={uploadComment}
                size="icon"
                className="absolute right-0 top-0 h-full px-3 py-2 text-black bg-transparent hover:bg-transparent"
                disabled={isLoading}
              >
                <SendHorizonal />
              </Button>
            </div>
          )}
        </div>
      </div>
      <div className="hidden lg:w-[45%] border-l border-black lg:flex flex-col">
        <div className="py-2 px-4 flex items-center justify-between border-b border-black">
          <Link
            href={
              post.userId === currentUser.id
                ? "/profile"
                : `/user/${post.userId}`
            }
          >
            <div className="flex items-center gap-2">
              <Avatar className="w-8 h-8">
                <AvatarImage
                  src={post.user.image || "/assets/default-user.jpg"}
                />
              </Avatar>
              <span className="font-medium">
                {post.user.username || post.user.name}
              </span>
            </div>
          </Link>
          {isPostOwner ? null : (
            <Button
              size="sm"
              variant="secondary"
              className="flex items-center text-xs h-7 gap-1"
              onClick={followed ? handleUnfollow : HandleFollow}
            >
              {followed ? <UserCheck2 size={15} /> : <UserPlus2 size={15} />}
              {followed ? "Following" : "Follow"}
            </Button>
          )}
          {isPostOwner && (
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
        <ScrollArea className="h-[400px] flex flex-col border-b py-2 px-4">
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-3">
              <div className="flex gap-2">
                <Link
                  href={
                    post.userId === currentUser.id
                      ? "/profile"
                      : `/user/${post.userId}`
                  }
                >
                  <Avatar className="w-7 h-7">
                    <AvatarImage
                      src={post.user.image || "/assets/default-user.jpg"}
                    />
                  </Avatar>
                </Link>
                <p className="inline-block break-all text-sm">
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
              </div>
              <p className="text-xs text-gray-500 pl-9">1 jam</p>
            </div>
            <p className="text-sm pt-3 font-medium">{data?.length} comments</p>
            <Separator className="bg-gray-400" />
            {data?.map((comment: any) => (
              <CommentBubble
                key={comment.id}
                comment={comment}
                currentUser={currentUser}
              />
            ))}
          </div>
        </ScrollArea>
        <div className="py-2 px-4 space-y-4 border-b border-black">
          <div className="flex flex-col gap-1">
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
                onClick={() => setIsCommentsClick(true)}
                className="hover:scale-110"
              >
                <MessageSquare size={22} />
              </button>
              <Share2 size={22} />
            </div>
            <span className="text-sm font-medium">{likes} Likes</span>
          </div>
          <p className="text-gray-400 text-sm">Posted 2 days ago</p>
        </div>
        <div>
          <div className="relative">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Write a comment"
              className="h-[52px] w-full focus: outline-none pl-4 pr-12 text-sm bg-white"
              disabled={isLoading}
            />
            <Button
              onClick={uploadComment}
              size="icon"
              className="absolute right-0 top-0 h-full px-3 py-2 rounded-none"
              disabled={isLoading}
            >
              <SendHorizonal />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostModalClient;

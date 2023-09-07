import { Like, Post, User } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface IUseLikes {
  post: Post & {
    likes: Like[];
  };
  currentUser: User & {
    likes: Like[];
  };
}

const useLike = ({ post, currentUser }: IUseLikes) => {
  const router = useRouter();
  const [likes, setLikes] = useState(post?.likes?.length);
  const isLiked = currentUser?.likes?.some((like) => like?.postId === post?.id);
  const [hasLike, setHasLike] = useState(isLiked);

  const toggleLike = async () => {
    if (!currentUser) {
      return router.push("/signin");
    }
    try {
      if (hasLike) {
        setLikes(likes - 1);
        setHasLike(false);
        await axios.delete(`/api/like/${post.id}`);
      } else {
        setLikes(likes + 1);
        setHasLike(true);
        await axios.post(`/api/like/${post.id}`);
      }
      router.refresh();
    } catch (error: any) {
      throw Error(error.message);
    }
  };

  return {
    hasLike,
    likes,
    toggleLike,
  };
};

export default useLike;

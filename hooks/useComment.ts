import { Comment } from "@prisma/client";
import useSWR from "swr";

export const useComment = (postId: string) => {
  const fetcher = (url: string) => fetch(url).then((r) => r.json());
  const { data, mutate, isLoading } = useSWR<Comment[]>(
    `/api/comment/${postId}`,
    fetcher
  );
  return {
    data,
    mutate,
    isLoading,
  };
};

import { getPosts } from "@/actions/getPost";
import SecondaryModal from "@/components/modal/SecondaryModal";
import React from "react";
import PostModalClient from "./client";
import getCurrentUser from "@/actions/getCurrentUser";

const PostModal = async ({ params }: { params: { postId: string } }) => {
  const currentUser = await getCurrentUser();
  const posts = await getPosts();

  const post = posts.find((post) => post.id === params.postId);

  return (
    <SecondaryModal>
      <PostModalClient post={post!} currentUser={currentUser!} />
    </SecondaryModal>
  );
};

export default PostModal;

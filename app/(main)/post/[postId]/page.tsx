import getCurrentUser from "@/actions/getCurrentUser";
import PostPageClient from "./client";
import { getPosts } from "@/actions/getPost";
import { redirect } from "next/navigation";

const PostPage = async ({ params }: { params: { postId: string } }) => {
  const currentUser = await getCurrentUser();
  const posts = await getPosts();

  const post = posts.find((post) => post.id === params.postId);

  if (!post) {
    return redirect("/not-found");
  }

  return <PostPageClient post={post!} currentUser={currentUser!} />;
};

export default PostPage;

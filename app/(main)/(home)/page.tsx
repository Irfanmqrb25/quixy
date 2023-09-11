import PostCard from "@/components/card/PostCard";
import FeaturedUser from "@/components/card/FeaturedUser";

import getCurrentUser from "../../../actions/getCurrentUser";
import { getPostsByFollowing } from "@/actions/getPost";

import { GoHome } from "react-icons/go";
import { getFeaturedUser } from "@/actions/getUser";

const HomePage = async () => {
  const currentUser = await getCurrentUser();
  const posts = await getPostsByFollowing();
  const featuredUser = await getFeaturedUser();

  if (!posts || posts.length === 0) {
    return (
      <div className="flex flex-col gap-4 mb-10">
        <div className="lg:mt-7 flex items-center gap-2 justify-center border border-black dark:border-muted-foreground rounded-md p-1">
          <GoHome className="w-7 h-7" />
          <h1 className="text-xl md:text-2xl font-medium">Home</h1>
        </div>
        <FeaturedUser user={featuredUser} currentUser={currentUser!} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 pb-[80px]">
      <div className="lg:mt-7 flex items-center gap- justify-center border border-black dark:border-muted-foreground rounded-md p-1">
        <GoHome className="w-7 h-7" />
        <h1 className="text-xl md:text-2xl font-medium">Home</h1>
      </div>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} currentUser={currentUser!} />
      ))}
    </div>
  );
};

export default HomePage;

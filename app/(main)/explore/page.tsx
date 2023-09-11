import { getPosts } from "@/actions/getPost";
import PostCardExplore from "@/components/card/PostCardExplore";
import SearchBar from "@/components/input/SearchBar";
import { Compass } from "lucide-react";
import React from "react";

const ExplorePage = async () => {
  const post = await getPosts();

  return (
    <div className="flex flex-col gap-4 pb-[80px]">
      <div className="lg:mt-7 flex items-center gap-2 justify-center border border-black dark:border-muted-foreground rounded-md p-1">
        <Compass className="w-7-h-7" strokeWidth={1.5} />
        <h1 className="text-xl md:text-2xl font-medium">Explore</h1>
      </div>
      <SearchBar />
      <div className="grid grid-cols-3 gap-1">
        {post.map((post) => (
          <PostCardExplore key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default ExplorePage;

import Link from "next/link";

import ProfilePageClient from "./Client";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import UserPostCard from "@/components/card/UserPostCard";

import getCurrentUser from "@/actions/getCurrentUser";
import { ImageIcon, Plus, UserCircle } from "lucide-react";

const ProfilePage = async () => {
  const currentUser = await getCurrentUser();

  return (
    <div className="flex flex-col gap-4">
      <div className="lg:mt-7 flex items-center gap-1 justify-center border rounded-md p-1">
        <UserCircle />
        <h1 className="text-xl md:text-2xl font-semibold">Profile</h1>
      </div>
      <Card>
        <ProfilePageClient currentUser={currentUser!} />
        <CardContent className="pt-6">
          {currentUser?.description ? (
            <p>{currentUser?.description}</p>
          ) : (
            <Link
              href="/settings"
              className="flex items-center text-sm gap-1 hover:text-muted-foreground"
            >
              <Plus size={18} />
              Add description
            </Link>
          )}
        </CardContent>
      </Card>
      <Separator />
      {currentUser?.posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 mt-10">
          <ImageIcon
            strokeWidth={1}
            className="w-28 h-28 text-muted-foreground"
          />
          <p className="text-xl font-semibold text-muted-foreground">
            No posts yet
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 xl:grid-cols-3 gap-2">
          {currentUser?.posts.map((post) => (
            <UserPostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfilePage;

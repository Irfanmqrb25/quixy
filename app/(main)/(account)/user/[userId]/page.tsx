import { redirect } from "next/navigation";

import UserClientPage from "./client";
import { Separator } from "@/components/ui/separator";
import UserPostCard from "@/components/card/UserPostCard";

import { ImageIcon, UserCircle } from "lucide-react";

import { getUserById } from "@/actions/getUser";
import getCurrentUser from "@/actions/getCurrentUser";

const UserPage = async ({ params }: { params: { userId: string } }) => {
  const currentUser = await getCurrentUser();
  const user = await getUserById(params.userId);

  if (user?.id === currentUser?.id) redirect("/profile");

  return (
    <div className="flex flex-col gap-4">
      <div className="lg:mt-7 flex items-center gap-1 justify-center border rounded-md p-1">
        <UserCircle />
        <h1 className="text-xl md:text-2xl font-semibold">User</h1>
      </div>
      <div className="w-full">
        <UserClientPage currentUser={currentUser!} user={user!} />
      </div>
      <Separator />
      {user?.posts.length === 0 ? (
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
          {user?.posts.map((post) => (
            <UserPostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
};

export default UserPage;

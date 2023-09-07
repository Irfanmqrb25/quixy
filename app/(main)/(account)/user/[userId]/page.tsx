import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { UserCircle } from "lucide-react";
import UserPostCard from "@/components/card/UserPostCard";
import { getUserById } from "@/actions/getUser";
import UserClientPage from "./client";
import getCurrentUser from "@/actions/getCurrentUser";
import { redirect } from "next/navigation";

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
      <div className="grid grid-cols-2 xl:grid-cols-3 gap-2">
        {user?.posts.map((post) => (
          <UserPostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default UserPage;

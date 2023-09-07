import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import getCurrentUser from "@/actions/getCurrentUser";
import {
  Pencil,
  Plus,
  Settings,
  User,
  UserCircle,
  UserCog2,
} from "lucide-react";
import UserPostCard from "@/components/card/UserPostCard";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

const ProfilePage = async () => {
  const currentUser = await getCurrentUser();

  return (
    <div className="flex flex-col gap-4">
      <div className="lg:mt-7 flex items-center gap-1 justify-center border rounded-md p-1">
        <UserCircle />
        <h1 className="text-xl md:text-2xl font-semibold">Profile</h1>
      </div>
      <Card>
        <CardHeader className="border-b">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage
                    alt={currentUser?.username || (currentUser?.name as string)}
                    src={currentUser?.image || "/assets/default-user.jpg"}
                  />
                </Avatar>
                <span className="text-xl font-medium">
                  {currentUser?.username || currentUser?.name}
                </span>
              </div>
              <Link
                href="/settings"
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                  "text-xs flex items-center gap-1"
                )}
              >
                <Pencil size={18} className="md:hidden" />
                <span className="hidden md:block">Edit Profile</span>
              </Link>
            </div>
            <div className="flex pl-20 items-center justify-between">
              <div className="flex flex-col items-center">
                <p className="text-sm font-medium">
                  {currentUser?.followers.length}
                </p>
                <p className="text-xs">Followers</p>
              </div>
              <div className="flex flex-col items-center">
                <p className="text-sm font-medium">
                  {currentUser?.following.length}
                </p>
                <p className="text-xs">Following</p>
              </div>
              <div className="flex flex-col items-center">
                <p className="text-sm font-medium">
                  {currentUser?.posts.length}
                </p>
                <p className="text-xs">Posts</p>
              </div>
            </div>
          </div>
        </CardHeader>
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
      <div className="grid grid-cols-2 xl:grid-cols-3 gap-2">
        {currentUser?.posts.map((post) => (
          <UserPostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default ProfilePage;

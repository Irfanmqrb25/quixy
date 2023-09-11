"use client";

import Link from "next/link";
import { useCallback, useState } from "react";

import { CardHeader } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import FollProfileModal from "@/components/modal/FollProfileModal";

import { Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import { FullUserType } from "@/types";

interface ProfilePageClientProps {
  currentUser: FullUserType;
}

const ProfilePageClient: React.FC<ProfilePageClientProps> = ({
  currentUser,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");

  const handleFollowersModal = useCallback(() => {
    setTitle("Followers");
    setIsOpen(true);
  }, []);

  const handleFollowingModal = useCallback(() => {
    setTitle("Following");
    setIsOpen(true);
  }, []);

  return (
    <>
      <FollProfileModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={title}
        user={currentUser}
      />
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
            <div
              className="flex flex-col items-center cursor-pointer"
              onClick={handleFollowersModal}
            >
              <p className="text-sm font-medium">
                {currentUser?.followers.length}
              </p>
              <p className="text-xs">Followers</p>
            </div>
            <div
              className="flex flex-col items-center cursor-pointer"
              onClick={handleFollowingModal}
            >
              <p className="text-sm font-medium">
                {currentUser?.following.length}
              </p>
              <p className="text-xs">Following</p>
            </div>
            <div className="flex flex-col items-center">
              <p className="text-sm font-medium">{currentUser?.posts.length}</p>
              <p className="text-xs">Posts</p>
            </div>
          </div>
        </div>
      </CardHeader>
    </>
  );
};

export default ProfilePageClient;

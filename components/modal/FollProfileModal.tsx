"use client";

import { useRouter } from "next/navigation";

import { Button } from "../ui/button";
import AvatarWithStatus from "../Avatar";
import { Dialog, DialogTitle, DialogContent, DialogHeader } from "../ui/dialog";

import axios from "axios";
import toast from "react-hot-toast";
import { FullUserType } from "@/types";

interface FollProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  user: FullUserType;
}

const FollProfileModal: React.FC<FollProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  title,
}) => {
  const router = useRouter();

  const followed = user.following.some((follower) =>
    follower.followerId === user.id ? true : false
  );

  const handleUnfollow = async (followingId: string) => {
    try {
      await axios.delete("/api/user/follow", {
        data: {
          follower: user.id,
          following: followingId,
        },
      });
      toast.success("Unfollowed");
      router.refresh();
    } catch (error: any) {
      toast.error("Something went wrong");
      console.log(error.message);
    }
  };

  const handleRemoveFromFollowers = async (followerId: string) => {
    try {
      await axios.delete("/api/user/follow", {
        data: {
          follower: followerId,
          following: user.id,
        },
      });
      toast.success("Removed");
      router.refresh();
    } catch (error: any) {
      toast.error("Something went wrong");
      console.log(error.message);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full h-full md:h-fit flex flex-col">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-center">{title}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-2 items-start justify-start h-full md:min-h-[300px] md:max-h-[400px] overflow-y-auto message-body-scroll">
          {title === "Followers" &&
            user.followers.map((follower) => (
              <div
                key={follower.id}
                className="w-full h-full flex flex-col gap-1 px-2"
              >
                <div className="flex items-center justify-start gap-1">
                  <AvatarWithStatus
                    data={follower.follower}
                    className="w-8 h-8"
                  />
                  <div className="flex items-center justify-between w-full pl-2">
                    <p className="text-sm">
                      {follower.follower.username || follower.follower.name}
                    </p>
                    <Button
                      className="h-7 text-xs rounded-sm bg-blue-500 hover:bg-blue-400 text-white"
                      onClick={() =>
                        handleRemoveFromFollowers(follower.follower.id)
                      }
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          {title === "Following" &&
            user.following.map((following) => (
              <div
                key={following.id}
                className="w-full flex flex-col gap-1 px-2"
              >
                <div className="flex items-center justify-start gap-1">
                  <AvatarWithStatus
                    data={following.following}
                    className="w-8 h-8"
                  />
                  <div className="flex items-center justify-between w-full pl-2">
                    <p className="text-sm">
                      {following.following.username || following.following.name}
                    </p>
                    <Button
                      className="h-7 text-xs rounded-sm"
                      variant={followed ? "outline" : "default"}
                      onClick={() => handleUnfollow(following.following.id)}
                    >
                      {followed ? "Following" : "Follow"}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FollProfileModal;

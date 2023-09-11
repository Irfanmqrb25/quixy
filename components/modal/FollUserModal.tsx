"use client";

import { useRouter } from "next/navigation";

import { Button } from "../ui/button";
import AvatarWithStatus from "../Avatar";
import { Dialog, DialogTitle, DialogContent, DialogHeader } from "../ui/dialog";

import { cn } from "@/lib/utils";
import { FullUserType } from "@/types";

import axios from "axios";
import toast from "react-hot-toast";

interface FollUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  user: FullUserType;
  userLoggedIn: FullUserType;
}

const FollUserModal: React.FC<FollUserModalProps> = ({
  isOpen,
  onClose,
  user,
  title,
  userLoggedIn,
}) => {
  const router = useRouter();

  const isOwn = user.following.find(
    (following) => following.following.id === userLoggedIn.id
  );

  const handleFollow = async (followingId: string) => {
    try {
      await axios.post("/api/user/follow", {
        follower: userLoggedIn.id,
        following: followingId,
      });
      toast.success("Followed");
      router.refresh();
    } catch (error: any) {
      toast.error("Something went wrong");
      console.log(error.message);
    }
  };

  const handleUnfollow = async (followingId: string) => {
    try {
      await axios.delete("/api/user/follow", {
        data: {
          follower: userLoggedIn.id,
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
                      className={cn(
                        "h-7 text-xs rounded-sm min-w-[100px]",
                        follower.follower.id === isOwn?.followingId && "hidden"
                      )}
                      variant={
                        userLoggedIn.following.some(
                          (UserloggedInfollowing) =>
                            UserloggedInfollowing.following.id ===
                            follower.follower.id
                        )
                          ? "outline"
                          : "default"
                      }
                      onClick={() => {
                        if (
                          userLoggedIn.following.some(
                            (UserloggedInfollowing) =>
                              UserloggedInfollowing.following.id ===
                              follower.follower.id
                          )
                        ) {
                          handleUnfollow(follower.follower.id);
                        } else {
                          handleFollow(follower.follower.id);
                        }
                      }}
                    >
                      {userLoggedIn.following.some(
                        (UserloggedInfollowing) =>
                          UserloggedInfollowing.following.id ===
                          follower.follower.id
                      )
                        ? "Following"
                        : "Follow"}
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
                      className={cn(
                        "h-7 text-xs rounded-sm min-w-[100px]",
                        following.following.id === isOwn?.followingId &&
                          "hidden"
                      )}
                      variant={
                        userLoggedIn.following.some(
                          (UserloggedInfollowing) =>
                            UserloggedInfollowing.following.id ===
                            following.following.id
                        )
                          ? "outline"
                          : "default"
                      }
                      onClick={() => {
                        if (
                          userLoggedIn.following.some(
                            (UserloggedInfollowing) =>
                              UserloggedInfollowing.following.id ===
                              following.following.id
                          )
                        ) {
                          handleUnfollow(following.following.id);
                        } else {
                          handleFollow(following.following.id);
                        }
                      }}
                    >
                      {userLoggedIn.following.some(
                        (UserloggedInfollowing) =>
                          UserloggedInfollowing.following.id ===
                          following.following.id
                      )
                        ? "Following"
                        : "Follow"}
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

export default FollUserModal;

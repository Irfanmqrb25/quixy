"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { UserCheck2, UserPlus2 } from "lucide-react";
import axios from "axios";
import { Follow, User } from "@prisma/client";
import toast from "react-hot-toast";

interface UserClientPageProps {
  currentUser: User;
  user: User & {
    followers: Follow[];
    following: Follow[];
  };
}

const UserClientPage: React.FC<UserClientPageProps> = ({
  currentUser,
  user,
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const followed = user.followers.some((follower) =>
    follower.followerId === currentUser.id ? true : false
  );

  const [isFollowed, setIsFollowed] = useState(followed);
  const [followers, setFollowers] = useState(user?.followers?.length);

  const HandleFollow = async () => {
    setIsFollowed(true);
    setFollowers(followers + 1);
    try {
      await axios.post("/api/user/follow", {
        follower: currentUser.id,
        following: user.id,
      });
      toast.success("Followed");
      router.refresh();
    } catch (error: any) {
      toast.error("Something went wrong");
      console.log(error.message);
    }
  };

  const handleUnfollow = async () => {
    setIsFollowed(false);
    if (followers > 0) {
      setFollowers(followers - 1);
    }
    try {
      await axios.delete("/api/user/follow", {
        data: {
          follower: currentUser.id,
          following: user.id,
        },
      });
      toast.success("Unfollowed");
      router.refresh();
    } catch (error: any) {
      toast.error("Something went wrong");
      console.log(error.message);
    }
  };

  const handleClick = useCallback(() => {
    setLoading(false);
    axios
      .post("/api/conversations", {
        userId: user.id,
      })
      .then((data) => {
        router.push(`/message/${data.data.id}`);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [router, user]);

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16">
              <AvatarImage
                alt={user?.username! || user?.name!}
                src={user?.image || "/assets/default-user.jpg"}
              />
            </Avatar>
            <span className="text-xl font-medium">
              {user?.username || user?.name}
            </span>
          </div>
          <div className="flex flex-col gap-7">
            <div className="flex pl-20 items-center justify-between">
              <div className="flex flex-col items-center">
                <p className="text-sm font-medium">{followers}</p>
                <p className="text-xs">Followers</p>
              </div>
              <div className="flex flex-col items-center">
                <p className="text-sm font-medium">{user.following.length}</p>
                <p className="text-xs">Following</p>
              </div>
              <div className="flex flex-col items-center">
                <p className="text-sm font-medium">1</p>
                <p className="text-xs">Posts</p>
              </div>
            </div>
            <p className="text-sm">
              {user?.description ? user.description : ""}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardFooter className="w-full gap-2">
        <Button
          size="sm"
          variant={isFollowed ? "outline" : "default"}
          className="flex gap-1 text-xs items-center w-full"
          onClick={isFollowed ? handleUnfollow : HandleFollow}
        >
          {isFollowed ? <UserCheck2 size={18} /> : <UserPlus2 size={18} />}
          <span className="hidden md:block">
            {isFollowed ? "Following" : "Follow"}
          </span>
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="w-full text-xs"
          onClick={handleClick}
        >
          Send message
        </Button>
      </CardFooter>
    </Card>
  );
};

export default UserClientPage;

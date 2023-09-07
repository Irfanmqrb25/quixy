"use client";

import { useState } from "react";

import { Button } from "../ui/button";
import { Avatar, AvatarImage } from "../ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

import { UserCheck2, UserPlus, XIcon } from "lucide-react";
import { Follow, User } from "@prisma/client";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface FeaturedUserProps {
  user: User[];
  currentUser: User & {
    following: Follow[];
  };
}

const FeaturedUser: React.FC<FeaturedUserProps> = ({ user, currentUser }) => {
  const [open, setOpen] = useState(true);

  return (
    <>
      {open && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Featured User</CardTitle>
              <button onClick={() => setOpen(false)}>
                <XIcon className="w-5 h-5" />
              </button>
            </div>
            <CardDescription>
              Follow some people to see their posts
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            {user.map((user) => (
              <FeaturedUserItem
                key={user.id}
                user={user}
                currentUser={currentUser}
              />
            ))}
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default FeaturedUser;

interface FeaturedUserItemProps {
  user: User;
  currentUser: User & {
    following: Follow[];
  };
}

const FeaturedUserItem: React.FC<FeaturedUserItemProps> = ({
  user,
  currentUser,
}) => {
  const router = useRouter();

  const isFollowed = currentUser.following.some(
    (follow) => follow.followingId === user.id
  );

  const [followed, setIsFollowed] = useState(isFollowed);

  const HandleFollow = async () => {
    setIsFollowed(true);
    try {
      await axios.post("/api/user/follow", {
        follower: currentUser.id,
        following: user.id,
      });
      toast.success(`Followed ${user.username || user.name}`);
      router.refresh();
    } catch (error: any) {
      toast.error("Something went wrong");
      console.log(error.message);
    }
  };

  const handleUnfollow = async () => {
    setIsFollowed(false);
    try {
      await axios.delete("/api/user/follow", {
        data: {
          follower: currentUser.id,
          following: user.id,
        },
      });
      toast.success(`Unfollowed ${user.username || user.name}`);
      router.refresh();
    } catch (error: any) {
      toast.error("Something went wrong");
      console.log(error.message);
    }
  };

  return (
    <div className="flex items-center justify-between" key={user.id}>
      <Link href={`/user/${user.id}`}>
        <div className="flex items-center gap-2">
          <Avatar className="w-7 h-7">
            <AvatarImage src={user.image ?? "/assets/default-user.jpg"} />
          </Avatar>
          <span>{user.username || user.name}</span>
        </div>
      </Link>
      <Button
        variant={followed ? "outline" : "default"}
        className="flex items-center gap-1 text-sm h-7 px-2"
        onClick={followed ? handleUnfollow : HandleFollow}
      >
        {followed ? <UserCheck2 size={15} /> : <UserPlus size={15} />}
        {followed ? "following" : "Follow"}
      </Button>
    </div>
  );
};

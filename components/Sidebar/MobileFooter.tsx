"use client";
import { Bell, Compass, Home, Search, Upload } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Avatar, AvatarImage } from "../ui/avatar";
import { User } from "@prisma/client";
import { cn } from "@/lib/utils";
import useConversation from "@/hooks/useConversation";

interface MobileFooterProps {
  user: User;
}

const MobileFooter: React.FC<MobileFooterProps> = ({ user }) => {
  const { conversationId } = useConversation();
  return (
    <div
      className={cn(
        "fixed bottom-0 z-40 flex items-center justify-between w-full bg-white dark:bg-black border-t lg:hidden",
        conversationId && "hidden"
      )}
    >
      <footer className="flex w-full items-center justify-between p-4 px-6 md:px-10">
        <Link href="/">
          <Home />
        </Link>
        <Link href="/explore">
          <Compass />
        </Link>
        <Link href="/notifications">
          <Bell />
        </Link>
        {user ? (
          <Link href="/profile">
            <Avatar className="w-7 h-7">
              <AvatarImage src={user?.image || "/assets/default-user.jpg"} />
            </Avatar>
          </Link>
        ) : (
          <Link href="/signin">
            <Avatar className="w-7 h-7">
              <AvatarImage src={"/assets/default-user.jpg"} />
            </Avatar>
          </Link>
        )}
      </footer>
    </div>
  );
};

export default MobileFooter;

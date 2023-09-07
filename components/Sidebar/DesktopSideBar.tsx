"use client";

import Link from "next/link";
import { useCallback } from "react";

import { Avatar, AvatarImage } from "../ui/avatar";
import ThemeToggle from "../button/ThemeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

import { GoHome } from "react-icons/go";
import {
  Bell,
  Compass,
  LogOut,
  MessageCircle,
  Settings,
  Upload,
  User as UserIcon,
  Zap,
} from "lucide-react";

import usePostUploadModal from "@/hooks/usePostUploadModal";
import { User } from "@prisma/client";
import { signOut } from "next-auth/react";
import AvatarWithStatus from "../Avatar";

interface DesktopSideBarProps {
  user: User;
}

const DesktopSideBar: React.FC<DesktopSideBarProps> = ({ user }) => {
  const postUploadModal = usePostUploadModal();

  const onPostUploadModal = useCallback(() => {
    postUploadModal.onOpen();
  }, [postUploadModal]);

  return (
    <div className="hidden lg:fixed lg:inset-0 lg:left-0 lg:z-40 lg:w-80 lg:px-10 lg:overflow-y-auto lg:bg-white dark:bg-dark lg:border-r-[1px] lg:py-7 lg:flex lg:flex-col justify-between">
      <div className="flex flex-col gap-7">
        <div className="mb-8 pl-2">
          <Link
            href="/"
            className="text-2xl font-semibold flex items-center gap-2"
          >
            <span className="p-2 border bg-black dark:bg-white text-white dark:text-black border-black dark:border-muted-foreground rounded">
              <Zap size={25} />
            </span>
            Quixy
          </Link>
        </div>
        <Link
          href="/"
          className="flex items-center gap-4 hover:bg-gray-400/30 p-2 rounded-sm group transition ease-in-out duration-300"
        >
          <GoHome className="w-6 h-6 group-hover:scale-105" />
          <span>Home</span>
        </Link>
        <Link
          href="/message/inbox"
          className="flex items-center gap-4 hover:bg-gray-400/30 p-2 rounded-sm group transition ease-in-out duration-300"
        >
          <MessageCircle
            strokeWidth={1.5}
            className="w-6 h-6 group-hover:scale-105"
          />
          <span>Message</span>
        </Link>
        <Link
          href="/explore"
          className="flex items-center gap-4 hover:bg-gray-400/30 p-2 rounded-sm group transition ease-in-out duration-300"
        >
          <Compass
            strokeWidth={1.5}
            className="w-6 h-6 group-hover:scale-105"
          />
          <span>Explore</span>
        </Link>
        <Link
          href="/notifications"
          className="flex items-center gap-4 hover:bg-gray-400/30 p-2 rounded-sm group transition ease-in-out duration-300"
        >
          <Bell strokeWidth={1.5} className="w-6 h-6 group-hover:scale-105" />
          <span>Notification</span>
        </Link>
        <button
          onClick={onPostUploadModal}
          className="flex items-center gap-4 hover:bg-gray-400/30 p-2 rounded-sm group transition ease-in-out duration-300"
        >
          <Upload strokeWidth={1.5} className="w-6 h-6 group-hover:scale-105" />
          <span>Upload</span>
        </button>
      </div>
      <div className="ml-2">
        <DropdownMenu>
          <DropdownMenuTrigger className="outline-none">
            <div className="flex items-center gap-2">
              <AvatarWithStatus data={user} className="w-7 h-7" />
              <span className="font-medium">
                {user?.username || user?.name}
              </span>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className=" mb-2 w-40">
            <DropdownMenuItem>
              <Link href="/profile" className="flex items-center gap-2">
                <UserIcon className="h-4 w-4" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>
            <ThemeToggle />
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => signOut()}
            >
              <LogOut className="h-4 w-4 mr-2" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default DesktopSideBar;

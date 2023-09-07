"use client";
import { MessageCircle, Upload, Zap } from "lucide-react";
import Link from "next/link";
import React, { useCallback } from "react";
import { ToggleTheme } from "../button/ToggleTheme";
import { cn } from "@/lib/utils";
import { buttonVariants } from "../ui/button";
import usePostUploadModal from "@/hooks/usePostUploadModal";
import useConversation from "@/hooks/useConversation";

const MobileNav: React.FC = () => {
  const postUploadModal = usePostUploadModal();
  const { conversationId } = useConversation();

  const onPostUploadModal = useCallback(() => {
    postUploadModal.onOpen();
  }, [postUploadModal]);

  return (
    <div
      className={cn(
        "fixed p-4 md:px-10 top-0 z-40 flex items-center w-full bg-white dark:bg-black justify-between border-b lg:hidden",
        conversationId && "hidden"
      )}
    >
      <div>
        <Link
          href="/"
          className="text-lg font-semibold flex items-center gap-2"
        >
          <span className="p-2 border bg-black dark:bg-white text-white dark:text-black border-black dark:border-muted-foreground rounded">
            <Zap size={22} />
          </span>
          Quixy
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <ToggleTheme />
        <button
          onClick={onPostUploadModal}
          type="button"
          className={cn(buttonVariants({ size: "icon", variant: "outline" }))}
        >
          <Upload size={22} strokeWidth={1.5} />
          <span className="sr-only">Upload</span>
        </button>
        <Link
          href="/message/inbox"
          className={cn(buttonVariants({ size: "icon", variant: "outline" }))}
        >
          <MessageCircle size={22} strokeWidth={1.5} />
          <span className="sr-only">Chat</span>
        </Link>
      </div>
    </div>
  );
};

export default MobileNav;

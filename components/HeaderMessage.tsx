"use client";

import { Conversation, User } from "@prisma/client";
import { Avatar, AvatarImage } from "./ui/avatar";
import { ArrowLeft, Info } from "lucide-react";
import useOtherUser from "@/hooks/useOtherUser";
import { useCallback, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "./ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import axios from "axios";
import useConversation from "@/hooks/useConversation";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import useActiveList from "@/hooks/useActiveList";
import AvatarWithStatus from "./Avatar";

interface HeaderMessageProps {
  conversation: Conversation & {
    users: User[];
  };
}

const HeaderMessage: React.FC<HeaderMessageProps> = ({ conversation }) => {
  const router = useRouter();
  const otherUser = useOtherUser(conversation);
  const { conversationId } = useConversation();
  const [open, setOpen] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [isLoading, setIsloading] = useState(false);

  const { members } = useActiveList();
  const isActive = members.indexOf(otherUser?.email!) !== -1;

  const statusText = useMemo(() => {
    if (conversation.isGroup) {
      return `${conversation.users.length} members`;
    }
    return isActive ? "Online" : "Offline";
  }, [conversation, isActive]);

  const onDelete = useCallback(() => {
    setIsloading(true);

    axios
      .delete(`/api/conversations/${conversationId}`)
      .then(() => {
        setOpenAlert(false);
        setOpen(false);
        router.push("/message/inbox");
        router.refresh();
      })
      .catch(() => toast.error("Something went wrong"))
      .finally(() => setIsloading(false));
  }, [conversationId, router]);

  return (
    <div className="lg:mt-7 flex items-center gap-2 justify-between border-2 border-black dark:border-muted-foreground rounded-md py-2 px-3">
      <div className="flex items-center gap-2">
        <button onClick={() => router.push("/message/inbox")}>
          <ArrowLeft size={22} />
        </button>
        <Link
          href={`/user/${otherUser.id}`}
          className="flex items-center gap-2"
        >
          {conversation.isGroup ? (
            <div>grup</div>
          ) : (
            <AvatarWithStatus data={otherUser} className="w-7 h-7" />
          )}
          <h1>{conversation.name || otherUser.username || otherUser.name}</h1>
        </Link>
      </div>
      <button type="button" onClick={() => setOpen(true)}>
        <Info size={25} />
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="px-0">
          <DialogHeader className="px-7">
            <DialogTitle>Detail</DialogTitle>
          </DialogHeader>
          <Separator />
          <p className="px-7 text-lg font-medium">
            {conversation.isGroup ? "Users" : "User"}
          </p>
          {conversation.isGroup &&
            conversation.users.map((user) => (
              <div key={user.id} className="flex items-center gap-2 px-7">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={"/assets/default-user.jpg"} />
                </Avatar>
                <p>{user.username || user.name}</p>
              </div>
            ))}
          {!conversation.isGroup && (
            <div className="flex items-center justify-between px-7">
              <div className="flex items-center gap-2">
                <AvatarWithStatus data={otherUser} className="w-7 h-7" />
                <p>{otherUser.username || otherUser.name}</p>
              </div>
              <span>{statusText}</span>
            </div>
          )}
          <div className="px-7 mt-40">
            <Button variant="destructive" onClick={() => setOpenAlert(true)}>
              Delete message
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <AlertDialog open={openAlert} onOpenChange={setOpenAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This message will be permanently deleted
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={onDelete}
              className="bg-red-500 hover:bg-red-400 text-white"
              disabled={isLoading}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default HeaderMessage;

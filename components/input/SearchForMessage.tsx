"use client";

import { Button } from "../ui/button";
import { useCallback, useEffect, useState } from "react";
import { Search } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/hooks/useDebounce";
import { User } from "@prisma/client";
import axios from "axios";
import { Skeleton } from "../ui/skeleton";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import AvatarWithStatus from "../Avatar";

const SearchForMessage = () => {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [data, setData] = useState<User[] | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmedHasNoResults, setConfirmedHasNoResults] = useState(false);
  const debouncedQuery = useDebounce(query, 300);

  const searchUser = async (query: string) => {
    setIsLoading(true);
    try {
      const response = await axios.get(`/api/user?q=${query}`);
      setData(response.data);
    } catch (error: any) {
      throw new Error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClick = useCallback(
    (userId: string) => {
      setIsLoading(false);
      axios
        .post("/api/conversations", {
          userId: userId,
        })
        .then((data) => {
          router.push(`/message/${data.data.id}`);
        })
        .finally(() => {
          setIsLoading(false);
        });
    },
    [router]
  );

  useEffect(() => {
    if (debouncedQuery.length === 0) setData(null);

    if (debouncedQuery.length > 0) {
      searchUser(debouncedQuery);
    }
  }, [debouncedQuery]);

  useEffect(() => {
    if (!isOpen) {
      setQuery("");
    }
  }, [isOpen]);

  return (
    <>
      <Button className="relative " onClick={() => setIsOpen(true)}>
        <Search className="h-4 w-4 mr-2" aria-hidden="true" />
        <span className="inline-flex">New Message...</span>
        <span className="sr-only">Search user</span>
      </Button>
      <Dialog
        open={isOpen}
        onOpenChange={(isOpen) => {
          setIsOpen(isOpen);
        }}
      >
        <DialogContent className="w-full h-full md:h-fit flex flex-col">
          <DialogHeader className="">
            <DialogTitle className="text-center">New Message</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-1">
            <p className="text-xs font-medium">Send a message to:</p>
            <Input
              className="placeholder:text-xs text-xs"
              placeholder="Search..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2 items-start justify-start h-full md:min-h-[200px] md:max-h-[350px] overflow-y-auto message-body-scroll">
            {isLoading && <Skeleton className="w-full h-10" />}
            {!data?.length &&
              query !== "" &&
              !isLoading &&
              data?.length === 0 && (
                <p className="text-center font-medium text-sm w-full">
                  User not found.
                </p>
              )}
            {data?.map((user) => (
              <div key={user.id} className="w-full bg-secondary p-2 rounded-md">
                <div className="flex items-center justify-start gap-2">
                  <AvatarWithStatus data={user} className="w-7 h-7" />
                  <div className="flex items-center justify-between w-full">
                    <p className="text-sm">{user.username || user.name}</p>
                    <Button
                      className="h-7 text-xs rounded-sm bg-blue-500 hover:bg-blue-400 text-white"
                      onClick={() => handleClick(user.id)}
                    >
                      Chat
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SearchForMessage;

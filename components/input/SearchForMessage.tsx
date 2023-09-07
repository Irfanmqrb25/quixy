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

const SearchForMessage = () => {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [data, setData] = useState<User[] | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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

  const handleSelect = useCallback((callback: () => unknown) => {
    setIsOpen(false);
    callback();
  }, []);

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
        <span className="inline-flex">Search user...</span>
        <span className="sr-only">Search user</span>
      </Button>
      <CommandDialog position="top" open={isOpen} onOpenChange={setIsOpen}>
        <CommandInput
          placeholder="Search user..."
          value={query}
          onValueChange={setQuery}
        />
        {isLoading ? (
          <div className="space-y-1 overflow-hidden px-1 py-2">
            <Skeleton className="h-4 w-10 rounded" />
            <Skeleton className="h-8 rounded-sm" />
            <Skeleton className="h-8 rounded-sm" />
            <Skeleton className="h-8 rounded-sm" />
            <Skeleton className="h-8 rounded-sm" />
            <Skeleton className="h-8 rounded-sm" />
          </div>
        ) : (
          <CommandGroup
            heading={
              data?.length ? `Search result for "${query}"` : "Search result"
            }
          >
            {data?.map((user) => (
              <CommandItem
                key={user.id}
                onSelect={() =>
                  handleSelect(() => router.push(`/user/${user.id}`))
                }
              >
                {user.username || user.name}
              </CommandItem>
            ))}
          </CommandGroup>
        )}
        <CommandList>
          <CommandEmpty
            className={cn(isLoading ? "hidden" : "py-6 text-center text-sm")}
          >
            user not found
          </CommandEmpty>
        </CommandList>
      </CommandDialog>
    </>
  );
};

export default SearchForMessage;

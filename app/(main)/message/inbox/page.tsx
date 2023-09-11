import { getConversations } from "@/actions/getConversation";
import ChatList from "@/components/ChatList";
import SearchForMessage from "@/components/input/SearchForMessage";
import { Mail, MessageCircle } from "lucide-react";
import { AiOutlineUsergroupAdd } from "react-icons/ai";

const ChatInboxPage = async () => {
  const chatList = await getConversations();

  return (
    <div className="flex flex-col gap-4">
      <div className="lg:mt-7 flex items-center gap-2 justify-center border border-black dark:border-muted-foreground rounded-md p-1">
        <MessageCircle className="w-7 h-7" strokeWidth={1.5} />
        <h1 className="text-xl md:text-2xl font-medium">Message</h1>
      </div>
      <div className="flex items-center justify-between">
        <p className="md:text-lg">Messages</p>
        <AiOutlineUsergroupAdd size={22} />
      </div>
      <SearchForMessage />
      {!chatList || chatList.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 mt-10">
          <Mail strokeWidth={1} className="w-28 h-28 text-muted-foreground" />
          <p className="text-xl font-semibold text-muted-foreground">
            No message
          </p>
        </div>
      ) : (
        <ChatList initialItems={chatList} />
      )}
    </div>
  );
};

export default ChatInboxPage;

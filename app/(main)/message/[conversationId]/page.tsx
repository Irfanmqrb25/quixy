import { getConversationById } from "@/actions/getConversation";
import getMessages from "@/actions/getMessage";
import BodyMessage from "@/components/BodyMessage";
import HeaderMessage from "@/components/HeaderMessage";
import InputMessage from "@/components/input/InputMessage";
import { Conversation, User } from "@prisma/client";

interface IParams {
  conversationId: string;
}

const ChatPage = async ({ params }: { params: IParams }) => {
  const conversation = await getConversationById(params.conversationId);
  const message = await getMessages(params.conversationId);

  return (
    <div className="h-full">
      <div className="flex flex-col h-full">
        <HeaderMessage conversation={conversation as any} />
        <BodyMessage initialMessages={message} />
        <InputMessage />
      </div>
    </div>
  );
};

export default ChatPage;

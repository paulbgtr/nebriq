import { use } from "react";
import ChatModule from "@/modules/chat";

export default function ChatPage({
  params,
}: {
  params: Promise<{ chatId: string }>;
}) {
  const { chatId } = use(params);

  return <ChatModule chatId={chatId} />;
}

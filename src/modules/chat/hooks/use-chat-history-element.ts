import { useQuery } from "@tanstack/react-query";
import { getMessagesForChat } from "@/app/actions/supabase/chat";
import { chatHistoryElementSchema } from "@/shared/lib/schemas/chat-history";
import { z } from "zod";

type ChatHistoryElement = z.infer<typeof chatHistoryElementSchema>;

export const useChatHistoryElement = (chatId: string) => {
  return useQuery<ChatHistoryElement>({
    queryKey: ["chat-history-element", chatId],
    queryFn: async () => await getMessagesForChat(chatId),
    enabled: !!chatId,
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: false,
  });
};

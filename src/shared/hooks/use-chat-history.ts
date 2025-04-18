import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createChat,
  deleteChat,
  getMessagesForChat,
  getUserChats,
} from "@/app/actions/supabase/chat";
import {
  chatSchema,
  chatHistoryElementSchema,
} from "@/shared/lib/schemas/chat-history";
import { z } from "zod";
import { useUser } from "./use-user";
import queryClient from "../lib/react-query";

type Chat = z.infer<typeof chatSchema>;
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

export const useChatHistory = () => {
  const { user } = useUser();

  const { data: chats, isLoading } = useChats(user?.id);

  const { mutateAsync: createChat, isPending: isCreatingChat } = useCreateChat(
    user?.id
  );
  const { mutate: deleteChat, isPending: isDeletingChat } = useDeleteChat();

  return {
    chats,
    isLoading,
    createChat,
    deleteChat,
    isCreatingChat,
    isDeletingChat,
  };
};

const useChats = (userId: string | undefined) => {
  return useQuery<Chat[]>({
    queryKey: ["chats", userId],
    queryFn: async () => {
      if (!userId) throw new Error("User not found");

      return getUserChats(userId);
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: false,
  });
};

const useCreateChat = (userId: string | undefined) => {
  return useMutation<Chat, Error, string>({
    mutationFn: async (title: string) => {
      if (!userId) throw new Error("User not found for creating chat");

      return createChat(userId, title);
    },
    onSuccess: (newChat) => {
      queryClient.invalidateQueries({ queryKey: ["chats", userId] });
      queryClient.setQueryData(["chat-history-element", newChat.id], {
        messages: [],
      });
    },
  });
};

const useDeleteChat = () => {
  return useMutation({
    mutationFn: async (chatId: string) => deleteChat(chatId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chats"] });
    },
  });
};

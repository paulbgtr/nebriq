import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createChat,
  deleteChat,
  getUserChats,
} from "@/app/actions/supabase/chat";
import { chatSchema } from "@/shared/lib/schemas/chat-history";
import { z } from "zod";
import { useUser } from "../data/use-user";
import queryClient from "../../lib/react-query";

type Chat = z.infer<typeof chatSchema>;

export const useChatHistory = () => {
  const { user } = useUser();

  const { data: chats, isLoading } = useChats(user?.id);

  const { mutateAsync: createChat, isPending: isCreatingChat } = useCreateChat(
    user?.id
  );
  const { mutate: deleteChat, isPending: isDeletingChat } = useDeleteChat(
    user?.id
  );

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

const useDeleteChat = (userId: string | undefined) => {
  return useMutation({
    mutationFn: async (chatId: string) => deleteChat(chatId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chats", userId] });
    },
  });
};

"use server";

import { createClient } from "@/shared/lib/supabase/server";
import {
  chatHistoryElementSchema,
  chatSchema,
} from "@/shared/lib/schemas/chat-history";
import { z } from "zod";

type ChatHistoryElement = z.infer<typeof chatHistoryElementSchema>;
type Chat = z.infer<typeof chatSchema>;

export const getUserChats = async (userId: string): Promise<Chat[]> => {
  const supabase = await createClient();

  const { data: chats, error } = await supabase
    .from("chats")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return chats.map((chat) => chatSchema.parse(chat));
};

export const getMessagesForChat = async (
  chatId: string
): Promise<ChatHistoryElement> => {
  const supabase = await createClient();

  const { data: chat, error: chatError } = await supabase
    .from("chats")
    .select("*")
    .eq("id", chatId)
    .single();

  if (chatError) throw new Error(chatError.message);

  const { data: messages, error: messagesError } = await supabase
    .from("messages")
    .select("*")
    .eq("session_id", chatId);

  if (messagesError) throw new Error(messagesError.message);

  const chatHistoryElement = chatHistoryElementSchema.parse({
    ...chat,
    messages,
  });

  return chatHistoryElement;
};

export const createChat = async (
  userId: string,
  title: string
): Promise<Chat> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("chats")
    .insert({
      user_id: userId,
      title,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);

  return chatSchema.parse(data);
};

export const deleteChat = async (chatId: string) => {
  const supabase = await createClient();

  const { error } = await supabase.from("chats").delete().eq("id", chatId);

  if (error) throw new Error(error.message);

  return { success: true };
};

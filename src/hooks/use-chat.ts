import { useEffect, useState } from "react";
import { chat } from "@/app/actions/llm/chat";
import { ChatContext } from "@/types/chat";
import { z } from "zod";
import { noteSchema } from "@/shared/lib/schemas/note";

const STORAGE_KEY = "chatContext";

export const useChat = (
  userId: string | undefined,
  relevantNotes: z.infer<typeof noteSchema>[]
) => {
  const [query, setQuery] = useState("");
  const [chatContext, setChatContext] = useState<ChatContext>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          return {
            conversationHistory: parsed.conversationHistory || [],
            relevantNotes: parsed.relevantNotes || relevantNotes,
          };
        } catch (e) {
          console.error("Failed to parse stored context:", e);
        }
      }
    }
    return {
      conversationHistory: [],
      relevantNotes,
    };
  });
  const [isLoading, setIsLoading] = useState(false);

  const clearChatContext = () => {
    setChatContext({
      conversationHistory: [],
      relevantNotes,
    });
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(chatContext));
    }
  }, [chatContext]);

  const sendMessage = async (message: string): Promise<void> => {
    if (!userId || !message.trim()) return;

    try {
      setChatContext((prev) => ({
        ...prev,
        conversationHistory: [
          ...prev.conversationHistory,
          { role: "user", content: message.trim() },
        ],
      }));
      setIsLoading(true);

      try {
        const data = await chat(message, userId, chatContext);

        if (data) {
          setChatContext((prev) => ({
            ...prev,
            conversationHistory: [
              ...prev.conversationHistory,
              { role: "assistant", content: data },
            ],
          }));
        }
      } catch (err) {
        console.error(`An error occured when trying to follow up: ${err}`);
        throw err;
      }
    } catch (err) {
      console.error(err);
      setChatContext((prev) => ({
        ...prev,
        conversationHistory: [
          ...prev.conversationHistory,
          {
            role: "assistant",
            content: "An error occurred. Please try again.",
          },
        ],
      }));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (query.trim()) {
      sendMessage(query);
    }
  }, [query]);

  return {
    isLoading,
    query,
    setQuery,
    clearChatContext,
    chatContext,
    setChatContext,
  };
};

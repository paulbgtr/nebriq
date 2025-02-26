import { useEffect, useState } from "react";
import { chat } from "@/app/actions/llm/chat";
import { ChatContext } from "@/types/chat";
import { z } from "zod";
import { noteSchema } from "@/shared/lib/schemas/note";
import { searchUsingTFIDF } from "@/app/actions/search/tfidf";
import { semanticSearch } from "@/app/actions/search/semantic-search";
import { useQuery } from "@tanstack/react-query";

const STORAGE_KEY = "chatContext";
const MAX_RELEVANT_NOTES = 5;

type NoteWithScore = z.infer<typeof noteSchema> & { score?: number };

export const useChat = (
  userId: string | undefined,
  allNotes: z.infer<typeof noteSchema>[]
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
            relevantNotes: parsed.relevantNotes || [],
          };
        } catch (e) {
          console.error("Failed to parse stored context:", e);
        }
      }
    }
    return {
      conversationHistory: [],
      relevantNotes: [],
    };
  });
  const [isLoading, setIsLoading] = useState(false);

  const relevantNotesQuery = useQuery({
    queryKey: ["relevantNotes", query, userId],
    queryFn: async () => {
      if (!allNotes?.length) return [];

      try {
        const lastMessages = chatContext.conversationHistory
          .slice(-4)
          .map((msg) => msg.content)
          .join(" ");

        const searchContext = [query, lastMessages].filter(Boolean).join(" ");

        if (!searchContext.trim()) return [];

        const [tfidfResults, semanticResults] = await Promise.all([
          searchUsingTFIDF(searchContext, allNotes),
          semanticSearch(searchContext, allNotes),
        ]);

        const uniqueResults = new Map<string, NoteWithScore>();

        semanticResults.forEach((note, index) => {
          uniqueResults.set(note.id, {
            ...note,
            score: (semanticResults.length - index) * 1.2,
          });
        });

        tfidfResults.forEach((note, index) => {
          if (!uniqueResults.has(note.id)) {
            uniqueResults.set(note.id, {
              ...note,
              score: tfidfResults.length - index,
            });
          }
        });

        return Array.from(uniqueResults.values())
          .sort((a, b) => (b.score || 0) - (a.score || 0))
          .slice(0, MAX_RELEVANT_NOTES);
      } catch (error) {
        console.error("Error finding relevant notes:", error);
        return [];
      }
    },
    enabled: !!userId && !!allNotes?.length,
  });

  useEffect(() => {
    if (relevantNotesQuery.data) {
      setChatContext((prev) => ({
        ...prev,
        relevantNotes: relevantNotesQuery.data,
      }));
    }
  }, [relevantNotesQuery.data]);

  // Save chat context to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(chatContext));
    }
  }, [chatContext]);

  const clearChatContext = () => {
    setChatContext({
      conversationHistory: [],
      relevantNotes: [],
    });
  };

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

      await relevantNotesQuery.refetch();

      const data = await chat(message, userId, {
        conversationHistory: chatContext.conversationHistory,
        relevantNotes: relevantNotesQuery.data || [],
      });

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
      console.error(`Chat error:`, err);

      const errorMessage = err instanceof Error ? err.message : String(err);
      const isTokenLimitError =
        errorMessage.toLowerCase().includes("token") &&
        (errorMessage.toLowerCase().includes("limit") ||
          errorMessage.toLowerCase().includes("exceed") ||
          errorMessage.toLowerCase().includes("context length"));

      setChatContext((prev) => ({
        ...prev,
        conversationHistory: [
          ...prev.conversationHistory,
          {
            role: "assistant",
            content: isTokenLimitError
              ? "The conversation has reached the token limit. Please try again later."
              : "An error occurred. Please try again.",
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
    setQuery,
    chatContext,
    isLoading,
    clearChatContext,
  };
};

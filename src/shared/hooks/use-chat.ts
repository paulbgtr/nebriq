import { useEffect, useState } from "react";
import { chat } from "@/app/actions/llm/chat";
import { ChatContext } from "@/types/chat";
import { z } from "zod";
import { noteSchema } from "@/shared/lib/schemas/note";
import { searchUsingTFIDF } from "@/app/actions/search/tfidf";
import { semanticSearch } from "@/app/actions/search/semantic-search";
import { useQuery } from "@tanstack/react-query";
import { useSelectedModelStore } from "@/store/selected-model";
import { useChatHistoryStore } from "@/store/chat-history";

const STORAGE_KEY = "chatContext";
const MAX_RELEVANT_NOTES = 5;
const MIN_QUERY_LENGTH = 15;
const CONVERSATION_MARKERS = [
  "thanks",
  "thank you",
  "ok",
  "okay",
  "got it",
  "bye",
  "hello",
  "hi",
];

type BaseNote = z.infer<typeof noteSchema>;
type NoteWithScore = BaseNote & {
  score?: number;
  matchType?: "semantic" | "tfidf" | "both";
};

const shouldSkipSearch = (query: string): boolean => {
  const normalizedQuery = query.toLowerCase().trim();

  if (normalizedQuery.length < MIN_QUERY_LENGTH) return true;

  if (CONVERSATION_MARKERS.some((marker) => normalizedQuery.includes(marker)))
    return true;

  if (
    /^(what|how|why|when|where|who|is|are|can|could|would|will)\s.{0,10}$/i.test(
      normalizedQuery
    )
  )
    return true;

  return false;
};

const calculateRelevanceScore = (
  note: NoteWithScore,
  semanticRank: number,
  tfidfRank: number,
  totalResults: number
): number => {
  const semanticScore = semanticRank ? (totalResults - semanticRank) * 1.5 : 0;
  const tfidfScore = tfidfRank ? totalResults - tfidfRank : 0;

  let boostScore = 0;

  const noteDate = note.created_at;
  const daysSinceCreation =
    (Date.now() - noteDate.getTime()) / (1000 * 60 * 60 * 24);
  const recencyBoost = Math.max(0, 1 - daysSinceCreation / 30);

  const lengthBoost = Math.min(1, (note.content?.length || 0) / 1000) * 0.5;

  boostScore = recencyBoost + lengthBoost;

  return semanticScore + tfidfScore + boostScore;
};

export const useChat = (
  userId: string | undefined,
  allNotes: z.infer<typeof noteSchema>[]
) => {
  const [query, setQuery] = useState("");
  const { selectedModel } = useSelectedModelStore();
  const { activeChatId, addChat, updateChat, getChatById, setActiveChatId } =
    useChatHistoryStore();

  const [chatContext, setChatContext] = useState<ChatContext>(() => {
    if (typeof window === "undefined") {
      return {
        conversationHistory: [],
        relevantNotes: [],
      };
    }

    if (activeChatId) {
      const activeChat = getChatById(activeChatId);
      if (activeChat) {
        return activeChat.context;
      }
    }

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

    return {
      conversationHistory: [],
      relevantNotes: [],
    };
  });

  useEffect(() => {
    if (typeof window === "undefined") {
      return; // Skip on server side
    }

    if (activeChatId) {
      const activeChat = getChatById(activeChatId);
      if (activeChat) {
        setChatContext(activeChat.context);
      }
    } else {
      setChatContext({
        conversationHistory: [],
        relevantNotes: [],
      });

      localStorage.removeItem(STORAGE_KEY);

      setTimeout(() => {
        const inputArea = document.querySelector("textarea");
        if (inputArea) {
          inputArea.focus();
        }
      }, 100);
    }
  }, [activeChatId, getChatById]);

  const [isLoading, setIsLoading] = useState(false);

  const relevantNotesQuery = useQuery({
    queryKey: ["relevantNotes", query, userId],
    queryFn: async () => {
      if (!allNotes?.length || shouldSkipSearch(query)) return [];

      try {
        const searchContext = query.trim();
        if (!searchContext) return [];

        console.log(`🔍 Searching for context: "${searchContext}"`);

        const [tfidfResults, semanticResults] = await Promise.all([
          searchUsingTFIDF(searchContext, allNotes),
          semanticSearch(searchContext, allNotes),
        ]);

        const uniqueResults = new Map<string, NoteWithScore>();
        const totalResults = Math.max(
          semanticResults.length,
          tfidfResults.length
        );

        semanticResults.forEach((note, index) => {
          uniqueResults.set(note.id, {
            ...note,
            matchType: "semantic",
            score: calculateRelevanceScore(note, index + 1, 0, totalResults),
          });
        });

        tfidfResults.forEach((note, index) => {
          if (uniqueResults.has(note.id)) {
            const existingNote = uniqueResults.get(note.id)!;
            existingNote.matchType = "both";
            existingNote.score = calculateRelevanceScore(
              note,
              semanticResults.findIndex((n) => n.id === note.id) + 1,
              index + 1,
              totalResults
            );
          } else {
            uniqueResults.set(note.id, {
              ...note,
              matchType: "tfidf",
              score: calculateRelevanceScore(note, 0, index + 1, totalResults),
            });
          }
        });

        const results = Array.from(uniqueResults.values())
          .sort((a, b) => (b.score || 0) - (a.score || 0))
          .slice(0, MAX_RELEVANT_NOTES);

        console.log(`📝 Found ${results.length} relevant notes`);
        return results;
      } catch (error) {
        console.error("Error finding relevant notes:", error);
        return [];
      }
    },
    enabled: !!userId && !!allNotes?.length,
  });

  useEffect(() => {
    if (relevantNotesQuery.data) {
      const updatedContext = {
        ...chatContext,
        relevantNotes: relevantNotesQuery.data,
      };

      setChatContext(updatedContext);

      if (activeChatId) {
        updateChat(activeChatId, updatedContext);
      }
    }
  }, [relevantNotesQuery.data]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return; // Skip on server side
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(chatContext));

    if (activeChatId && chatContext.conversationHistory.length > 0) {
      const activeChat = getChatById(activeChatId);
      if (
        activeChat &&
        JSON.stringify(activeChat.context) !== JSON.stringify(chatContext)
      ) {
        updateChat(activeChatId, chatContext);
      }
    }
  }, [chatContext, activeChatId, getChatById, updateChat]);

  const clearChatContext = () => {
    const emptyContext = {
      conversationHistory: [],
      relevantNotes: [],
    };

    setChatContext(emptyContext);

    // Clear the active chat ID without creating a new one
    // A new chat will be created when the first message is sent
    setActiveChatId(null);

    // Clear local storage to prevent hydration issues
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const sendMessage = async (message: string): Promise<void> => {
    if (!userId || !message.trim()) return;

    try {
      let attachedNoteIds: string[] = [];
      if (typeof window !== "undefined") {
        const savedNoteIds = localStorage.getItem("attachedNoteIds");
        if (savedNoteIds) {
          try {
            attachedNoteIds = JSON.parse(savedNoteIds);
            localStorage.removeItem("attachedNoteIds");
          } catch (e) {
            console.error("Failed to parse attached note IDs:", e);
          }
        }
      }

      const attachedNotes =
        attachedNoteIds.length > 0
          ? allNotes.filter((note) => attachedNoteIds.includes(note.id))
          : [];

      const newMessage = {
        role: "user" as const,
        content: message.trim(),
        attachedNotes: attachedNotes.length > 0 ? attachedNotes : undefined,
      };

      setQuery(message.trim());

      // Create a new chat if there's no active conversation
      if (chatContext.conversationHistory.length === 0 && userId) {
        const newContext = {
          conversationHistory: [newMessage],
          relevantNotes: [],
        };
        const newChatId = addChat(newContext);
        setChatContext(newContext);
        if (newChatId) {
          setActiveChatId(newChatId);
        }
      } else {
        const updatedContext = {
          ...chatContext,
          conversationHistory: [...chatContext.conversationHistory, newMessage],
          relevantNotes: [],
        };
        setChatContext(updatedContext);

        if (activeChatId) {
          updateChat(activeChatId, updatedContext);
        }
      }

      setIsLoading(true);

      let freshRelevantNotes: z.infer<typeof noteSchema>[] = [];

      if (attachedNotes.length > 0) {
        freshRelevantNotes = attachedNotes;
      } else {
        const { data } = await relevantNotesQuery.refetch();
        freshRelevantNotes = data || [];
      }

      const updatedContext: ChatContext = {
        conversationHistory: [...chatContext.conversationHistory, newMessage],
        relevantNotes: freshRelevantNotes,
      };

      const data = await chat(
        message,
        userId,
        updatedContext,
        undefined,
        selectedModel.id
      );

      if (data) {
        const finalContext = {
          ...updatedContext,
          conversationHistory: [
            ...updatedContext.conversationHistory,
            {
              role: "assistant" as const,
              content: data,
              relevantNotes: freshRelevantNotes,
            },
          ],
        };

        setChatContext(finalContext);

        if (activeChatId) {
          updateChat(activeChatId, finalContext);
        }
      }
    } catch (err) {
      console.error(`Chat error:`, err);

      const errorMessage = err instanceof Error ? err.message : String(err);
      const isTokenLimitError =
        errorMessage.toLowerCase().includes("token") &&
        (errorMessage.toLowerCase().includes("limit") ||
          errorMessage.toLowerCase().includes("exceed") ||
          errorMessage.toLowerCase().includes("context length"));

      const errorContext = {
        ...chatContext,
        conversationHistory: [
          ...chatContext.conversationHistory,
          {
            role: "assistant" as const,
            content: isTokenLimitError
              ? "The conversation has reached the token limit. Please try again later."
              : "An error occurred. Please try again.",
            relevantNotes: [],
          },
        ],
      };

      setChatContext(errorContext);

      if (activeChatId) {
        updateChat(activeChatId, errorContext);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") {
      return; // Skip on server side
    }

    if (query.trim()) {
      sendMessage(query);
    }
  }, [query]);

  return {
    query,
    setQuery,
    chatContext,
    setChatContext,
    isLoading,
    sendMessage,
    clearChatContext,
    activeChatId,
  };
};

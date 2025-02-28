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

        // Process semantic results
        semanticResults.forEach((note, index) => {
          uniqueResults.set(note.id, {
            ...note,
            matchType: "semantic",
            score: calculateRelevanceScore(note, index + 1, 0, totalResults),
          });
        });

        // Process TFIDF results and merge with semantic
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
      setChatContext((prev) => ({
        ...prev,
        relevantNotes: relevantNotesQuery.data,
      }));
    }
  }, [relevantNotesQuery.data]);

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
      const newMessage = { role: "user" as const, content: message.trim() };

      setQuery(message.trim());
      setChatContext((prev) => ({
        ...prev,
        conversationHistory: [...prev.conversationHistory, newMessage],
        relevantNotes: [],
      }));
      setIsLoading(true);

      const { data: freshRelevantNotes } = await relevantNotesQuery.refetch();

      const updatedContext: ChatContext = {
        conversationHistory: [...chatContext.conversationHistory, newMessage],
        relevantNotes: freshRelevantNotes || [],
      };

      const data = await chat(message, userId, updatedContext);

      if (data) {
        setChatContext((prev) => ({
          ...prev,
          conversationHistory: [
            ...prev.conversationHistory,
            {
              role: "assistant" as const,
              content: data,
              relevantNotes: freshRelevantNotes || [],
            },
          ],
          relevantNotes: freshRelevantNotes || [],
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
            relevantNotes: [],
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

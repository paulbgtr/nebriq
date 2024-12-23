import { useEffect, useState } from "react";
import { followUp } from "@/app/actions/llm/follow-up";
import { FollowUpContext } from "@/types/follow-up";
import { z } from "zod";
import { noteSchema } from "@/shared/lib/schemas/note";

const STORAGE_KEY = "followUpContext";

export const useFollowUp = (
  userId: string | undefined,
  relevantNotes: z.infer<typeof noteSchema>[]
) => {
  const [query, setQuery] = useState("");
  const [followUpContext, setFollowUpContext] = useState<FollowUpContext>(
    () => {
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
    }
  );
  const [isLoading, setIsLoading] = useState(false);

  const clearFollowUpContext = () => {
    setFollowUpContext({
      conversationHistory: [],
      relevantNotes,
    });
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(followUpContext));
    }
  }, [followUpContext]);

  const sendMessage = async (message: string): Promise<void> => {
    if (!userId || !message.trim()) return;

    try {
      setFollowUpContext((prev) => ({
        ...prev,
        conversationHistory: [
          ...prev.conversationHistory,
          { role: "user", content: message.trim() },
        ],
      }));
      setIsLoading(true);

      try {
        const data = await followUp(message, userId, followUpContext);

        if (data) {
          setFollowUpContext((prev) => ({
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
      setFollowUpContext((prev) => ({
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
    clearFollowUpContext,
    followUpContext,
    setFollowUpContext,
  };
};

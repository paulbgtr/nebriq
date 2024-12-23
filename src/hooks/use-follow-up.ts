import { useEffect, useState } from "react";
import { followUp } from "@/app/actions/llm/follow-up";
import { FollowUpContext } from "@/types/follow-up";
import { z } from "zod";
import { noteSchema } from "@/shared/lib/schemas/note";

export const useFollowUp = (
  userId: string | undefined,
  relevantNotes: z.infer<typeof noteSchema>[]
) => {
  const [query, setQuery] = useState("");
  const [followUpContext, setFollowUpContext] = useState<FollowUpContext>({
    conversationHistory: [],
    relevantNotes,
  });
  const [isLoading, setIsLoading] = useState(false);

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
    followUpContext,
    setFollowUpContext,
  };
};

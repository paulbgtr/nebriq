import { useEffect, useState } from "react";
import { followUp } from "@/app/actions/llm/follow-up";
import { FollowUpContext } from "@/types/follow-up";
import { Note } from "@/types/note";

export const useFollowUp = (
  userId: string | undefined,
  relevantNotes: Note[]
) => {
  const [query, setQuery] = useState("");
  const [followUpContext, setFollowUpContext] = useState<FollowUpContext>({
    conversationHistory: [],
    relevantNotes,
  });
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (message: string) => {
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
      console.error(err);
      setFollowUpContext((prev) => ({
        ...prev,
        conversationHistory: [
          ...prev.conversationHistory,
          { role: "user", content: message.trim() },
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

import { useState } from "react";
import { useUser } from "./use-user";
import { summarize } from "@/app/actions/llm/summary";
import { Note } from "@/types/note";
import { useQuery } from "@tanstack/react-query";

export const useSummary = (results: Note[]) => {
  const [isSummarized, setIsSummarized] = useState(false);

  const { user } = useUser();

  const { data: summary, isLoading: isLoadingSummary } = useQuery({
    queryKey: ["summary", results],
    queryFn: () => {
      return summarize(results, user?.id ?? "");
    },
    enabled: isSummarized,
  });

  return {
    summary,
    isLoadingSummary,
    isSummarized,
    setIsSummarized,
  };
};

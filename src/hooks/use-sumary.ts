import { useState } from "react";
import { useUser } from "./use-user";
import { summarize } from "@/app/actions/llm/summary";
import { noteSchema } from "@/shared/lib/schemas/note";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";

export const useSummary = (results: z.infer<typeof noteSchema>[]) => {
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

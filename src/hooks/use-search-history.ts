"use client";

import {
  getSearchHistory,
  createSearchHistory,
  deleteSearchHistory,
} from "@/app/actions/supabase/search_history";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useUser } from "./use-user";
import queryClient from "@/shared/lib/react-query";
import { createSearhHistoryItemSchema } from "@/shared/lib/schemas/search-history-item";

export const useSearchHistory = () => {
  const { user } = useUser();

  const searchHistoryQuery = useQuery({
    queryFn: () => {
      if (user?.id) {
        return getSearchHistory(user.id);
      }
      return [];
    },
    queryKey: ["search-history"],
    enabled: !!user?.id,
  });

  const createSearchHistoryMutation = useMutation({
    mutationFn: (data: any) => {
      const searchHistory = createSearhHistoryItemSchema.parse({
        ...data,
        user_id: user?.id,
        created_at: new Date(),
      });

      return createSearchHistory(searchHistory);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["search-history"] });
    },
  });

  const clearSearchHistory = useMutation({
    mutationFn: () => {
      if (user?.id) {
        return deleteSearchHistory(user.id);
      }
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["search-history"] });
    },
  });

  return {
    searchHistoryQuery,
    createSearchHistoryMutation,
    clearSearchHistory,
  };
};

"use client";

import {
  getSearchHistory,
  deleteSearchHistory,
} from "@/app/actions/supabase/search_history";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useUser } from "./use-user";
import queryClient from "@/shared/lib/react-query";

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

  return { searchHistoryQuery, clearSearchHistory };
};

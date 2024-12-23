"use client";

import { z } from "zod";
import { searchHistoryItemSchema } from "@/shared/lib/schemas/search-history-item";
import { SearchHistoryList } from "./components/search-history-list";
import { useSearchHistory } from "@/hooks/use-search-history";
import { SkeletonHistory } from "./components/skeleton";

export const SearchHistory = () => {
  const { searchHistoryQuery } = useSearchHistory();

  const { isLoading, data: searchHistoryData } = searchHistoryQuery;

  if (searchHistoryQuery.isLoading) {
    return <SkeletonHistory />;
  }

  const searchHistory: z.infer<typeof searchHistoryItemSchema>[] =
    searchHistoryData
      ? searchHistoryItemSchema.array().parse(
          searchHistoryData.map((item) => ({
            ...item,
            created_at: new Date(item.created_at),
          }))
        )
      : [];

  return (
    <>
      {isLoading || searchHistory.length === 0 ? (
        <SkeletonHistory />
      ) : (
        <SearchHistoryList searchHistory={searchHistory} />
      )}
    </>
  );
};

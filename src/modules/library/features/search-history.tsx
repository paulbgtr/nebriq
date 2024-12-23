"use client";

import { z } from "zod";
import { searchHistoryItemSchema } from "@/shared/lib/schemas/search-history-item";
import { SearchHistoryList } from "./components/search-history-list";
import { SkeletonHistory } from "./components/skeleton";

type Props = {
  searchHistory: z.infer<typeof searchHistoryItemSchema>[] | undefined;
};

export const SearchHistory = ({ searchHistory }: Props) => {
  return (
    <>
      {searchHistory ? (
        <SearchHistoryList searchHistory={searchHistory} />
      ) : (
        <SkeletonHistory />
      )}
    </>
  );
};

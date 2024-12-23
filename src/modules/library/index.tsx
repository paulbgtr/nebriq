"use client";

import Link from "next/link";
import { z } from "zod";
import { SearchHistory } from "./features/search-history";
import { Button, buttonVariants } from "@/shared/components/ui/button";
import { useSearchHistory } from "@/hooks/use-search-history";
import { searchHistoryItemSchema } from "@/shared/lib/schemas/search-history-item";

export default function LibraryModule() {
  const { searchHistoryQuery, clearSearchHistory } = useSearchHistory();

  const { isLoading, data: searchHistoryData } = searchHistoryQuery;

  const handleClearSearchHistory = () => {
    clearSearchHistory.mutate();
  };

  const searchHistory: z.infer<typeof searchHistoryItemSchema>[] =
    searchHistoryData
      ? searchHistoryItemSchema.array().parse(
          searchHistoryData.map((item) => ({
            ...item,
            created_at: new Date(item.created_at),
          }))
        )
      : [];

  if (searchHistory.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 flex flex-col items-center">
        <div className="flex flex-col items-center py-16 space-y-4">
          <h1 className="font-bold mt-4 text-xl text-center">
            Your library is empty yet
          </h1>
          <p>Start searching for knowledge and it'll show up here.</p>
          <Link
            className={buttonVariants({ variant: "outline" })}
            href="/search"
          >
            Search
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <header className="mb-5 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Library</h1>
        <Button onClick={handleClearSearchHistory} variant="outline">
          Clear Search History
        </Button>
      </header>
      <p>Here you can find your search history.</p>
      <SearchHistory searchHistory={searchHistory} />
    </div>
  );
}

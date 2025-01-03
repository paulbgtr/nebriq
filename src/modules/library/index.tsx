"use client";

import Link from "next/link";
import { z } from "zod";
import { SearchHistory } from "./features/search-history";
import { Button, buttonVariants } from "@/shared/components/ui/button";
import { useSearchHistory } from "@/hooks/use-search-history";
import { searchHistoryItemSchema } from "@/shared/lib/schemas/search-history-item";
import { BookOpen, Search, Trash2 } from "lucide-react";
import { cn } from "@/shared/lib/utils";

export default function LibraryModule() {
  const { searchHistoryQuery, clearSearchHistory } = useSearchHistory();
  const { isLoading, data: searchHistoryData, isPending } = searchHistoryQuery;

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

  if (isLoading || isPending) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-1/4 bg-muted rounded"></div>
          <div className="h-4 w-3/4 bg-muted rounded"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (searchHistory.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div
          className={cn(
            "rounded-xl p-8 sm:p-12",
            "flex flex-col items-center text-center"
          )}
        >
          <div className="rounded-full bg-primary/10 p-3 mb-4">
            <BookOpen className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-semibold text-foreground mb-3">
            Your library is empty
          </h1>
          <p className="text-muted-foreground mb-6 max-w-md">
            Start exploring and searching for knowledge. Your search history
            will appear here.
          </p>
          <Link
            className={buttonVariants({
              variant: "default",
              size: "lg",
              className: "gap-2",
            })}
            href="/home"
          >
            <Search className="h-5 w-5" />
            Start Searching
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="space-y-8">
        <header
          className={cn(
            "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
          )}
        >
          <div>
            <h1 className="text-3xl font-bold text-foreground">Library</h1>
            <p className="mt-2 text-muted-foreground">
              Your personal knowledge collection and search history
            </p>
          </div>
          <Button
            onClick={handleClearSearchHistory}
            variant="outline"
            className="gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Clear History
          </Button>
        </header>

        <SearchHistory searchHistory={searchHistory} />
      </div>
    </div>
  );
}

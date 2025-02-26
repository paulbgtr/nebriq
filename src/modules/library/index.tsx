"use client";

import Link from "next/link";
import { z } from "zod";
import { SearchHistory } from "./features/search-history";
import { Button, buttonVariants } from "@/shared/components/ui/button";
import { useSearchHistory } from "@/hooks/use-search-history";
import { searchHistoryItemSchema } from "@/shared/lib/schemas/search-history-item";
import { BookOpen, Search, Trash2, BookMarked, Clock } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { motion } from "framer-motion";

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
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="max-w-4xl w-full px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-6">
            <div className="h-12 w-1/3 bg-muted rounded-lg" />
            <div className="h-6 w-2/3 bg-muted rounded-lg" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-48 bg-muted rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (searchHistory.length === 0) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="max-w-lg mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "rounded-2xl p-8 sm:p-12",
              "flex flex-col items-center text-center",
              "bg-background",
              "border border-border/50 shadow-xl"
            )}
          >
            <div className="rounded-full p-4 mb-6 ring-4 ring-primary/5">
              <BookOpen className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-3xl font-semibold text-foreground mb-4">
              Welcome to Your Library
            </h1>
            <p className="text-muted-foreground mb-8 max-w-md leading-relaxed">
              Your personal sanctuary of knowledge awaits. Start your journey by
              exploring and collecting insights through search.
            </p>
            <Link
              className={buttonVariants({
                variant: "default",
                size: "lg",
                className: "gap-2 text-lg px-8",
              })}
              href="/home"
            >
              <Search className="h-5 w-5" />
              Begin Your Journey
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-12"
        >
          <header className="relative">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 border-b border-border/40 pb-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
                    <BookMarked className="h-6 w-6" />
                  </div>
                  <h1 className="text-4xl font-bold text-foreground tracking-tight">
                    Library
                  </h1>
                </div>
                <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
                  Your curated collection of knowledge and insights, carefully
                  preserved from your explorations.
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-4 py-2 rounded-lg">
                  <Clock className="h-4 w-4" />
                  <span>{searchHistory.length} entries</span>
                </div>
                <Button
                  onClick={handleClearSearchHistory}
                  variant="outline"
                  className="gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Clear History
                </Button>
              </div>
            </div>
          </header>

          <SearchHistory searchHistory={searchHistory} />
        </motion.div>
      </div>
    </div>
  );
}

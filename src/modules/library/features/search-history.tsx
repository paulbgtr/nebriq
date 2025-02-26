"use client";

import { useState } from "react";
import { z } from "zod";
import { searchHistoryItemSchema } from "@/shared/lib/schemas/search-history-item";
import { SearchHistoryList } from "./components/search-history-list";
import { SkeletonHistory } from "./components/skeleton";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Calendar, Clock, Search, BookOpen } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
  searchHistory: z.infer<typeof searchHistoryItemSchema>[] | undefined;
};

type TimeGroup = "today" | "yesterday" | "thisWeek" | "thisMonth" | "earlier";
type SortOption = "newest" | "oldest" | "relevance";

const timeGroups: { id: TimeGroup; label: string; icon: typeof Clock }[] = [
  { id: "today", label: "Today", icon: Clock },
  { id: "yesterday", label: "Yesterday", icon: Clock },
  { id: "thisWeek", label: "This Week", icon: Calendar },
  { id: "thisMonth", label: "This Month", icon: Calendar },
  { id: "earlier", label: "Earlier", icon: BookOpen },
];

const sortOptions: { id: SortOption; label: string }[] = [
  { id: "newest", label: "Newest First" },
  { id: "oldest", label: "Oldest First" },
  { id: "relevance", label: "Most Relevant" },
];

export const SearchHistory = ({ searchHistory }: Props) => {
  const [filterQuery, setFilterQuery] = useState("");
  const [selectedTimeGroup, setSelectedTimeGroup] = useState<TimeGroup | "all">(
    "all"
  );
  const [sortBy, setSortBy] = useState<SortOption>("newest");

  if (!searchHistory) {
    return <SkeletonHistory />;
  }

  const getTimeGroup = (date: Date): TimeGroup => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const thisWeek = new Date(today);
    thisWeek.setDate(thisWeek.getDate() - 7);
    const thisMonth = new Date(today);
    thisMonth.setMonth(thisMonth.getMonth() - 1);

    if (date >= today) return "today";
    if (date >= yesterday) return "yesterday";
    if (date >= thisWeek) return "thisWeek";
    if (date >= thisMonth) return "thisMonth";
    return "earlier";
  };

  const groupedHistory = searchHistory.reduce(
    (acc, item) => {
      const timeGroup = getTimeGroup(item.created_at);
      if (!acc[timeGroup]) acc[timeGroup] = [];
      acc[timeGroup].push(item);
      return acc;
    },
    {} as Record<TimeGroup, typeof searchHistory>
  );

  const filteredAndSortedHistory = Object.entries(groupedHistory).reduce(
    (acc, [group, items]) => {
      const filtered = items.filter((item) =>
        item.query.toLowerCase().includes(filterQuery.toLowerCase())
      );

      const sorted = [...filtered].sort((a, b) => {
        if (sortBy === "newest")
          return b.created_at.getTime() - a.created_at.getTime();
        if (sortBy === "oldest")
          return a.created_at.getTime() - b.created_at.getTime();
        // For relevance, we could implement more sophisticated sorting later
        return 0;
      });

      if (sorted.length > 0) {
        acc[group as TimeGroup] = sorted;
      }
      return acc;
    },
    {} as Record<TimeGroup, typeof searchHistory>
  );

  return (
    <div className="space-y-8">
      <div className="grid gap-6 sm:grid-cols-[1fr,auto] items-start">
        <div className="relative flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/70" />
            <Input
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Filter your knowledge..."
              className="pl-9 border-border/40 hover:border-primary/30 focus:border-primary/50 h-11"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm">
            {sortOptions.map((option) => (
              <Button
                key={option.id}
                variant={sortBy === option.id ? "default" : "ghost"}
                size="sm"
                onClick={() => setSortBy(option.id)}
                className={cn(
                  "text-xs px-3 h-8",
                  sortBy === option.id &&
                    "bg-primary/10 text-primary hover:bg-primary/20"
                )}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 -mx-2 px-2 scrollbar-none">
        <Button
          variant={selectedTimeGroup === "all" ? "default" : "ghost"}
          size="sm"
          onClick={() => setSelectedTimeGroup("all")}
          className={cn(
            "whitespace-nowrap",
            selectedTimeGroup === "all" &&
              "bg-primary/10 text-primary hover:bg-primary/20"
          )}
        >
          All Time
        </Button>
        {timeGroups.map((group) => {
          const Icon = group.icon;
          const hasItems = groupedHistory[group.id]?.length > 0;

          return (
            <Button
              key={group.id}
              variant={selectedTimeGroup === group.id ? "default" : "ghost"}
              size="sm"
              onClick={() => setSelectedTimeGroup(group.id)}
              className={cn(
                "whitespace-nowrap gap-1.5",
                !hasItems && "opacity-50",
                selectedTimeGroup === group.id &&
                  "bg-primary/10 text-primary hover:bg-primary/20"
              )}
              disabled={!hasItems}
            >
              <Icon className="h-3.5 w-3.5" />
              {group.label}
            </Button>
          );
        })}
      </div>

      <div className="space-y-12">
        <AnimatePresence mode="wait">
          {Object.entries(filteredAndSortedHistory).map(([group, items]) => {
            if (selectedTimeGroup !== "all" && group !== selectedTimeGroup)
              return null;

            const timeGroup = timeGroups.find((t) => t.id === group);
            if (!timeGroup) return null;

            return (
              <motion.div
                key={group}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-2 text-lg font-medium text-foreground/80">
                  <timeGroup.icon className="h-5 w-5 text-primary/70" />
                  <h2>{timeGroup.label}</h2>
                  <span className="text-sm text-muted-foreground">
                    ({items.length} entries)
                  </span>
                </div>
                <SearchHistoryList searchHistory={items} />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};

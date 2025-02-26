"use client";

import { useState } from "react";
import { z } from "zod";
import { searchHistoryItemSchema } from "@/shared/lib/schemas/search-history-item";
import { SearchHistoryList } from "./components/search-history-list";
import { SkeletonHistory } from "./components/skeleton";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Calendar, Clock, Filter, Search, TrendingUp } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
  searchHistory: z.infer<typeof searchHistoryItemSchema>[] | undefined;
};

type TimeGroup = "today" | "yesterday" | "thisWeek" | "thisMonth" | "earlier";
type SortOption = "newest" | "oldest" | "relevance";

const timeGroups: { id: TimeGroup; label: string }[] = [
  { id: "today", label: "Today" },
  { id: "yesterday", label: "Yesterday" },
  { id: "thisWeek", label: "This Week" },
  { id: "thisMonth", label: "This Month" },
  { id: "earlier", label: "Earlier" },
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

  const stats = {
    total: searchHistory.length,
    today: groupedHistory.today?.length || 0,
    thisWeek:
      (groupedHistory.thisWeek?.length || 0) +
      (groupedHistory.today?.length || 0),
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none sm:min-w-[300px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Filter searches..."
              className="pl-9"
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() =>
              setSelectedTimeGroup(
                selectedTimeGroup === "all" ? "today" : "all"
              )
            }
          >
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            <span>{stats.today} today</span>
          </div>
          <div className="w-px h-4 bg-border" />
          <div className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            <span>{stats.thisWeek} this week</span>
          </div>
          <div className="w-px h-4 bg-border" />
          <div className="flex items-center gap-1.5">
            <TrendingUp className="h-4 w-4" />
            <span>{stats.total} total</span>
          </div>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 -mx-2 px-2">
        {timeGroups.map((group) => (
          <Button
            key={group.id}
            variant={selectedTimeGroup === group.id ? "default" : "outline"}
            size="sm"
            onClick={() =>
              setSelectedTimeGroup(
                selectedTimeGroup === group.id ? "all" : group.id
              )
            }
            className="whitespace-nowrap"
          >
            {group.label}
          </Button>
        ))}
      </div>

      <div className="space-y-8">
        <AnimatePresence mode="wait">
          {Object.entries(filteredAndSortedHistory).map(([group, items]) => {
            if (selectedTimeGroup !== "all" && group !== selectedTimeGroup)
              return null;

            return (
              <motion.div
                key={group}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                <h2 className="text-lg font-semibold capitalize">
                  {timeGroups.find((t) => t.id === group)?.label}
                </h2>
                <SearchHistoryList searchHistory={items} />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};

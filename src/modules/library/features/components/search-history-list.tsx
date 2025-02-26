import { z } from "zod";
import { searchHistoryItemSchema } from "@/shared/lib/schemas/search-history-item";
import { motion } from "framer-motion";
import { Badge } from "@/shared/components/ui/badge";
import { Card } from "@/shared/components/ui/card";
import {
  Clock,
  Search,
  Tag,
  Sparkles,
  ArrowRight,
  BookOpen,
} from "lucide-react";
import { cn } from "@/shared/lib/utils";
import Link from "next/link";

type SearchHistoryListProps = {
  searchHistory: z.infer<typeof searchHistoryItemSchema>[];
};

const extractKeywords = (query: string): string[] => {
  // Simple keyword extraction - split by spaces and filter out common words
  const commonWords = new Set([
    "the",
    "a",
    "an",
    "and",
    "or",
    "but",
    "in",
    "on",
    "at",
    "to",
    "for",
    "of",
    "with",
    "by",
    "what",
    "how",
    "why",
    "when",
    "where",
    "who",
    "which",
    "that",
    "this",
    "these",
    "those",
    "is",
    "are",
    "was",
    "were",
    "be",
    "been",
    "being",
  ]);
  return query
    .toLowerCase()
    .split(/\s+/)
    .filter((word) => word.length > 2 && !commonWords.has(word))
    .slice(0, 3);
};

const formatTimeAgo = (date: Date): string => {
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return "just now";
};

export const SearchHistoryList = ({
  searchHistory,
}: SearchHistoryListProps) => {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {searchHistory.map((item, index) => {
        const keywords = extractKeywords(item.query);
        const timeAgo = formatTimeAgo(item.created_at);

        return (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Link href={`/search/${encodeURIComponent(item.query)}`}>
              <Card
                className={cn(
                  "group relative overflow-hidden",
                  "border border-border/40 hover:border-primary/20",
                  "transition-all duration-300 hover:shadow-lg",
                  "cursor-pointer hover:bg-background"
                )}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative p-5 space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="p-1.5 rounded-md bg-primary/10 text-primary">
                          <BookOpen className="h-4 w-4" />
                        </div>
                        <h3 className="font-medium text-foreground truncate group-hover:text-primary transition-colors">
                          {item.query}
                        </h3>
                      </div>
                      {item.summary && (
                        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                          {item.summary}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground whitespace-nowrap pt-1">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{timeAgo}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {keywords.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {keywords.map((keyword) => (
                          <Badge
                            key={keyword}
                            variant="secondary"
                            className={cn(
                              "text-xs px-2 py-0.5",
                              "bg-primary/5 hover:bg-primary/10",
                              "text-primary/70 hover:text-primary",
                              "transition-colors duration-200"
                            )}
                          >
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {item.summary && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs text-primary/70">
                          <Sparkles className="h-3.5 w-3.5" />
                          <span>AI-enhanced</span>
                        </div>
                        <div className="text-primary/70 group-hover:text-primary transition-colors">
                          <ArrowRight className="h-4 w-4" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
};

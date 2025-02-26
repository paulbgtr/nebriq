import { z } from "zod";
import { searchHistoryItemSchema } from "@/shared/lib/schemas/search-history-item";
import { motion } from "framer-motion";
import { Badge } from "@/shared/components/ui/badge";
import { Card } from "@/shared/components/ui/card";
import { Clock, Search, Tag, Sparkles } from "lucide-react";
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
    <div className="grid gap-4">
      {searchHistory.map((item, index) => {
        const keywords = extractKeywords(item.query);
        const timeAgo = formatTimeAgo(item.created_at);

        return (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link href={`/search/${encodeURIComponent(item.query)}`}>
              <Card
                className={cn(
                  "group relative p-4 sm:p-6 hover:shadow-md transition-all duration-200",
                  "border border-border/40 hover:border-primary/20",
                  "cursor-pointer"
                )}
              >
                <div className="flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <Search className="h-4 w-4 text-primary" />
                        <h3 className="text-lg font-medium text-foreground group-hover:text-primary transition-colors">
                          {item.query}
                        </h3>
                      </div>
                      {item.summary && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {item.summary}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{timeAgo}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Tag className="h-3.5 w-3.5" />
                      <span className="text-xs">Keywords:</span>
                    </div>
                    {keywords.map((keyword) => (
                      <Badge
                        key={keyword}
                        variant="secondary"
                        className="text-xs bg-primary/5 hover:bg-primary/10"
                      >
                        {keyword}
                      </Badge>
                    ))}
                  </div>

                  {item.summary && (
                    <div className="flex items-center gap-1.5 text-xs text-primary/80">
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>AI-enhanced search</span>
                    </div>
                  )}
                </div>
              </Card>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
};

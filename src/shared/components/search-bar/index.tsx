"use client";

import { useState } from "react";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";
import { FaArrowUp } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";
import { AISearch } from "./ai-search";
import { useSearchStore } from "@/store/search";

type SearchBarProps = {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearch: (e: React.FormEvent) => void;
};

export default function SearchBar({
  searchQuery,
  setSearchQuery,
  handleSearch,
}: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);
  const { isAiSearch } = useSearchStore();

  return (
    <article
      className={cn(
        "flex flex-col gap-3 justify-end rounded-lg p-4 shadow-lg border relative overflow-hidden transition-all duration-700",
        isAiSearch
          ? "bg-gradient-to-r from-violet-500/5 via-purple-500/5 to-fuchsia-500/5"
          : "bg-background"
      )}
    >
      {isAiSearch && (
        <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 via-purple-500/10 to-fuchsia-500/10 animate-gradient opacity-0 animate-fade-in" />
      )}
      <form onSubmit={handleSearch} className="relative z-10">
        <div
          className={cn(
            "relative group transition-all duration-300",
            isFocused && "ring-2 ring-primary/20 rounded-lg"
          )}
        >
          <div className="relative flex items-center">
            <div className="absolute left-4">
              <FaSearch className="h-4 w-4" />
            </div>
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Search anything..."
              className={cn(
                "pl-11 pr-20 h-14 transition-all duration-300",
                isAiSearch ? "bg-background/80" : "bg-background/50",
                "border-muted hover:border-primary/50",
                isFocused && "ring-2 ring-primary/20 border-primary",
                "placeholder:text-muted-foreground/60",
                "text-base"
              )}
            />
            <div className="absolute right-3 flex items-center space-x-2">
              <Button
                type="submit"
                variant="secondary"
                size="sm"
                disabled={searchQuery.length <= 0}
                className={cn(
                  "hover:bg-muted transition-all duration-300 rounded-full w-10 h-10",
                  searchQuery &&
                    "bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 transform",
                  "shadow-sm"
                )}
              >
                <FaArrowUp className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </form>
      <AISearch />
    </article>
  );
}

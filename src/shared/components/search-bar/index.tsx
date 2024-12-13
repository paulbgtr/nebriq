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
        "flex flex-col gap-3 justify-end rounded-lg p-4 shadow-lg border relative overflow-hidden transition-all duration-700"
      )}
    >
      {isAiSearch && (
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500/30 via-crimson-500/30 to-red-500/30 animate-gradient opacity-0 animate-fade-in blur-xl" />
      )}
      <form onSubmit={handleSearch} className="relative z-10">
        <div
          className={cn(
            "relative group transition-all duration-500 ease-in-out",
            isFocused && "ring-2 ring-primary/30 rounded-lg shadow-lg"
          )}
        >
          <div className="relative flex items-center">
            <div
              className={cn(
                "absolute left-4 transition-all duration-300",
                isFocused ? "text-primary scale-110" : "text-muted-foreground"
              )}
            >
              <FaSearch className="h-4 w-4" />
            </div>
            <Input
              isBordered={false}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Search anything..."
              className={cn(
                "pl-11 pr-20 h-14 transition-all duration-300 ease-in-out",
                isAiSearch ? "bg-background/90" : "bg-background/80",
                "border-muted hover:border-primary/50",
                isFocused &&
                  "ring-2 ring-primary/20 border-primary shadow-inner",
                "placeholder:text-muted-foreground/60",
                "text-base",
                "hover:shadow-md"
              )}
            />
            <div className="absolute right-3 flex items-center space-x-2">
              <Button
                type="submit"
                variant="ghost"
                size="sm"
                disabled={searchQuery.length <= 0}
                className={cn(
                  "transition-all duration-200 rounded-full w-8 h-8 p-0",
                  searchQuery && [
                    "text-primary hover:text-primary/90",
                    "hover:scale-105 transform",
                    "hover:bg-transparent",
                  ],
                  !searchQuery && "text-muted-foreground"
                )}
              >
                <FaArrowUp className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </form>
      <AISearch />
    </article>
  );
}

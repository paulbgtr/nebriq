"use client";

import { useState } from "react";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";
import { FaArrowUp } from "react-icons/fa";
import { AISearch } from "./ai-search";

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
  const [isAISearch, setIsAISearch] = useState(false);

  return (
    <article className="flex flex-col gap-2 justify-end rounded-md p-2 bg-accent pb-3">
      <form onSubmit={handleSearch}>
        <div
          className={cn(
            "relative group transition-all duration-300",
            isFocused && "ring-1 ring-gray-200 rounded-lg"
          )}
        >
          <div className="relative flex items-center">
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Seek and you shall find..."
              className={cn(
                "pl-3 h-12 transition-all duration-300",
                isFocused && "ring-2 ring-offset-2",
                "placeholder:text-muted-foreground/60"
              )}
            />
            <div className="absolute right-2 flex items-center space-x-2">
              <Button
                type="submit"
                variant="secondary"
                size="sm"
                disabled={searchQuery.length <= 0}
                className={cn(
                  "hover:bg-muted transition-all duration-300 rounded-full w-8 h-8",
                  searchQuery &&
                    "bg-primary text-primary-foreground hover:bg-primary/90"
                )}
              >
                <FaArrowUp className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </form>
      <AISearch isAISearch={isAISearch} setIsAISearch={setIsAISearch} />
    </article>
  );
}

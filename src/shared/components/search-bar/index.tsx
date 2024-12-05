"use client";

import { useState } from "react";
import { Search as SearchIcon } from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";
import { FaArrowUp } from "react-icons/fa";

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

  return (
    <>
      <form onSubmit={handleSearch}>
        <div
          className={cn(
            "relative group transition-all duration-300",
            isFocused && "ring-1 ring-gray-200 rounded-lg"
          )}
        >
          <div className="relative flex items-center">
            <SearchIcon
              className={cn(
                "absolute left-3 text-muted-foreground transition-colors",
                isFocused && "text-foreground"
              )}
              size={20}
            />
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Type to search..."
              className={cn(
                "pl-10 pr-24 h-12 transition-all duration-300",
                isFocused && "ring-2 ring-offset-2",
                "placeholder:text-muted-foreground/60"
              )}
            />
            <Button
              type="submit"
              variant="secondary"
              size="sm"
              disabled={searchQuery.length <= 0}
              className={cn(
                "absolute right-2 hover:bg-muted transition-all duration-300 rounded-full w-8 h-8",
                searchQuery &&
                  "bg-primary text-primary-foreground hover:bg-primary/90"
              )}
            >
              <FaArrowUp className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </form>
    </>
  );
}

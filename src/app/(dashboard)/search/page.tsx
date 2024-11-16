"use client";

import { useState } from "react";
import { Search as SearchIcon, Sparkle } from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-2xl mx-auto mt-20">
        <div className="mb-8 text-center space-y-2">
          <Sparkle className="w-12 h-12 mx-auto text-muted-foreground" />
          <h1 className="text-2xl font-semibold tracking-tight">
            What&apos;s on your mind?
          </h1>
        </div>

        <form onSubmit={handleSearch}>
          <div
            className={cn(
              "relative group transition-all duration-300",
              isFocused && "scale-[1.01]"
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
                className={cn(
                  "absolute right-1 hover:bg-muted transition-all duration-300",
                  searchQuery &&
                    "bg-primary text-primary-foreground hover:bg-primary/90"
                )}
              >
                Search
              </Button>
            </div>
          </div>
        </form>

        {!searchQuery && (
          <div className="mt-8 text-center text-sm text-muted-foreground">
            <p>Try searching for:</p>
            <div className="mt-2 flex flex-wrap gap-2 justify-center">
              {["Meeting notes", "Project ideas", "Tasks", "Daily journal"].map(
                (suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => setSearchQuery(suggestion)}
                    className="px-3 py-1 rounded-full bg-muted hover:bg-muted/80 
                           transition-colors text-sm"
                  >
                    {suggestion}
                  </button>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

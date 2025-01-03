"use client";

import { useState } from "react";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";
import { FaArrowUp } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";
import { AISearch } from "./ai-search";
import { useSearchStore } from "@/store/search";
import { motion, AnimatePresence } from "framer-motion";

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
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex flex-col gap-3 justify-end rounded-xl p-5",
        "backdrop-blur-xl shadow-xl",
        "border border-white/10",
        "relative overflow-hidden"
      )}
    >
      <motion.div
        initial={false}
        animate={{
          opacity: isAiSearch ? 1 : 0,
        }}
        transition={{
          duration: 0.6,
          ease: "easeInOut",
        }}
        className={cn(
          "absolute inset-0 bg-gradient-to-r from-blue-700/20 via-blue-600/25 to-blue-500/20",
          "animate-gradient blur-2xl"
        )}
      />

      <div
        className={cn(
          "absolute inset-0",
          "bg-background/50 backdrop-blur-sm",
          "transition-opacity duration-500",
          isAiSearch ? "opacity-90" : "opacity-100"
        )}
      />

      <form onSubmit={handleSearch} className="relative z-10">
        <motion.div
          animate={{
            scale: isFocused ? 1.02 : 1,
          }}
          transition={{
            duration: 0.2,
            type: "tween",
          }}
          className={cn(
            "relative group rounded-lg",
            isFocused && "ring-2 ring-primary/20",
            "transition-shadow duration-200",
            isFocused ? "shadow-lg" : "shadow-md hover:shadow-lg"
          )}
        >
          <div className="relative flex items-center">
            <motion.div
              animate={{
                scale: isFocused ? 1.1 : 1,
                x: isFocused ? 2 : 0,
              }}
              transition={{ duration: 0.2 }}
              className={cn(
                "absolute left-4",
                "transition-colors duration-300",
                isFocused ? "text-primary" : "text-muted-foreground"
              )}
            >
              <FaSearch className="h-4 w-4" />
            </motion.div>

            <Input
              isBordered={false}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Search anything..."
              className={cn(
                "pl-11 pr-20 h-14",
                "transition-all duration-300",
                "bg-background/80",
                "border-muted/50 hover:border-primary/30",
                isFocused && "ring-2 ring-primary/20 border-primary",
                "placeholder:text-muted-foreground/60",
                "text-base font-medium",
                "rounded-lg"
              )}
            />

            <AnimatePresence>
              {searchQuery && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-3 flex items-center space-x-2"
                >
                  <Button
                    type="submit"
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "transition-all duration-200",
                      "rounded-full w-9 h-9 p-0",
                      "bg-primary/10 hover:bg-primary/20",
                      "text-primary hover:text-primary/90",
                      "hover:scale-105 transform"
                    )}
                  >
                    <FaArrowUp className="h-3.5 w-3.5" />
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </form>

      <AISearch />
    </motion.article>
  );
}

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
  variant?: "default" | "minimal";
};

export default function SearchBar({
  searchQuery,
  setSearchQuery,
  handleSearch,
  variant = "default",
}: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);
  const { isAiSearch } = useSearchStore();

  const isMinimal = variant === "minimal";

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex flex-col gap-2 sm:gap-3 justify-end rounded-lg sm:rounded-xl",
        "relative overflow-hidden",
        "w-full max-w-3xl mx-auto",
        isMinimal ? "p-2" : "p-3 sm:p-4 md:p-5",
        !isMinimal && ["backdrop-blur-xl shadow-md", "border border-white/10"],
        isMinimal && ["bg-muted/5 backdrop-blur-sm", "border border-border/40"]
      )}
    >
      <motion.div
        initial={false}
        animate={{
          opacity: isAiSearch && !isMinimal ? 1 : 0,
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
          "transition-opacity duration-500",
          isMinimal ? "bg-background/30" : "bg-background/50 backdrop-blur-sm",
          isAiSearch && !isMinimal ? "opacity-90" : "opacity-100"
        )}
      />

      <form onSubmit={handleSearch} className="relative z-10">
        <motion.div
          animate={{
            scale: isFocused ? 1.01 : 1,
          }}
          transition={{
            duration: 0.2,
            type: "tween",
          }}
          className={cn(
            "relative group rounded-md sm:rounded-lg",
            isFocused && "ring-2 ring-primary/20",
            "transition-shadow duration-200",
            isMinimal
              ? "shadow-none hover:shadow-sm"
              : "shadow-md hover:shadow-lg"
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
                "absolute left-3 sm:left-4",
                "transition-colors duration-300",
                isFocused ? "text-primary" : "text-muted-foreground/70"
              )}
            >
              <FaSearch className="h-3 w-3 sm:h-4 sm:w-4" />
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
                "pl-9 sm:pl-11 pr-12 sm:pr-20",
                "h-11 sm:h-12",
                "transition-all duration-300",
                isMinimal ? "bg-background/50" : "bg-background/80",
                "border-border/40 hover:border-primary/30",
                isFocused && "ring-2 ring-primary/20 border-primary/50",
                "placeholder:text-muted-foreground/50",
                "text-sm sm:text-base",
                "rounded-md sm:rounded-lg"
              )}
            />

            <AnimatePresence>
              {searchQuery && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-2 sm:right-3 flex items-center space-x-2"
                >
                  <Button
                    type="submit"
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "transition-all duration-200",
                      "rounded-full w-8 h-8 sm:w-9 sm:h-9 p-0",
                      isMinimal
                        ? "bg-primary/5 hover:bg-primary/10"
                        : "bg-primary/10 hover:bg-primary/20",
                      "text-primary/70 hover:text-primary",
                      "hover:scale-105 transform"
                    )}
                  >
                    <FaArrowUp className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </form>

      {!isMinimal && <AISearch />}
    </motion.article>
  );
}

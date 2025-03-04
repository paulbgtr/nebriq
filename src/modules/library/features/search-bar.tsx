import { Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Spinner } from "@/shared/components/spinner";
import { SearchBarProps } from "../types";

export function SearchBar({
  searchQuery,
  onSearchChange,
  isPendingTransition,
  showSearch,
}: SearchBarProps) {
  return (
    <AnimatePresence mode="wait">
      {showSearch && (
        <motion.div
          initial={{ opacity: 0, y: -10, height: 0 }}
          animate={{ opacity: 1, y: 0, height: "auto" }}
          exit={{ opacity: 0, y: -10, height: 0 }}
          transition={{ duration: 0.2 }}
          className="relative overflow-hidden"
        >
          <div className="relative max-w-2xl mx-auto bg-background/50 backdrop-blur-sm rounded-lg border border-border/40 shadow-sm">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60">
              <Search className="h-4 w-4" />
            </div>
            <Input
              type="text"
              placeholder="Search by title, content, or tags..."
              value={searchQuery}
              onChange={onSearchChange}
              className="w-full pl-10 pr-12 h-11 bg-transparent border-0 focus-visible:ring-1 focus-visible:ring-offset-0 placeholder:text-muted-foreground/50"
              autoFocus
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <div className="mr-1">
                {isPendingTransition && <Spinner size="sm" />}
              </div>
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    onSearchChange({
                      target: { value: "" },
                    } as React.ChangeEvent<HTMLInputElement>)
                  }
                  className="h-7 w-7 p-0 hover:bg-muted/50"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="absolute inset-0 -z-10 bg-gradient-to-b from-muted/20 to-transparent pointer-events-none"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

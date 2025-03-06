import { Tags, Filter } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";
import { FilterBarProps } from "../types";

export function FilterBar({
  categories,
  expandedCategories,
  onToggleCategory,
  showFilters,
}: FilterBarProps) {
  return (
    <AnimatePresence mode="wait">
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden"
        >
          <div className="p-5 rounded-xl border border-border/30 bg-background/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-background/80 border border-primary/20 flex items-center justify-center">
                  <Filter className="h-4 w-4 text-primary/70" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-foreground/90 group-hover:text-foreground">
                    Filter & Sort
                  </h3>
                  <p className="text-xs text-muted-foreground/70 flex items-center gap-1.5">
                    <span className="bg-background/80 border border-primary/20 text-primary/80 px-2 py-0.5 rounded-full text-xs font-medium">
                      {categories.length}
                    </span>
                    <span>categories available</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-5">
              {categories.map(([category, notes]) => (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                      "h-8 text-xs gap-1.5 transition-all duration-200",
                      expandedCategories.includes(category)
                        ? "bg-primary/10 text-primary border-primary/30 shadow-sm"
                        : "hover:bg-primary/5 hover:border-primary/20 border-border/30 bg-background/60"
                    )}
                    onClick={() => onToggleCategory(category)}
                  >
                    <Tags className="h-3.5 w-3.5" />
                    {category}
                    <span
                      className={cn(
                        "inline-flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[10px] font-medium transition-colors duration-200",
                        expandedCategories.includes(category)
                          ? "bg-primary/20 text-primary"
                          : "bg-background/80 border border-border/30 text-muted-foreground/70"
                      )}
                    >
                      {notes.length}
                    </span>
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="absolute inset-0 -z-10 bg-gradient-to-b from-background/30 to-transparent pointer-events-none"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

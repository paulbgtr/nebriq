import { Settings2, Tags } from "lucide-react";
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
          transition={{ duration: 0.2 }}
          className="relative overflow-hidden"
        >
          <div className="p-4 rounded-xl border border-border/40 bg-background/50 backdrop-blur-sm shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Settings2 className="h-5 w-5 text-primary/60" />
                  <motion.div
                    className="absolute inset-0"
                    animate={{
                      rotate: [0, 180],
                    }}
                    transition={{
                      duration: 20,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <Settings2 className="h-5 w-5 text-primary/10" />
                  </motion.div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-foreground/90">
                    Filter & Sort
                  </h3>
                  <p className="text-xs text-muted-foreground/70">
                    {categories.length} categories available
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {categories.map(([category, notes]) => (
                <Button
                  key={category}
                  variant="outline"
                  size="sm"
                  className={cn(
                    "h-8 text-xs gap-1.5 transition-all duration-200",
                    expandedCategories.includes(category)
                      ? "bg-primary/10 text-primary border-primary/30 shadow-sm"
                      : "hover:bg-muted/50"
                  )}
                  onClick={() => onToggleCategory(category)}
                >
                  <Tags className="h-3.5 w-3.5" />
                  {category}
                  <span className="inline-flex h-4 min-w-[16px] items-center justify-center rounded-full bg-muted px-1 text-[10px] font-medium text-muted-foreground/70">
                    {notes.length}
                  </span>
                </Button>
              ))}
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

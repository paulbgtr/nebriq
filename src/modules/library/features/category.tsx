import { ChevronRight, FolderIcon, ChevronUp, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/shared/components/ui/button";
import { NoteList } from "@/shared/components/note-list";
import { cn } from "@/shared/lib/utils";
import { CategoryProps } from "../types";
import { useState } from "react";

const NOTES_PER_CATEGORY = 3;

export function Category({
  category,
  notes,
  isExpanded,
  isSelectionMode,
  viewMode,
  onSelectionChange,
  onToggleCategory,
}: CategoryProps) {
  const [isViewExpanded, setIsViewExpanded] = useState(false);
  const showViewMore = notes.length > NOTES_PER_CATEGORY;
  const displayedNotes = isViewExpanded
    ? notes
    : notes.slice(0, NOTES_PER_CATEGORY);

  const handleNotePlural = (count: number) => {
    return count === 1 ? "note" : "notes";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "rounded-xl border border-border/30",
        "bg-background/50 backdrop-blur-sm",
        "transition-all duration-300 ease-in-out",
        "hover:border-primary/20 hover:bg-background/70",
        "group shadow-sm hover:shadow-md",
        isExpanded ? "ring-1 ring-primary/10" : ""
      )}
    >
      <div
        className={cn(
          "flex items-center gap-3 p-4 cursor-pointer",
          "transition-all duration-300",
          "hover:bg-muted/20 rounded-t-xl",
          "group-hover:bg-muted/10"
        )}
        onClick={() => onToggleCategory(category)}
      >
        <motion.div
          animate={{ rotate: isExpanded ? 90 : 0 }}
          transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
          className="text-primary/60 group-hover:text-primary/80"
        >
          <ChevronRight className="h-5 w-5" />
        </motion.div>
        <div className="flex-1 flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-lg bg-background/80 border border-primary/20 flex items-center justify-center">
              <FolderIcon className="h-5 w-5 text-primary/70 group-hover:text-primary/90 transition-colors duration-300" />
            </div>
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              animate={{
                opacity: [0.4, 1, 0.4],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <div className="w-10 h-10 rounded-lg border border-primary/10 flex items-center justify-center">
                {isExpanded && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-primary/40"></div>
                )}
              </div>
            </motion.div>
          </div>
          <div>
            <h3 className="text-lg font-medium text-foreground/90 group-hover:text-foreground transition-colors duration-300">
              {category}
            </h3>
            <p className="text-sm text-muted-foreground/70 flex items-center gap-1.5">
              <span className="bg-background/80 border border-primary/20 text-primary/80 px-2 py-0.5 rounded-full text-xs font-medium">
                {notes.length}
              </span>
              <span>{handleNotePlural(notes.length)}</span>
            </p>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
            className="overflow-hidden"
          >
            <div className="p-4 pt-2">
              <div className="w-full">
                <NoteList
                  notes={displayedNotes}
                  selectable={isSelectionMode}
                  onSelectionChange={onSelectionChange}
                  viewMode={viewMode}
                />
              </div>
              {showViewMore && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsViewExpanded(!isViewExpanded);
                  }}
                  className={cn(
                    "mt-6 w-full flex items-center justify-center gap-2",
                    "text-primary/70 hover:text-primary hover:bg-primary/10",
                    "transition-all duration-300 group/button"
                  )}
                >
                  {isViewExpanded ? (
                    <>
                      <ChevronUp className="h-4 w-4 group-hover/button:animate-bounce" />
                      <span>Show Less</span>
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-4 w-4 group-hover/button:animate-bounce" />
                      <span>
                        View {notes.length - NOTES_PER_CATEGORY} More Notes
                      </span>
                    </>
                  )}
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

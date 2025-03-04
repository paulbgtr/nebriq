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
        "rounded-xl border border-border/40",
        "bg-card/30 backdrop-blur-sm",
        "transition-all duration-200 ease-in-out",
        "hover:border-border/60 hover:bg-card/40",
        "group"
      )}
    >
      <div
        className={cn(
          "flex items-center gap-3 p-4 cursor-pointer",
          "transition-colors duration-200",
          "hover:bg-muted/30 rounded-t-xl",
          "group-hover:bg-muted/20"
        )}
        onClick={() => onToggleCategory(category)}
      >
        <motion.div
          animate={{ rotate: isExpanded ? 90 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-primary/60 group-hover:text-primary/80"
        >
          <ChevronRight className="h-5 w-5" />
        </motion.div>
        <div className="flex-1 flex items-center gap-3">
          <div className="relative">
            <FolderIcon className="h-6 w-6 text-primary/60 group-hover:text-primary/80" />
            <motion.div
              className="absolute inset-0"
              animate={{
                opacity: [0.4, 1, 0.4],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <FolderIcon className="h-6 w-6 text-primary/10" />
            </motion.div>
          </div>
          <div>
            <h3 className="text-lg font-medium text-foreground/90 group-hover:text-foreground">
              {category}
            </h3>
            <p className="text-sm text-muted-foreground/70">
              {notes.length} {handleNotePlural(notes.length)}
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
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="p-4 pt-2">
              <div
                className={cn(
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                    : "space-y-4"
                )}
              >
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
                  className="mt-6 w-full flex items-center justify-center gap-2 text-primary/70 hover:text-primary hover:bg-primary/10"
                >
                  {isViewExpanded ? (
                    <>
                      <ChevronUp className="h-4 w-4" />
                      Show Less
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-4 w-4" />
                      View {notes.length - NOTES_PER_CATEGORY} More Notes
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

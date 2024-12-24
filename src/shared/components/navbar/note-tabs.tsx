import { X } from "lucide-react";
import { Tabs, TabsList } from "@/shared/components/ui/tabs";
import Link from "next/link";
import { cn } from "@/shared/lib/utils";
import { useNoteTabsStore } from "@/store/note-tabs";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export const NoteTabs = () => {
  const searchParams = useSearchParams();
  const currentNoteId = searchParams.get("id");
  const { openNotes, setOpenNotes } = useNoteTabsStore();

  return (
    <Tabs className="w-full select-none" orientation="horizontal">
      <TabsList
        className="h-10 flex bg-background border-b border-border/10 
          overflow-x-auto no-scrollbar"
      >
        <AnimatePresence initial={false}>
          {openNotes.map((note) => (
            <motion.div
              key={note.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Link
                href={`/write?id=${note.id}`}
                className={cn(
                  "group relative flex items-center h-10 px-3",
                  "min-w-[100px] max-w-[180px]",
                  "transition-colors duration-200",
                  currentNoteId === note.id && [
                    "after:absolute after:bottom-0 after:left-0",
                    "after:w-full after:h-[1px]",
                    "after:bg-foreground/30",
                  ]
                )}
              >
                <div className="flex-1 flex items-center">
                  <span className="text-xs font-medium truncate opacity-70">
                    {note.title || "Untitled"}
                  </span>
                </div>

                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setOpenNotes(openNotes.filter((n) => n.id !== note.id));
                  }}
                  className={cn(
                    "ml-1 p-0.5 rounded-sm opacity-0",
                    "group-hover:opacity-40 hover:opacity-70",
                    "focus-visible:opacity-70 focus-visible:outline-none",
                    "transition-opacity duration-200"
                  )}
                  aria-label="Close tab"
                >
                  <X className="h-3 w-3" />
                </button>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </TabsList>
    </Tabs>
  );
};

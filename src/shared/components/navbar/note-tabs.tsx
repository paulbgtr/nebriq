import { X } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { useNoteTabsStore } from "@/store/note-tabs";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/shared/components/ui/button";
import { useState, useEffect } from "react";

export const NoteTabs = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentNoteId = searchParams.get("id");
  const { openNotes, setOpenNotes } = useNoteTabsStore();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check initial scroll position

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleCloseTab = (noteId: string, e: React.MouseEvent) => {
    e.preventDefault();

    const updatedNotes = openNotes.filter((n) => n.id !== noteId);
    setOpenNotes(updatedNotes);

    if (noteId !== currentNoteId) {
      return;
    }

    if (updatedNotes.length > 0) {
      const lastNote = updatedNotes[updatedNotes.length - 1];
      router.push(`/write?id=${lastNote.id}`);
      return;
    }
    router.push("/home");
  };

  if (openNotes.length === 0) return null;

  return (
    <div
      className={cn(
        "sticky top-16 z-40 w-full bg-background/50 backdrop-blur-sm",
        "transition-all duration-200",
        scrolled && "border-b border-border/40"
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-11 items-center">
          <div className="flex w-full items-center gap-1 overflow-x-auto no-scrollbar">
            {openNotes.map((note) => (
              <div key={note.id} className="relative group flex items-center">
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "relative px-3 h-8",
                    "text-sm font-medium shrink-0",
                    "transition-all duration-200",
                    "hover:bg-transparent",
                    "pr-7", // Space for close button
                    "min-w-[100px]", // Added minimum width
                    currentNoteId === note.id
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                  onClick={() => router.push(`/write?id=${note.id}`)}
                >
                  <span className="relative z-10 max-w-[120px] truncate">
                    <motion.span
                      key={note.title}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                    >
                      {note.title || "Untitled"}
                    </motion.span>
                  </span>

                  {currentNoteId === note.id && (
                    <motion.div
                      layoutId="activeNoteTab"
                      className={cn(
                        "absolute inset-0 rounded-md",
                        "bg-muted/50"
                      )}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                </Button>

                <button
                  onClick={(e) => handleCloseTab(note.id, e)}
                  className={cn(
                    "absolute right-1 p-1 rounded-sm",
                    "opacity-0 group-hover:opacity-100",
                    "focus:opacity-100 focus:outline-none",
                    "transition-opacity duration-200",
                    "text-muted-foreground/50 hover:text-muted-foreground"
                  )}
                  aria-label="Close tab"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

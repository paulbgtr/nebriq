import { z } from "zod";
import { noteSchema } from "@/shared/lib/schemas/note";
import { Button } from "@/shared/components/ui/button";
import { X, Lightbulb, Zap, ExternalLink, Sparkles } from "lucide-react";
import { useNoteTabsStore } from "@/store/note-tabs";
import { motion, AnimatePresence } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import { cn } from "@/shared/lib/utils";

type DiscoveredNote = z.infer<typeof noteSchema> & {
  matchScore: number;
  matchedText?: string;
};

interface NoteDiscoveryProps {
  notes: DiscoveredNote[];
  isOpen: boolean;
  onClose: () => void;
  isLoading: boolean;
}

export function NoteDiscovery({
  notes,
  isOpen,
  onClose,
  isLoading,
}: NoteDiscoveryProps) {
  const { setOpenNotes, openNotes } = useNoteTabsStore();

  if (!isOpen) return null;

  const openNote = (note: DiscoveredNote) => {
    const isNoteOpen = openNotes.some((openNote) => openNote.id === note.id);

    if (!isNoteOpen) {
      setOpenNotes([
        ...openNotes,
        {
          id: note.id,
          title: note.title || "Untitled",
          content: note.content || "",
        },
      ]);
    }
  };

  const renderConnectionLines = () => {
    if (notes.length < 2) return null;

    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {notes.slice(0, Math.min(notes.length, 5)).map((note, index) => {
          const delay = index * 0.2;
          const startX = Math.random() * 30 + 10;
          const startY = 60 + index * 70;

          return (
            <motion.div
              key={`line-${note.id}`}
              className="absolute h-[1.5px] bg-gradient-to-r from-primary/40 to-transparent"
              style={{
                top: `${startY}px`,
                left: `${startX}%`,
                width: "40%",
                transformOrigin: "left center",
              }}
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 0.7 }}
              transition={{ delay, duration: 0.8, ease: "easeOut" }}
            />
          );
        })}
      </div>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed right-5 top-20 w-[340px] bg-background/95 backdrop-blur-xl border border-border/40 rounded-xl shadow-lg z-50 overflow-hidden"
          initial={{ opacity: 0, x: 20, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 20, scale: 0.95 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
            duration: 0.2,
          }}
        >
          <div className="flex items-center justify-between px-4 py-2 border-b border-border/20">
            <div className="flex items-center gap-2.5">
              <div className="flex items-center justify-center h-7 w-7 rounded-full bg-gradient-to-br from-primary/20 to-primary/10">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Connected Notes</p>
              </div>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    className="h-7 w-7 p-0 rounded-full hover:bg-muted/80"
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left">
                  <p>Close</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="max-h-[60vh] overflow-y-auto p-3 scrollbar-thin scrollbar-thumb-muted-foreground/10 hover:scrollbar-thumb-muted-foreground/20">
            {isLoading ? (
              <div className="flex flex-col justify-center items-center p-10 gap-3">
                <div className="relative h-10 w-10">
                  <div className="absolute inset-0 rounded-full border-2 border-primary/10 border-t-primary/80 animate-spin" />
                  <div className="absolute inset-2 rounded-full border border-primary/20" />
                </div>
                <p className="text-sm text-muted-foreground animate-pulse">
                  Finding connections...
                </p>
              </div>
            ) : notes.length === 0 ? (
              <div className="text-center p-8 text-muted-foreground">
                <div className="flex justify-center mb-4">
                  <div className="p-4 rounded-full bg-gradient-to-br from-muted/70 to-muted/30">
                    <Lightbulb className="h-6 w-6 text-muted-foreground/70" />
                  </div>
                </div>
                <p className="text-sm font-medium mb-1">
                  No connected notes found
                </p>
                <p className="text-xs text-muted-foreground/70">
                  Try editing your content to discover connections
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {notes.map((note, index) => (
                  <motion.div
                    key={note.id}
                    className={cn(
                      "relative border border-border/30 rounded-lg p-4",
                      "hover:bg-muted/20 hover:border-primary/20 cursor-pointer transition-all duration-200",
                      "group"
                    )}
                    onClick={() => openNote(note)}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.15,
                      delay: index * 0.05,
                      ease: "easeOut",
                    }}
                  >
                    <div className="absolute -right-1.5 -top-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <div className="bg-primary/10 p-1.5 rounded-full shadow-sm">
                        <ExternalLink className="h-3 w-3 text-primary" />
                      </div>
                    </div>

                    <div className="font-medium text-sm truncate text-foreground">
                      {note.title || "Untitled"}
                    </div>

                    {note.content && (
                      <div className="text-xs text-muted-foreground line-clamp-2 mt-2 leading-relaxed">
                        {note.content.replace(/<[^>]*>/g, "")}
                      </div>
                    )}
                    <div className="flex items-center gap-2 mt-3.5">
                      <div className="relative h-1.5 w-full bg-muted/40 rounded-full overflow-hidden">
                        <motion.div
                          className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary/60 to-primary/80 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${note.matchScore * 100}%` }}
                          transition={{
                            duration: 0.5,
                            delay: 0.1 + index * 0.05,
                          }}
                        />
                      </div>
                      <div className="flex items-center gap-1">
                        <Zap className="h-3 w-3 text-primary/70" />
                        <span className="text-xs font-medium text-primary whitespace-nowrap">
                          {Math.round(note.matchScore * 100)}%
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

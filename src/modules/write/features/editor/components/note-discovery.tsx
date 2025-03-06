import { z } from "zod";
import { noteSchema } from "@/shared/lib/schemas/note";
import { Button } from "@/shared/components/ui/button";
import { X, Zap, ExternalLink, Sparkles, Search } from "lucide-react";
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

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed right-6 top-6 w-[320px] bg-background/95 backdrop-blur-xl border border-border/30 rounded-xl shadow-lg z-50 overflow-hidden"
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
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />

          <div className="flex items-center justify-between px-4 py-3 border-b border-border/20">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center h-6 w-6 rounded-full bg-primary/10">
                <Sparkles className="h-3 w-3 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm text-foreground">
                  Connected Notes
                </p>
              </div>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    className="h-6 w-6 p-0 rounded-full hover:bg-muted/60"
                  >
                    <X className="h-3 w-3" />
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
              <div className="flex flex-col justify-center items-center p-8 gap-3">
                <div className="relative h-8 w-8">
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-primary/10 border-t-primary/70"
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                  <div className="absolute inset-2 rounded-full border border-primary/20" />
                </div>
                <p className="text-sm text-foreground/80 font-medium">
                  <motion.span
                    animate={{ opacity: [0.6, 1, 0.6] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    Finding connections...
                  </motion.span>
                </p>
              </div>
            ) : notes.length === 0 ? (
              <div className="text-center p-6 text-foreground/80">
                <div className="flex justify-center mb-3">
                  <div className="p-3 rounded-full bg-muted/40">
                    <Search className="h-4 w-4 text-foreground/60" />
                  </div>
                </div>
                <p className="text-sm font-medium mb-1">
                  No connected notes found
                </p>
                <p className="text-xs text-foreground/70">
                  Try editing your content to discover connections
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {notes.map((note, index) => (
                  <motion.div
                    key={note.id}
                    className={cn(
                      "relative border border-border/20 rounded-lg p-3",
                      "hover:bg-primary/10 hover:border-primary/20 cursor-pointer transition-all duration-200",
                      "group"
                    )}
                    onClick={() => openNote(note)}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.2,
                      delay: index * 0.05,
                      ease: "easeOut",
                    }}
                  >
                    <div className="absolute -right-1 -top-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <div className="bg-primary/15 p-1 rounded-full shadow-sm">
                        <ExternalLink className="h-2.5 w-2.5 text-primary" />
                      </div>
                    </div>

                    <div className="font-medium text-sm truncate text-foreground mb-1">
                      {note.title || "Untitled"}
                    </div>

                    {note.content && (
                      <div className="text-xs text-foreground/70 line-clamp-2 leading-relaxed">
                        {note.content.replace(/<[^>]*>/g, "")}
                      </div>
                    )}

                    <div className="flex items-center gap-2 mt-2">
                      <div className="relative h-0.5 w-full bg-muted/40 rounded-full overflow-hidden">
                        <motion.div
                          className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary/50 to-primary/70 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${note.matchScore * 100}%` }}
                          transition={{
                            duration: 0.5,
                            delay: 0.1 + index * 0.05,
                          }}
                        />
                      </div>
                      <div className="flex items-center gap-1">
                        <Zap className="h-2.5 w-2.5 text-primary" />
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

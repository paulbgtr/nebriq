import { z } from "zod";
import { noteSchema } from "@/shared/lib/schemas/note";
import { Button } from "@/shared/components/ui/button";
import { X, Lightbulb, Zap } from "lucide-react";
import { useNoteTabsStore } from "@/store/note-tabs";
import { motion, AnimatePresence } from "framer-motion";

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
              className="absolute h-px bg-muted-foreground/20"
              style={{
                top: `${startY}px`,
                left: `${startX}%`,
                width: "40%",
                transformOrigin: "left center",
              }}
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 0.3 }}
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
          className="fixed right-4 top-20 w-80 bg-background/95 border rounded-lg shadow-md z-50 overflow-hidden"
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
          {renderConnectionLines()}

          <div className="flex items-center justify-between p-3 border-b">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-medium text-foreground">Connected Notes</h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="max-h-[60vh] overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-muted-foreground/10 hover:scrollbar-thumb-muted-foreground/20">
            {isLoading ? (
              <div className="flex justify-center items-center p-8">
                <div className="animate-spin h-5 w-5 border-2 border-muted-foreground border-t-transparent rounded-full" />
              </div>
            ) : notes.length === 0 ? (
              <div className="text-center p-6 text-muted-foreground">
                <div className="flex justify-center mb-2">
                  <Lightbulb className="h-5 w-5 text-muted-foreground/50" />
                </div>
                No connected notes found
              </div>
            ) : (
              <ul className="space-y-2">
                {notes.map((note, index) => (
                  <motion.li
                    key={note.id}
                    className="border rounded p-3 hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => openNote(note)}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.15,
                      delay: index * 0.05,
                      ease: "easeOut",
                    }}
                  >
                    <div className="font-medium truncate">
                      {note.title || "Untitled"}
                    </div>
                    {note.content && (
                      <div className="text-sm text-muted-foreground line-clamp-2 mt-1">
                        {note.content.replace(/<[^>]*>/g, "")}
                      </div>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="relative h-0.5 w-full bg-muted rounded-full overflow-hidden">
                        <motion.div
                          className="absolute top-0 left-0 h-full bg-muted-foreground/50 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${note.matchScore * 100}%` }}
                          transition={{
                            duration: 0.5,
                            delay: 0.1 + index * 0.05,
                          }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {Math.round(note.matchScore * 100)}%
                      </span>
                    </div>
                  </motion.li>
                ))}
              </ul>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

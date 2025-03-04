import { Note } from "./note";
import { z } from "zod";
import { noteSchema } from "../lib/schemas/note";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { EmptyState } from "./empty-state";
import { cn } from "../lib/utils";

type NoteListProps = {
  notes: z.infer<typeof noteSchema>[];
  onSelectionChange?: (selectedNotes: string[]) => void;
  selectable?: boolean;
  viewMode?: "grid" | "list";
};

export const NoteList = ({
  notes,
  onSelectionChange,
  selectable = false,
  viewMode = "grid",
}: NoteListProps) => {
  const [selectedNotes, setSelectedNotes] = useState<string[]>([]);
  const [isFirstRender, setIsFirstRender] = useState(true);
  const prevNotesLength = useRef(notes.length);

  useEffect(() => {
    if (isFirstRender) {
      setIsFirstRender(false);
    }

    prevNotesLength.current = notes.length;
  }, [notes.length, isFirstRender]);

  const sortedNotes = [...notes].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  const handleNoteSelect = (noteId: string, selected: boolean) => {
    const newSelection = selected
      ? [...selectedNotes, noteId]
      : selectedNotes.filter((id) => id !== noteId);

    setSelectedNotes(newSelection);
    onSelectionChange?.(newSelection);
  };

  if (!sortedNotes.length) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="py-8"
      >
        <EmptyState
          title="No notes found"
          description="Try adjusting your search or create a new note"
        />
      </motion.div>
    );
  }

  const shouldAnimate = !isFirstRender;

  return (
    <div
      className={cn(
        viewMode === "grid"
          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 lg:gap-6"
          : "flex flex-col gap-4",
        "items-start"
      )}
    >
      <AnimatePresence mode="popLayout">
        {sortedNotes.map((note) => (
          <motion.div
            key={note.id}
            initial={shouldAnimate ? { opacity: 0, y: 20 } : { opacity: 1 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 30,
              mass: 1,
            }}
            layout
            className="h-full w-full"
          >
            <Note
              note={note}
              selectable={selectable}
              selected={selectedNotes.includes(note.id)}
              onSelect={(selected) => handleNoteSelect(note.id, selected)}
              skipAnimation={true}
              viewMode={viewMode}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

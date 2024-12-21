import { Note } from "./note";
import { z } from "zod";
import { noteSchema } from "../lib/schemas/note";
import { motion } from "framer-motion";
import { useState } from "react";

type NoteListProps = {
  notes: z.infer<typeof noteSchema>[];
  onSelectionChange?: (selectedNotes: string[]) => void;
  selectable?: boolean;
};

export const NoteList = ({
  notes,
  onSelectionChange,
  selectable = false,
}: NoteListProps) => {
  const [selectedNotes, setSelectedNotes] = useState<string[]>([]);

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

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {sortedNotes.map((note) => (
        <motion.div key={note.id} variants={item}>
          <Note
            note={note}
            selectable={selectable}
            selected={selectedNotes.includes(note.id)}
            onSelect={(selected) => handleNoteSelect(note.id, selected)}
          />
        </motion.div>
      ))}
    </motion.div>
  );
};

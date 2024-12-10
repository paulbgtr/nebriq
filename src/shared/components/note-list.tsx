import { DetailedNote } from "./detailed-note";
import { Note } from "./note";
import { Note as NoteType } from "@/types/note";
import { motion } from "framer-motion";

type NoteListProps = {
  notes: NoteType[];
};

export const NoteList = ({ notes }: NoteListProps) => {
  const sortedNotes = [...notes].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

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
          <DetailedNote
            {...note}
            initialTags={note.tags}
            createdAt={note.created_at}
          >
            <Note {...note} createdAt={note.created_at} />
          </DetailedNote>
        </motion.div>
      ))}
    </motion.div>
  );
};

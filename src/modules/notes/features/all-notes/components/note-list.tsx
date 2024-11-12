"use client";

import { DetailedNote } from "./detailed-note";
import { Note } from "./note";
import { useNotes } from "@/hooks/useNotes";
import { Spinner } from "@/components/spinner";

export const NoteList = () => {
  const { getNotesQuery } = useNotes();

  const { data: notes, isPending } = getNotesQuery;

  if (!notes) return null;

  if (isPending) return <Spinner size="md" />;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {notes?.map((note) => (
        <DetailedNote
          id={note.id}
          key={note.id}
          title={note.title}
          content={note.content}
          createdAt={note.created_at}
        >
          <Note
            title={note.title}
            content={note.content}
            createdAt={note.created_at}
          />
        </DetailedNote>
      ))}
    </div>
  );
};

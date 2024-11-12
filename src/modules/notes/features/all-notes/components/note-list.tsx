"use client";

import { DetailedNote } from "./detailed-note";
import { Note } from "./note";
import { useNotes } from "@/hooks/useNotes";

export const NoteList = () => {
  const { getNotesQuery } = useNotes();

  const { data: notes } = getNotesQuery;

  const createdAt = new Date(notes?.[0].created_at);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {notes?.map((note) => (
        <DetailedNote
          id={note.id}
          key={note.id}
          title={note.title}
          content={note.content}
          createdAt={createdAt}
        >
          <Note
            title={note.title}
            content={note.content}
            createdAt={createdAt}
          />
        </DetailedNote>
      ))}
    </div>
  );
};

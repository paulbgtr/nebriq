"use client";

import { DetailedNote } from "./detailed-note";
import { Note } from "./note";
import { useNotes } from "@/hooks/useNotes";
import { Spinner } from "@/components/spinner";
import Link from "next/link";

export const NoteList = () => {
  const { getNotesQuery } = useNotes();

  const { data: notes, isPending } = getNotesQuery;

  if (isPending) return <Spinner size="md" />;

  if (!notes?.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4 text-center">
        <p className="text-xl font-light tracking-wide">a blank canvas</p>
        <p className="text-gray-500 text-sm">waiting for your thoughts</p>
        <Link
          href="/write"
          className="mt-4 px-6 py-2 border border-gray-200 text-sm
            text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
        >
          begin writing
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {notes.map((note) => (
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

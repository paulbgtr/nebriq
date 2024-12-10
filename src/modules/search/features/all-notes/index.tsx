"use client";

import { NoteList } from "@/shared/components/note-list";
import { useNotes } from "@/hooks/use-notes";
import { Spinner } from "@/shared/components/spinner";

export default function AllNotes() {
  const { getNotesQuery } = useNotes();
  const { data: notes, isPending } = getNotesQuery;

  if (isPending)
    return (
      <div className="min-h-[400px] flex items-center justify-center bg-gray-50/30 rounded-lg">
        <Spinner size="sm" />
      </div>
    );

  if (!notes?.length) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center gap-6 text-center bg-gray-50/30 rounded-lg p-8">
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
          <svg
            className="w-8 h-8 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
        </div>
        <div>
          <h3 className="text-xl font-medium mb-2">No notes yet</h3>
          <p className="text-gray-500 text-sm max-w-sm">
            Start capturing your thoughts, ideas, and memories.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold mb-1">All Notes</h2>
          <p className="text-gray-500 text-sm">
            {notes.length} note{notes.length !== 1 ? "s" : ""}
          </p>
        </div>
      </header>

      <div className="max-w-[1200px] w-full bg-white rounded-lg">
        <NoteList notes={notes} />
      </div>
    </div>
  );
}

"use client";

import { NoteList } from "@/shared/components/note-list";
import { useNotes } from "@/hooks/use-notes";
import { Spinner } from "@/shared/components/spinner";
import Link from "next/link";

export default function AllNotes() {
  const { getNotesQuery } = useNotes();
  const { data: notes, isPending } = getNotesQuery;

  if (isPending) return <Spinner size="md" />;

  if (!notes?.length) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 text-center">
        <p className="text-xl font-light tracking-wide">no notes</p>
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
    <section>
      <h2 className="text-lg font-normal mb-6 text-gray-500">Here are all your notes</h2>
      <NoteList notes={notes} />
    </section>
  );
}

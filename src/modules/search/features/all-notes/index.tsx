"use client";

import { NoteList } from "@/shared/components/note-list";
import { useNotes } from "@/hooks/use-notes";
import { Spinner } from "@/shared/components/spinner";
import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { CheckSquare } from "lucide-react";
import { Trash2 } from "lucide-react";
import { Pen } from "lucide-react";
import Link from "next/link";

export default function AllNotes() {
  const { getNotesQuery } = useNotes();
  const { data: notes, isPending } = getNotesQuery;
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedNotes, setSelectedNotes] = useState<string[]>([]);

  const handleSelectionChange = (selected: string[]) => {
    setSelectedNotes(selected);
  };

  const toggleSelectionMode = () => {
    setIsSelectionMode(!isSelectionMode);
    setSelectedNotes([]); // Clear selection when toggling mode
  };

  if (isPending)
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Spinner size="sm" />
      </div>
    );

  if (!notes?.length) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center gap-4 text-center">
        <svg
          className="w-6 h-6 text-gray-400"
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
        <div className="space-y-4">
          <div className="space-y-1">
            <h3 className="text-base font-medium">No notes yet</h3>
            <p className="text-sm text-gray-500">
              Start writing your first note
            </p>
          </div>
          <Button variant="ghost" asChild>
            <Link href="/write">
              <Pen />
              <span>compose</span> <span className="sr-only">Note</span>
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h2 className="text-xl font-medium">All Notes</h2>
          <p className="text-sm text-gray-500">
            {notes.length} note{notes.length !== 1 ? "s" : ""}
            {isSelectionMode && selectedNotes.length > 0 && (
              <span className="ml-2 text-gray-400">
                {selectedNotes.length} selected
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSelectionMode}
            className="flex items-center gap-1.5"
          >
            <CheckSquare className="h-4 w-4" />
            {isSelectionMode ? "Done" : "Select"}
          </Button>
          {isSelectionMode && selectedNotes.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </header>

      <div className="w-full">
        <NoteList
          notes={notes}
          selectable={isSelectionMode}
          onSelectionChange={handleSelectionChange}
        />
      </div>
    </div>
  );
}

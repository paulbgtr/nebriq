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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/shared/components/ui/alert-dialog";

export default function AllNotes() {
  const { getNotesQuery, deleteNotesMutation } = useNotes();
  const { data: notes, isPending } = getNotesQuery;
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedNotes, setSelectedNotes] = useState<string[]>([]);

  const handleSelectionChange = (selected: string[]) => {
    setSelectedNotes(selected);
  };

  const handleDeleteMultipleNotes = async () => {
    await deleteNotesMutation.mutateAsync(selectedNotes);
    setSelectedNotes([]);
  };

  const toggleSelectionMode = () => {
    setIsSelectionMode(!isSelectionMode);
    setSelectedNotes([]); // Clear selection when toggling mode
  };

  const handleNotePlural = (count: number) => {
    if (count === 1) return "note";
    return "notes";
  };

  if (isPending)
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Spinner size="sm" />
      </div>
    );

  if (!notes?.length) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center">
        <div className="space-y-1.5">
          <p className="text-sm text-muted-foreground/70">
            Start composing and your notes will appear here
          </p>
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
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete this note?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete {selectedNotes.length}{" "}
                    {handleNotePlural(selectedNotes.length)}? This action cannot
                    be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={(e) => e.stopPropagation()}>
                    {selectedNotes.length > 1 ? "Keep notes" : "Keep note"}
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteMultipleNotes}
                    className="bg-destructive hover:bg-destructive/90"
                  >
                    Delete {handleNotePlural(selectedNotes.length)}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
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

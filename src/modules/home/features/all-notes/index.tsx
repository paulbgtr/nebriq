"use client";

import { NoteList } from "@/shared/components/note-list";
import { useNotes } from "@/hooks/use-notes";
import { Spinner } from "@/shared/components/spinner";
import { useState, useCallback, useTransition } from "react";
import { Button } from "@/shared/components/ui/button";
import { CheckSquare, Trash2, BookOpen, Search } from "lucide-react";
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
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/shared/components/ui/input";

export default function AllNotes() {
  const { getNotesQuery, deleteNotesMutation } = useNotes();
  const { data: notes, isPending } = getNotesQuery;
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedNotes, setSelectedNotes] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [isPendingTransition, startTransition] = useTransition();

  const handleSelectionChange = (selected: string[]) => {
    setSelectedNotes(selected);
  };

  const handleDeleteMultipleNotes = async () => {
    await deleteNotesMutation.mutateAsync(selectedNotes);
    setSelectedNotes([]);
    setIsSelectionMode(false);
  };

  const toggleSelectionMode = () => {
    setIsSelectionMode(!isSelectionMode);
    setSelectedNotes([]); // Clear selection when toggling mode
  };

  const toggleSearch = () => {
    setShowSearch(!showSearch);
    if (showSearch) {
      startTransition(() => {
        setSearchQuery("");
      });
    }
  };

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      startTransition(() => {
        setSearchQuery(value);
      });
    },
    []
  );

  const handleNotePlural = (count: number) => {
    if (count === 1) return "note";
    return "notes";
  };

  const filteredNotes = searchQuery
    ? notes?.filter(
        (note) =>
          note.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          note.content?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : notes;

  if (isPending)
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Spinner size="sm" />
      </div>
    );

  if (!notes?.length) {
    return (
      <motion.div
        className="min-h-[400px] flex flex-col items-center justify-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="space-y-3 text-center">
          <BookOpen className="h-12 w-12 text-muted-foreground/40 mx-auto" />
          <h3 className="text-lg font-medium text-muted-foreground/70">
            No notes yet
          </h3>
          <p className="text-sm text-muted-foreground/60 max-w-md">
            Start composing and your notes will appear here
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <header className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <motion.div
            className="space-y-1"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <h2 className="text-2xl font-semibold tracking-tight">All Notes</h2>
            <p className="text-sm text-muted-foreground">
              {notes.length} {handleNotePlural(notes.length)}
              {isSelectionMode && selectedNotes.length > 0 && (
                <span className="ml-2 text-primary font-medium">
                  • {selectedNotes.length} selected
                </span>
              )}
              {searchQuery && (
                <span className="ml-2 text-muted-foreground/70">
                  • Filtered results {isPendingTransition && "..."}
                </span>
              )}
            </p>
          </motion.div>
          <motion.div
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSearch}
              className="flex items-center gap-1.5"
            >
              <Search className="h-4 w-4" />
              <span className="hidden sm:inline">
                {showSearch ? "Hide search" : "Search"}
              </span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSelectionMode}
              className="flex items-center gap-1.5"
            >
              <CheckSquare className="h-4 w-4" />
              <span className="hidden sm:inline">
                {isSelectionMode ? "Done" : "Select"}
              </span>
            </Button>
            {isSelectionMode && selectedNotes.length > 0 && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 flex items-center gap-1.5"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="hidden sm:inline">Delete</span>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Delete{" "}
                      {selectedNotes.length > 1 ? "these notes" : "this note"}?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete {selectedNotes.length}{" "}
                      {handleNotePlural(selectedNotes.length)}? This action
                      cannot be undone.
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
          </motion.div>
        </div>

        <AnimatePresence>
          {showSearch && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
              }}
              className="relative overflow-hidden"
            >
              <Input
                type="text"
                placeholder="Search notes..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full max-w-md"
                autoFocus
              />
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <div className="w-full">
        <NoteList
          notes={filteredNotes || []}
          selectable={isSelectionMode}
          onSelectionChange={handleSelectionChange}
        />
      </div>
    </motion.div>
  );
}

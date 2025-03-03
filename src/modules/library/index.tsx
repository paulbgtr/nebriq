"use client";

import { useState, useCallback, useTransition } from "react";
import { useNotes } from "@/hooks/use-notes";
import { NoteList } from "@/shared/components/note-list";
import { Spinner } from "@/shared/components/spinner";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  CheckSquare,
  Trash2,
  BookOpen,
  Search,
  FolderIcon,
  ChevronRight,
  ChevronDown,
  Plus,
  Minus,
} from "lucide-react";
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
import { z } from "zod";
import { noteSchema } from "@/shared/lib/schemas/note";
import { cn } from "@/shared/lib/utils";

type NotesByCategory = {
  [category: string]: z.infer<typeof noteSchema>[];
};

const NOTES_PER_CATEGORY = 3; // Initial number of notes to show per category

export default function LibraryModule() {
  const { getNotesQuery, deleteNotesMutation } = useNotes();
  const { data: notes, isPending } = getNotesQuery;
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedNotes, setSelectedNotes] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [isPendingTransition, startTransition] = useTransition();
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [expandedViews, setExpandedViews] = useState<string[]>([]);

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
    setSelectedNotes([]);
  };

  const toggleSearch = () => {
    setShowSearch(!showSearch);
    if (showSearch) {
      startTransition(() => {
        setSearchQuery("");
      });
    }
  };

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const toggleViewMore = (category: string) => {
    setExpandedViews((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
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

  const groupNotesByCategory = (notes: z.infer<typeof noteSchema>[]) => {
    const categorized: NotesByCategory = {};

    notes.forEach((note) => {
      if (!note.tags || note.tags.length === 0) {
        if (!categorized["Uncategorized"]) {
          categorized["Uncategorized"] = [];
        }
        categorized["Uncategorized"].push(note);
      } else {
        note.tags.forEach((tag) => {
          if (!categorized[tag]) {
            categorized[tag] = [];
          }
          categorized[tag].push(note);
        });
      }
    });

    return Object.entries(categorized).sort((a, b) => {
      if (a[0] === "Uncategorized") return 1;
      if (b[0] === "Uncategorized") return -1;
      return a[0].localeCompare(b[0]);
    });
  };

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

  const categorizedNotes = groupNotesByCategory(filteredNotes || []);

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
            <h2 className="text-2xl font-semibold tracking-tight">Library</h2>
            <p className="text-sm text-muted-foreground">
              {notes.length} {handleNotePlural(notes.length)} in{" "}
              {categorizedNotes.length} categories
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

      <div className="w-full space-y-6">
        {categorizedNotes.map(([category, notes]) => {
          const isExpanded = expandedCategories.includes(category);
          const showViewMore = notes.length > NOTES_PER_CATEGORY;
          const isViewExpanded = expandedViews.includes(category);
          const displayedNotes = isViewExpanded
            ? notes
            : notes.slice(0, NOTES_PER_CATEGORY);

          return (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className={cn(
                "rounded-lg border border-border/40",
                "bg-card/30 backdrop-blur-sm",
                "transition-all duration-200 ease-in-out",
                "hover:border-border/60 hover:bg-card/40"
              )}
            >
              <div
                className={cn(
                  "flex items-center gap-2 p-4 cursor-pointer",
                  "transition-colors duration-200",
                  "hover:bg-muted/30 rounded-t-lg"
                )}
                onClick={() => toggleCategory(category)}
              >
                <motion.div
                  animate={{ rotate: isExpanded ? 90 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </motion.div>
                <FolderIcon className="h-5 w-5 text-primary/60" />
                <h3 className="text-lg font-medium text-foreground/80">
                  {category}
                </h3>
                <span className="text-sm font-normal text-muted-foreground">
                  ({notes.length} {handleNotePlural(notes.length)})
                </span>
              </div>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 pt-0">
                      <NoteList
                        notes={displayedNotes}
                        selectable={isSelectionMode}
                        onSelectionChange={handleSelectionChange}
                      />
                      {showViewMore && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleViewMore(category);
                          }}
                          className="mt-4 w-full flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground"
                        >
                          {isViewExpanded ? (
                            <>
                              <Minus className="h-4 w-4" />
                              Show Less
                            </>
                          ) : (
                            <>
                              <Plus className="h-4 w-4" />
                              View {notes.length - NOTES_PER_CATEGORY} More
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

"use client";

import { useState, useCallback, useTransition } from "react";
import { useNotes } from "@/shared/hooks/use-notes";
import { Spinner } from "@/shared/components/spinner";
import { Button } from "@/shared/components/ui/button";
import { BookOpen, FolderIcon, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { ViewMode } from "./types";
import { handleNotePlural, groupNotesByCategory } from "./utils";
import { SearchBar } from "./features/search-bar";
import { FilterBar } from "./features/filter-bar";
import { Category } from "./features/category";
import { HeaderActions } from "./features/header-actions";

export default function LibraryModule() {
  const { getNotesQuery, deleteNotesMutation } = useNotes();
  const { data: notes, isPending } = getNotesQuery;
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedNotes, setSelectedNotes] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [isPendingTransition, startTransition] = useTransition();
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [showFilters, setShowFilters] = useState(false);

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

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      startTransition(() => {
        setSearchQuery(value);
      });
    },
    []
  );

  const filteredNotes = searchQuery
    ? notes?.filter(
        (note) =>
          note.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          note.content?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : notes;

  if (isPending)
    return (
      <motion.div
        className="min-h-[400px] flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="flex flex-col items-center gap-4 text-primary">
          <Spinner size="lg" />
          <p className="text-sm text-muted-foreground animate-pulse">
            Loading your library...
          </p>
        </div>
      </motion.div>
    );

  if (!notes?.length) {
    return (
      <motion.div
        className="min-h-[400px] flex flex-col items-center justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="space-y-6 text-center">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="relative">
              <BookOpen className="h-16 w-16 text-primary/30 mx-auto" />
              <motion.div
                className="absolute inset-0"
                animate={{
                  opacity: [0.4, 1, 0.4],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <BookOpen className="h-16 w-16 text-primary/10 mx-auto" />
              </motion.div>
            </div>
          </motion.div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-foreground/90">
              Your Library Awaits
            </h3>
            <p className="text-sm text-muted-foreground/80 max-w-md mx-auto leading-relaxed">
              Start your journey by creating your first note. Organize your
              thoughts, ideas, and inspirations in one place.
            </p>
          </div>
          <Button size="lg" className="bg-primary/90 hover:bg-primary">
            <Plus className="h-4 w-4 mr-2" />
            Create Your First Note
          </Button>
        </div>
      </motion.div>
    );
  }

  const categorizedNotes = groupNotesByCategory(filteredNotes || []);

  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <header className="space-y-6">
        <div className="flex items-start justify-between">
          <motion.div
            className="space-y-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <BookOpen className="h-8 w-8 text-primary/60" />
                <motion.div
                  className="absolute inset-0"
                  animate={{
                    opacity: [0.4, 1, 0.4],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <BookOpen className="h-8 w-8 text-primary/10" />
                </motion.div>
              </div>
              <h2 className="text-3xl font-bold">Library</h2>
            </div>
            <p className="text-sm text-muted-foreground/80 flex items-center gap-2">
              <span className="flex items-center gap-1.5">
                <BookOpen className="h-4 w-4" />
                {notes.length} {handleNotePlural(notes.length)}
              </span>
              <span className="text-muted-foreground/40">•</span>
              <span className="flex items-center gap-1.5">
                <FolderIcon className="h-4 w-4" />
                {categorizedNotes.length} categories
              </span>
              {isSelectionMode && selectedNotes.length > 0 && (
                <>
                  <span className="text-muted-foreground/40">•</span>
                  <span className="text-primary font-medium flex items-center gap-1.5">
                    {selectedNotes.length} selected
                  </span>
                </>
              )}
            </p>
          </motion.div>

          <HeaderActions
            viewMode={viewMode}
            setViewMode={setViewMode}
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            showSearch={showSearch}
            toggleSearch={toggleSearch}
            isSelectionMode={isSelectionMode}
            toggleSelectionMode={toggleSelectionMode}
            selectedNotes={selectedNotes}
            onDeleteNotes={handleDeleteMultipleNotes}
          />
        </div>

        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          isPendingTransition={isPendingTransition}
          showSearch={showSearch}
        />

        <FilterBar
          categories={categorizedNotes}
          expandedCategories={expandedCategories}
          onToggleCategory={toggleCategory}
          showFilters={showFilters}
        />
      </header>

      <div className="w-full space-y-6">
        {categorizedNotes.map(([category, notes]) => (
          <Category
            key={category}
            category={category}
            notes={notes}
            isExpanded={expandedCategories.includes(category)}
            isSelectionMode={isSelectionMode}
            viewMode={viewMode}
            onSelectionChange={handleSelectionChange}
            onToggleCategory={toggleCategory}
          />
        ))}
      </div>
    </motion.div>
  );
}

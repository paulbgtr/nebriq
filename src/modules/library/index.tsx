"use client";

import { useState, useCallback, useTransition } from "react";
import { useNotes } from "@/shared/hooks/use-notes";
import { useSubscription } from "@/shared/hooks/use-subscription";
import { Spinner } from "@/shared/components/spinner";
import { Button, buttonVariants } from "@/shared/components/ui/button";
import {
  BookOpen,
  FolderIcon,
  Plus,
  Network,
  BookMarked,
  Library,
  Compass,
  Zap,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ViewMode } from "./types";
import { handleNotePlural, groupNotesByCategory } from "./utils";
import { SearchBar } from "./features/search-bar";
import { FilterBar } from "./features/filter-bar";
import { Category } from "./features/category";
import { HeaderActions } from "./features/header-actions";
import { Visualization } from "@/modules/library/features/visualization";
import { SmartView } from "@/modules/library/features/smart-view";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import Link from "next/link";
import { cn } from "@/shared/lib/utils";
export default function LibraryModule() {
  const { getNotesQuery, deleteNotesMutation } = useNotes();
  const { isFree } = useSubscription();
  const { data: notes, isPending } = getNotesQuery;
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedNotes, setSelectedNotes] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [isPendingTransition, startTransition] = useTransition();
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState("smart");

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
          <div className="relative">
            <Spinner size="lg" className="text-primary" />
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
              <Spinner size="lg" className="text-primary/20" />
            </motion.div>
          </div>
          <p className="text-sm text-muted-foreground animate-pulse">
            Loading your knowledge hub...
          </p>
        </div>
      </motion.div>
    );

  if (!notes?.length) {
    return (
      <motion.div
        className="min-h-[500px] flex flex-col items-center justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="space-y-8 text-center max-w-md mx-auto">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
          >
            <div className="w-24 h-24 rounded-full bg-background/80 border border-primary/20 mx-auto flex items-center justify-center">
              <BookMarked className="h-12 w-12 text-primary/70 mx-auto" />
            </div>
          </motion.div>
          <div className="space-y-3">
            <h3 className="text-2xl font-bold text-foreground/90">
              Your Knowledge Hub Awaits
            </h3>
            <p className="text-sm text-muted-foreground/80 max-w-md mx-auto leading-relaxed">
              Start your journey by creating your first note. Organize your
              thoughts, ideas, and inspirations in one place.
            </p>
            {isFree && (
              <p className="text-xs text-muted-foreground/60 italic max-w-md mx-auto">
                Free plan includes up to 50 notes.
                <span className="text-amber-500/80 ml-1 font-medium">
                  Upgrade to Pro for unlimited notes.
                </span>
              </p>
            )}
          </div>
          <Link
            href="/write"
            className={cn(
              buttonVariants({ variant: "default" }),
              "shadow-sm group"
            )}
          >
            <Plus className="h-4 w-4 group-hover:rotate-90 transition-transform duration-300" />
            <span>Create Your First Note</span>
          </Link>
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
                <div className="w-12 h-12 rounded-xl bg-background/80 border border-primary/20 flex items-center justify-center">
                  <Library className="h-6 w-6 text-primary/80" />
                </div>
                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  animate={{
                    opacity: [0.4, 1, 0.4],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <div className="w-12 h-12 rounded-xl border border-primary/10 flex items-center justify-center">
                    <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-primary/40"></div>
                  </div>
                </motion.div>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-foreground/90">
                  Knowledge Hub
                </h2>
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
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
                  {isFree && (
                    <div className="text-xs flex items-center gap-1.5 text-muted-foreground/70">
                      <div
                        className={`h-1.5 w-1.5 rounded-full ${
                          notes.length > 40 ? "bg-amber-500" : "bg-muted"
                        }`}
                      />
                      <span>{notes.length}/50 notes</span>
                      {notes.length > 40 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-5 px-1.5 text-xs font-medium text-amber-500 hover:text-amber-600 hover:bg-amber-500/10"
                          onClick={() =>
                            (window.location.href = "/subscription")
                          }
                        >
                          <Zap className="h-3 w-3 mr-1" />
                          Upgrade
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
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

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto bg-background/50 backdrop-blur-sm border border-border/30 p-1 rounded-xl">
          <TabsTrigger
            value="smart"
            className="flex items-center gap-2 rounded-lg data-[state=active]:bg-primary/90 data-[state=active]:text-white transition-all duration-300"
          >
            <Compass className="h-4 w-4" />
            <span className="hidden sm:inline">Smart View</span>
          </TabsTrigger>
          <TabsTrigger
            value="collection"
            className="flex items-center gap-2 rounded-lg data-[state=active]:bg-primary/90 data-[state=active]:text-white transition-all duration-300"
          >
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Collection</span>
          </TabsTrigger>
          <TabsTrigger
            value="graph"
            className="flex items-center gap-2 rounded-lg data-[state=active]:bg-primary/90 data-[state=active]:text-white transition-all duration-300"
          >
            <Network className="h-4 w-4" />
            <span className="hidden sm:inline">Graph</span>
          </TabsTrigger>
        </TabsList>

        <AnimatePresence mode="wait">
          {activeTab === "smart" && (
            <TabsContent value="smart" className="mt-6">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <SmartView
                  notes={filteredNotes || []}
                  viewMode={viewMode}
                  smartViewMode={"recent"}
                  isSelectionMode={isSelectionMode}
                  onSelectionChange={handleSelectionChange}
                />
              </motion.div>
            </TabsContent>
          )}

          {activeTab === "collection" && (
            <TabsContent value="collection" className="space-y-6 mt-6">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="grid gap-6"
              >
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
              </motion.div>
            </TabsContent>
          )}

          {activeTab === "graph" && (
            <TabsContent value="graph" className="mt-6">
              <motion.div
                className="h-[600px] rounded-xl border border-border/30 bg-background/50 backdrop-blur-sm overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="h-full relative">
                  <div className="absolute inset-0">
                    <Visualization />
                  </div>
                </div>
              </motion.div>
            </TabsContent>
          )}
        </AnimatePresence>
      </Tabs>
    </motion.div>
  );
}

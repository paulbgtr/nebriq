import { EditorContent } from "@tiptap/react";
import { useState, useEffect } from "react";
import {
  Expand,
  Shrink,
  Save,
  Sparkles,
  BookOpen,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { TagManager } from "./tag-manager";
import { EditorContextMenu } from "./context-menu";
import { cn } from "@/shared/lib/utils";
import { useEditorCounts } from "@/modules/write/hooks/use-editor-counts";
import { useCustomEditor } from "@/modules/write/hooks/use-editor";
import { useNoteDiscovery } from "@/modules/write/hooks/use-note-discovery";
import { NoteDiscovery } from "./note-discovery";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import { motion, AnimatePresence } from "framer-motion";

export function Editor({ initialNoteId }: { initialNoteId: string | null }) {
  const {
    id,
    title,
    content,
    handleTitleChange,
    editor,
    updateNote,
    isSaving,
  } = useCustomEditor(initialNoteId);

  const {
    wordCount,
    characterCount,
    sentenceCount,
    paragraphCount,
    readingTime,
  } = useEditorCounts({
    editor,
    content,
  });

  const { isSearching, discoveredNotes, isDiscoveryOpen, toggleDiscovery } =
    useNoteDiscovery(editor, id);

  const [isZenMode, setIsZenMode] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showControls, setShowControls] = useState(true);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle zen mode with Alt+Z
      if (e.altKey && e.key === "z") {
        setIsZenMode(!isZenMode);
      }

      // Toggle controls with Alt+C
      if (e.altKey && e.key === "c") {
        setShowControls(!showControls);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isZenMode, showControls]);

  useEffect(() => {
    if (editor) {
      const handleFocus = () => setIsEditing(true);
      const handleBlur = () => setIsEditing(false);

      editor.on("focus", handleFocus);
      editor.on("blur", handleBlur);

      return () => {
        editor.off("focus", handleFocus);
        editor.off("blur", handleBlur);
      };
    }
  }, [editor]);

  if (!editor) {
    return null;
  }

  const editorContainerClass = cn(
    "mx-auto container",
    isZenMode
      ? ["max-w-2xl sm:max-w-3xl lg:max-w-4xl", "px-4 sm:px-6 md:px-8 lg:px-12"]
      : ["max-w-full", "px-3 sm:px-4 md:px-6"],
    "overflow-y-auto scrollbar-thin scrollbar-thumb-muted-foreground/10 hover:scrollbar-thumb-muted-foreground/20",
    "transition-all duration-300 ease-in-out",
    "focus-within:ring-0 selection:bg-primary/20",
    "dark:prose-invert dark:prose-pre:bg-muted/50",
    "touch-manipulation sm:touch-auto"
  );

  return (
    <motion.div
      className={cn(
        "transition-all duration-300",
        isZenMode && "fixed inset-0 bg-background p-4 sm:p-6 md:p-8 z-50"
      )}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className={editorContainerClass}>
        {/* Floating controls */}
        <AnimatePresence>
          {showControls && (
            <motion.div
              className="fixed bottom-6 right-6 z-10 flex items-center gap-1.5 bg-background/90 backdrop-blur-md border border-border/40 rounded-full px-2 py-1.5 shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2 }}
            >
              <AnimatePresence>
                {isSaving && (
                  <motion.div
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-xs text-foreground/80 font-medium flex items-center gap-1.5 pr-1"
                  >
                    <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                    <span>Saving</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => updateNote()}
                      disabled={isSaving}
                      className="h-7 w-7 rounded-full bg-muted/40 hover:bg-muted/60 transition-colors"
                    >
                      <Save
                        className={cn(
                          "h-3 w-3 text-foreground",
                          isSaving && "animate-spin"
                        )}
                      />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p>Save (Ctrl+S)</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "h-7 w-7 rounded-full",
                        isDiscoveryOpen
                          ? "bg-primary/20 text-primary"
                          : "bg-muted/40 hover:bg-muted/60 text-foreground"
                      )}
                      onClick={toggleDiscovery}
                      disabled={!id}
                    >
                      <Sparkles
                        className={cn(
                          "h-3 w-3",
                          isSearching && "animate-pulse"
                        )}
                      />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p>Find connected notes (Alt+L)</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowStats(!showStats)}
                      className={cn(
                        "h-7 w-7 rounded-full",
                        showStats
                          ? "bg-primary/20 text-primary"
                          : "bg-muted/40 hover:bg-muted/60 text-foreground"
                      )}
                    >
                      <BookOpen className="h-3 w-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p>Toggle statistics</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "h-7 w-7 rounded-full",
                        isZenMode
                          ? "bg-primary/20 text-primary"
                          : "bg-muted/40 hover:bg-muted/60 text-foreground"
                      )}
                      onClick={() => setIsZenMode(!isZenMode)}
                    >
                      {isZenMode ? (
                        <Shrink className="h-3 w-3" />
                      ) : (
                        <Expand className="h-3 w-3" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p>Toggle zen mode (Alt+Z)</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <div className="h-4 w-[1px] bg-border/50 mx-0.5" />

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 rounded-full bg-muted/40 hover:bg-muted/60 text-foreground transition-colors"
                      onClick={() => setShowControls(false)}
                    >
                      <MoreHorizontal className="h-3 w-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p>Hide controls (Alt+C)</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hidden controls toggle */}
        <AnimatePresence>
          {!showControls && (
            <motion.div
              className="fixed bottom-6 right-6 z-10"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
            >
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-9 w-9 rounded-full shadow-sm hover:shadow-md transition-all duration-200 border-border/40"
                      onClick={() => setShowControls(true)}
                    >
                      <MoreHorizontal className="h-4 w-4 text-foreground" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p>Show controls (Alt+C)</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats display */}
        <AnimatePresence>
          {showStats && (
            <motion.div
              className="fixed bottom-20 right-6 z-10 bg-background/90 backdrop-blur-md border border-border/40 rounded-lg px-3 py-2 shadow-sm"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex flex-col gap-1.5 text-xs">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-foreground/70">Words</span>
                  <span className="font-medium text-foreground">
                    {wordCount}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-foreground/70">Characters</span>
                  <span className="font-medium text-foreground">
                    {characterCount}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-foreground/70">Reading time</span>
                  <span className="font-medium text-foreground">
                    {readingTime} min
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-foreground/70">Paragraphs</span>
                  <span className="font-medium text-foreground">
                    {paragraphCount}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-foreground/70">Sentences</span>
                  <span className="font-medium text-foreground">
                    {sentenceCount}
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex flex-col">
          {/* Title input */}
          <motion.div
            className="relative mb-1"
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <input
              type="text"
              value={title}
              onChange={(e) => {
                handleTitleChange(e.target.value);
              }}
              placeholder="Untitled"
              className={cn(
                "text-xl sm:text-2xl font-bold",
                "bg-transparent border-none outline-none",
                "placeholder:text-gray-400 focus:ring-0",
                "w-full truncate py-1",
                "transition-all duration-200"
              )}
            />
          </motion.div>

          {/* Tags */}
          {id && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="mb-3"
            >
              <TagManager noteId={id} className="w-full" />
            </motion.div>
          )}

          {/* Editor content */}
          <EditorContextMenu editor={editor}>
            <motion.div
              className={cn(
                "flex flex-col flex-1",
                "min-h-[calc(100vh-12rem)]",
                "cursor-text prose prose-sm sm:prose-base max-w-none",
                "overflow-auto scroll-smooth",
                "prose-p:my-1.5",
                "prose-headings:mt-3 prose-headings:mb-2",
                "leading-relaxed",
                "prose-mark:bg-transparent prose-mark:border prose-mark:border-dashed prose-mark:border-muted-foreground/30 prose-mark:px-0.5 prose-mark:rounded",
                "prose-mark:cursor-pointer prose-mark:hover:bg-green-500/10 prose-mark:hover:border-green-500/30 prose-mark:dark:hover:bg-green-500/10",
                "prose-mark:relative prose-mark:after:content-[attr(data-note-title)] prose-mark:after:absolute prose-mark:after:hidden prose-mark:hover:after:block prose-mark:after:bottom-full prose-mark:after:left-1/2 prose-mark:after:-translate-x-1/2 prose-mark:after:bg-popover prose-mark:after:text-popover-foreground prose-mark:after:px-2 prose-mark:after:py-1 prose-mark:after:rounded prose-mark:after:text-xs prose-mark:after:whitespace-nowrap prose-mark:after:shadow-md",
                "[&_.animate-highlight]:animate-pulse [&_.animate-highlight]:duration-500",
                "relative"
              )}
              onClick={() => editor?.commands.focus()}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {/* Subtle background gradient */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-primary/[0.02] pointer-events-none" />

              {/* Editor content */}
              <div className="relative">
                <EditorContent editor={editor} />
              </div>

              {/* Subtle animated cursor indicator when editor is focused */}
              <AnimatePresence>
                {isEditing && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/30 to-transparent"
                    initial={{ opacity: 0, scaleX: 0 }}
                    animate={{ opacity: 1, scaleX: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  />
                )}
              </AnimatePresence>
            </motion.div>
          </EditorContextMenu>
        </div>
      </div>

      <NoteDiscovery
        notes={discoveredNotes}
        isOpen={isDiscoveryOpen}
        onClose={toggleDiscovery}
        isLoading={isSearching}
      />
    </motion.div>
  );
}

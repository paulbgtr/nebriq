import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";
import { FaArrowUp } from "react-icons/fa";
import {
  KeyboardEvent,
  useState,
  useCallback,
  useMemo,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import { Textarea } from "@/shared/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import {
  FileText,
  X,
  StickyNote,
  Brain,
  Book,
  Search,
  Sparkles,
} from "lucide-react";
import { useNotes } from "@/shared/hooks/use-notes";
import { formatDate } from "@/shared/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { z } from "zod";
import { noteSchema } from "@/shared/lib/schemas/note";
import { ModelSelector } from "./model-selector";
import { getRandomQuote } from "@/modules/home/utils";
import { LucideIcon } from "lucide-react";

export interface InputAreaHandle {
  focusInput: () => void;
}

type Props = {
  followUp: string;
  setFollowUp: (followUp: string) => void;
  setQuery: (query: string) => void;
  isEmpty?: boolean;
};

const AttachedNotePreview = ({
  note,
  onRemove,
}: {
  note: z.infer<typeof noteSchema>;
  onRemove: () => void;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={cn(
        "flex items-center gap-2 px-2.5 py-1",
        "rounded-full",
        "bg-primary/5 hover:bg-primary/10",
        "border border-primary/15",
        "group transition-colors duration-200"
      )}
    >
      <FileText className="w-3 h-3 text-primary/60 shrink-0" />
      <span className="text-xs font-medium truncate max-w-[120px] text-primary/80">
        {note.title || "Untitled"}
      </span>
      <button
        onClick={onRemove}
        className="text-primary/40 hover:text-primary/80 opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="Remove note"
      >
        <X className="w-3 h-3" />
      </button>
    </motion.div>
  );
};

const Quote = () => {
  const [quote, setQuote] = useState("");

  useEffect(() => {
    setQuote(getRandomQuote());
  }, []);

  return (
    <div className="flex items-center justify-center my-3">
      <div className="relative">
        <span className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">
          {quote || ""}
        </span>
      </div>
    </div>
  );
};

const QueryExample = ({
  icon: Icon,
  text,
  onClick,
}: {
  icon: LucideIcon;
  text: string;
  onClick: () => void;
}) => (
  <motion.button
    onClick={onClick}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className={cn(
      "flex items-center gap-2",
      "px-3 py-2",
      "rounded-lg",
      "bg-muted/20 hover:bg-muted/30",
      "border border-border/20 hover:border-border/30",
      "transition-colors duration-200",
      "group"
    )}
  >
    <div className="text-primary/60 group-hover:text-primary/80 transition-colors">
      <Icon className="w-4 h-4" />
    </div>
    <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
      {text}
    </span>
  </motion.button>
);

const QueryExamples = ({ onSelect }: { onSelect: (query: string) => void }) => {
  const { getNotesQuery } = useNotes();
  const notes = getNotesQuery.data || [];

  const examples = useMemo(() => {
    const staticExamples = [
      {
        icon: Brain,
        text: "Create Quiz",
        query: "Create a quiz from my notes",
      },
      { icon: Book, text: "Summarize", query: "Summarize my recent notes" },
    ];

    const dynamicExamples = [];

    const allTags = notes.flatMap((note) => note.tags || []);
    if (allTags.length > 0) {
      const randomTag = allTags[Math.floor(Math.random() * allTags.length)];
      dynamicExamples.push({
        icon: Search,
        text: `Find ${randomTag}`,
        query: `Find notes about ${randomTag}`,
      });
    }

    const recentNote = notes[0];
    if (recentNote?.title) {
      dynamicExamples.push({
        icon: Sparkles,
        text: `Review`,
        query: `Explain the concepts in "${recentNote.title}"`,
      });
    }

    return [...staticExamples, ...dynamicExamples];
  }, [notes]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ delay: 0.1 }}
      className="flex flex-wrap items-center gap-2 mt-3 px-1"
    >
      {examples.map((example, i) => (
        <QueryExample
          key={i}
          icon={example.icon}
          text={example.text}
          onClick={() => onSelect(example.query)}
        />
      ))}
    </motion.div>
  );
};

export const InputArea = forwardRef<InputAreaHandle, Props>(
  ({ followUp, setFollowUp, setQuery, isEmpty = false }, ref) => {
    const [selectedNoteIds, setSelectedNoteIds] = useState<string[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const { getNotesQuery } = useNotes();
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Expose the focusInput function through the ref
    useImperativeHandle(ref, () => ({
      focusInput: () => {
        if (textareaRef.current) {
          textareaRef.current.focus();
        }
      },
    }));

    const selectedNotes =
      getNotesQuery.data?.filter((note) => selectedNoteIds.includes(note.id)) ||
      [];

    const filteredNotes =
      searchQuery && getNotesQuery.data
        ? getNotesQuery.data.filter(
            (note) =>
              !selectedNoteIds.includes(note.id) &&
              (note.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                note.content?.toLowerCase().includes(searchQuery.toLowerCase()))
          )
        : getNotesQuery.data?.filter(
            (note) => !selectedNoteIds.includes(note.id)
          );

    const handleSearchChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
      },
      []
    );

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        if (followUp.trim()) {
          if (selectedNoteIds.length > 0) {
            localStorage.setItem(
              "attachedNoteIds",
              JSON.stringify(selectedNoteIds)
            );
          }
          setQuery(followUp);
          setFollowUp("");
          setSelectedNoteIds([]);
        }
      }
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (followUp.trim()) {
        if (selectedNoteIds.length > 0) {
          localStorage.setItem(
            "attachedNoteIds",
            JSON.stringify(selectedNoteIds)
          );
        }
        setQuery(followUp);
        setFollowUp("");
        setSelectedNoteIds([]);
      }
    };

    const handleNoteSelect = (noteId: string) => {
      setSelectedNoteIds((prev) => [...prev, noteId]);
      setIsOpen(false);
      setSearchQuery("");
    };

    const handleNoteRemove = (noteId: string) => {
      setSelectedNoteIds((prev) => prev.filter((id) => id !== noteId));
    };

    return (
      <div
        className={cn(
          "w-full bg-background/70 backdrop-blur-xl border-t border-border/20",
          "transition-all duration-500 ease-in-out",
          "flex-shrink-0",
          isEmpty && "border-transparent"
        )}
      >
        <div
          className={cn(
            "px-4 sm:px-6 lg:px-8 py-4 max-w-2xl mx-auto",
            isEmpty && "px-6 py-8 sm:py-12"
          )}
        >
          <AnimatePresence>
            {isEmpty && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="mb-6"
              >
                <div className="flex flex-col items-center gap-8">
                  <Quote />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="relative space-y-3">
            <AnimatePresence>
              {selectedNotes.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2 overflow-hidden"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    {selectedNotes.map((note) => (
                      <AttachedNotePreview
                        key={note.id}
                        note={note}
                        onRemove={() => handleNoteRemove(note.id)}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div
              className={cn(
                "relative rounded-2xl border border-border/30",
                "bg-gradient-to-b from-background/95 to-background/90",
                "backdrop-blur-xl overflow-hidden",
                "focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/30",
                "transition-all duration-300 ease-in-out shadow-sm",
                isEmpty && "shadow-lg"
              )}
            >
              <div className="flex items-center">
                <Textarea
                  ref={textareaRef}
                  value={followUp}
                  onChange={(e) => setFollowUp(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Message Briq..."
                  rows={1}
                  aria-label="Type your message"
                  className={cn(
                    "min-h-[52px] max-h-[200px] flex-1",
                    "py-3.5 px-4",
                    "text-base leading-relaxed resize-none",
                    "border-0 focus:ring-0 focus-visible:ring-0 ring-0 shadow-none outline-none",
                    "bg-transparent",
                    "placeholder:text-muted-foreground/40",
                    "scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent",
                    "transition-all duration-300 ease-in-out"
                  )}
                />
                <div className="flex items-center gap-2 px-4">
                  <Button
                    type="submit"
                    disabled={followUp.length === 0}
                    className={cn(
                      "flex items-center justify-center",
                      "h-8 w-8 rounded-full",
                      "transition-all duration-300 ease-in-out",
                      followUp.length > 0
                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                        : "bg-muted/40 text-muted-foreground",
                      "disabled:opacity-40 disabled:cursor-not-allowed"
                    )}
                  >
                    <FaArrowUp className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>

              <div
                className={cn(
                  "flex items-center justify-between",
                  "border-t border-border/10",
                  "bg-muted/20",
                  "px-4 py-2.5"
                )}
              >
                <div className="flex items-center gap-2">
                  <Popover open={isOpen} onOpenChange={setIsOpen}>
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        className={cn(
                          "flex items-center gap-2 px-2 py-1",
                          "rounded-full",
                          "text-xs font-medium",
                          "hover:bg-muted/50",
                          "text-muted-foreground/70 hover:text-muted-foreground",
                          "transition-colors duration-200"
                        )}
                      >
                        <StickyNote className="w-3.5 h-3.5" />
                        <span>Add context</span>
                      </button>
                    </PopoverTrigger>
                    <PopoverContent
                      side="top"
                      align="start"
                      className="w-80 p-3 rounded-lg shadow-md border border-border/30 bg-background/95 backdrop-blur-sm"
                    >
                      <div className="space-y-3">
                        <div className="space-y-2">
                          <div className="text-xs font-medium text-muted-foreground mb-2">
                            Attach notes to your message
                          </div>
                          <div className="relative">
                            <input
                              type="text"
                              placeholder="Search notes..."
                              value={searchQuery}
                              onChange={handleSearchChange}
                              className={cn(
                                "w-full py-1.5 px-2.5",
                                "text-xs",
                                "rounded-md border border-input/50 focus:border-primary/30",
                                "bg-background",
                                "focus-visible:ring-1 focus-visible:ring-primary/30 focus-visible:outline-none"
                              )}
                            />
                          </div>
                          <div className="max-h-[300px] overflow-y-auto space-y-1 mt-2">
                            <AnimatePresence mode="popLayout">
                              {filteredNotes?.map((note) => (
                                <motion.button
                                  key={note.id}
                                  layout
                                  initial={{ opacity: 0, y: 5 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, scale: 0.95 }}
                                  onClick={() => handleNoteSelect(note.id)}
                                  className={cn(
                                    "w-full text-left p-2 rounded-md",
                                    "transition-colors duration-200",
                                    "hover:bg-muted/50"
                                  )}
                                >
                                  <div className="space-y-1">
                                    <div className="flex items-start justify-between gap-2">
                                      <h5 className="font-medium text-sm text-foreground/90 truncate">
                                        {note.title || "Untitled"}
                                      </h5>
                                      <time className="text-[10px] text-muted-foreground/60 whitespace-nowrap">
                                        {formatDate(note.created_at)}
                                      </time>
                                    </div>
                                    {note.content && (
                                      <p className="text-xs text-muted-foreground line-clamp-2">
                                        {note.content.replace(/<[^>]*>/g, "")}
                                      </p>
                                    )}
                                  </div>
                                </motion.button>
                              ))}
                            </AnimatePresence>
                            {filteredNotes?.length === 0 && (
                              <div className="text-center py-6">
                                <p className="text-sm text-muted-foreground">
                                  No notes found
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>

                <ModelSelector />
              </div>
            </div>
          </form>
          <AnimatePresence>
            {isEmpty && (
              <QueryExamples onSelect={(query) => setFollowUp(query)} />
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  }
);

InputArea.displayName = "InputArea";

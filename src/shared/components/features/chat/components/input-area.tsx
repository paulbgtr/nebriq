import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";
import { FaArrowUp } from "react-icons/fa";
import { KeyboardEvent, useState, useCallback } from "react";
import { Textarea } from "@/shared/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { FileText, X, StickyNote } from "lucide-react";
import { useNotes } from "@/hooks/use-notes";
import { formatDate } from "@/shared/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { z } from "zod";
import { noteSchema } from "@/shared/lib/schemas/note";

type Props = {
  followUp: string;
  setFollowUp: (followUp: string) => void;
  setQuery: (query: string) => void;
  maxLength: number;
  isFullscreen?: boolean;
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

export const InputArea = ({
  followUp,
  setFollowUp,
  setQuery,
  maxLength,
  isFullscreen = false,
}: Props) => {
  const [selectedNoteIds, setSelectedNoteIds] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { getNotesQuery } = useNotes();

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
        "w-full bg-background/95 backdrop-blur-sm border-t border-border/10 transition-all duration-500 ease-in-out",
        isFullscreen ? "px-8 py-5" : "p-3"
      )}
    >
      <form
        onSubmit={handleSubmit}
        className={cn(
          "relative mx-auto space-y-2 transition-all duration-500 ease-in-out",
          isFullscreen && "max-w-2xl"
        )}
      >
        <AnimatePresence>
          {selectedNotes.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-2"
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

        <div className="relative rounded-xl border border-border/20 bg-background/80 overflow-hidden focus-within:ring-1 focus-within:ring-primary/30 focus-within:border-primary/20 transition-all duration-300 ease-in-out">
          <Textarea
            value={followUp}
            onChange={(e) => setFollowUp(e.target.value)}
            onKeyDown={handleKeyDown}
            maxLength={maxLength}
            placeholder="Message Briq..."
            rows={1}
            aria-label="Type your message"
            className={cn(
              "min-h-[44px] max-h-[180px] w-full",
              "py-2.5 px-3.5",
              "text-sm leading-relaxed resize-none",
              "border-0 focus:ring-0 focus-visible:ring-0 ring-0 shadow-none outline-none",
              "bg-transparent",
              "placeholder:text-muted-foreground/40",
              "scrollbar-thin scrollbar-thumb-primary/20",
              "scrollbar-track-transparent",
              "transition-all duration-300 ease-in-out",
              isFullscreen && "min-h-[52px] text-base"
            )}
          />

          <div
            className={cn(
              "flex items-center justify-between transition-all duration-300 ease-in-out",
              "px-3 py-1.5"
            )}
          >
            <div className="flex items-center gap-2 transition-transform duration-300 ease-in-out">
              <div className="flex items-center gap-2">
                <Popover open={isOpen} onOpenChange={setIsOpen}>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className={cn(
                        "flex items-center gap-1.5 px-2 py-0.5",
                        "rounded-full",
                        "text-xs font-medium",
                        "bg-muted/30 hover:bg-muted/50",
                        "border-none",
                        "text-muted-foreground/60 hover:text-muted-foreground/80",
                        "transition-colors duration-200"
                      )}
                    >
                      <StickyNote className="w-3 h-3" />
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
            </div>

            <div className="flex items-center gap-3 transition-transform duration-300 ease-in-out">
              <span
                className={cn(
                  "text-xs font-medium",
                  followUp.length > maxLength * 0.8 && "text-yellow-500",
                  followUp.length === maxLength && "text-red-500",
                  "text-muted-foreground/50"
                )}
              >
                {followUp.length}/{maxLength}
              </span>

              <Button
                type="submit"
                variant="outline"
                size="sm"
                disabled={followUp.length === 0}
                className={cn(
                  "flex items-center justify-center",
                  "h-7 w-7 rounded-full",
                  "transition-all duration-300 ease-in-out",
                  followUp.length > 0
                    ? "bg-primary/90 text-primary-foreground hover:bg-primary border-primary/80"
                    : "bg-muted/40 text-muted-foreground border-none",
                  "disabled:opacity-40 disabled:cursor-not-allowed"
                )}
              >
                <FaArrowUp className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

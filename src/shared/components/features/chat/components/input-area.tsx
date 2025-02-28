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
import { FileText, Search, X, Plus } from "lucide-react";
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

type NoteAttachmentProps = {
  selectedNoteIds: string[];
  onNoteSelect: (noteId: string) => void;
};

const NoteAttachment = ({
  selectedNoteIds,
  onNoteSelect,
}: NoteAttachmentProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { getNotesQuery } = useNotes();

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

  const handleNoteSelect = (noteId: string) => {
    onNoteSelect(noteId);
    setIsOpen(false);
    setSearchQuery("");
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={cn(
            "absolute left-3 bottom-3",
            "w-6 h-6",
            "hover:bg-muted/80",
            "transition-colors duration-200",
            selectedNoteIds.length > 0 && "text-primary"
          )}
        >
          <Plus className="w-4 h-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent side="top" align="start" className="w-80">
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Attach Note</h4>
            <p className="text-xs text-muted-foreground">
              Search and attach notes to your message
            </p>
          </div>
          <div className="space-y-2">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <input
                type="text"
                placeholder="Search notes..."
                value={searchQuery}
                onChange={handleSearchChange}
                className={cn(
                  "w-full pl-8 pr-8 py-2",
                  "text-sm",
                  "rounded-md border border-input",
                  "bg-background",
                  "focus:outline-none focus:ring-1 focus:ring-primary",
                  "transition-all duration-200"
                )}
              />
            </div>
            <div className="max-h-[300px] overflow-y-auto space-y-1 -mx-2">
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
                <div className="text-center py-8">
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
  );
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
        "flex items-center gap-2 px-3 py-1.5",
        "rounded-md bg-muted/50",
        "border border-input",
        "group hover:bg-muted/80 transition-colors"
      )}
    >
      <FileText className="w-3.5 h-3.5 text-primary shrink-0" />
      <span className="text-sm font-medium truncate max-w-[120px]">
        {note.title || "Untitled"}
      </span>
      <button
        onClick={onRemove}
        className="text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <X className="w-3.5 h-3.5" />
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
  const { getNotesQuery } = useNotes();

  const selectedNotes =
    getNotesQuery.data?.filter((note) => selectedNoteIds.includes(note.id)) ||
    [];

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (followUp.trim()) {
        setQuery(followUp);
        setFollowUp("");
        setSelectedNoteIds([]);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (followUp.trim()) {
      setQuery(followUp);
      setFollowUp("");
      setSelectedNoteIds([]);
    }
  };

  const handleNoteSelect = (noteId: string) => {
    setSelectedNoteIds((prev) => [...prev, noteId]);
  };

  const handleNoteRemove = (noteId: string) => {
    setSelectedNoteIds((prev) => prev.filter((id) => id !== noteId));
  };

  return (
    <div
      className={cn("w-full bg-background", isFullscreen ? "px-8 py-6" : "p-4")}
    >
      <form
        onSubmit={handleSubmit}
        className={cn(
          "relative mx-auto space-y-4",
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

        <div className="relative rounded-xl border bg-background overflow-hidden focus-within:ring-1 focus-within:ring-primary focus-within:border-primary transition-all">
          <Textarea
            value={followUp}
            onChange={(e) => setFollowUp(e.target.value)}
            onKeyDown={handleKeyDown}
            maxLength={maxLength}
            placeholder="Message Briq..."
            rows={1}
            aria-label="Type your message"
            className={cn(
              "min-h-[48px] max-h-[200px] w-full",
              "py-3 px-4",
              "text-base leading-relaxed resize-none",
              "border-0 focus:ring-0 focus-visible:ring-0",
              "bg-transparent",
              "placeholder:text-muted-foreground/40",
              "scrollbar-thin scrollbar-thumb-primary/20",
              "scrollbar-track-transparent",
              isFullscreen && "min-h-[56px] text-lg"
            )}
          />

          <div
            className={cn(
              "flex items-center justify-between",
              "px-4 py-2",
              "border-t border-input",
              "bg-muted/50"
            )}
          >
            <div className="flex items-center gap-2">
              <NoteAttachment
                selectedNoteIds={selectedNoteIds}
                onNoteSelect={handleNoteSelect}
              />
            </div>

            <div className="flex items-center gap-3">
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
                disabled={followUp.length === 0}
                className={cn(
                  "rounded-full h-8 w-8",
                  "flex items-center justify-center",
                  "transition-colors duration-200",
                  followUp.length > 0
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "bg-muted text-muted-foreground",
                  "disabled:opacity-40 disabled:cursor-not-allowed"
                )}
              >
                <FaArrowUp className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

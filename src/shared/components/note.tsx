import React from "react";
import { useRouter } from "next/navigation";
import { Calendar, ChevronRight } from "lucide-react";
import { z } from "zod";
import { motion } from "framer-motion";
import { cn } from "../lib/utils";

import { useNotes } from "@/shared/hooks/data/use-notes";
import { useNoteTabsStore } from "@/store/note-tabs";
import { noteSchema } from "@/shared/lib/schemas/note";
import { formatDate, formatHTMLNoteContent } from "../lib/utils";
import { DeleteNoteDialog } from "./delete-note-dialog";
import { Badge } from "./ui/badge";

interface NoteProps {
  note: z.infer<typeof noteSchema>;
  selectable?: boolean;
  selected?: boolean;
  onSelect?: (selected: boolean) => void;
  skipAnimation?: boolean;
  viewMode?: "grid" | "list";
}

const MAX_CONTENT_LENGTH = 80;

const NoteContent: React.FC<{ content: string }> = ({ content }) => {
  const formattedContent = formatHTMLNoteContent(content || "");
  const shortenedContent =
    formattedContent.length > MAX_CONTENT_LENGTH
      ? `${formattedContent.slice(0, MAX_CONTENT_LENGTH).trim()}...`
      : formattedContent;

  const hasImages = /<img[^>]+>/i.test(content);

  return (
    <div className="mb-2 sm:mb-3 md:mb-4">
      <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground group-hover:text-foreground/80 transition-colors duration-200 line-clamp-4">
        {hasImages && (
          <span className="mr-1.5 sm:mr-2 inline-block" title="Contains images">
            🖼️
          </span>
        )}
        {shortenedContent}
      </p>
    </div>
  );
};

const NoteTags: React.FC<{ tags: string[] }> = ({ tags }) => {
  if (!tags.length) return null;

  return (
    <div className="flex flex-wrap gap-1.5">
      {tags.slice(0, 3).map((tag) => (
        <Badge
          key={tag}
          variant="secondary"
          className="text-[10px] px-2 py-0 h-5 bg-secondary/50 hover:bg-secondary/70 transition-colors duration-200"
        >
          {tag}
        </Badge>
      ))}
      {tags.length > 3 && (
        <Badge
          variant="outline"
          className="text-[10px] px-2 py-0 h-5 bg-background/80"
        >
          +{tags.length - 3}
        </Badge>
      )}
    </div>
  );
};

const NoteComponent: React.FC<NoteProps> = ({
  note,
  selectable = false,
  selected = false,
  onSelect,
  skipAnimation = false,
  viewMode = "grid",
}) => {
  const { id, title, content, tags, created_at } = note;
  const { deleteNoteMutation } = useNotes();
  const { push } = useRouter();
  const { openNotes, setOpenNotes } = useNoteTabsStore();

  const handleDelete = React.useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (id) {
        deleteNoteMutation.mutate(id);
        setOpenNotes(openNotes.filter((note) => note.id !== id));
      }
    },
    [id, deleteNoteMutation, setOpenNotes, openNotes]
  );

  const handleClick = React.useCallback(
    (e: React.MouseEvent) => {
      if (selectable) {
        e.preventDefault();
        e.stopPropagation();
        onSelect?.(!selected);
      } else {
        push(`/write?id=${id}`);
      }
    },
    [selectable, selected, onSelect, push, id]
  );

  const noteClasses = React.useMemo(
    () =>
      cn(
        "group relative",
        viewMode === "grid"
          ? "flex flex-col w-full"
          : "flex flex-row items-center gap-4 sm:gap-6",
        "p-4 sm:p-5",
        "mb-2 sm:mb-3",
        "bg-card/50 backdrop-blur-sm",
        "rounded-md sm:rounded-lg",
        viewMode === "grid"
          ? "min-h-[160px] sm:min-h-[180px]"
          : "min-h-[90px] sm:min-h-[100px]",
        "h-full w-full",
        selected && selectable
          ? "ring-2 ring-primary border-transparent"
          : "border border-border/20",
        "transition-all duration-300 ease-out",
        "hover:bg-card",
        "hover:shadow-lg hover:shadow-primary/5",
        "hover:border-primary/20",
        "hover:translate-y-[-2px]",
        "cursor-pointer"
      ),
    [selected, selectable, viewMode]
  );

  const noteTitle = title || "Untitled";
  const noteContent = content || "";

  return (
    <motion.div
      initial={skipAnimation ? false : { opacity: 0, y: 15 }}
      animate={skipAnimation ? { opacity: 1 } : { opacity: 1, y: 0 }}
      exit={skipAnimation ? { opacity: 0 } : { opacity: 0, y: -10 }}
      transition={
        skipAnimation
          ? { duration: 0.1 }
          : {
              type: "spring",
              stiffness: 260,
              damping: 20,
              mass: 0.5,
            }
      }
      className={noteClasses}
      onClick={handleClick}
      layout={!skipAnimation}
    >
      <div
        className={cn(
          "flex justify-between items-start sm:items-center",
          viewMode === "grid" ? "mb-2 sm:mb-3" : "mb-0",
          viewMode === "list" && "flex-1 min-w-0 max-w-[30%]"
        )}
      >
        <h3
          className={cn(
            "font-semibold text-foreground group-hover:text-primary transition-colors duration-200 pr-8 sm:pr-0 line-clamp-1",
            viewMode === "grid"
              ? "text-base sm:text-lg"
              : "text-sm sm:text-base"
          )}
        >
          {noteTitle}
          <ChevronRight className="inline-block ml-1 w-3 h-3 sm:w-4 sm:h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200" />
        </h3>
        <div className="absolute top-2 right-2 sm:static">
          <DeleteNoteDialog title={noteTitle} onDelete={handleDelete} />
        </div>
      </div>

      <div className={cn(viewMode === "grid" ? "flex-grow" : "flex-1 min-w-0")}>
        <NoteContent content={noteContent} />
      </div>

      <div
        className={cn(
          viewMode === "grid"
            ? "mt-auto pt-2 sm:pt-3 flex-col sm:flex-row sm:justify-between sm:items-end border-t border-border/10"
            : "flex-row items-center gap-6 ml-auto",
          "flex gap-2 sm:gap-3"
        )}
      >
        <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
          <Calendar className="w-3 h-3 sm:w-4 sm:h-4 opacity-70" />
          <time className="group-hover:text-foreground/60 transition-colors duration-200">
            {formatDate(created_at)}
          </time>
        </div>
        <div className="flex-shrink-0">{tags && <NoteTags tags={tags} />}</div>
      </div>
    </motion.div>
  );
};

export const Note = React.memo(NoteComponent);

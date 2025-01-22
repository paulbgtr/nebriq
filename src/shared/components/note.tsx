import React from "react";
import { useRouter } from "next/navigation";
import { Calendar, ChevronRight } from "lucide-react";
import { z } from "zod";
import { motion } from "framer-motion";
import { cn } from "../lib/utils";

import { useNotes } from "@/hooks/use-notes";
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
      <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground group-hover:text-foreground/80 transition-colors duration-200">
        {hasImages && (
          <span className="mr-1.5 sm:mr-2" title="Contains images">
            🖼️
          </span>
        )}
        {shortenedContent}
      </p>
    </div>
  );
};

const NoteTags: React.FC<{ tags: string[] }> = ({ tags }) => {
  if (!tags?.length) return null;

  return (
    <div className="flex flex-wrap gap-1 sm:gap-1.5">
      {tags.map((tag) => (
        <Badge
          key={tag}
          variant="secondary"
          className="px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-xs font-medium bg-primary/10 text-primary hover:bg-primary/15 transition-colors duration-200"
        >
          {tag}
        </Badge>
      ))}
    </div>
  );
};

const NoteComponent: React.FC<NoteProps> = ({
  note,
  selectable = false,
  selected = false,
  onSelect,
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
        "group relative flex flex-col",
        "p-3 sm:p-4 md:p-6",
        "mb-2 sm:mb-3 md:mb-4",
        "bg-card/50 backdrop-blur-sm",
        "rounded-md sm:rounded-lg",
        "min-h-[140px] sm:min-h-[160px]",
        selected && selectable
          ? "ring-2 ring-primary border-transparent"
          : "border border-border/20",
        "transition-all duration-300 ease-out",
        "hover:bg-card",
        "hover:shadow-lg hover:shadow-primary/5",
        "hover:border-primary/20",
        "cursor-pointer"
      ),
    [selected, selectable]
  );

  const noteTitle = title || "Untitled";
  const noteContent = content || "";

  return (
    <motion.div
      initial={false}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={noteClasses}
      onClick={handleClick}
    >
      <div className="flex justify-between items-start sm:items-center mb-2 sm:mb-3">
        <h3 className="text-base sm:text-lg font-semibold text-foreground group-hover:text-primary transition-colors duration-200 pr-8 sm:pr-0">
          {noteTitle}
          <ChevronRight className="inline-block ml-1 w-3 h-3 sm:w-4 sm:h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200" />
        </h3>
        <div className="absolute top-2 right-2 sm:static">
          <DeleteNoteDialog title={noteTitle} onDelete={handleDelete} />
        </div>
      </div>

      <div className="flex-grow">
        <NoteContent content={noteContent} />
      </div>

      <div className="mt-2 sm:mt-3 flex flex-col sm:flex-row gap-2 sm:gap-3 sm:justify-between sm:items-end">
        <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
          <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
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

import React from "react";
import { useRouter } from "next/navigation";
import { Trash2, Calendar, ChevronRight } from "lucide-react"; // Added icons
import { z } from "zod";
import { motion } from "framer-motion"; // Added for smooth animations

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

const MAX_CONTENT_LENGTH = 80; // Increased for better preview

const NoteContent: React.FC<{ content: string }> = ({ content }) => {
  const formattedContent = formatHTMLNoteContent(content || "");
  const shortenedContent =
    formattedContent.length > MAX_CONTENT_LENGTH
      ? `${formattedContent.slice(0, MAX_CONTENT_LENGTH).trim()}...`
      : formattedContent;

  return (
    <p className="text-sm leading-relaxed text-muted-foreground mb-4 group-hover:text-foreground/80 transition-colors duration-200">
      {shortenedContent}
    </p>
  );
};

const NoteTags: React.FC<{ tags: string[] }> = ({ tags }) => {
  if (!tags?.length) return null;

  return (
    <div className="flex flex-wrap gap-1.5">
      {tags.map((tag) => (
        <Badge
          key={tag}
          variant="secondary"
          className="px-2 py-0.5 text-xs font-medium bg-primary/10 text-primary hover:bg-primary/15 transition-colors duration-200"
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
      `group relative flex flex-col p-6 mb-4 bg-card/50 backdrop-blur-sm rounded-lg
      ${
        selected && selectable
          ? "ring-2 ring-primary border-transparent"
          : "border border-border/20"
      }
      transition-all duration-300 ease-out
      hover:bg-card
      hover:shadow-lg hover:shadow-primary/5
      hover:border-primary/20
      cursor-pointer`,
    [selected, selectable]
  );

  if (!title || !content || !created_at) return null;

  return (
    <motion.div
      initial={false}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={noteClasses}
      onClick={handleClick}
    >
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors duration-200">
          {title}
          <ChevronRight className="inline-block ml-1 w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200" />
        </h3>
        <DeleteNoteDialog title={title} onDelete={handleDelete} />
      </div>

      <NoteContent content={content} />

      <div className="mt-auto pt-4 flex justify-between items-end">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="w-4 h-4" />
          <time className="group-hover:text-foreground/60 transition-colors duration-200">
            {formatDate(created_at)}
          </time>
        </div>
        {tags && <NoteTags tags={tags} />}
      </div>
    </motion.div>
  );
};

export const Note = React.memo(NoteComponent);

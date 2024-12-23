import React from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { z } from "zod";

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

const MAX_CONTENT_LENGTH = 30;

const NoteContent: React.FC<{ content: string }> = ({ content }) => {
  const formattedContent = formatHTMLNoteContent(content || "");
  const shortenedContent =
    formattedContent.length > MAX_CONTENT_LENGTH
      ? `${formattedContent.slice(0, MAX_CONTENT_LENGTH).trim()}...`
      : formattedContent;

  return (
    <p className="text-muted-foreground mb-3 group-hover:text-foreground/80 transition-colors">
      {shortenedContent}
    </p>
  );
};

const NoteTags: React.FC<{ tags: string[] }> = ({ tags }) => {
  if (!tags?.length) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <Badge key={tag} variant="secondary" className="text-xs">
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
      `group relative h-full flex flex-col p-5 mb-4 bg-card rounded-xl border 
      ${
        selected && selectable
          ? "border-primary ring-2 ring-primary/20"
          : "border-border/40"
      }
      transition-all duration-300 ease-in-out
      hover:shadow-lg hover:shadow-primary/5
      hover:border-primary/30
      hover:translate-y-[-2px]
      cursor-pointer`,
    [selected, selectable]
  );

  if (!title || !content || !created_at) return null;

  return (
    <div onClick={handleClick} className={noteClasses}>
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold text-card-foreground group-hover:text-primary transition-colors">
          {title}
        </h3>
        <DeleteNoteDialog title={title} onDelete={handleDelete} />
      </div>

      <NoteContent content={content} />

      <div className="flex flex-col gap-2">
        <time className="text-sm text-muted-foreground group-hover:text-foreground/60 transition-colors">
          {formatDate(created_at)}
        </time>
        {tags && <NoteTags tags={tags} />}
      </div>
    </div>
  );
};

export const Note = React.memo(NoteComponent);

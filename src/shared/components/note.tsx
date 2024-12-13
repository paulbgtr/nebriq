import React from "react";
import { formatDate } from "../lib/utils";
import { Badge } from "./ui/badge";
import { formatHTMLNoteContent } from "../lib/utils";
import Link from "next/link";
import { useNotes } from "@/hooks/use-notes";
import { Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/shared/components/ui/alert-dialog";
import { useRouter } from "next/navigation";

type NoteProps = {
  id?: string;
  title?: string;
  content?: string;
  createdAt: Date;
  tags?: string[];
};

const NoteComponent = ({
  id,
  title,
  content,
  createdAt,
  tags = [],
}: NoteProps) => {
  const { deleteNoteMutation } = useNotes();
  const { push } = useRouter();

  const contentWithoutHTML = formatHTMLNoteContent(content || "");

  const shortenedContent =
    contentWithoutHTML.length > 30
      ? `${contentWithoutHTML.slice(0, 30).trim()}...`
      : contentWithoutHTML;

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (id) {
      deleteNoteMutation.mutate(id);
    }
  };

  return (
    <div
      onClick={() => push(`/write?id=${id}`)}
      className="h-full min-w-[300px] flex flex-col justify-between p-4 mb-4 bg-card rounded-lg border border-border shadow-sm transition-all duration-200 hover:shadow-md hover:scale-[1.02] hover:border-primary/20 cursor-pointer"
    >
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold text-card-foreground group-hover:text-primary transition-colors">
          {title}
        </h3>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent onClick={(e) => e.stopPropagation()}>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this note?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete &quot;
                {title || "Untitled note"}&quot;? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={(e) => e.stopPropagation()}>
                Keep note
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(e);
                }}
                className="bg-destructive hover:bg-destructive/90"
              >
                Delete note
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <p className="text-muted-foreground mb-3 group-hover:text-foreground/80 transition-colors">
        {shortenedContent}
      </p>
      <div className="flex flex-col gap-2">
        <div className="text-sm text-muted-foreground group-hover:text-foreground/60 transition-colors">
          {formatDate(createdAt)}
        </div>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};

export const Note = React.memo(NoteComponent);

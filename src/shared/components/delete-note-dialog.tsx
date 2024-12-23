import React from "react";
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

interface DeleteNoteDialogProps {
  title: string;
  onDelete: (e: React.MouseEvent) => void;
}

export const DeleteNoteDialog: React.FC<DeleteNoteDialogProps> = ({
  title,
  onDelete,
}) => (
  <AlertDialog>
    <AlertDialogTrigger asChild>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-muted-foreground hover:text-destructive"
        onClick={(e) => e.stopPropagation()}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </AlertDialogTrigger>
    <AlertDialogContent onClick={(e) => e.stopPropagation()}>
      <AlertDialogHeader>
        <AlertDialogTitle>Delete this note?</AlertDialogTitle>
        <AlertDialogDescription>
          Are you sure you want to delete &quot;{title || "Untitled note"}
          &quot;? This action cannot be undone.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel onClick={(e) => e.stopPropagation()}>
          Keep note
        </AlertDialogCancel>
        <AlertDialogAction
          onClick={(e) => {
            e.stopPropagation();
            onDelete(e);
          }}
          className="bg-destructive hover:bg-destructive/90"
        >
          Delete note
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);

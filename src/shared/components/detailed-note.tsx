import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
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
import { useNotes } from "@/hooks/use-notes";
import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { FaRegTrashCan } from "react-icons/fa6";
import { CiShare2 } from "react-icons/ci";
import { Editor } from "./editor";
import { formatDate } from "../lib/utils";

type DetailedNoteProps = {
  children: React.ReactNode;
  id: string;
  title: string;
  content: string;
  createdAt: Date;
};

export const DetailedNote = ({
  id,
  children,
  title: initialTitle,
  content: initialContent,
  createdAt,
}: DetailedNoteProps) => {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const { updateNoteMutation, deleteNoteMutation } = useNotes();

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);

    updateNoteMutation.mutate({
      id,
      title: newTitle,
      created_at: createdAt,
    });
  };

  const handleDeleteNote = () => {
    deleteNoteMutation.mutate(id);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div>{children}</div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[90vw] sm:max-h-[90vh] w-[90vw] h-[90vh]">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <DialogTitle>
              <input
                type="text"
                value={title}
                className="focus:outline-none text-xl font-semibold"
                onChange={handleTitleChange}
              />
            </DialogTitle>
            <div className="flex items-center gap-2">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                  >
                    <FaRegTrashCan className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete this note?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete this note and all of its
                      contents. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Keep Note</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteNote}>
                      Delete Note
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <Button variant="outline" size="sm">
                <CiShare2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <Editor
              id={id}
              title={title}
              content={content}
              setContent={setContent}
              createdAt={createdAt}
            />
            <div className="text-sm text-muted-foreground/60 mt-4">
              {formatDate(createdAt)}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

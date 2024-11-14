import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
} from "@/components/ui/alert-dialog";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { useNotes } from "@/hooks/use-notes";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FaRegTrashCan } from "react-icons/fa6";
import { CiShare2 } from "react-icons/ci";

type DetailedNoteProps = {
  children: React.ReactNode;
  id: string;
  title: string;
  content: string;
  createdAt: string;
};

export const DetailedNote = ({
  id,
  children,
  title: initialTitle,
  content: noteContent,
  createdAt,
}: DetailedNoteProps) => {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(noteContent);
  const { updateNoteMutation, deleteNoteMutation } = useNotes();

  const editor = useEditor({
    extensions: [StarterKit, Placeholder.configure()],
    editorProps: {
      attributes: {
        class: "prose prose-slate focus:outline-none",
      },
    },
    content,
    onUpdate: ({ editor }) => {
      const newContent = editor.getHTML();
      setContent(newContent);

      updateNoteMutation.mutate({
        id,
        title,
        content: newContent,
        created_at: createdAt,
      });
    },
  });

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);

    updateNoteMutation.mutate({
      id,
      title: newTitle,
      content,
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
            <EditorContent
              editor={editor}
              className="[&_.ProseMirror]:h-[73vh]"
            />
            <div className="text-sm text-muted-foreground/60 mt-4">
              {new Date(createdAt).toLocaleString()}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

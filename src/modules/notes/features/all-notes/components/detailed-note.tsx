import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { useNotes } from "@/hooks/useNotes";
import { useState } from "react";

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
  content: noteContent,
  createdAt,
}: DetailedNoteProps) => {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(noteContent);
  const { updateNoteMutation } = useNotes();

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

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div>{children}</div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[90vw] sm:max-h-[90vh] w-[90vw] h-[90vh]">
        <div className="grid items-center px-12">
          <div className="flex flex-col space-y-0 gap-0">
            <DialogTitle>
              <input
                type="text"
                value={title}
                className="focus:outline-none text-xl font-semibold"
                onChange={handleTitleChange}
              />
            </DialogTitle>
            <EditorContent
              editor={editor}
              className="mt-4 [&_.ProseMirror]:min-h-[200px]"
            />
            <div className="text-sm text-muted-foreground/60 mt-4">
              {createdAt.toLocaleDateString()}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

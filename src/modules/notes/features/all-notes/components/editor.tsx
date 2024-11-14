import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { useNotes } from "@/hooks/use-notes";

type EditorProps = {
  id: string;
  title: string;
  content: string;
  setContent: (content: string) => void;
  createdAt: string;
};

export const Editor = ({
  id,
  title,
  content,
  setContent,
  createdAt,
}: EditorProps) => {
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
        created_at: new Date(createdAt),
      });
    },
  });

  return (
    <EditorContent editor={editor} className="[&_.ProseMirror]:h-[73vh]" />
  );
};

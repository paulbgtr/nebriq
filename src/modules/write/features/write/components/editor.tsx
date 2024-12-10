import { EditorContent } from "@tiptap/react";
import { useNotes } from "@/hooks/use-notes";
import { Editor as TiptapEditor } from "@tiptap/react";
import { Check } from "lucide-react";
import { useEffect } from "react";

type EditorProps = {
  id: string;
  editor: TiptapEditor | null;
  title: string;
  setTitle: (title: string) => void;
  content: string;
};

export const Editor = ({
  id,
  editor,
  title,
  setTitle,
  content,
}: EditorProps) => {
  const { updateNoteMutation } = useNotes();

  const updateNote = (newTitle?: string, newContent?: string) => {
    updateNoteMutation.mutate({
      id,
      title: newTitle ?? title,
      content: newContent ?? content,
      created_at: new Date(),
    });
  };

  useEffect(() => {
    if (editor) {
      editor.on("update", ({ editor }) => {
        updateNote(undefined, editor.getHTML());
      });
    }
  }, [editor]);

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="flex items-center justify-between">
        <input
          type="text"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            updateNote(e.target.value);
          }}
          placeholder="Untitled"
          className="text-2xl font-bold bg-transparent border-none outline-none placeholder:text-gray-400 focus:ring-0"
        />
        <div className="text-sm text-muted-foreground flex items-center gap-1">
          {updateNoteMutation.isPending ? (
            "Saving..."
          ) : (
            <>
              <Check size={14} className="text-green-500" />
              <span>Saved</span>
            </>
          )}
        </div>
      </div>
      <div
        className="h-full cursor-text"
        onClick={() => editor?.commands.focus()}
      >
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

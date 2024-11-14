import { EditorContent } from "@tiptap/react";
import { useNotes } from "@/hooks/use-notes";
import { Editor as TiptapEditor } from "@tiptap/react";

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

  return (
    <div className="flex flex-col h-full gap-4">
      <input
        type="text"
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
          updateNoteMutation.mutate({
            id,
            title: e.target.value,
            content,
            created_at: new Date(),
          });
        }}
        placeholder="Untitled"
        className="text-2xl font-bold bg-transparent border-none outline-none placeholder:text-gray-400 focus:ring-0"
      />
      <div
        className="h-full cursor-text"
        onClick={() => editor?.commands.focus()}
      >
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

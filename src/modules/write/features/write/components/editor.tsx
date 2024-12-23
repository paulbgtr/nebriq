import { EditorContent } from "@tiptap/react";
import { useNotes } from "@/hooks/use-notes";
import { Editor as TiptapEditor } from "@tiptap/react";
import { useEffect, useState } from "react";
import { useToast } from "@/shared/hooks/use-toast";
import { Expand, Shrink } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { useDebouncedCallback } from "use-debounce";
import { TagManager } from "./tag-manager";

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
  const { toast } = useToast();
  const [isZenMode, setIsZenMode] = useState(false);

  const updateNote = (newTitle?: string, newContent?: string) => {
    updateNoteMutation.mutate({
      id,
      title: newTitle ?? title,
      content: newContent ?? content,
    });
  };

  const debouncedUpdate = useDebouncedCallback(
    (newTitle?: string, newContent?: string) => {
      updateNote(newTitle, newContent);
    },
    1000 // 1 second delay
  );

  useEffect(() => {
    if (editor) {
      editor.on("update", ({ editor }) => {
        debouncedUpdate(undefined, editor.getHTML());
      });
    }
  }, [editor]);

  useEffect(() => {
    if (updateNoteMutation.isSuccess) {
      toast({
        title: "Note updated",
      });
    }
  }, [updateNoteMutation.isSuccess]);

  return (
    <div
      className={`flex flex-col h-full gap-2 transition-all duration-300 ${
        isZenMode ? "fixed inset-0 bg-background p-8 z-50" : ""
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
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
          {id && <TagManager noteId={id} />}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsZenMode(!isZenMode)}
          title={isZenMode ? "Exit Zen Mode" : "Enter Zen Mode"}
        >
          {isZenMode ? (
            <Shrink className="h-4 w-4" />
          ) : (
            <Expand className="h-4 w-4" />
          )}
        </Button>
      </div>
      <div
        className={`h-full cursor-text ${isZenMode ? "mx-auto w-full" : ""}`}
        onClick={() => editor?.commands.focus()}
      >
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

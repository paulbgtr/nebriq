import { EditorContent } from "@tiptap/react";
import { useNotes } from "@/hooks/use-notes";
import { Editor as TiptapEditor } from "@tiptap/react";
import { useEffect, useState, useCallback } from "react";
import { Expand, Shrink, Save, Undo, Redo } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { useDebouncedCallback } from "use-debounce";
import { TagManager } from "./tag-manager";
import { EditorContextMenu } from "./context-menu";
import { useToast } from "@/shared/hooks/use-toast";

type EditorProps = {
  id: string;
  editor: TiptapEditor | null;
  title: string;
  setTitle: (title: string) => void;
  content: string;
};

export function Editor({ id, editor, title, setTitle, content }: EditorProps) {
  const { updateNoteMutation } = useNotes();
  const { toast } = useToast();
  const [isZenMode, setIsZenMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [characterCount, setCharacterCount] = useState(0);
  const [hasContentChanged, setHasContentChanged] = useState(false);

  const updateCounts = useCallback(() => {
    if (!editor) return;
    const text = editor.state.doc.textContent;
    setCharacterCount(text.length);
    setWordCount(text.split(/\s+/).filter(Boolean).length);
  }, [editor]);

  const updateNote = useCallback(
    (newTitle?: string, newContent?: string) => {
      if (!id) return;

      setIsSaving(true);
      updateNoteMutation.mutate(
        {
          id,
          title: newTitle ?? title,
          content: newContent ?? content,
        },
        {
          onSuccess: () => setIsSaving(false),
          onError: () => {
            setIsSaving(false);
            toast({
              title: "Error saving changes",
              description: "Please try again",
              variant: "destructive",
            });
          },
        }
      );
    },
    [id, title, content, updateNoteMutation, toast]
  );

  const debouncedUpdate = useDebouncedCallback(updateNote, 1000);

  // Initial counts update
  useEffect(() => {
    if (editor && content) {
      updateCounts();
    }
  }, [editor, content, updateCounts]);

  // Editor update handler
  useEffect(() => {
    if (!editor) return;

    const handleUpdate = () => {
      const newContent = editor.getHTML();
      debouncedUpdate(undefined, newContent);
      updateCounts();
      setHasContentChanged(true);
    };

    editor.on("update", handleUpdate);
    return () => {
      editor.off("update", handleUpdate);
    };
  }, [editor, debouncedUpdate, updateCounts]);

  useEffect(() => {
    const handleKeyboard = (e: KeyboardEvent) => {
      if (!editor) return;

      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case "s":
            e.preventDefault();
            updateNote();
            break;
          case "z":
            e.preventDefault();
            if (e.shiftKey) {
              editor.commands.redo();
            } else {
              editor.commands.undo();
            }
            break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyboard);
    return () => window.removeEventListener("keydown", handleKeyboard);
  }, [editor, updateNote]);

  const editorContent = (
    <div
      className={`h-[calc(100vh-24rem)] cursor-text prose prose-sm max-w-none ${
        isZenMode ? "mx-auto w-full max-w-3xl" : ""
      }`}
      style={{ overflow: "auto" }}
      onClick={() => editor?.commands.focus()}
    >
      <EditorContent editor={editor} />
    </div>
  );

  return (
    <div
      className={`flex flex-col h-full gap-2 transition-all duration-300 ${
        isZenMode ? "fixed inset-0 bg-background p-8 z-50" : ""
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2 flex-1">
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              debouncedUpdate(e.target.value);
            }}
            placeholder="Untitled"
            className="text-2xl font-bold bg-transparent border-none outline-none placeholder:text-gray-400 focus:ring-0 w-full"
          />
          {id && <TagManager noteId={id} />}
        </div>

        <div className="flex items-center gap-2">
          <div className="text-sm text-gray-500">
            {wordCount} words | {characterCount} characters
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => editor?.commands.undo()}
            disabled={!hasContentChanged || !editor?.can().undo()}
          >
            <Undo className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => editor?.commands.redo()}
            disabled={!editor?.can().redo()}
          >
            <Redo className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => updateNote()}
            disabled={isSaving}
          >
            <Save className={`h-4 w-4 ${isSaving ? "animate-spin" : ""}`} />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsZenMode(!isZenMode)}
          >
            {isZenMode ? (
              <Shrink className="h-4 w-4" />
            ) : (
              <Expand className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      <EditorContextMenu editor={editor}>{editorContent}</EditorContextMenu>
    </div>
  );
}

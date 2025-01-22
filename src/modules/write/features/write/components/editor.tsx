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
import { cn } from "@/shared/lib/utils";

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

  const editorContainerClass = cn(
    // Container width constraints
    "mx-auto",
    "container",
    isZenMode
      ? ["max-w-2xl sm:max-w-3xl lg:max-w-4xl", "px-4 sm:px-6 md:px-8 lg:px-12"]
      : ["max-w-full", "px-3 sm:px-4 md:px-6"],

    // Scrolling behavior
    "overflow-y-auto",
    "scrollbar-thin scrollbar-thumb-muted-foreground/10",
    "hover:scrollbar-thumb-muted-foreground/20",

    // Transitions
    "transition-all duration-300 ease-in-out",

    // Focus & Interaction
    "focus-within:ring-0",
    "selection:bg-primary/20",

    // Dark mode adjustments
    "dark:prose-invert",
    "dark:prose-pre:bg-muted/50",

    // Mobile optimizations
    "touch-manipulation",
    "sm:touch-auto"
  );

  return (
    <div
      className={cn(
        "transition-all duration-300",
        isZenMode && "fixed inset-0 bg-background p-4 sm:p-6 md:p-8 z-50"
      )}
    >
      <div className={editorContainerClass}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          <div className="flex flex-col gap-2 flex-1 w-full sm:w-auto">
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                debouncedUpdate(e.target.value);
              }}
              placeholder="Untitled"
              className={cn(
                "text-xl sm:text-2xl font-bold",
                "bg-transparent border-none outline-none",
                "placeholder:text-gray-400 focus:ring-0",
                "w-full truncate"
              )}
            />
            {id && <TagManager noteId={id} className="w-full sm:w-auto" />}
          </div>

          <div className="flex flex-wrap items-center gap-1 sm:gap-2 w-full sm:w-auto justify-between sm:justify-end">
            <div className="text-xs sm:text-sm text-gray-500 order-1 sm:order-none">
              {wordCount} words | {characterCount} chars
            </div>

            <div className="flex items-center gap-0.5 sm:gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 sm:h-9 sm:w-9"
                onClick={() => editor?.commands.undo()}
                disabled={!hasContentChanged || !editor?.can().undo()}
              >
                <Undo className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 sm:h-9 sm:w-9"
                onClick={() => editor?.commands.redo()}
                disabled={!editor?.can().redo()}
              >
                <Redo className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 sm:h-9 sm:w-9"
                onClick={() => updateNote()}
                disabled={isSaving}
              >
                <Save
                  className={cn(
                    "h-3.5 w-3.5 sm:h-4 sm:w-4",
                    isSaving && "animate-spin"
                  )}
                />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 sm:h-9 sm:w-9"
                onClick={() => setIsZenMode(!isZenMode)}
              >
                {isZenMode ? (
                  <Shrink className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                ) : (
                  <Expand className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {editor && (
          <EditorContextMenu editor={editor}>
            <div
              className={cn(
                "!pt-0 !px-0",
                "h-[calc(100vh-20rem)] sm:h-[calc(100vh-22rem)] md:h-[calc(100vh-24rem)]",
                "cursor-text prose prose-sm sm:prose-base max-w-none",
                "overflow-auto"
              )}
              onClick={() => editor?.commands.focus()}
            >
              <EditorContent editor={editor} />
            </div>
          </EditorContextMenu>
        )}
      </div>
    </div>
  );
}

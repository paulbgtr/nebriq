import { EditorContent } from "@tiptap/react";
import { useState } from "react";
import { Expand, Shrink, Save, Lightbulb } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { TagManager } from "./tag-manager";
import { EditorContextMenu } from "./context-menu";
import { cn } from "@/shared/lib/utils";
import { useEditorCounts } from "@/modules/write/hooks/use-editor-counts";
import { useCustomEditor } from "@/modules/write/hooks/use-editor";
import { useNoteDiscovery } from "@/modules/write/hooks/use-note-discovery";
import { NoteDiscovery } from "./note-discovery";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";

export function Editor({ initialNoteId }: { initialNoteId: string | null }) {
  const {
    id,
    title,
    content,
    handleTitleChange,
    editor,
    updateNote,
    isSaving,
  } = useCustomEditor(initialNoteId);

  const { wordCount, characterCount } = useEditorCounts({
    editor,
    content,
  });

  const { isSearching, discoveredNotes, isDiscoveryOpen, toggleDiscovery } =
    useNoteDiscovery(editor, id);

  const [isZenMode, setIsZenMode] = useState(false);

  if (!editor) {
    return null;
  }

  const editorContainerClass = cn(
    "mx-auto container",
    isZenMode
      ? ["max-w-2xl sm:max-w-3xl lg:max-w-4xl", "px-4 sm:px-6 md:px-8 lg:px-12"]
      : ["max-w-full", "px-3 sm:px-4 md:px-6"],
    "overflow-y-auto scrollbar-thin scrollbar-thumb-muted-foreground/10 hover:scrollbar-thumb-muted-foreground/20",
    "transition-all duration-300 ease-in-out",
    "focus-within:ring-0 selection:bg-primary/20",
    "dark:prose-invert dark:prose-pre:bg-muted/50",
    "touch-manipulation sm:touch-auto"
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
                handleTitleChange(e.target.value);
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
                onClick={() => updateNote()}
                disabled={isSaving}
                className="h-8 w-8 sm:h-9 sm:w-9"
              >
                <Save
                  className={cn(
                    "h-3.5 w-3.5 sm:h-4 sm:w-4",
                    isSaving && "animate-spin"
                  )}
                />
              </Button>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "h-8 w-8 sm:h-9 sm:w-9",
                        isDiscoveryOpen ? "bg-muted" : ""
                      )}
                      onClick={toggleDiscovery}
                      disabled={!id}
                    >
                      <Lightbulb
                        className={cn(
                          "h-3.5 w-3.5 sm:h-4 sm:w-4",
                          isSearching && "animate-pulse"
                        )}
                      />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>Find connected notes (Alt+L)</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

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

        <EditorContextMenu editor={editor}>
          <div
            className={cn(
              "flex flex-col flex-1",
              "min-h-[calc(100vh-18rem)]",
              "cursor-text prose prose-sm sm:prose-base max-w-none",
              "overflow-auto scroll-smooth",
              "prose-p:my-2",
              "prose-headings:my-4",
              "leading-relaxed",
              "prose-mark:bg-transparent prose-mark:border prose-mark:border-dashed prose-mark:border-muted-foreground/30 prose-mark:px-0.5 prose-mark:rounded",
              "prose-mark:cursor-pointer prose-mark:hover:bg-green-500/10 prose-mark:hover:border-green-500/30 prose-mark:dark:hover:bg-green-500/10",
              "prose-mark:relative prose-mark:after:content-[attr(data-note-title)] prose-mark:after:absolute prose-mark:after:hidden prose-mark:hover:after:block prose-mark:after:bottom-full prose-mark:after:left-1/2 prose-mark:after:-translate-x-1/2 prose-mark:after:bg-popover prose-mark:after:text-popover-foreground prose-mark:after:px-2 prose-mark:after:py-1 prose-mark:after:rounded prose-mark:after:text-xs prose-mark:after:whitespace-nowrap prose-mark:after:shadow-md",
              "[&_.animate-highlight]:animate-pulse [&_.animate-highlight]:duration-500"
            )}
            onClick={() => editor?.commands.focus()}
          >
            <EditorContent editor={editor} />
          </div>
        </EditorContextMenu>
      </div>

      <NoteDiscovery
        notes={discoveredNotes}
        isOpen={isDiscoveryOpen}
        onClose={toggleDiscovery}
        isLoading={isSearching}
      />
    </div>
  );
}

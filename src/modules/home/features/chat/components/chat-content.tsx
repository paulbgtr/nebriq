import "katex/dist/katex.min.css";
import { useState, useEffect } from "react";

import { ChatContext } from "@/types/chat";
import { StickyNote } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { MessageActions } from "./message-actions";
import { LoadingIndicator } from "./loading-indicator";
import { formatDate } from "@/shared/lib/utils";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { noteSchema } from "@/shared/lib/schemas/note";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { InlineMath, BlockMath } from "react-katex";

type ChatContentProps = {
  scrollContainerRef: React.RefObject<HTMLDivElement>;
  chatContext: ChatContext;
  displayedText: string;
  isLoading: boolean;
};

type MessageProps = {
  message: ChatContext["conversationHistory"][0];
};

type Note = z.infer<typeof noteSchema>;

type NoteStackProps = {
  notes: Note[];
  isAttached?: boolean;
};

export const ChatContent = ({
  scrollContainerRef,
  chatContext,
  displayedText,
  isLoading,
}: ChatContentProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div
      ref={scrollContainerRef}
      className={cn(
        "flex-1 overflow-y-auto",
        mounted && "transition-all duration-500 ease-in-out",
        !chatContext.conversationHistory.length &&
          mounted &&
          "opacity-0 pointer-events-none absolute"
      )}
    >
      <div className="h-full px-4 sm:px-6 lg:px-8">
        <div className="space-y-4 max-w-3xl mx-auto py-4">
          {chatContext.conversationHistory.map((message, index) => (
            <div
              key={index}
              className={cn(
                "group",
                message.role === "user"
                  ? "flex justify-end"
                  : "flex justify-start",
                mounted && "animate-in fade-in-0 slide-in-from-bottom-2"
              )}
              style={!mounted ? { opacity: 0 } : undefined}
            >
              <MessageBubble
                message={message}
                displayedText={mounted ? displayedText : message.content}
                chatContext={chatContext}
              />
            </div>
          ))}
          {isLoading && mounted && <LoadingIndicator />}
        </div>
      </div>
    </div>
  );
};

const NoteStack = ({ notes, isAttached = false }: NoteStackProps) => {
  const router = useRouter();

  if (!notes?.length) return null;

  const handleNoteClick = (noteId: string) => {
    router.push(`/write?id=${noteId}`);
  };

  return (
    <div className={cn("absolute -top-4", isAttached ? "-left-5" : "left-0")}>
      <Popover>
        <PopoverTrigger asChild>
          <button
            className={cn(
              "group flex items-center gap-1.5 px-2 py-1",
              "rounded-full",
              "text-xs",
              "shadow-sm",
              "border",
              "transition-all duration-200",
              isAttached
                ? "bg-primary/10 hover:bg-primary/15 border-primary/20 text-primary/70"
                : "bg-secondary/10 hover:bg-secondary/15 border-secondary/20 text-secondary-foreground/70"
            )}
          >
            <StickyNote
              className={cn(
                "w-3 h-3",
                isAttached ? "text-primary/70" : "text-secondary-foreground/70"
              )}
            />
            <span className="font-medium">
              {isAttached
                ? "Attached"
                : notes.length > 1
                  ? `${notes.length}`
                  : "Source"}
            </span>
          </button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          className="p-2 flex flex-col gap-1 rounded-lg shadow-md border border-border/30 bg-background/95 backdrop-blur-sm"
          sideOffset={5}
        >
          <div className="text-xs font-medium text-muted-foreground mb-1 px-1">
            {isAttached ? "Attached Notes" : "Referenced Sources"}
          </div>
          {notes.map((note) => (
            <button
              key={note.id}
              onClick={() => handleNoteClick(note.id)}
              className={cn(
                "w-full text-left",
                "transition-colors duration-200 hover:bg-muted/50",
                "flex flex-col gap-0.5",
                "p-2",
                "rounded-md"
              )}
            >
              <h5 className="font-medium text-sm text-foreground/90 truncate">
                {note.title || "Untitled"}
              </h5>
              <div className="text-[10px] text-muted-foreground/60 flex items-center gap-1">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-muted-foreground/40"></span>
                {formatDate(note.created_at)}
              </div>
            </button>
          ))}
        </PopoverContent>
      </Popover>
    </div>
  );
};

const MessageBubble = ({
  message,
  displayedText,
  chatContext,
}: MessageProps & Pick<ChatContentProps, "displayedText" | "chatContext">) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const processText = (text: string) => {
    const blocks = text.split(/(\\[[\s\S]*?\\]|\\\([\s\S]*?\\\))/g);
    return blocks.map((block, index) => {
      if (block.startsWith("\\[") && block.endsWith("\\]")) {
        return <BlockMath key={index} math={block.slice(2, -2)} />;
      }
      if (block.startsWith("\\(") && block.endsWith("\\)")) {
        return <InlineMath key={index} math={block.slice(2, -2)} />;
      }
      return block;
    });
  };

  const hasNotes =
    (message.role === "assistant" && message.relevantNotes?.length) ||
    (message.role === "user" && message.attachedNotes?.length);

  return (
    <div>
      <div
        className={cn(
          "relative p-1 text-sm",
          mounted && "transition-all duration-200 ease-out",
          message.role === "user"
            ? "bg-muted/30 border-none rounded-2xl rounded-tr-sm"
            : "bg-transparent border-0",
          message.role === "user" ? "ml-12" : "mr-4",
          hasNotes ? "mt-5" : message.role === "assistant" ? "mt-1" : "mt-0"
        )}
        style={!mounted ? { opacity: 0 } : undefined}
      >
        {mounted &&
          message.role === "assistant" &&
          message.relevantNotes &&
          message.relevantNotes.length > 0 && (
            <NoteStack notes={message.relevantNotes} isAttached={false} />
          )}
        {mounted &&
          message.role === "user" &&
          message.attachedNotes &&
          message.attachedNotes.length > 0 && (
            <NoteStack notes={message.attachedNotes} isAttached={true} />
          )}
        <div
          className={cn(
            "prose max-w-none",
            message.role === "user" ? "prose-sm" : "prose-base",
            message.role === "assistant"
              ? "text-foreground/90 leading-relaxed"
              : "text-foreground/80"
          )}
        >
          {processText(
            message.role === "assistant" &&
              message ===
                chatContext.conversationHistory
                  .filter((m) => m.role === "assistant")
                  .slice(-1)[0]
              ? mounted
                ? displayedText
                : message.content
              : message.content
          )}
        </div>
      </div>
      {mounted && <MessageActions message={message} />}
    </div>
  );
};

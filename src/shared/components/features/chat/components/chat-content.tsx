import "katex/dist/katex.min.css";

import { ChatContext } from "@/types/chat";
import { FileText } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { QueryExamples } from "./query-examples";
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
  setFollowUp: (followUp: string) => void;
  displayedText: string;
  isLoading: boolean;
  isFullscreen?: boolean;
};

type MessageProps = {
  message: ChatContext["conversationHistory"][0];
};

type Note = z.infer<typeof noteSchema>;

type NoteStackProps = {
  notes: Note[];
  isFullscreen?: boolean;
};

export const ChatContent = ({
  scrollContainerRef,
  chatContext,
  setFollowUp,
  displayedText,
  isLoading,
  isFullscreen = false,
}: ChatContentProps) => (
  <div
    ref={scrollContainerRef}
    className={cn(
      "flex-1 overflow-y-auto",
      isFullscreen ? "px-4 py-8 md:px-8" : "px-4 py-6 md:px-6",
      "scroll-smooth"
    )}
  >
    {!chatContext.conversationHistory.length ? (
      <QueryExamples setFollowUp={setFollowUp} />
    ) : (
      <div className="space-y-8 max-w-3xl mx-auto">
        {chatContext.conversationHistory.map((message, index) => (
          <div
            key={index}
            className={cn(
              "group",
              "animate-in fade-in-0 slide-in-from-bottom-2",
              message.role === "user"
                ? "flex justify-end"
                : "flex justify-start"
            )}
          >
            <MessageBubble
              message={message}
              displayedText={displayedText}
              chatContext={chatContext}
              isFullscreen={isFullscreen}
            />
          </div>
        ))}
        {isLoading && <LoadingIndicator />}
      </div>
    )}
  </div>
);

const NoteStack = ({ notes }: NoteStackProps) => {
  const router = useRouter();

  if (!notes?.length) return null;

  const handleNoteClick = (noteId: string) => {
    router.push(`/write?id=${noteId}`);
  };

  return (
    <div className="absolute -top-6 left-0">
      <Popover>
        <PopoverTrigger asChild>
          <button
            className={cn(
              "group flex items-center gap-2 px-3 py-1.5",
              "rounded-xl",
              "bg-secondary/30 hover:bg-secondary/40",
              "border border-secondary/30",
              "hover:bg-foreground/5",
              "transition-all duration-200"
            )}
          >
            <FileText className="w-3.5 h-3.5 text-secondary-foreground/70" />
            <span className="text-xs font-medium text-secondary-foreground/70">
              {notes.length} source{notes.length > 1 ? "s" : ""}
            </span>
          </button>
        </PopoverTrigger>
        <PopoverContent align="start" className="p-2 flex flex-col gap-1">
          {notes.map((note) => (
            <button
              key={note.id}
              onClick={() => handleNoteClick(note.id)}
              className={cn(
                "w-full text-left",
                "transition-colors duration-200 hover:bg-muted/50",
                "flex flex-col gap-1",
                "p-1",
                "rounded-md"
              )}
            >
              <h5 className="font-medium text-sm text-foreground/90 truncate">
                {note.title || "Untitled"}
              </h5>
              <div className="text-[10px] text-muted-foreground/60">
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
  isFullscreen = false,
}: MessageProps &
  Pick<ChatContentProps, "displayedText" | "chatContext" | "isFullscreen">) => {
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

  return (
    <div
      className={cn(
        "px-4 py-3",
        "text-sm relative",
        "transition-all duration-200 ease-out",
        message.role === "user" && "bg-white text-foreground/90",
        message.role === "user" ? "ml-8" : "mr-8",
        message.role === "user" && "rounded-l-full rounded-tr-full"
      )}
    >
      {message.role === "assistant" &&
        message.relevantNotes &&
        message.relevantNotes.length > 0 && (
          <NoteStack
            notes={message.relevantNotes}
            isFullscreen={isFullscreen}
          />
        )}
      <MessageActions message={message} />
      {processText(
        message.role === "assistant" &&
          message ===
            chatContext.conversationHistory
              .filter((m) => m.role === "assistant")
              .slice(-1)[0]
          ? displayedText
          : message.content
      )}
    </div>
  );
};

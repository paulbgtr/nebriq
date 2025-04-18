import "katex/dist/katex.min.css";
import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";

import { ChatContext, LLM_MODE_OPTIONS } from "@/types/chat";
import {
  StickyNote,
  Brain,
  ChevronRight,
  BarChart2,
  Lightbulb,
  Code,
  MessageSquare,
} from "lucide-react";
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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/shared/components/ui/collapsible";

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
        "flex-1 overflow-y-auto h-full",
        mounted && "transition-all duration-500 ease-in-out",
        !chatContext.conversationHistory.length &&
          mounted &&
          "opacity-0 pointer-events-none absolute"
      )}
    >
      <div className="h-full px-2 sm:px-4 lg:px-6 pb-4 max-w-3xl mx-auto">
        <div className="space-y-8 py-6">
          {chatContext.conversationHistory.map((message, index) => (
            <div
              key={index}
              className={cn(
                "group",
                message.role === "user"
                  ? "flex justify-end"
                  : "flex justify-start",
                mounted 
                  ? "animate-in fade-in-0 slide-in-from-bottom-1 duration-300"
                  : "opacity-0"
              )}
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
    <div className="mb-1.5">
      <Popover>
        <PopoverTrigger asChild>
          <button
            className={cn(
              "group flex items-center gap-1 px-1.5 py-0.5",
              "rounded-full",
              "text-[10px]",
              "shadow-sm",
              "transition-all duration-200 ease-in-out",
              isAttached
                ? "bg-primary/5 hover:bg-primary/10 text-primary/60 hover:text-primary/80 border border-primary/10"
                : "bg-secondary/5 hover:bg-secondary/10 text-secondary-foreground/60 hover:text-secondary-foreground/80 border border-secondary/10"
            )}
          >
            <StickyNote
              className={cn(
                "w-2.5 h-2.5",
                isAttached ? "text-primary/60" : "text-secondary-foreground/60"
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
          className="p-2 flex flex-col gap-1 rounded-lg shadow-md border border-border/20 bg-background/95 backdrop-blur-sm"
          sideOffset={5}
        >
          <div className="text-xs font-medium text-muted-foreground/80 mb-1 px-1">
            {isAttached ? "Attached Notes" : "Referenced Sources"}
          </div>
          {notes.map((note) => (
            <button
              key={note.id}
              onClick={() => handleNoteClick(note.id)}
              className={cn(
                "w-full text-left",
                "transition-colors duration-200 hover:bg-muted/40",
                "flex flex-col gap-0.5",
                "p-2",
                "rounded-md"
              )}
            >
              <h5 className="font-medium text-sm text-foreground/90 truncate">
                {note.title || "Untitled"}
              </h5>
              <div className="text-[10px] text-muted-foreground/60 flex items-center gap-1">
                <span className="inline-block w-1 h-1 rounded-full bg-muted-foreground/30"></span>
                {formatDate(note.created_at)}
              </div>
            </button>
          ))}
        </PopoverContent>
      </Popover>
    </div>
  );
};

type ThinkingProcessProps = {
  content: string;
};

const ThinkingProcess = ({ content }: ThinkingProcessProps) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!content) return null;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="mb-2 w-fit">
      <CollapsibleTrigger className="group flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full bg-secondary/5 hover:bg-secondary/10 text-secondary-foreground/60 hover:text-secondary-foreground/80 transition-all duration-200 ease-in-out border border-secondary/10">
        <Brain className="w-2.5 h-2.5 text-secondary-foreground/60" />
        <span className="font-medium">read my mind</span>
        <ChevronRight
          className={cn(
            "w-2.5 h-2.5 text-secondary-foreground/60 transition-transform duration-200",
            isOpen && "transform rotate-90"
          )}
        />
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-1.5 overflow-hidden text-[12px] px-3 py-2 rounded-md bg-secondary/5 border border-secondary/10 text-secondary-foreground/70">
        <div className="prose-xs max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code({ className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || "");
                return match ? (
                  <SyntaxHighlighter
                    style={vscDarkPlus}
                    language={match[1]}
                    PreTag="div"
                    className="rounded-md text-[12px] my-2 !bg-black/80"
                  >
                    {String(children).replace(/\n$/, "")}
                  </SyntaxHighlighter>
                ) : (
                  <code
                    className={cn(
                      "px-1 py-0.5 rounded bg-muted/40 text-foreground/90 font-mono text-[85%]",
                      className
                    )}
                    {...props}
                  >
                    {children}
                  </code>
                );
              },
              p({ children }) {
                return (
                  <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>
                );
              },
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

const MessageBubble = ({
  message,
  displayedText,
  chatContext,
}: MessageProps & Pick<ChatContentProps, "displayedText" | "chatContext">) => {
  const [mounted, setMounted] = useState(false);
  const messageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const extractThinking = (
    text: string
  ): { thinking: string | null; content: string } => {
    const thinkRegex = /<think>([\s\S]*?)<\/think>/;
    const match = text.match(thinkRegex);

    if (match) {
      const thinking = match[1].trim();
      const content = text.replace(thinkRegex, "").trim();
      return { thinking, content };
    }

    return { thinking: null, content: text };
  };

  // Process the message
  const processMessageContent = () => {
    const text =
      message.role === "assistant" &&
      message ===
        chatContext.conversationHistory
          .filter((m) => m.role === "assistant")
          .slice(-1)[0]
        ? mounted
          ? displayedText
          : message.content
        : message.content;

    return extractThinking(text);
  };

  const { thinking, content } = processMessageContent();

  const processText = (text: string) => {
    const blocks = text.split(/(\\[[\s\S]*?\\]|\\\([\s\S]*?\\\))/g);
    return blocks.map((block, index) => {
      if (block.startsWith("\\[") && block.endsWith("\\]")) {
        return <BlockMath key={index} math={block.slice(2, -2)} />;
      }
      if (block.startsWith("\\(") && block.endsWith("\\)")) {
        return <InlineMath key={index} math={block.slice(2, -2)} />;
      }

      return (
        <ReactMarkdown
          key={index}
          remarkPlugins={[remarkGfm]}
          components={{
            code({ className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || "");
              return match ? (
                <SyntaxHighlighter
                  style={vscDarkPlus}
                  language={match[1]}
                  PreTag="div"
                  className="rounded-md text-[13px] my-3 !bg-black/80"
                >
                  {String(children).replace(/\n$/, "")}
                </SyntaxHighlighter>
              ) : (
                <code
                  className={cn(
                    "px-1.5 py-0.5 rounded bg-muted/40 text-foreground/90 font-mono text-[85%]",
                    className
                  )}
                  {...props}
                >
                  {children}
                </code>
              );
            },
            p({ children }) {
              return (
                <p className="mb-3 last:mb-0 leading-relaxed">{children}</p>
              );
            },
            ul({ children }) {
              return (
                <ul className="mb-3 last:mb-0 pl-6 space-y-1">{children}</ul>
              );
            },
            ol({ children }) {
              return (
                <ol className="mb-3 last:mb-0 pl-6 space-y-1">{children}</ol>
              );
            },
            li({ children }) {
              return (
                <li className="marker:text-muted-foreground/70">{children}</li>
              );
            },
            h1({ children }) {
              return (
                <h1 className="text-xl font-semibold mt-5 mb-2">{children}</h1>
              );
            },
            h2({ children }) {
              return (
                <h2 className="text-lg font-semibold mt-4 mb-2">{children}</h2>
              );
            },
            h3({ children }) {
              return (
                <h3 className="text-base font-semibold mt-3 mb-1.5">
                  {children}
                </h3>
              );
            },
            blockquote({ children }) {
              return (
                <blockquote className="border-l-2 border-muted pl-3 italic text-muted-foreground/80 my-2">
                  {children}
                </blockquote>
              );
            },
            a({ children, href }) {
              return (
                <a
                  href={href}
                  className="text-primary hover:underline transition-all duration-200"
                >
                  {children}
                </a>
              );
            },
            table({ children }) {
              return (
                <div className="overflow-x-auto mb-3">
                  <table className="min-w-full border-collapse text-sm">
                    {children}
                  </table>
                </div>
              );
            },
            th({ children }) {
              return (
                <th className="border border-border/20 px-2 py-1 text-left font-medium bg-muted/20">
                  {children}
                </th>
              );
            },
            td({ children }) {
              return (
                <td className="border border-border/20 px-2 py-1">
                  {children}
                </td>
              );
            },
          }}
        >
          {block}
        </ReactMarkdown>
      );
    });
  };

  // Create a ModeIndicator component
  const ModeIndicator = () => {
    if (!message.mode || message.mode === "standard" || message.role === "user")
      return null;

    const modeOption = LLM_MODE_OPTIONS.find(
      (option) => option.value === message.mode
    );
    if (!modeOption) return null;

    const IconComponent = (() => {
      switch (message.mode) {
        case "analysis":
          return BarChart2;
        case "reflection":
          return Brain;
        case "ideation":
          return Lightbulb;
        case "engineering":
          return Code;
        default:
          return MessageSquare;
      }
    })();

    return (
      <div className="flex items-center gap-1 mb-1">
        <div
          className={cn(
            "flex items-center justify-center rounded-full w-5 h-5",
            "bg-background border border-border/30"
          )}
        >
          <IconComponent className={cn("w-3 h-3", modeOption.color)} />
        </div>
        <span className={cn("text-[10px] font-medium", modeOption.color)}>
          {modeOption.label} Mode
        </span>
      </div>
    );
  };

  return (
    <div
      ref={messageRef}
      className={message.role === "user" ? "ml-auto" : "mr-auto"}
    >
      {/* Show mode indicator only for assistant messages with special modes */}
      {mounted &&
        message.role === "assistant" &&
        message.mode &&
        message.mode !== "standard" && <ModeIndicator />}

      <div className="flex gap-3">
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

        {/* Thinking process for assistant messages */}
        {mounted && message.role === "assistant" && thinking && (
          <ThinkingProcess content={thinking} />
        )}
      </div>
      <div
        className={cn(
          "relative",
          mounted 
            ? "transition-all duration-200 ease-out" 
            : "opacity-0",
          message.role === "user"
            ? "bg-muted/20 rounded-2xl rounded-tr-sm"
            : "bg-transparent" // No background for assistant messages
        )}
      >
        <div
          className={cn(
            "px-4 py-3",
            message.role === "user" ? "text-[14px]" : "text-[15px]",
            message.role === "assistant"
              ? "text-foreground/90 font-normal"
              : "text-foreground/85"
          )}
        >
          <div className="prose-sm max-w-none">{processText(content)}</div>
        </div>
      </div>
      {mounted && (
        <div
          className={cn(
            "opacity-0 group-hover:opacity-100 transition-opacity duration-200",
            message.role === "user" ? "text-right" : "text-left"
          )}
        >
          <MessageActions message={message} />
        </div>
      )}
    </div>
  );
};

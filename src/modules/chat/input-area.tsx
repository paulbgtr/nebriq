"use client";

import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";
import { FaArrowUp } from "react-icons/fa";
import { KeyboardEvent, useState, useCallback, useRef, useEffect } from "react";
import { Textarea } from "@/shared/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { FileText, X, StickyNote } from "lucide-react";
import { useNotes } from "@/shared/hooks/use-notes";
import { formatDate } from "@/shared/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { z } from "zod";
import { noteSchema } from "@/shared/lib/schemas/note";
import { ModeSelector } from "../home/features/chat/components/mode-selector";
import { useUser } from "@/shared/hooks/use-user";
import {
  useChatHistory,
  useSendMessage,
} from "../../shared/hooks/use-chat-history";
import { useRouter } from "next/navigation";
import { useSelectedModelStore } from "@/store/selected-model";
import { Greeting } from "./components/greeting";
import { summarizeText } from "@/app/actions/llm/summary";

const AttachedNotePreview = ({
  note,
  onRemove,
}: {
  note: z.infer<typeof noteSchema>;
  onRemove: () => void;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={cn(
        "flex items-center gap-2 px-3 py-1.5",
        "rounded-full",
        "bg-primary/5 hover:bg-primary/10",
        "border border-primary/20",
        "shadow-sm",
        "group transition-all duration-200 ease-out"
      )}
    >
      <div className="flex items-center gap-1.5">
        <FileText className="w-3 h-3 text-primary/60 shrink-0" />
        <span className="text-xs font-medium truncate max-w-[120px] text-primary/80">
          {note.title || "Untitled"}
        </span>
      </div>
      <button
        onClick={onRemove}
        className={cn(
          "text-primary/40 hover:text-primary/80",
          "opacity-0 group-hover:opacity-100",
          "transition-all duration-200",
          "focus:opacity-100 focus:outline-none",
          "w-4 h-4 rounded-full",
          "flex items-center justify-center",
          "hover:bg-primary/10 active:scale-90"
        )}
        aria-label="Remove note"
      >
        <X className="w-2.5 h-2.5" />
      </button>
    </motion.div>
  );
};

type Props = {
  chatId?: string;
  setIsModelThinking?: React.Dispatch<React.SetStateAction<boolean>>;
};

export const InputArea = ({ chatId, setIsModelThinking }: Props) => {
  const [followUp, setFollowUp] = useState("");
  const [selectedNoteIds, setSelectedNoteIds] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { getNotesQuery } = useNotes();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const router = useRouter();
  const { user } = useUser();
  const { createChat } = useChatHistory();
  const { mutate: sendMessage, isPending: isSending } = useSendMessage();
  const { selectedModel, selectedMode } = useSelectedModelStore();

  useEffect(() => {
    if (!isSending && setIsModelThinking) {
      setIsModelThinking(false);
    }
  }, [isSending, setIsModelThinking]);

  const isNewChat = !chatId;

  const selectedNotes =
    getNotesQuery.data?.filter((note) => selectedNoteIds.includes(note.id)) ||
    [];

  const filteredNotes =
    searchQuery && getNotesQuery.data
      ? getNotesQuery.data.filter(
          (note) =>
            !selectedNoteIds.includes(note.id) &&
            (note.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
              note.content?.toLowerCase().includes(searchQuery.toLowerCase()))
        )
      : getNotesQuery.data?.filter(
          (note) => !selectedNoteIds.includes(note.id)
        );

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
    },
    []
  );

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const currentFollowUp = followUp.trim();
    const currentSelectedNoteIds = [...selectedNoteIds];

    if (!user?.id || !currentFollowUp || isSending) {
      return;
    }

    const currentSelectedNotes = getNotesQuery.data?.filter((note) =>
      currentSelectedNoteIds.includes(note.id)
    );

    setFollowUp("");
    setSelectedNoteIds([]);

    if (setIsModelThinking) {
      setIsModelThinking(true);
    }

    let targetChatId = chatId;

    try {
      if (isNewChat) {
        const title = await summarizeText({ text: currentFollowUp });

        if (!title) {
          console.error("Failed to generate chat title.");
          setFollowUp(currentFollowUp);
          setSelectedNoteIds(currentSelectedNoteIds);
          return;
        }

        const newChat = await createChat(title);

        if (!newChat || !newChat.id) {
          console.error("Failed to create new chat or missing ID.");
          setFollowUp(currentFollowUp);
          setSelectedNoteIds(currentSelectedNoteIds);
          return;
        }

        if (currentSelectedNoteIds.length > 0) {
          localStorage.setItem(
            `attachedNoteIds_${targetChatId}`,
            JSON.stringify(currentSelectedNoteIds)
          );
        }

        targetChatId = newChat.id;
        router.push(`/c/${targetChatId}`);

        sendMessage({
          messageContent: currentFollowUp,
          chatId: targetChatId,
          userId: user.id,
          model: selectedModel.id,
          mode: selectedMode,
          attachedNotes: currentSelectedNotes,
        });
      } else {
        if (currentSelectedNoteIds.length > 0) {
          localStorage.setItem(
            `attachedNoteIds_${chatId}`,
            JSON.stringify(currentSelectedNoteIds)
          );
        }
        sendMessage({
          messageContent: currentFollowUp,
          chatId: targetChatId!,
          userId: user.id,
          model: selectedModel.id,
          mode: selectedMode,
          attachedNotes: currentSelectedNotes,
        });
      }
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      if (!isSending) {
        setFollowUp(currentFollowUp);
        setSelectedNoteIds(currentSelectedNoteIds);
      }
    }
  };

  const handleNoteSelect = (noteId: string) => {
    setSelectedNoteIds((prev) => [...prev, noteId]);
    setIsOpen(false);
    setSearchQuery("");
  };

  const handleNoteRemove = (noteId: string) => {
    setSelectedNoteIds((prev) => prev.filter((id) => id !== noteId));
  };

  const SubmitButton = () => {
    return (
      <div className="flex items-center gap-2">
        <Button
          type="submit"
          disabled={followUp.length === 0 || isSending}
          className={cn(
            "flex items-center justify-center",
            "h-9 w-9 rounded-xl",
            "transition-all duration-300 ease-in-out",
            "shadow-sm",
            "bg-primary hover:bg-primary/90",
            "active:scale-95 disabled:opacity-50",
            "disabled:pointer-events-none"
          )}
        >
          <FaArrowUp className="w-3.5 h-3.5" />
        </Button>
      </div>
    );
  };

  return (
    <div
      className={cn(
        "pb-4",
        "max-w-xl mx-auto",
        "w-full bg-background/70 backdrop-blur-xl",
        "transition-all duration-500 ease-in-out",
        "flex-shrink-0",
        "space-y-2",
        !isNewChat && "fixed bottom-0 left-0 right-0"
      )}
    >
      {isNewChat && <Greeting />}
      <div className="relative space-y-3">
        <form onSubmit={handleSubmit} className="relative space-y-3">
          <AnimatePresence>
            {selectedNotes.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2 overflow-hidden"
              >
                <div className="flex flex-wrap items-center gap-2">
                  {selectedNotes.map((note) => (
                    <AttachedNotePreview
                      key={note.id}
                      note={note}
                      onRemove={() => handleNoteRemove(note.id)}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div
            className={cn(
              "relative rounded-2xl border border-border/30",
              "bg-gradient-to-b from-background/95 to-background/90",
              "backdrop-blur-xl overflow-hidden",
              "focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/30",
              "transition-all duration-300 ease-in-out shadow-sm",
              "hover:shadow-md hover:border-primary/20"
            )}
          >
            <div className="flex items-center relative">
              <motion.div
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground/30 pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: followUp.length > 0 ? 0 : 1 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-medium">Ask Briq</span>
                  <span className="hidden sm:inline text-[10px] opacity-70">
                    •
                  </span>
                  <span className="hidden sm:inline text-[10px] opacity-70">
                    &quot;Summarize this note&quot; or &quot;Generate
                    ideas&quot;
                  </span>
                </div>
              </motion.div>
              <Textarea
                ref={textareaRef}
                value={followUp}
                onChange={(e) => setFollowUp(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder=""
                rows={1}
                aria-label="Type your message"
                className={cn(
                  "min-h-[52px] max-h-[200px] flex-1",
                  "py-3.5 px-4",
                  "text-base leading-relaxed resize-none",
                  "border-0 focus:ring-0 focus-visible:ring-0 ring-0 shadow-none outline-none",
                  "bg-transparent",
                  "placeholder:text-muted-foreground/40",
                  "scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent",
                  "transition-all duration-300 ease-in-out"
                )}
              />
            </div>

            <div
              className={cn(
                "flex items-center justify-between",
                "border-t border-border/10",
                "bg-muted/20",
                "px-4 py-2.5"
              )}
            >
              <div className="flex items-center gap-2">
                <Popover open={isOpen} onOpenChange={setIsOpen}>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className={cn(
                        "flex items-center gap-2 py-1.5 px-3",
                        "rounded-full",
                        "text-xs font-medium",
                        "hover:bg-muted/70",
                        "active:scale-95",
                        "text-muted-foreground/70 hover:text-muted-foreground",
                        "transition-all duration-200 ease-out",
                        "border border-transparent hover:border-border/40"
                      )}
                    >
                      <StickyNote className="w-3.5 h-3.5" />
                      <span>Add context</span>
                    </button>
                  </PopoverTrigger>
                  <PopoverContent
                    side="top"
                    align="start"
                    className="w-80 p-4 rounded-xl shadow-lg border border-border/30 bg-background/95 backdrop-blur-sm"
                    sideOffset={8}
                  >
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <div className="text-sm font-medium text-foreground mb-3">
                          Attach notes to your message
                        </div>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                            <svg
                              width="15"
                              height="15"
                              viewBox="0 0 15 15"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              className="text-muted-foreground/50"
                            >
                              <path
                                d="M10 6.5C10 8.433 8.433 10 6.5 10C4.567 10 3 8.433 3 6.5C3 4.567 4.567 3 6.5 3C8.433 3 10 4.567 10 6.5ZM9.30884 10.0159C8.53901 10.6318 7.56251 11 6.5 11C4.01472 11 2 8.98528 2 6.5C2 4.01472 4.01472 2 6.5 2C8.98528 2 11 4.01472 11 6.5C11 7.56251 10.6318 8.53901 10.0159 9.30884L12.8536 12.1464C13.0488 12.3417 13.0488 12.6583 12.8536 12.8536C12.6583 13.0488 12.3417 13.0488 12.1464 12.8536L9.30884 10.0159Z"
                                fill="currentColor"
                                fillRule="evenodd"
                                clipRule="evenodd"
                              ></path>
                            </svg>
                          </div>
                          <input
                            type="text"
                            placeholder="Search notes..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                            className={cn(
                              "w-full py-2.5 pl-9 pr-3",
                              "text-sm",
                              "rounded-lg border border-input/50 focus:border-primary/30",
                              "bg-background/80",
                              "focus-visible:ring-1 focus-visible:ring-primary/30 focus-visible:outline-none",
                              "transition-all duration-200"
                            )}
                          />
                        </div>
                        <div className="max-h-[300px] overflow-y-auto space-y-1 mt-2">
                          <AnimatePresence mode="popLayout">
                            {filteredNotes?.map((note) => (
                              <motion.button
                                key={note.id}
                                layout
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                onClick={() => handleNoteSelect(note.id)}
                                className={cn(
                                  "w-full text-left p-3 rounded-lg",
                                  "transition-all duration-200 ease-out",
                                  "hover:bg-muted/70 hover:shadow-sm",
                                  "border border-transparent hover:border-border/40",
                                  "active:scale-[0.98]"
                                )}
                              >
                                <div className="space-y-1.5">
                                  <div className="flex items-start justify-between gap-2">
                                    <h5 className="font-medium text-sm text-foreground truncate flex items-center gap-1.5">
                                      <FileText className="w-3.5 h-3.5 text-primary/60 shrink-0" />
                                      <span>{note.title || "Untitled"}</span>
                                    </h5>
                                    <time className="text-[10px] text-muted-foreground/60 whitespace-nowrap bg-muted/40 py-0.5 px-1.5 rounded-full">
                                      {formatDate(note.created_at)}
                                    </time>
                                  </div>
                                  {note.content && (
                                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                                      {note.content.replace(/<[^>]*>/g, "")}
                                    </p>
                                  )}
                                </div>
                              </motion.button>
                            ))}
                          </AnimatePresence>
                          {filteredNotes?.length === 0 && (
                            <div className="text-center py-8 px-4">
                              <StickyNote className="w-8 h-8 text-muted-foreground/30 mx-auto mb-3" />
                              <p className="text-sm font-medium text-muted-foreground/70 mb-1">
                                No notes found
                              </p>
                              <p className="text-xs text-muted-foreground/50">
                                Try a different search term or create a new note
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              <div className="flex items-center gap-2">
                <ModeSelector />

                <SubmitButton />
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

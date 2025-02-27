import { ChatContext } from "@/types/chat";
import { cn } from "@/shared/lib/utils";
import { Eye, EyeOff, FileText, ExternalLink, Clock } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/shared/components/ui/collapsible";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { formatDate } from "@/shared/lib/utils";

type ContextPanelProps = {
  chatContext: ChatContext;
};

export const ContextPanel = ({ chatContext }: ContextPanelProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const hasRelevantNotes = chatContext.relevantNotes.length > 0;

  if (!hasRelevantNotes) {
    return null;
  }

  const handleNoteClick = (noteId: string) => {
    router.push(`/write?id=${noteId}`);
  };

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="space-y-2 bg-background/50 p-3 transition-all duration-200"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="h-3.5 w-3.5 text-muted-foreground" />
          <h3 className="text-sm text-muted-foreground">Context</h3>
        </div>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
            {isOpen ? (
              <EyeOff className="h-3.5 w-3.5 text-muted-foreground" />
            ) : (
              <Eye className="h-3.5 w-3.5 text-muted-foreground" />
            )}
          </Button>
        </CollapsibleTrigger>
      </div>

      <CollapsibleContent>
        {hasRelevantNotes && (
          <div>
            <h4 className="mb-2 text-xs text-muted-foreground flex items-center justify-between">
              <span>Notes ({chatContext.relevantNotes.length})</span>
              <span className="text-[10px] text-muted-foreground">
                AI Selected
              </span>
            </h4>
            <ScrollArea className="h-[min(calc(100vh-20rem),400px)]">
              <AnimatePresence>
                <div className="space-y-1.5 pr-4">
                  {chatContext.relevantNotes.map((note, index) => (
                    <motion.div
                      key={note.id || index}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.15, delay: index * 0.05 }}
                    >
                      <button
                        onClick={() => note.id && handleNoteClick(note.id)}
                        className={cn(
                          "group w-full rounded-md p-2.5",
                          "transition-colors duration-200 hover:bg-muted/50",
                          "text-left cursor-pointer"
                        )}
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5 mb-0.5">
                                <h5 className="font-medium text-sm text-foreground/80 truncate">
                                  {note.title || "Untitled"}
                                </h5>
                                <ExternalLink className="h-3 w-3 text-muted-foreground/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex-shrink-0" />
                              </div>
                              <p className="text-xs text-muted-foreground line-clamp-2">
                                {note.content}
                              </p>
                            </div>
                          </div>
                          {note.created_at && (
                            <div className="flex items-center gap-1 text-[10px] text-muted-foreground/60">
                              <Clock className="h-3 w-3" />
                              <span>{formatDate(note.created_at)}</span>
                            </div>
                          )}
                        </div>
                      </button>
                    </motion.div>
                  ))}
                </div>
              </AnimatePresence>
            </ScrollArea>
          </div>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
};

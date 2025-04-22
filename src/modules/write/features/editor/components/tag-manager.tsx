import { useState, useRef, useEffect } from "react";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { X, Plus, Hash } from "lucide-react";
import { useTags } from "@/shared/hooks/data/use-tags";
import { useToast } from "@/shared/hooks/use-toast";
import { useUser } from "@/shared/hooks/data/use-user";
import { cn } from "@/shared/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface TagManagerProps {
  noteId: string;
  className?: string;
}

export const TagManager = ({ noteId, className }: TagManagerProps) => {
  const [newTag, setNewTag] = useState("");
  const [isInputActive, setIsInputActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { user } = useUser();
  const { getTagsByNoteIdQuery, createTagMutation, deleteTagMutation } =
    useTags(noteId);
  const { data: tags, isLoading } = getTagsByNoteIdQuery;

  useEffect(() => {
    if (isInputActive && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isInputActive]);

  const handleAddTag = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTag.trim() || !user?.id) return;

    try {
      await createTagMutation.mutateAsync({
        name: newTag.trim(),
        user_id: user.id,
        note_id: noteId,
      });
      setNewTag("");
      setIsInputActive(false);
    } catch {
      toast({
        description: "Failed to add tag",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTag = async (id: number) => {
    try {
      await deleteTagMutation.mutateAsync(id);
    } catch {
      toast({
        description: "Failed to delete tag",
        variant: "destructive",
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsInputActive(false);
      setNewTag("");
    }
  };

  return (
    <div className={cn("flex flex-wrap items-center gap-1.5", className)}>
      {!isLoading && tags?.length === 0 && !isInputActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          className="text-xs text-foreground/70 font-medium"
        >
          Add tags to organize your note
        </motion.div>
      )}

      <div className="flex flex-wrap items-center gap-1.5">
        <AnimatePresence>
          {isLoading ? (
            <Badge
              variant="secondary"
              className="h-6 px-2 text-xs font-medium bg-muted/40 text-foreground border-none"
            >
              <span className="animate-pulse">•••</span>
            </Badge>
          ) : (
            tags?.map((tag) => (
              <motion.div
                key={tag.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <Badge
                  variant="secondary"
                  className="h-6 px-2 text-xs font-medium bg-primary/15 text-foreground/70 hover:bg-primary/25 group transition-all duration-200 border-none"
                >
                  {tag.name}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-3.5 w-3.5 p-0 ml-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleDeleteTag(tag.id)}
                  >
                    <X className="h-2 w-2 text-foreground/70 hover:text-foreground transition-colors" />
                  </Button>
                </Badge>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {!isInputActive ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.15 }}
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsInputActive(true)}
              className="h-6 px-2 text-xs text-foreground/80 hover:text-foreground group flex items-center gap-1.5 rounded-full bg-muted/40 hover:bg-muted/60 transition-all duration-200"
            >
              <Hash className="h-3 w-3 text-primary group-hover:text-primary transition-colors" />
              <span>Add tag</span>
            </Button>
          </motion.div>
        ) : (
          <motion.form
            onSubmit={handleAddTag}
            initial={{ opacity: 0, width: "80px" }}
            animate={{ opacity: 1, width: "auto" }}
            exit={{ opacity: 0, width: "80px" }}
            transition={{ duration: 0.2 }}
            className="flex items-center"
          >
            <div className="relative flex items-center bg-muted/40 rounded-full pl-2 pr-1 h-6 border border-transparent focus-within:border-primary/20 focus-within:bg-muted/60 transition-all duration-200">
              <Hash className="h-3 w-3 text-primary mr-1" />
              <input
                ref={inputRef}
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={() => !newTag && setIsInputActive(false)}
                placeholder="Type tag..."
                className="bg-transparent focus:outline-none text-xs w-20 text-foreground placeholder:text-foreground/50"
                maxLength={20}
              />
              <div className="flex items-center">
                <Button
                  type="submit"
                  size="icon"
                  variant="ghost"
                  className="h-4 w-4 p-0 ml-1 text-primary hover:text-primary/80 transition-colors"
                  disabled={!newTag.trim()}
                >
                  <Plus className="h-2.5 w-2.5" />
                </Button>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  onClick={() => {
                    setIsInputActive(false);
                    setNewTag("");
                  }}
                  className="h-4 w-4 p-0 text-foreground/60 hover:text-foreground/80 transition-colors"
                >
                  <X className="h-2.5 w-2.5" />
                </Button>
              </div>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
};

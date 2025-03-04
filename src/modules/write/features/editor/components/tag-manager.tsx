import { useState } from "react";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { X, Plus } from "lucide-react";
import { useTags } from "@/shared/hooks/use-tags";
import { useToast } from "@/shared/hooks/use-toast";
import { useUser } from "@/shared/hooks/use-user";
import { cn } from "@/shared/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface TagManagerProps {
  noteId: string;
  className?: string;
}

export const TagManager = ({ noteId, className }: TagManagerProps) => {
  const [newTag, setNewTag] = useState("");
  const { toast } = useToast();
  const { user } = useUser();
  const { getTagsByNoteIdQuery, createTagMutation, deleteTagMutation } =
    useTags(noteId);
  const { data: tags, isLoading } = getTagsByNoteIdQuery;

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

  return (
    <div className={cn("p-3 space-y-2", className)}>
      <div className="flex flex-wrap items-center gap-1.5">
        <form onSubmit={handleAddTag} className="inline-flex">
          <Badge
            variant="outline"
            className="group border-dashed hover:border-solid transition-all duration-200"
          >
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="New tag"
              className="w-16 bg-transparent focus:outline-none text-xs placeholder:text-muted-foreground/70"
              maxLength={20}
            />
            <Button
              type="submit"
              size="icon"
              variant="ghost"
              className="h-4 w-4 p-0 ml-1 opacity-0 group-hover:opacity-100 transition-opacity"
              disabled={!newTag.trim()}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </Badge>
        </form>

        <AnimatePresence>
          {isLoading ? (
            <Badge variant="secondary" className="animate-pulse">
              Loading...
            </Badge>
          ) : (
            tags?.map((tag) => (
              <motion.div
                key={tag.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.15 }}
              >
                <Badge
                  variant="secondary"
                  className="group text-xs font-normal"
                >
                  {tag.name}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 p-0 ml-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleDeleteTag(tag.id)}
                  >
                    <X className="h-3 w-3 hover:text-destructive transition-colors" />
                  </Button>
                </Badge>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

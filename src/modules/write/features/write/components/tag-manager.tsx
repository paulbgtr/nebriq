import { useState } from "react";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { X, Plus } from "lucide-react";
import { useTags } from "@/hooks/use-tags";
import { useToast } from "@/shared/hooks/use-toast";
import { useUser } from "@/hooks/use-user";
import { cn } from "@/shared/lib/utils";

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
      toast({
        title: "Success",
        description: `Tag "${newTag}" has been added`,
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add tag. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const handleDeleteTag = async (id: number, name: string) => {
    try {
      await deleteTagMutation.mutateAsync(id);
      toast({
        title: "Success",
        description: `Tag "${name}" has been removed`,
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete tag. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex flex-wrap items-center gap-2">
        <form onSubmit={handleAddTag} className="flex-shrink-0">
          <Badge
            variant="outline"
            className="hover:bg-secondary transition-colors cursor-text px-2 py-1"
          >
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="New tag..."
              className="bg-transparent focus:outline-none w-16 placeholder:text-muted-foreground"
              maxLength={20}
            />
            <Button
              type="submit"
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0 hover:bg-transparent"
              disabled={!newTag.trim()}
            >
              <Plus className="h-3 w-3 text-muted-foreground hover:text-foreground transition-colors" />
            </Button>
          </Badge>
        </form>

        {isLoading ? (
          <Badge variant="secondary" className="animate-pulse">
            Loading tags...
          </Badge>
        ) : (
          <div className="flex flex-wrap gap-2">
            {tags?.map((tag) => (
              <Badge
                key={tag.id}
                variant="secondary"
                className="group px-2 py-1 transition-all hover:bg-secondary/80"
              >
                <span className="text-sm">{tag.name}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-1 h-4 w-4 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleDeleteTag(tag.id, tag.name)}
                >
                  <X className="h-3 w-3 text-muted-foreground hover:text-destructive transition-colors" />
                </Button>
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

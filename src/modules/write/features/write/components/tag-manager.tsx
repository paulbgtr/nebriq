import { useState } from "react";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { X, Plus } from "lucide-react";
import { useTags } from "@/hooks/use-tags";
import { useToast } from "@/shared/hooks/use-toast";
import { useUser } from "@/hooks/use-user";

interface TagManagerProps {
  noteId: string;
}

export const TagManager = ({ noteId }: TagManagerProps) => {
  const [newTag, setNewTag] = useState("");
  const { toast } = useToast();
  const { user } = useUser();
  const { getTagsByNoteIdQuery, createTagMutation, deleteTagMutation } =
    useTags(noteId);

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
        title: "Tag added",
        description: `Added tag "${newTag}"`,
      });
    } catch (error) {
      toast({
        title: "Error adding tag",
        description: "Failed to add tag. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTag = async (tagName: string) => {
    try {
      await deleteTagMutation.mutateAsync(tagName);
      toast({
        title: "Tag deleted",
        description: `Removed tag "${tagName}"`,
      });
    } catch (error) {
      toast({
        title: "Error deleting tag",
        description: "Failed to delete tag. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex gap-2">
      <form onSubmit={handleAddTag} className="flex gap-2">
        <Badge variant="secondary">
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="Add tag..."
            className="bg-transparent focus:outline-none"
            size={10}
          />
          <Plus className="text-neutral h-4 w-4" />
        </Badge>
      </form>
      <div className="flex flex-wrap gap-2">
        {getTagsByNoteIdQuery.data?.map((tagLink: any) => (
          <Badge
            key={tagLink.tags.id}
            variant="secondary"
            className="text-sm group flex items-center gap-1"
          >
            {tagLink.tags.name}
            <Button
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0 opacity-50 hover:opacity-100"
              onClick={() => handleDeleteTag(tagLink.tags.name)}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        ))}
      </div>
    </div>
  );
};

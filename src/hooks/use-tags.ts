import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getTagLinks,
  getTagsByNoteId,
  createTag,
  updateTag,
  deleteTag,
  linkTagToNote,
} from "@/app/actions/supabase/tags";
import queryClient from "@/shared/lib/react-query";
import { CreateTag } from "@/types/tag";

export const useTags = (noteId?: string) => {
  const getTagLinksQuery = useQuery({
    queryKey: ["tagLinks"],
    queryFn: getTagLinks,
  });

  const getTagsByNoteIdQuery = useQuery({
    queryKey: ["tags", noteId],
    queryFn: () => getTagsByNoteId(noteId!),
    enabled: !!noteId,
  });

  const createTagMutation = useMutation({
    mutationFn: async (tag: CreateTag) => {
      try {
        const { id } = await createTag({
          name: tag.name,
          user_id: tag.user_id,
        });

        await linkTagToNote(id, tag.note_id);
      } catch (error) {
        console.error("Mutation error:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
    },
    onError: (error) => {
      console.error("Failed to create tag:", error);
    },
  });

  const updateTagMutation = useMutation({
    mutationFn: updateTag,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
    },
  });

  const deleteTagMutation = useMutation({
    mutationFn: deleteTag,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
    },
  });

  return {
    getTagLinksQuery,
    getTagsByNoteIdQuery,
    createTagMutation,
    updateTagMutation,
    deleteTagMutation,
  };
};

import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
} from "@/app/actions/supabase/notes";
import queryClient from "@/shared/lib/react-query";
import { useUser } from "@/hooks/use-user";

export const useNotes = () => {
  const { user } = useUser();

  const getNotesQuery = useQuery({
    queryKey: ["notes", user?.id],
    queryFn: () => getNotes(user!.id),
    enabled: !!user?.id,
  });

  const createNoteMutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  const updateNoteMutation = useMutation({
    mutationFn: updateNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  const deleteNoteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  return {
    getNotesQuery,
    createNoteMutation,
    updateNoteMutation,
    deleteNoteMutation,
  };
};

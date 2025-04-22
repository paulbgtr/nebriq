import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
  deleteNotes,
} from "@/app/actions/supabase/notes";
import queryClient from "@/shared/lib/react-query";
import { useUser } from "@/shared/hooks/data/use-user";

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
      queryClient.invalidateQueries({ queryKey: ["note-tabs"] });
    },
  });

  const updateNoteMutation = useMutation({
    mutationFn: updateNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      queryClient.invalidateQueries({ queryKey: ["note-tabs"] });
    },
  });

  const deleteNoteMutation = useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      queryClient.invalidateQueries({ queryKey: ["note-tabs"] });
    },
  });

  const deleteNotesMutation = useMutation({
    mutationFn: deleteNotes,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      queryClient.invalidateQueries({ queryKey: ["note-tabs"] });
    },
  });

  return {
    getNotesQuery,
    createNoteMutation,
    updateNoteMutation,
    deleteNoteMutation,
    deleteNotesMutation,
  };
};

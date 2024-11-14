import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
} from "@/app/actions/notes";
import queryClient from "@/shared/lib/react-query";

export const useNotes = () => {
  const getNotesQuery = useQuery({
    queryKey: ["notes"],
    queryFn: getNotes,
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

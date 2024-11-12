import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
} from "@/app/actions/notes";

export const useNotes = () => {
  const getNotesQuery = useQuery({
    queryKey: ["notes"],
    queryFn: getNotes,
  });

  const createNoteMutation = useMutation({
    mutationFn: createNote,
  });

  const updateNoteMutation = useMutation({
    mutationFn: updateNote,
  });

  const deleteNoteMutation = useMutation({
    mutationFn: deleteNote,
  });

  return {
    getNotesQuery,
    createNoteMutation,
    updateNoteMutation,
    deleteNoteMutation,
  };
};

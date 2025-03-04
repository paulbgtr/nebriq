import { useQuery, useMutation } from "@tanstack/react-query";
import {
  getNoteConnections,
  createNoteConnection,
  deleteNoteConnection,
} from "@/app/actions/supabase/note_connections";
import queryClient from "@/shared/lib/react-query";

export const useNoteConnections = (noteId: string) => {
  const noteConnectionsQuery = useQuery({
    queryKey: ["noteConnections", noteId],
    queryFn: () => getNoteConnections(noteId),
    enabled: !!noteId,
  });

  const createNoteConnectionMutation = useMutation({
    mutationFn: createNoteConnection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["noteConnections"] });
    },
  });

  const deleteNoteConnectionMutation = useMutation({
    mutationFn: deleteNoteConnection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["noteConnections"] });
    },
    onError: (error) => {
      console.error("Error deleting note connection:", error);
      queryClient.invalidateQueries({ queryKey: ["noteConnections"] });
    },
    retry: false,
  });

  return {
    noteConnectionsQuery,
    createNoteConnectionMutation,
    deleteNoteConnectionMutation,
  };
};

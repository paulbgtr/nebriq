import { useMutation } from "@tanstack/react-query";
import { createNoteConnection } from "@/app/actions/supabase/note_connections";

export const useNoteConnections = () => {
  const createNoteConnectionMutation = useMutation({
    mutationFn: createNoteConnection,
  });
  return { createNoteConnectionMutation };
};

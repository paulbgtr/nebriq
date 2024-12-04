import { useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  getNoteConnections,
  createNoteConnection,
  deleteNoteConnection,
} from "@/app/actions/supabase/note_connections";
import queryClient from "@/shared/lib/react-query";
import { useNotes } from "./use-notes";
import { extractNoteConnectionsFromContent } from "@/shared/lib/utils";

type UseNoteConnectionsProps = {
  noteId: string;
  content?: string;
};

export const useNoteConnections = ({
  noteId,
  content,
}: UseNoteConnectionsProps) => {
  const { getNotesQuery } = useNotes();

  const noteConnectionsQuery = useQuery({
    queryKey: ["noteConnections"],
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
  });

  useEffect(() => {
    if (!content) return;

    const mentionsInContent = extractNoteConnectionsFromContent(content);

    console.log(mentionsInContent);

    const currentConnectionIds = mentionsInContent
      .map((mention) => {
        const note = getNotesQuery.data?.find(
          (note) =>
            note.content?.toLowerCase().startsWith(mention.toLowerCase())
        );
        return note?.id;
      })
      .filter(Boolean) as string[];

    const existingConnectionIds =
      noteConnectionsQuery.data?.map((connection) => connection.id) || [];

    const connectionsToRemove = existingConnectionIds.filter(
      (connectionId) => !currentConnectionIds.includes(connectionId)
    );

    console.log(existingConnectionIds, connectionsToRemove);

    connectionsToRemove.forEach((connectionId) => {
      deleteNoteConnectionMutation.mutate(connectionId);
    });
  }, [content]);

  return {
    noteConnectionsQuery,
    createNoteConnectionMutation,
    deleteNoteConnectionMutation,
  };
};

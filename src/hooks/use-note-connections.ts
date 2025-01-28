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
  });

  useEffect(() => {
    if (!content || !noteConnectionsQuery.data) return;

    const { data: noteConnections } = noteConnectionsQuery;

    const mentionsInContent = extractNoteConnectionsFromContent(content);

    if (!mentionsInContent) {
      return noteConnections.forEach((connection) => {
        deleteNoteConnectionMutation.mutate(connection.id);
      });
    }

    const currentConnectionIds = mentionsInContent
      .map((mention) => {
        if (!mention || !getNotesQuery.data) return null;
        const note = getNotesQuery.data.find(
          (note) => note?.title?.toLowerCase() === mention.toLowerCase()
        );
        return note?.id ?? null;
      })
      .filter(Boolean) as string[];

    const connectionsToRemove = noteConnections
      .filter(
        (connection) => !currentConnectionIds.includes(connection.note_id_to)
      )
      .map((connection) => connection.id);

    connectionsToRemove.forEach((connectionId) => {
      deleteNoteConnectionMutation.mutate(connectionId);
    });
  }, [content, noteConnectionsQuery.data, getNotesQuery.data]);

  return {
    noteConnectionsQuery,
    createNoteConnectionMutation,
    deleteNoteConnectionMutation,
  };
};

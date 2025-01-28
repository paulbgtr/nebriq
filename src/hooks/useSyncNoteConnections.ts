import { useEffect } from "react";
import { extractNoteConnectionsFromContent } from "@/shared/lib/utils";
import { useNoteConnections } from "./use-note-connections";
import { useNotes } from "./use-notes";

export const useSyncNoteConnections = (noteId: string, content: string) => {
  const { noteConnectionsQuery, deleteNoteConnectionMutation } =
    useNoteConnections(noteId);
  const { getNotesQuery } = useNotes();

  useEffect(() => {
    const noteConnections = noteConnectionsQuery.data;
    const notes = getNotesQuery.data;

    if (!noteConnections || !notes) {
      return;
    }

    const mentionsInContent = extractNoteConnectionsFromContent(content);

    if (!mentionsInContent) {
      noteConnections.forEach((connection) => {
        deleteNoteConnectionMutation.mutate(connection.id);
      });
      return;
    }

    const currentConnectionIds = mentionsInContent
      .map((mention) => {
        const note = notes.find(
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
  }, [
    content,
    noteConnectionsQuery,
    getNotesQuery,
    deleteNoteConnectionMutation,
  ]);
};

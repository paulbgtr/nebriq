import { useEffect, useRef } from "react";
import { extractNoteConnectionsFromContent } from "@/shared/lib/utils";
import { useNoteConnections } from "@/shared/hooks/use-note-connections";
import { useNotes } from "@/shared/hooks/use-notes";

export const useSyncNoteConnections = (noteId: string, content: string) => {
  const { noteConnectionsQuery, deleteNoteConnectionMutation } =
    useNoteConnections(noteId);
  const { getNotesQuery } = useNotes();

  const isDeletingRef = useRef(false);

  useEffect(() => {
    if (
      isDeletingRef.current ||
      !noteId ||
      !noteConnectionsQuery.data ||
      !getNotesQuery.data
    ) {
      return;
    }

    const noteConnections = noteConnectionsQuery.data;
    const notes = getNotesQuery.data;

    const mentionsInContent = extractNoteConnectionsFromContent(content);

    let connectionsToRemove: string[] = [];

    if (!mentionsInContent) {
      connectionsToRemove = noteConnections.map((connection) => connection.id);
    } else {
      const currentConnectionIds = mentionsInContent
        .map((mention) => {
          const note = notes.find(
            (note) => note?.title?.toLowerCase() === mention.toLowerCase()
          );
          return note?.id ?? null;
        })
        .filter(Boolean) as string[];

      connectionsToRemove = noteConnections
        .filter(
          (connection) => !currentConnectionIds.includes(connection.note_id_to)
        )
        .map((connection) => connection.id);
    }

    if (connectionsToRemove.length > 0) {
      isDeletingRef.current = true;

      const processNextConnection = (index = 0) => {
        if (index >= connectionsToRemove.length) {
          isDeletingRef.current = false;
          return;
        }

        const connectionId = connectionsToRemove[index];

        try {
          deleteNoteConnectionMutation.mutate(connectionId, {
            onSuccess: () => {
              setTimeout(() => processNextConnection(index + 1), 50);
            },
            onError: (error) => {
              console.error("Error removing connection:", error);
              setTimeout(() => processNextConnection(index + 1), 50);
            },
          });
        } catch (error) {
          console.error("Error in deletion process:", error);
          setTimeout(() => processNextConnection(index + 1), 50);
        }
      };

      processNextConnection();
    }
  }, [
    noteId,
    content,
    noteConnectionsQuery.data,
    getNotesQuery.data,
    deleteNoteConnectionMutation,
  ]);
};

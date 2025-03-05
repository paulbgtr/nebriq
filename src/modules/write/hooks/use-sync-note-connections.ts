import { useEffect, useRef } from "react";
import { extractNoteConnectionsFromContent } from "@/shared/lib/utils";
import { useNoteConnections } from "@/shared/hooks/use-note-connections";
import { useNotes } from "@/shared/hooks/use-notes";
import queryClient from "@/shared/lib/react-query";

export const useSyncNoteConnections = (noteId: string, content: string) => {
  const { noteConnectionsQuery, deleteNoteConnectionMutation } =
    useNoteConnections(noteId);
  const { getNotesQuery } = useNotes();

  const isDeletingRef = useRef(false);
  const lastProcessedContentRef = useRef("");

  useEffect(() => {
    if (!noteId) return;

    const currentMentions = extractNoteConnectionsFromContent(content);
    const previousMentions = extractNoteConnectionsFromContent(
      lastProcessedContentRef.current
    );

    const mentionsChanged =
      !currentMentions ||
      !previousMentions ||
      currentMentions.length !== previousMentions.length ||
      currentMentions.some((m) => !previousMentions.includes(m));

    if (mentionsChanged) {
      lastProcessedContentRef.current = content;

      queryClient.invalidateQueries({ queryKey: ["noteConnections", noteId] });
      queryClient.invalidateQueries({ queryKey: ["note-connections"] });
    }
  }, [noteId, content]);

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

          // Invalidate both specific note connections and the global connections list
          queryClient.invalidateQueries({
            queryKey: ["noteConnections", noteId],
          });
          queryClient.invalidateQueries({ queryKey: ["note-connections"] });

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

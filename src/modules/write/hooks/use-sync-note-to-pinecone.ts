import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { useToast } from "@/shared/hooks/use-toast";
import { useUser } from "@/shared/hooks/data/use-user";
import { syncSingleNote } from "@/app/actions/pinecone/sync";

/**
 * Hook for debounced syncing of notes to Pinecone vector database
 *
 * @param debounceTime - Time in milliseconds to debounce the sync (default: 3000ms)
 * @returns Object containing the syncNoteToPinecone function and isSyncing state
 */
export const useSyncNoteToPinecone = (debounceTime = 3000) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const { toast } = useToast();
  const { user } = useUser();
  /**
   * Debounced function to sync a note to Pinecone
   * Will only trigger after the specified debounce time has passed since the last call
   */
  const syncNoteToPinecone = useDebouncedCallback(
    async (noteId: string, title: string, content: string) => {
      if (!noteId) return;

      const userId = user?.id;

      if (!userId) return;

      try {
        setIsSyncing(true);

        await syncSingleNote(noteId, title, content, userId);
      } catch (error) {
        console.error("Error syncing note to Pinecone:", error);
        toast({
          title: "Sync failed",
          description: "Failed to sync note to vector database",
          variant: "destructive",
        });
      } finally {
        setIsSyncing(false);
      }
    },
    debounceTime
  );

  return {
    syncNoteToPinecone,
    isSyncing,
  };
};

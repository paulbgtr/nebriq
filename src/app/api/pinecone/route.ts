import { index } from "@/shared/lib/pinecone/client";
import { createClient } from "@/shared/lib/supabase/server";

/**
 * Syncs notes from the database to the Pinecone index.
 *
 * This function fetches all notes from the database, maps them into a format suitable for Pinecone,
 * and then upserts them into the Pinecone index. If any errors occur during the process, they are logged to the console.
 */
const syncNotes = async () => {
  const supabase = await createClient();
  const { data: notes, error } = await supabase.from("notes").select("*");

  if (error) {
    console.error("Error fetching notes:", error);
    return;
  }

  if (notes.length === 0) return;

  try {
    await index.upsertRecords(
      notes.map((note) => ({
        _id: note.id,
        text: note.title + " " + note.content,
        userId: note.user_id,
      }))
    );
  } catch (error) {
    console.error("Error syncing notes:", error);
  }
};

/**
 * Handles the GET request to sync notes.
 *
 * This function logs a message indicating that notes are being synced, calls the syncNotes function to perform the actual syncing,
 * and then returns a response indicating that the syncing process has completed.
 */
export async function GET() {
  console.log("Syncing notes");
  await syncNotes();
  return new Response("Synced notes");
}

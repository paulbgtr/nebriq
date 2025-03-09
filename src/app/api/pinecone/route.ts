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

  console.log(`Found ${notes.length} notes to sync`);

  if (notes.length === 0) return;

  try {
    const records = notes.map((note) => ({
      _id: note.id,
      text: note.title + " " + note.content,
      userId: note.user_id,
    }));

    console.log(`Preparing to upsert ${records.length} records to Pinecone`);
    console.log(`Sample record:`, JSON.stringify(records[0]));

    await index.upsertRecords(records);
    console.log(`Successfully upserted records to Pinecone`);
  } catch (error) {
    console.error("Error syncing notes:", error);
    console.error("Error details:", JSON.stringify(error));
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
  try {
    await syncNotes();
    return new Response("Synced notes successfully");
  } catch (error: any) {
    console.error("Unexpected error in GET handler:", error);
    return new Response(`Error syncing notes: ${error.message}`, {
      status: 500,
    });
  }
}

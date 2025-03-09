import { index } from "@/shared/lib/pinecone/client";
import { createClient } from "@/shared/lib/supabase/server";

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

export async function POST() {
  console.log("Syncing notes");
  await syncNotes();
  return new Response("Synced notes");
}

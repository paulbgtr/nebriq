import { index } from "@/shared/lib/pinecone/client";
import { getAllNotes } from "../utils";

/**
 * Cleans up unused records from the Pinecone index.
 *
 * This function fetches all notes from the database, maps them into a format suitable for Pinecone,
 * and then checks if the corresponding records exist in the Pinecone index. If a record does not exist,
 * it is marked for deletion. Finally, all marked records are deleted from the Pinecone index.
 */
const cleanupUnusedRecords = async () => {
  const notes = await getAllNotes();

  if (!notes) {
    throw new Error("No notes found");
  }

  const records = notes.map((note) => ({
    _id: note.id,
    userId: note.user_id,
  }));

  const results = await index.listPaginated();

  await Promise.all(
    results.vectors?.map(async (vector) => {
      if (!vector.id) return;

      const record = records.find((record) => record._id === vector.id);
      if (!record) {
        await index.deleteOne(vector.id);
      }
    }) ?? []
  );
};

/**
 * Handles the GET request to clean up unused records.
 *
 * This function logs a message indicating that unused records are being cleaned up, calls the cleanupUnusedRecords function to perform the actual cleanup,
 * and then returns a response indicating that the cleanup process has completed.
 */
export async function GET() {
  console.log("Cleaning up unused records");
  try {
    await cleanupUnusedRecords();
    return new Response("Cleaned up unused records successfully");
  } catch (error) {
    return new Response(`Error cleaning up unused records: ${error}`, {
      status: 500,
    });
  }
}

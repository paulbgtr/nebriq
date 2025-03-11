"use server";

import { index } from "@/shared/lib/pinecone/client";

/**
 * Syncs a single note to Pinecone.
 *
 * @param {string} noteId - The ID of the note to sync.
 * @param {string} title - The title of the note.
 * @param {string} content - The content of the note.
 * @param {string} userId - The ID of the user who owns the note.
 */
export const syncSingleNote = async (
  noteId: string,
  title: string,
  content: string,
  userId: string
) => {
  const text = title + " " + content;

  const pineconeData = await index.namespace("notes").fetch([noteId]);
  const existingRecord = pineconeData.records[noteId];

  if (existingRecord && existingRecord.metadata?.text == text) {
    console.log(`Note ${noteId} already up to date in Pinecone`);
    return;
  }

  await index.upsertRecords([{ _id: noteId, text, userId }]);
  console.log(`Successfully upserted note ${noteId} to Pinecone`);
};

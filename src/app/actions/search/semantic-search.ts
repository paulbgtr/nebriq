"use server";

import { noteSchema } from "@/shared/lib/schemas/note";
import { z } from "zod";
import { index } from "@/shared/lib/pinecone/client";

type Note = z.infer<typeof noteSchema>;

const COSINE_THRESHOLD = 0.2;

/**
 * Performs a semantic search on the given notes based on the query and filters the results by user ID.
 *
 * @param {string} query - The search query.
 * @param {Note[]} notes - The array of notes to search through.
 * @param {string} userId - The user ID to filter the results by.
 * @returns {Promise<Note[]>} A promise that resolves to an array of notes that match the query and belong to the specified user.
 */
export const semanticSearch = async (
  query: string,
  notes: Note[],
  userId: string
) => {
  try {
    const results = await index.searchRecords({
      query: {
        inputs: { text: query },
        topK: 10,
        filter: {
          userId: userId,
        },
      },
    });

    return results.result.hits
      .filter((hit) => hit._score >= COSINE_THRESHOLD)
      .map((hit) => notes.find((note) => note.id === hit._id))
      .filter((note) => note !== undefined);
  } catch (error) {
    console.error("Error in semantic search:", error);
    return [];
  }
};

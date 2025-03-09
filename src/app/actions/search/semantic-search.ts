"use server";

import { noteSchema } from "@/shared/lib/schemas/note";
import { z } from "zod";
import { index } from "@/shared/lib/pinecone/client";

type Note = z.infer<typeof noteSchema>;

const COSINE_THRESHOLD = 0.2;

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

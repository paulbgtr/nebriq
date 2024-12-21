"use server";

import { OpenAIEmbeddings } from "@langchain/openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { z } from "zod";
import { noteSchema } from "@/shared/lib/schemas/note";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY is not defined in environment");
}

const embeddings = new OpenAIEmbeddings({
  apiKey: process.env.OPENAI_API_KEY,
  batchSize: 512, // Default value if omitted is 512. Max is 2048
  model: "text-embedding-3-large",
});

/**
 * Represents a document to be searched.
 */
const documentSchema = z.object({
  pageContent: z.string(),
  metadata: z.object({
    id: z.string(),
    user_id: z.string(),
    title: z.string(),
    tags: z.array(z.string()),
    created_at: z.date(),
  }),
});

/**
 * Handles searching a list of documents using a query.
 */
const searchHandler = async (
  query: string,
  documents: z.infer<typeof documentSchema>[]
) => {
  const vectorStore = await MemoryVectorStore.fromDocuments(
    documents,
    embeddings
  );

  const results = await vectorStore.similaritySearchWithScore(query, 3);

  const filteredResults = results
    .filter(([doc, score]) => score > 0.4)
    .map(([doc]) => doc);

  console.log(
    "Search results with scores:",
    results.map(([doc, score]) => ({
      content: doc.pageContent.substring(0, 100) + "...",
      score,
    }))
  );

  return filteredResults;
};

/**
 * Converts a {@link Document} object to a {@link Note} object.
 *
 * @remarks
 * This function is used to convert the documents returned by the semantic search
 * into notes that can be used by the application.
 *
 * @param document - The document to be converted.
 * @returns The converted note.
 */
const convertDocumentToNote = (
  document: z.infer<typeof documentSchema>
): z.infer<typeof noteSchema> => {
  return noteSchema.parse({
    id: document.metadata.id,
    user_id: document.metadata.user_id,
    title:
      document.metadata.title === "no title" ? "" : document.metadata.title,
    content: document.pageContent === "no content" ? "" : document.pageContent,
    tags: document.metadata.tags,
    created_at: document.metadata.created_at,
  });
};

/**
 * Searches a list of notes using a query.
 *
 * @param query - The query to search the notes with.
 * @param notes - The list of notes to search.
 * @returns The notes that match the query, sorted by relevance.
 */
export const semanticSearch = async (
  query: string,
  notes: z.infer<typeof noteSchema>[]
): Promise<z.infer<typeof noteSchema>[]> => {
  // Normalize query
  const normalizedQuery = query.trim().toLowerCase();

  const documents = notes.map((note) => {
    // Combine title and content for better search coverage
    const content = [note.title, note.content].filter(Boolean).join("\n\n");

    return {
      pageContent: content || "no content",
      metadata: {
        id: note.id,
        user_id: note.user_id,
        title: note.title || "no title",
        tags: note.tags ?? [],
        created_at: note.created_at,
      },
    };
  });

  const results = documentSchema
    .array()
    .parse(await searchHandler(normalizedQuery, documents));

  return results.map((result) => {
    return convertDocumentToNote(result);
  });
};

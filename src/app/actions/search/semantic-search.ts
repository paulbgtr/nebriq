"use server";

import { OpenAIEmbeddings } from "@langchain/openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { Note } from "@/types/note";

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
type Document = {
  pageContent: string;
  metadata: {
    id: string;
    user_id: string;
    title: string;
    tags: string[];
    created_at: Date;
  };
};

/**
 * Handles searching a list of documents using a query.
 */
const searchHandler = async (query: string, documents: Document[]) => {
  const vectorStore = await MemoryVectorStore.fromDocuments(
    documents,
    embeddings
  );
  return await vectorStore
    .asRetriever({
      k: 3,
      searchType: "similarity",
    })
    .invoke(query);
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
const convertDocumentToNote = (document: Document): Note => {
  return {
    id: document.metadata.id,
    user_id: document.metadata.user_id,
    title:
      document.metadata.title === "no title" ? "" : document.metadata.title,
    content: document.pageContent === "no content" ? "" : document.pageContent,
    tags: document.metadata.tags,
    created_at: document.metadata.created_at,
  };
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
  notes: Note[]
): Promise<Note[]> => {
  const documents = notes.map((note) => {
    return {
      pageContent: note.content || "no content",
      metadata: {
        id: note.id,
        user_id: note.user_id,
        title: note.title || "no title",
        tags: note.tags ?? [],
        created_at: note.created_at,
      },
    };
  });

  const results = (await searchHandler(query, documents)) as Document[];

  return results.map((result) => {
    return convertDocumentToNote(result);
  });
};

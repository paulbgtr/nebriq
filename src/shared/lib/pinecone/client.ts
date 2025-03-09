import { Pinecone } from "@pinecone-database/pinecone";

const PINECONE_API_KEY = process.env.PINECONE_API_KEY;

if (!PINECONE_API_KEY) {
  throw new Error("PINECONE_API_KEY is not defined in environment");
}

export const pinecone = new Pinecone({
  apiKey: PINECONE_API_KEY,
});

export const index = pinecone.Index("nebriq").namespace("notes");

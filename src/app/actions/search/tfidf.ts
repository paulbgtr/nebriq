"use server";

import { Note } from "@/types/note";
import { TFIDFResult } from "@/types/TFIDFResult";
import natural from "natural";
import { convertTFIDFToNotesWithDefaults } from "@/shared/lib/utils";

export const searchUsingTFIDF = async (
  query: string,
  notes: Note[]
): Promise<Note[]> => {
  try {
    if (!notes || !query || notes.length === 0 || query.length === 0) return [];

    const TfIdf = natural.TfIdf;
    if (!TfIdf) {
      console.error("TfIdf is not available");
      return [];
    }

    const tfidf = new TfIdf();
    const titleTfidf = new TfIdf();
    const tagsTfidf = new TfIdf();

    notes.forEach((note) => {
      if (!note?.content) return;
      try {
        tfidf.addDocument(note.content);
        titleTfidf.addDocument(note.title || "");
        const tagsString = note.tags?.join(" ") || "";
        tagsTfidf.addDocument(tagsString);
      } catch (err) {
        console.error("Error processing note:", err);
      }
    });

    const contentScores = tfidf.tfidfs(query);
    const titleScores = titleTfidf.tfidfs(query);
    const tagScores = tagsTfidf.tfidfs(query);

    if (!contentScores || !titleScores || !tagScores) {
      console.error("Failed to calculate scores");
      return [];
    }

    const results = notes.map((note, index) => ({
      note,
      score:
        (contentScores[index] || 0) +
        (titleScores[index] || 0) * 2 + // Give more weight to title matches
        (tagScores[index] || 0) * 3, // Give even more weight to tag matches
    })) satisfies TFIDFResult[] | null;

    const filteredResults = results
      .filter((result) => result !== null && result.score !== 0)
      .sort((a, b) => b.score - a.score);

    return convertTFIDFToNotesWithDefaults(filteredResults);
  } catch (error) {
    console.error("Search error:", error);
    return [];
  }
};

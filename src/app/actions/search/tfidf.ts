"use server";

import { Note } from "@/types/note";
import { TFIDFResult } from "@/types/TFIDFResult";
import natural from "natural";

export const searchUsingTFIDF = async (query: string, notes: Note[]) => {
  if (!notes || !query || notes.length === 0 || query.length === 0) return [];

  const TfIdf = natural.TfIdf;
  const tfidf = new TfIdf();
  const titleTfidf = new TfIdf();
  const tagsTfidf = new TfIdf();

  notes.forEach((note) => {
    if (!note?.content) return;
    tfidf.addDocument(note.content);
    titleTfidf.addDocument(note.title || "");
    const tagsString = note.tags?.join(" ") || "";
    tagsTfidf.addDocument(tagsString);
  });

  const contentScores = tfidf.tfidfs(query);
  const titleScores = titleTfidf.tfidfs(query);
  const tagScores = tagsTfidf.tfidfs(query);

  const results = notes.map((note, index) => ({
    note,
    score:
      contentScores[index] +
      titleScores[index] * 2 + // Give more weight to title matches
      tagScores[index] * 3, // Give even more weight to tag matches
  })) satisfies TFIDFResult[] | null;

  const filteredResults = results
    .filter((result) => result !== null && result.score !== 0)
    .sort((a, b) => b.score - a.score);

  return filteredResults;
};

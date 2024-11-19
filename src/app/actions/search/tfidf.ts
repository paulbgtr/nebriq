"use server";

import { Note } from "@/types/note";
import natural from "natural";

export const searchUsingTFIDF = (query: string, notes: Note[]) => {
  const TfIdf = natural.TfIdf;
  const tfidf = new TfIdf();

  notes.forEach((note) => {
    if (!note?.content) return;
    tfidf.addDocument(note.content);
  });

  const results = tfidf.tfidfs(query).map((score, index) => ({
    note: notes[index],
    score,
  })) satisfies ({ note: Note; score: number } | null)[];

  return results
    .filter((result) => result !== null && result.score !== 0)
    .sort((a, b) => b.score - a.score);
};

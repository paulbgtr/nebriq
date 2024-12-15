"use server";

import { Note } from "@/types/note";
import { TFIDFResult } from "@/types/TFIDFResult";
import natural from "natural";
import { convertTFIDFToNotesWithDefaults } from "@/shared/lib/utils";

/**
 * Represents the weights applied to different components in TF-IDF scoring.
 */
const SCORING_WEIGHTS = {
  CONTENT: 1,
  TITLE: 2,
  TAGS: 3,
} as const;

/**
 * Calculates the combined TF-IDF score for a note.
 *
 * @param contentScore - TF-IDF score for the note's content
 * @param titleScore - TF-IDF score for the note's title
 * @param tagScore - TF-IDF score for the note's tags
 * @returns The weighted combined score
 */
const calculateCombinedScore = (
  contentScore: number = 0,
  titleScore: number = 0,
  tagScore: number = 0
): number => {
  return (
    contentScore * SCORING_WEIGHTS.CONTENT +
    titleScore * SCORING_WEIGHTS.TITLE +
    tagScore * SCORING_WEIGHTS.TAGS
  );
};

/**
 * Searches notes using TF-IDF (Term Frequency-Inverse Document Frequency) algorithm.
 *
 * @remarks
 * This function performs a text-based search across notes' content, titles, and tags,
 * with different weights applied to each component.
 *
 * @param query - The search query string
 * @param notes - Array of notes to search through
 * @returns Array of notes sorted by relevance to the query
 */
export const searchUsingTFIDF = async (
  query: string,
  notes: Note[]
): Promise<Note[]> => {
  try {
    if (!notes?.length || !query?.trim()) return [];

    const TfIdf = natural.TfIdf;
    if (!TfIdf) {
      console.error("TfIdf is not available from natural library");
      return [];
    }

    const tfidf = new TfIdf();
    const titleTfidf = new TfIdf();
    const tagsTfidf = new TfIdf();

    notes.forEach((note) => {
      try {
        tfidf.addDocument(note.content || "");
        titleTfidf.addDocument(note.title || "");
        tagsTfidf.addDocument(note.tags?.join(" ") || "");
      } catch (err) {
        console.error("Error processing note for TF-IDF:", err);
      }
    });

    const contentScores = tfidf.tfidfs(query);
    const titleScores = titleTfidf.tfidfs(query);
    const tagScores = tagsTfidf.tfidfs(query);

    if (!contentScores || !titleScores || !tagScores) {
      console.error("Failed to calculate TF-IDF scores");
      return [];
    }

    const results: TFIDFResult[] = notes.map((note, index) => ({
      note,
      score: calculateCombinedScore(
        contentScores[index],
        titleScores[index],
        tagScores[index]
      ),
    }));

    const filteredResults = results
      .filter((result) => result.score > 0)
      .sort((a, b) => b.score - a.score);

    return convertTFIDFToNotesWithDefaults(filteredResults);
  } catch (error) {
    console.error("TF-IDF search error:", error);
    return [];
  }
};

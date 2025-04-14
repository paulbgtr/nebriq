import { NoteWithScore } from "./types";

const MIN_QUERY_LENGTH = 15;
const CONVERSATION_MARKERS = [
  "thanks",
  "thank you",
  "ok",
  "okay",
  "got it",
  "bye",
  "hello",
  "hi",
];

export const shouldSkipSearch = (query: string): boolean => {
  const normalizedQuery = query.toLowerCase().trim();

  if (normalizedQuery.length < MIN_QUERY_LENGTH) return true;

  if (CONVERSATION_MARKERS.some((marker) => normalizedQuery.includes(marker)))
    return true;

  if (
    /^(what|how|why|when|where|who|is|are|can|could|would|will)\s.{0,10}$/i.test(
      normalizedQuery
    )
  )
    return true;

  return false;
};

export const calculateRelevanceScore = (
  note: NoteWithScore,
  semanticRank: number,
  tfidfRank: number,
  totalResults: number
): number => {
  const semanticScore = semanticRank ? (totalResults - semanticRank) * 1.5 : 0;
  const tfidfScore = tfidfRank ? totalResults - tfidfRank : 0;

  let boostScore = 0;

  const noteDate = note.created_at;
  const daysSinceCreation =
    (Date.now() - noteDate.getTime()) / (1000 * 60 * 60 * 24);
  const recencyBoost = Math.max(0, 1 - daysSinceCreation / 30);

  const lengthBoost = Math.min(1, (note.content?.length || 0) / 1000) * 0.5;

  boostScore = recencyBoost + lengthBoost;

  return semanticScore + tfidfScore + boostScore;
};

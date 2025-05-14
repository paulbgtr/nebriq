import { tokenLimitSchema } from "@/shared/lib/schemas/token-limit";
import {
  createTokenLimit,
  getUserTokenLimits,
  updateTokenLimit,
} from "../supabase/token_limits";
import { getEncoding } from "js-tiktoken";
import { z } from "zod";
import { createClient } from "@/shared/lib/supabase/server";
import { noteSchema } from "@/shared/lib/schemas/note";

/**
 * If the token limit does not exist, it creates a new one with a default limit of 5000.
 * Otherwise, it returns the existing token limit.
 *
 * @param userId - The ID of the user for whom to create the token limit.
 */
export const createTokenLimitIfNotExists = async (
  userId: string
): Promise<z.infer<typeof tokenLimitSchema>> => {
  const tokenLimit = await getUserTokenLimits(userId);
  if (!tokenLimit) {
    return await createTokenLimit({
      user_id: userId,
      token_limit: 5000,
    });
  }

  return tokenLimit;
};

export const handleTokenLimits = async (
  userId: string,
  prompt: string
): Promise<void> => {
  const tokenLimit = await createTokenLimitIfNotExists(userId);

  const resetDate = tokenLimit.reset_date;
  const tokensUsed = tokenLimit.tokens_used;
  const tokensLimit = tokenLimit.token_limit;

  if (tokensLimit == null || tokensUsed == null || resetDate == null) {
    throw new Error(
      "One or more of these parameters are missing: reset_date, tokens_used, token_limit"
    );
  }

  const enc = getEncoding("gpt2");
  const newTokens = enc.encode(prompt).length;
  const now = new Date();

  if (resetDate < now) {
    const nextReset = new Date(now);
    nextReset.setHours(now.getHours() + 24);

    await updateTokenLimit({
      user_id: userId,
      tokens_used: newTokens,
      reset_date: nextReset,
    });
    return;
  }

  const totalTokens = tokensUsed + newTokens;
  if (totalTokens > tokensLimit) {
    throw new Error("Token limit exceeded");
  }

  await updateTokenLimit({
    user_id: userId,
    tokens_used: totalTokens,
    reset_date: resetDate,
  });
};

/**
 * Handles the association of attached notes with the last user message in a session.
 *
 * @param attachedNotes - An array of notes to be attached, inferred from the note schema.
 * @param sessionId - The session identifier for which the notes are to be attached.
 * @throws Will throw an error if no user message is found or if there is an issue with the database operation.
 */
export const handleAttachedNotes = async (
  attachedNotes: z.infer<typeof noteSchema>[],
  sessionId: string
) => {
  const supabase = await createClient();

  /**
   * Retrieves the last user message for a given session.
   *
   * @param sessionId - The session identifier to search for the last user message.
   * @returns The last user message data.
   * @throws Will throw an error if no user message is found or if there is an issue with the database operation.
   */
  const getLastUserMessage = async (sessionId: string) => {
    const { data, error } = await supabase
      .from("messages")
      .select("id")
      .eq("session_id", sessionId)
      .eq("message_type", "human")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (error || !data) throw error ?? new Error("No user message found");

    return data;
  };

  if (attachedNotes?.length && sessionId) {
    const insertedMessage = await getLastUserMessage(sessionId);
    const links = attachedNotes.map((note) => ({
      message_id: insertedMessage.id,
      note_id: note.id,
    }));
    await supabase.from("message_notes").insert(links);
  }
};

import { tokenLimitSchema } from "@/shared/lib/schemas/token-limit";
import {
  createTokenLimit,
  getUserTokenLimits,
  updateTokenLimit,
} from "../supabase/token_limits";
import { getEncoding } from "js-tiktoken";
import { z } from "zod";

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

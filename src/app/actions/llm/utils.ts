import { getUserTokenLimits, updateTokenLimit } from "../supabase/token_limits";
import { getEncoding } from "js-tiktoken";

export const handleTokenLimits = async (
  userId: string,
  prompt: string
): Promise<void> => {
  const tokenLimit = await getUserTokenLimits(userId);

  if (!tokenLimit) {
    throw new Error("Token limit not found");
  }

  const enc = getEncoding("gpt2");
  const newTokens = enc.encode(prompt).length;
  const now = new Date();

  if (new Date(tokenLimit.reset_date) < now) {
    const nextReset = new Date(now);
    nextReset.setHours(now.getHours() + 24);

    await updateTokenLimit({
      user_id: userId,
      tokens_used: newTokens,
      reset_date: nextReset,
    });
    return;
  }

  const totalTokens = tokenLimit.tokens_used + newTokens;
  if (totalTokens > tokenLimit.token_limit) {
    throw new Error("Token limit exceeded");
  }

  await updateTokenLimit({
    user_id: userId,
    tokens_used: totalTokens,
    reset_date: new Date(tokenLimit.reset_date),
  });
};

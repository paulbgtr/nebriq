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

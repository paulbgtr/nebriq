import { createClient } from "@/shared/lib/supabase/server";
import { z } from "zod";
import { tokenLimitSchema } from "@/shared/lib/schemas/token-limit";

export const getUserTokenLimits = async (
  userId: string
): Promise<z.infer<typeof tokenLimitSchema>> => {
  const supabase = await createClient();
  const { data: tokenLimits, error } = await supabase
    .from("token_limits")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error) {
    throw error;
  }

  return tokenLimitSchema.parse({
    ...tokenLimits,
    reset_date: new Date(tokenLimits.reset_date),
  });
};

export const createTokenLimit = async (
  tokenLimit: z.infer<typeof tokenLimitSchema>
): Promise<z.infer<typeof tokenLimitSchema>> => {
  const supabase = await createClient();
  const { data: newTokenLimit } = await supabase
    .from("token_limits")
    .insert({
      user_id: tokenLimit.user_id,
      tokens_used: 0,
      token_limit: tokenLimit.token_limit ?? 5000,
    })
    .select();
  return tokenLimitSchema.parse(newTokenLimit);
};

export const updateTokenLimit = async (
  tokenLimit: z.infer<typeof tokenLimitSchema>
): Promise<z.infer<typeof tokenLimitSchema>> => {
  const supabase = await createClient();
  const { data: updatedTokenLimit, error } = await supabase
    .from("token_limits")
    .update({
      tokens_used: tokenLimit.tokens_used,
      token_limit: tokenLimit.token_limit,
      reset_date: tokenLimit.reset_date?.toLocaleDateString(),
    })
    .eq("user_id", tokenLimit.user_id)
    .select()
    .single();

  if (error) {
    throw error;
  }
  return tokenLimitSchema.parse(updatedTokenLimit);
};

import { createClient } from "@/shared/lib/supabase/server";
import { z } from "zod";
import { tokenLimitSchema } from "@/shared/lib/schemas/token-limit";

export async function getUserTokenLimits(
  userId: string
): Promise<z.infer<typeof tokenLimitSchema> | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("token_limits")
    .select("*")
    .eq("user_id", userId)
    .single();

  const pgEmptyRowError = "PGRST116";

  if (error && error.code !== pgEmptyRowError) {
    throw new Error("Failed to get token limits");
  }

  if (!data) {
    return null;
  }

  const tokenLimit = {
    ...data,
    reset_date: new Date(data.reset_date),
    created_at: new Date(data.created_at),
  };

  return tokenLimitSchema.parse(tokenLimit);
}

export const createTokenLimit = async (
  tokenLimit: z.infer<typeof tokenLimitSchema>
): Promise<z.infer<typeof tokenLimitSchema>> => {
  const supabase = await createClient();
  const { data: newTokenLimit, error } = await supabase
    .from("token_limits")
    .insert({
      user_id: tokenLimit.user_id,
      tokens_used: 0,
      token_limit: tokenLimit.token_limit ?? 5000,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return tokenLimitSchema.parse({
    ...newTokenLimit,
    reset_date: new Date(newTokenLimit.reset_date),
    created_at: new Date(newTokenLimit.created_at),
  });
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

  const tokenLimitResponse = {
    ...updatedTokenLimit,
    reset_date: new Date(updatedTokenLimit.reset_date),
    created_at: new Date(updatedTokenLimit.created_at),
  };

  return tokenLimitSchema.parse(tokenLimitResponse);
};

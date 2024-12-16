import { createClient } from "@/shared/lib/supabase/server";
import { CreateTokenLimit, UpdateTokenLimit } from "@/types/token-limits";

export const getUserTokenLimits = async (userId: string) => {
  const supabase = await createClient();
  const { data: tokenLimits } = await supabase
    .from("token_limits")
    .select("*")
    .eq("user_id", userId)
    .single();
  return tokenLimits;
};

export const createTokenLimit = async (tokenLimit: CreateTokenLimit) => {
  const now = new Date();

  const supabase = await createClient();
  const { data: newTokenLimit } = await supabase
    .from("token_limits")
    .insert({
      ...tokenLimit,
      tokens_used: 0,
      created_at: now,
      reset_date: now,
    })
    .select();
  return newTokenLimit;
};

export const updateTokenLimit = async (tokenLimit: UpdateTokenLimit) => {
  const supabase = await createClient();
  const { data: updatedTokenLimit } = await supabase
    .from("token_limits")
    .update({
      ...tokenLimit,
      reset_date: new Date(),
    })
    .eq("user_id", tokenLimit.user_id)
    .select();
  return updatedTokenLimit;
};

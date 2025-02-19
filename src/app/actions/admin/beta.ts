"use server";

import { createClient } from "@/shared/lib/supabase/server";

export async function addBetaUser(email: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("beta_users")
    .insert({ email: email.toLowerCase() });

  if (error) {
    throw error;
  }

  return { success: true };
}

export async function addBetaUsersFromWaitlist(limit: number = 10) {
  const supabase = await createClient();

  const { data: waitlistUsers, error: waitlistError } = await supabase
    .from("wishlist")
    .select("email")
    .not("email", "in", supabase.from("beta_users").select("email"))
    .limit(limit);

  if (waitlistError) throw waitlistError;

  // Add them to beta users
  const { error: insertError } = await supabase
    .from("beta_users")
    .insert(waitlistUsers);

  if (insertError) throw insertError;

  return { success: true, count: waitlistUsers.length };
}

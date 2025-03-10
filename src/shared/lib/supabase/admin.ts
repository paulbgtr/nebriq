import { createClient } from "@supabase/supabase-js";

/**
 * Creates a Supabase client with service role permissions to bypass RLS policies.
 * This is necessary for cron jobs that need to access data without a user context.
 */
export const createAdminClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Missing Supabase service role credentials");
  }

  return createClient(supabaseUrl, supabaseServiceKey);
};

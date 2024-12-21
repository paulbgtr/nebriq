import { createClient } from "@/shared/lib/supabase/server";

export const getSearchHistory = async (userId: string) => {
  const supabase = await createClient();
  const { data: searchHistory } = await supabase
    .from("search_history")
    .select("*")
    .eq("user_id", userId);
  return searchHistory;
};

"use server";

import { createClient } from "@/shared/lib/supabase/server";
import { z } from "zod";
import {
  searchHistoryItemSchema,
  createSearhHistoryItemSchema,
} from "@/shared/lib/schemas/search-history-item";

export const getSearchHistory = async (
  userId: string
): Promise<z.infer<typeof searchHistoryItemSchema>[]> => {
  const supabase = await createClient();
  const { data: searchHistory, error } = await supabase
    .from("search_history")
    .select("*")
    .eq("user_id", userId);

  if (error) {
    throw error;
  }

  return searchHistoryItemSchema.array().parse(
    searchHistory?.map((item) => ({
      ...item,
      created_at: new Date(item.created_at),
    }))
  );
};

export const createSearchHistory = async (
  searchHistory: z.infer<typeof createSearhHistoryItemSchema>
) => {
  const supabase = await createClient();
  const { data: newSearchHistory, error } = await supabase
    .from("search_history")
    .insert({
      ...searchHistory,
      created_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return searchHistoryItemSchema.parse({
    ...newSearchHistory,
    created_at: new Date(newSearchHistory.created_at),
  });
};

export const deleteSearchHistory = async (userId: string) => {
  const supabase = await createClient();

  const searchHistory = await getSearchHistory(userId);

  if (searchHistory.length === 0) {
    throw new Error("No search history found");
  }

  const ids = searchHistory.map((item) => item.id);

  await supabase.from("search_history").delete().in("id", ids);
};

import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { semanticSearch } from "@/app/actions/search/semantic-search";
import { getNotes } from "../../supabase/notes";

export const searchNotes = (userId: string) =>
  tool(
    async ({ query }: { query: string }): Promise<string> => {
      const notes = await getNotes(userId);

      const results = await semanticSearch(query, notes, userId);

      console.log(results);

      if (!results.length) return "No relevant notes found.";

      return results.map((r) => `📘 ${r.title}\n${r.content}`).join("\n\n");
    },
    {
      name: "search_notes",
      description: "Search for semantically relevant notes using a query.",
      schema: z.object({
        query: z.string(),
      }),
    }
  );

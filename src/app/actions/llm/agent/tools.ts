import { tool } from "@langchain/core/tools";
import { z } from "zod";

export const searchNotes = tool(
  async ({ query }: { query: string }): Promise<string> => {
    const results = [
      {
        metadata: {
          title: "Note 1",
          content: "Content 1",
        },
      },
      {
        metadata: {
          title: "Note 2",
          content: "Content 2",
        },
      },
    ];
    if (!results.length) return "No relevant notes found.";
    return results
      .map((r: any) => `- ${r.metadata.title}: ${r.metadata.content}`)
      .join("\n");
  },
  {
    name: "search_notes",
    description: "Search for semantically relevant notes using a query.",
    schema: z.object({
      query: z.string(),
    }),
  }
);

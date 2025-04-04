import { z } from "zod";
import { noteSchema } from "@/shared/lib/schemas/note";
import { ModelId } from "@/types/ai-model";

export type LLMMode = "standard" | "analysis" | "reflection" | "ideation" | "engineering";

export const LLM_MODE_OPTIONS: { 
  value: LLMMode; 
  label: string; 
  description: string;
  icon: string;
  color: string;
} [] = [
  {
    value: "standard",
    label: "Standard",
    description: "General-purpose conversation with your notes",
    icon: "MessageSquare",
    color: "text-blue-500"
  },
  {
    value: "analysis",
    label: "Analysis",
    description: "Break down notes into key points, detect structure and inconsistencies",
    icon: "BarChart2",
    color: "text-emerald-500"
  },
  {
    value: "reflection",
    label: "Reflection",
    description: "Ask thoughtful questions to clarify meaning and intention",
    icon: "Brain",
    color: "text-purple-500"
  },
  {
    value: "ideation",
    label: "Ideation",
    description: "Suggest new angles, metaphors and creative extensions",
    icon: "Lightbulb",
    color: "text-amber-500"
  },
  {
    value: "engineering",
    label: "Engineering",
    description: "Extract concrete action steps, features and implementation plans",
    icon: "Code",
    color: "text-indigo-500"
  }
];

export type ConversationTurn = {
  role: "user" | "assistant";
  content: string;
  relevantNotes?: z.infer<typeof noteSchema>[];
  attachedNotes?: z.infer<typeof noteSchema>[];
  modelId?: ModelId;
  mode?: LLMMode;
};

export type ChatContext = {
  conversationHistory: ConversationTurn[];
  relevantNotes: z.infer<typeof noteSchema>[];
};

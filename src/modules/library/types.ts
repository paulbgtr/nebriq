import { z } from "zod";
import { noteSchema } from "@/shared/lib/schemas/note";

export type NotesByCategory = {
  [category: string]: z.infer<typeof noteSchema>[];
};

export type ViewMode = "grid" | "list";

export interface CategoryProps {
  category: string;
  notes: z.infer<typeof noteSchema>[];
  isExpanded: boolean;
  isSelectionMode: boolean;
  viewMode: ViewMode;
  onSelectionChange: (selected: string[]) => void;
  onToggleCategory: (category: string) => void;
}

export interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isPendingTransition: boolean;
  showSearch: boolean;
}

export interface FilterBarProps {
  categories: [string, z.infer<typeof noteSchema>[]][];
  expandedCategories: string[];
  onToggleCategory: (category: string) => void;
  showFilters: boolean;
}

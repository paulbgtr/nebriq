import { z } from "zod";
import { noteSchema } from "@/shared/lib/schemas/note";

export type NotesByCategory = {
  [category: string]: z.infer<typeof noteSchema>[];
};

export type ViewMode = "grid" | "list";

export type SmartViewMode = "recent" | "tags" | "ai" | "timeline";

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

export interface SmartViewProps {
  notes: z.infer<typeof noteSchema>[];
  viewMode: ViewMode;
  smartViewMode: SmartViewMode;
  isSelectionMode: boolean;
  onSelectionChange: (selected: string[]) => void;
}

export interface TimelineViewProps {
  notes: z.infer<typeof noteSchema>[];
  viewMode: ViewMode;
  isSelectionMode: boolean;
  onSelectionChange: (selected: string[]) => void;
}

export interface TagCloudViewProps {
  notes: z.infer<typeof noteSchema>[];
  viewMode: ViewMode;
  isSelectionMode: boolean;
  onSelectionChange: (selected: string[]) => void;
  onTagSelect: (tag: string) => void;
  selectedTags: string[];
}

export interface AIClusterViewProps {
  notes: z.infer<typeof noteSchema>[];
  viewMode: ViewMode;
  isSelectionMode: boolean;
  onSelectionChange: (selected: string[]) => void;
  clusters: {
    name: string;
    notes: z.infer<typeof noteSchema>[];
  }[];
}

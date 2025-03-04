import { motion } from "framer-motion";
import { Button } from "@/shared/components/ui/button";
import {
  CheckSquare,
  Trash2,
  Search,
  Grid2X2,
  Rows3,
  ListFilter,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/shared/components/ui/alert-dialog";
import { cn } from "@/shared/lib/utils";
import { ViewMode } from "../types";
import { handleNotePlural } from "../utils";

interface HeaderActionsProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  showSearch: boolean;
  toggleSearch: () => void;
  isSelectionMode: boolean;
  toggleSelectionMode: () => void;
  selectedNotes: string[];
  onDeleteNotes: () => void;
}

export function HeaderActions({
  viewMode,
  setViewMode,
  showFilters,
  setShowFilters,
  showSearch,
  toggleSearch,
  isSelectionMode,
  toggleSelectionMode,
  selectedNotes,
  onDeleteNotes,
}: HeaderActionsProps) {
  return (
    <motion.div
      className="flex items-center gap-2"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-1.5 p-1 bg-muted/30 rounded-lg border border-border/40">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
          className={cn(
            "h-8 px-2.5",
            viewMode === "grid" && "bg-background shadow-sm"
          )}
        >
          <Grid2X2 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setViewMode(viewMode === "list" ? "grid" : "list")}
          className={cn(
            "h-8 px-2.5",
            viewMode === "list" && "bg-background shadow-sm"
          )}
        >
          <Rows3 className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center gap-1.5">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          className={cn(
            "h-9",
            showFilters && "bg-primary/10 text-primary border-primary/30"
          )}
        >
          <ListFilter className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Filter</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={toggleSearch}
          className={cn(
            "h-9",
            showSearch && "bg-primary/10 text-primary border-primary/30"
          )}
        >
          <Search className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Search</span>
        </Button>
        <Button
          variant={isSelectionMode ? "default" : "outline"}
          size="sm"
          onClick={toggleSelectionMode}
          className="h-9"
        >
          <CheckSquare className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">
            {isSelectionMode ? "Done" : "Select"}
          </span>
        </Button>
      </div>

      {isSelectionMode && selectedNotes.length > 0 && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="destructive"
              size="sm"
              className="h-9 gap-2 shadow-sm"
            >
              <Trash2 className="h-4 w-4" />
              <span className="hidden sm:inline">Delete</span>
              <span className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-destructive-foreground/20 px-1.5 text-xs font-medium text-destructive-foreground">
                {selectedNotes.length}
              </span>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent
            onClick={(e) => e.stopPropagation()}
            className="sm:max-w-[425px]"
          >
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2 text-red-600">
                <Trash2 className="h-5 w-5" />
                Delete {selectedNotes.length}{" "}
                {handleNotePlural(selectedNotes.length)}?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-muted-foreground/70">
                This action cannot be undone. These notes will be permanently
                removed from your library.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                onClick={(e) => e.stopPropagation()}
                className="sm:w-auto"
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={onDeleteNotes}
                className="bg-red-600 hover:bg-red-700 sm:w-auto"
              >
                Delete {handleNotePlural(selectedNotes.length)}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </motion.div>
  );
}

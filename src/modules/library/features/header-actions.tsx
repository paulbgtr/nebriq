import { motion } from "framer-motion";
import { Button } from "@/shared/components/ui/button";
import {
  CheckSquare,
  Trash2,
  Search,
  Grid2X2,
  Rows3,
  ListFilter,
  Sparkles,
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
      <div className="flex items-center gap-1.5 p-1 bg-card/50 backdrop-blur-sm rounded-lg border border-border/40 shadow-sm">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
          className={cn(
            "h-8 px-2.5 transition-all duration-200",
            viewMode === "grid"
              ? "bg-gradient-to-r from-primary/20 to-secondary/20 text-primary shadow-sm"
              : "hover:bg-primary/5"
          )}
        >
          <Grid2X2 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setViewMode(viewMode === "list" ? "grid" : "list")}
          className={cn(
            "h-8 px-2.5 transition-all duration-200",
            viewMode === "list"
              ? "bg-gradient-to-r from-primary/20 to-secondary/20 text-primary shadow-sm"
              : "hover:bg-primary/5"
          )}
        >
          <Rows3 className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center gap-1.5">
        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "h-9 transition-all duration-200 border-border/40",
              showFilters
                ? "bg-gradient-to-r from-primary/20 to-secondary/20 text-primary border-primary/30 shadow-sm"
                : "hover:bg-primary/5 hover:border-primary/20"
            )}
          >
            <ListFilter className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Filter</span>
            {showFilters && (
              <Sparkles className="h-3 w-3 ml-1 text-primary/60" />
            )}
          </Button>
        </motion.div>

        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
          <Button
            variant="outline"
            size="sm"
            onClick={toggleSearch}
            className={cn(
              "h-9 transition-all duration-200 border-border/40",
              showSearch
                ? "bg-gradient-to-r from-primary/20 to-secondary/20 text-primary border-primary/30 shadow-sm"
                : "hover:bg-primary/5 hover:border-primary/20"
            )}
          >
            <Search className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Search</span>
            {showSearch && (
              <Sparkles className="h-3 w-3 ml-1 text-primary/60" />
            )}
          </Button>
        </motion.div>

        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
          <Button
            variant={isSelectionMode ? "default" : "outline"}
            size="sm"
            onClick={toggleSelectionMode}
            className={cn(
              "h-9 transition-all duration-200",
              isSelectionMode
                ? "bg-gradient-to-r from-primary to-secondary text-white shadow-md"
                : "border-border/40 hover:bg-primary/5 hover:border-primary/20"
            )}
          >
            <CheckSquare className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">
              {isSelectionMode ? "Done" : "Select"}
            </span>
            {isSelectionMode && (
              <Sparkles className="h-3 w-3 ml-1 text-white/60" />
            )}
          </Button>
        </motion.div>
      </div>

      {isSelectionMode && selectedNotes.length > 0 && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="inline-block"
            >
              <Button
                variant="destructive"
                size="sm"
                className="h-9 gap-2 shadow-md bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 transition-all duration-200"
              >
                <Trash2 className="h-4 w-4" />
                <span className="hidden sm:inline">Delete</span>
                <span className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-white/20 px-1.5 text-xs font-medium text-white">
                  {selectedNotes.length}
                </span>
              </Button>
            </motion.div>
          </AlertDialogTrigger>
          <AlertDialogContent
            onClick={(e) => e.stopPropagation()}
            className="sm:max-w-[425px] border-red-200 bg-gradient-to-br from-background to-red-50/30"
          >
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2 text-red-600">
                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                  <Trash2 className="h-4 w-4" />
                </div>
                <span>
                  Delete {selectedNotes.length}{" "}
                  {handleNotePlural(selectedNotes.length)}?
                </span>
              </AlertDialogTitle>
              <AlertDialogDescription className="text-muted-foreground/70">
                This action cannot be undone. These notes will be permanently
                removed from your library.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                onClick={(e) => e.stopPropagation()}
                className="sm:w-auto border-red-200 hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={onDeleteNotes}
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 sm:w-auto shadow-md transition-all duration-200"
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

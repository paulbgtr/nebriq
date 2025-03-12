"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Editor } from "./components/editor";
import { useSubscription } from "@/shared/hooks/use-subscription";
import { useNotes } from "@/shared/hooks/use-notes";
import { AlertCircle, Zap } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";

export default function Write() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const { isPro } = useSubscription();
  const { getNotesQuery } = useNotes();
  const { data: notes } = getNotesQuery;
  const [showLimitDialog, setShowLimitDialog] = useState(false);

  useEffect(() => {
    if (!id && !isPro && notes && notes.length >= 50) {
      setShowLimitDialog(true);
    }
  }, [id, isPro, notes]);

  const handleUpgrade = () => {
    window.location.href = "/subscription";
  };

  return (
    <>
      <Dialog open={showLimitDialog} onOpenChange={setShowLimitDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-amber-500">
              <AlertCircle className="h-5 w-5" />
              Note Limit Reached
            </DialogTitle>
            <DialogDescription>
              You've reached the 50 note limit on the free plan. Upgrade to Pro
              for unlimited notes and premium features.
            </DialogDescription>
          </DialogHeader>
          <div className="p-4 bg-muted/30 rounded-lg border border-border">
            <div className="flex justify-between items-center">
              <div className="text-sm">
                <span className="font-semibold">Current:</span>{" "}
                {notes?.length || 0}/50 notes
              </div>
              <div className="text-sm text-muted-foreground">
                <span className="line-through">$19.99</span>{" "}
                <span className="text-amber-500 font-medium">$11.99/month</span>
              </div>
            </div>
            <div className="mt-3 text-xs text-muted-foreground">
              <ul className="space-y-1">
                <li className="flex items-center gap-1.5">
                  <div className="w-1 h-1 rounded-full bg-primary"></div>
                  <span>Unlimited notes</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <div className="w-1 h-1 rounded-full bg-primary"></div>
                  <span>Full knowledge graph</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <div className="w-1 h-1 rounded-full bg-primary"></div>
                  <span>Advanced AI features</span>
                </li>
              </ul>
            </div>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => window.history.back()}
              className="w-full sm:w-auto"
            >
              Go Back
            </Button>
            <Button
              onClick={handleUpgrade}
              className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"
            >
              <Zap className="mr-2 h-4 w-4" />
              Upgrade to Pro
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {(id || !showLimitDialog) && (
        <div className="max-w-4xl mx-auto">
          <div className="prose prose-lg max-w-none dark:prose-invert">
            <Editor initialNoteId={id} />
          </div>
        </div>
      )}
    </>
  );
}

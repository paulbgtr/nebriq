import { useState } from "react";
import { Button, buttonVariants } from "../ui/button";
import { Camera, Crown } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogFooter,
} from "../ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import { Upload, FileText, X, Repeat, SparkleIcon } from "lucide-react";
import { ImageIcon } from "lucide-react";
import { Label } from "../ui/label";
import { ScrollArea } from "../ui/scroll-area";
import { Textarea } from "../ui/textarea";
import { transcribe } from "../../../app/actions/llm/transcribe";
import { useToast } from "@/shared/hooks/use-toast";
import { useNotes } from "@/shared/hooks/data/use-notes";
import { useUser } from "@/shared/hooks/data/use-user";
import { useSubscription } from "@/shared/hooks/data/use-subscription";
import Link from "next/link";
import { cn } from "@/shared/lib/utils";
import Image from "next/image";

export const Snap = () => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [generatedNotes, setGeneratedNotes] = useState("");
  const [showPaywall, setShowPaywall] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { toast } = useToast();
  const { createNoteMutation } = useNotes();
  const { user } = useUser();
  const { isPro } = useSubscription();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTranscribe = async () => {
    setIsProcessing(true);

    try {
      if (!uploadedImage) return;

      // Extract base64 data from the data URL
      const base64Data = uploadedImage.split(",")[1];

      // Call the transcribe function with the base64 image data
      const result = await transcribe(base64Data);

      if (result) {
        setGeneratedNotes(result);
        toast({
          title: "Success",
          description: "Image transcribed successfully",
        });
      } else {
        toast({
          title: "Error",
          description:
            "Sorry, we couldn't process this image. Please try again with a clearer image.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Transcription error:", error);
      setGeneratedNotes(
        "An error occurred during transcription. Please try again."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSaveNotes = () => {
    if (!user?.id) {
      toast({
        title: "Error",
        description: "Please login to save notes",
        variant: "destructive",
      });
      return;
    }

    createNoteMutation.mutate({
      title: "Snap Note",
      content: generatedNotes,
      user_id: user?.id,
    });

    toast({
      title: "Success",
      description: "Note saved successfully",
    });
  };

  const handleSnapClick = () => {
    if (!isPro) {
      setShowPaywall(true);
    }
  };

  const resetState = () => {
    setUploadedImage(null);
    setGeneratedNotes("");
    setIsProcessing(false);
  };

  return (
    <>
      <Dialog open={showPaywall} onOpenChange={setShowPaywall}>
        <DialogContent className="sm:max-w-[425px] rounded-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <span>Pro Feature</span>
            </DialogTitle>
            <DialogDescription>
              Snap to Notes is available exclusively for Pro subscribers.
              Upgrade your plan to unlock this powerful feature!
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center py-4">
            <div className="rounded-xl border-2 border-amber-500/20 bg-amber-500/5 p-6 text-center">
              <Crown className="w-12 h-12 text-amber-500 mx-auto mb-3" />
              <h3 className="text-lg font-semibold mb-2">
                Unlock Snap to Notes
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Transform any image with text into editable notes instantly with
                our Pro plan.
              </p>
              <DialogClose asChild>
                <Link
                  href="/subscription"
                  className={cn(
                    buttonVariants({ variant: "default" }),
                    "w-full bg-amber-500 hover:bg-amber-600"
                  )}
                >
                  Upgrade to Pro
                </Link>
              </DialogClose>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) {
            resetState();
          }
        }}
      >
        <DialogTrigger asChild onClick={handleSnapClick}>
          <Button
            variant="ghost"
            size="sm"
            className="relative flex-shrink-0 gap-1.5 pl-2.5 pr-3 h-9 border border-primary/20 group bg-background/50 hover:bg-primary/5 hover:border-primary/30 transition-all duration-300 overflow-hidden group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:mx-auto"
            title="Snap to notes"
          >
            <Camera className="w-4 h-4 text-primary relative z-10" />
          </Button>
        </DialogTrigger>

        {isPro && (
          <DialogContent className="sm:max-w-[700px] rounded-xl overflow-hidden">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-xl">
                <Camera className="w-5 h-5 text-primary" />
                <span>Snap to Notes</span>
                <span className="ml-2 text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full font-normal">
                  Beta
                </span>
              </DialogTitle>
              <DialogDescription>
                Upload any image with text to instantly transform it into
                editable notes.
              </DialogDescription>
            </DialogHeader>

            <Tabs
              className="w-full"
              value={generatedNotes ? "results" : "upload"}
            >
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="upload" className="gap-2">
                  <Upload className="w-4 h-4" />
                  Upload Image
                </TabsTrigger>
                <TabsTrigger
                  value="results"
                  className="gap-2"
                  disabled={!uploadedImage}
                >
                  <FileText className="w-4 h-4" />
                  Generated Notes
                </TabsTrigger>
              </TabsList>

              <TabsContent value="upload" className="space-y-4">
                {!uploadedImage ? (
                  <div className="border-2 border-dashed border-border/60 rounded-lg p-8 text-center space-y-3 transition-all hover:border-primary/30 group">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <ImageIcon className="w-8 h-8 text-primary" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-medium">
                          Upload an image to get started
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Supports JPG, PNG or PDF up to 10MB
                        </p>
                      </div>
                      <div className="relative mt-2">
                        <Label
                          htmlFor="image-upload"
                          className="cursor-pointer inline-flex items-center gap-2 bg-primary/90 hover:bg-primary text-primary-foreground rounded-md px-4 py-2 text-sm font-medium shadow transition-colors"
                        >
                          <Upload className="w-4 h-4" />
                          Select Image
                        </Label>
                        <input
                          id="image-upload"
                          type="file"
                          accept="image/*,.pdf"
                          className="sr-only"
                          onChange={handleImageUpload}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="relative group rounded-lg overflow-hidden border border-border/60 bg-muted/20">
                      <Image
                        src={uploadedImage}
                        alt="Uploaded image"
                        className="w-full max-h-[300px] object-contain"
                        width={1000}
                        height={1000}
                      />
                      <button
                        onClick={() => setUploadedImage(null)}
                        className="absolute top-2 right-2 rounded-full p-1.5 bg-background/80 backdrop-blur-sm text-muted-foreground hover:text-foreground hover:bg-background transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <Button
                      className="w-full gap-2"
                      onClick={handleTranscribe}
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <>
                          <Repeat className="w-4 h-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <SparkleIcon className="w-4 h-4" />
                          Transcribe
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="results" className="space-y-4">
                {generatedNotes ? (
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium flex items-center gap-2">
                      <FileText className="w-4 h-4 text-primary" />
                      Transcribed Note
                    </h3>

                    <div className="border rounded-lg">
                      <ScrollArea className="h-[300px] rounded-md">
                        <div className="p-4">
                          <Textarea
                            value={generatedNotes}
                            onChange={(e) => setGeneratedNotes(e.target.value)}
                            className="border-0 focus-visible:ring-0 resize-none h-full min-h-[280px] p-0"
                          />
                        </div>
                      </ScrollArea>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[300px] text-center">
                    <FileText className="w-12 h-12 text-muted-foreground/40 mb-2" />
                    <h3 className="text-lg font-medium">
                      No notes generated yet
                    </h3>
                    <p className="text-sm text-muted-foreground max-w-xs mt-1">
                      Upload an image and translate it to see the results here
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>

            <DialogFooter className="flex items-center justify-between sm:justify-between">
              <DialogClose asChild>
                {generatedNotes && (
                  <Button size="sm" className="gap-2" onClick={handleSaveNotes}>
                    <FileText className="w-4 h-4" />
                    Save to Notes
                  </Button>
                )}
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
};

"use client";

import { cn } from "@/shared/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Library,
  BrainCircuit,
  MessageSquarePlus,
  Pen,
  FileText,
  Shield,
  Trash2,
  Clock,
  Zap,
  Camera,
  Upload,
  Image as ImageIcon,
  X,
  SparkleIcon,
  Repeat,
} from "lucide-react";
import { useSubscription } from "../hooks/use-subscription";
import { transcribe } from "@/app/actions/llm/transcribe";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/shared/components/ui/sidebar";
import { FeedbackPopover } from "./feedback/feedback-popover";
import { Button } from "./ui/button";
import { useChatHistoryStore } from "@/store/chat-history";
import { useRouter } from "next/navigation";
import { useUser } from "@/shared/hooks/use-user";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/shared/components/ui/dialog";
import { useState } from "react";
import { Label } from "@/shared/components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { Textarea } from "@/shared/components/ui/textarea";

const navItems = [
  {
    icon: BrainCircuit,
    name: "briq",
    href: "/home",
    tooltip: "Talk to Briq",
  },
  {
    icon: Library,
    name: "knowledge hub",
    href: "/library",
    tooltip: "Browse Knowledge Hub",
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useUser();
  const { chatHistory, activeChatId, setActiveChatId, deleteChat } =
    useChatHistoryStore();
  const { isPro, isPending } = useSubscription();
  const [isSnapDialogOpen, setIsSnapDialogOpen] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [generatedNotes, setGeneratedNotes] = useState("");

  const handleChatClick = (id: string) => {
    setActiveChatId(id);
    if (pathname === "/home") {
      router.refresh();
    } else {
      router.push("/home");
    }
  };

  const handleDeleteChat = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();

    const isActiveChat = id === activeChatId;

    deleteChat(id);

    if (isActiveChat) {
      setTimeout(() => {
        const inputArea = document.querySelector("textarea");
        if (inputArea) {
          inputArea.focus();
        }
      }, 100);
    }
  };

  const handleSnapClick = () => {
    setIsSnapDialogOpen(true);
  };

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

  const handleTranslate = async () => {
    setIsProcessing(true);

    try {
      if (!uploadedImage) return;

      // Extract base64 data from the data URL
      const base64Data = uploadedImage.split(",")[1];

      // Call the transcribe function with the base64 image data
      const result = await transcribe(base64Data);

      if (result) {
        setGeneratedNotes(result);
      } else {
        setGeneratedNotes(
          "Sorry, we couldn't process this image. Please try again with a clearer image."
        );
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

  const handleDialogClose = () => {
    setIsSnapDialogOpen(false);
    // Reset states after dialog closes
    setTimeout(() => {
      setUploadedImage(null);
      setGeneratedNotes("");
      setIsProcessing(false);
    }, 300);
  };

  return (
    <>
      <Sidebar className="border-r border-border/40">
        <SidebarContent className="flex flex-col h-full">
          <div className="flex-1">
            {/* Action buttons row */}
            <div className="flex items-center gap-2 px-4 py-3">
              <Button
                variant="default"
                size="sm"
                className={cn(
                  "flex-1 gap-2 transition-all duration-200 hover:scale-102 shadow-sm",
                  pathname === "/write" && "opacity-80"
                )}
                disabled={pathname === "/write"}
                asChild
              >
                <Link href="/write">
                  <Pen className="w-4 h-4" />
                  <span>Compose</span>
                </Link>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleSnapClick}
                className="relative flex-shrink-0 gap-1.5 pl-2.5 pr-3 h-9 border border-primary/20 group bg-background/50 hover:bg-primary/5 hover:border-primary/30 transition-all duration-300 overflow-hidden"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity duration-500 blur-sm"></div>
                <div className="relative flex items-center gap-1.5">
                  <div className="relative">
                    <span className="absolute -inset-1 rounded-full bg-primary/20 animate-ping opacity-0 group-hover:opacity-75"></span>
                    <Camera className="w-4 h-4 text-primary relative z-10" />
                  </div>
                  <span className="text-xs font-medium bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80 group-hover:from-primary/90 group-hover:to-primary transition-all">
                    Snap
                  </span>
                </div>
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary/30 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
                <span className="absolute top-0 right-0 w-full h-0.5 bg-primary/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-right duration-300 delay-75"></span>
              </Button>
            </div>

            {/* Main Navigation */}
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-medium text-muted-foreground/80">
                Navigation
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navItems.map((item) => (
                    <SidebarMenuItem key={item.name}>
                      <SidebarMenuButton
                        asChild
                        className={cn(
                          "w-full gap-2 transition-all duration-150",
                          pathname === item.href
                            ? "bg-primary/8 text-primary font-medium"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                        )}
                      >
                        <Link href={item.href}>
                          <item.icon
                            className={cn(
                              "w-4 h-4",
                              pathname === item.href
                                ? "text-primary"
                                : "text-muted-foreground"
                            )}
                          />
                          <span className="capitalize">{item.name}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* Chat History Section */}
            {user && chatHistory.length > 0 && (
              <>
                <SidebarSeparator className="my-2 opacity-40" />
                <SidebarGroup>
                  <SidebarGroupLabel className="flex items-center gap-1 text-xs font-medium text-muted-foreground/80">
                    <Clock className="w-3 h-3" />
                    <span>Chat History</span>
                  </SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {chatHistory.length > 0 ? (
                        chatHistory
                          .sort(
                            (a, b) =>
                              new Date(b.createdAt).getTime() -
                              new Date(a.createdAt).getTime()
                          )
                          .map((chat) => (
                            <SidebarMenuItem
                              key={chat.id}
                              className="relative group/chat-item"
                            >
                              <SidebarMenuButton
                                onClick={() => handleChatClick(chat.id)}
                                className={cn(
                                  "w-full gap-2 transition-all duration-150 justify-between pr-2",
                                  activeChatId === chat.id
                                    ? "bg-primary/8 text-primary font-medium"
                                    : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                                )}
                              >
                                <div className="flex items-center gap-2 overflow-hidden">
                                  <div className="truncate text-sm">
                                    <span className="truncate">
                                      {chat.title}
                                    </span>
                                  </div>
                                </div>
                                <div
                                  role="button"
                                  className="w-6 h-6 flex items-center justify-center opacity-0 group-hover/chat-item:opacity-100 transition-opacity rounded-full hover:bg-muted"
                                  onClick={(e) => handleDeleteChat(e, chat.id)}
                                >
                                  <Trash2 className="w-3 h-3" />
                                  <span className="sr-only">Delete</span>
                                </div>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                          ))
                      ) : (
                        <SidebarMenuItem>
                          <div className="px-2 py-1.5 text-sm text-muted-foreground">
                            No chat history yet
                          </div>
                        </SidebarMenuItem>
                      )}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              </>
            )}
          </div>

          <div className="mt-auto">
            {!isPro && !isPending && (
              <>
                <div className="px-4 py-2">
                  <div className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-br from-primary/10 via-primary/5 to-background border border-primary/20 p-3 shadow-sm transition-all duration-300 hover:shadow-md hover:border-primary/30 hover:-translate-y-0.5">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(var(--primary-rgb),0.1),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                    <div className="flex flex-col gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-foreground mb-0.5">
                          Upgrade to Pro
                        </h3>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          Unlock unlimited usage and advanced features
                        </p>
                      </div>
                      <Button
                        onClick={() => router.push("/subscription")}
                        size="sm"
                        variant="default"
                        className="flex-shrink-0 px-2.5 py-1 h-auto text-xs bg-primary/90 hover:bg-primary text-primary-foreground shadow-sm shadow-primary/20 group-hover:shadow-md transition-all duration-200"
                      >
                        Upgrade
                      </Button>
                    </div>
                  </div>
                </div>
                <SidebarSeparator className="my-2 opacity-40" />
              </>
            )}

            <div className="px-4 py-2">
              <FeedbackPopover>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full gap-2 text-sm border-dashed border-muted-foreground/30 bg-transparent hover:bg-muted/30 hover:border-muted-foreground/50 transition-all"
                >
                  <MessageSquarePlus className="w-4 h-4 text-primary/70" />
                  <span>Share Feedback</span>
                </Button>
              </FeedbackPopover>
            </div>

            {/* Legal links */}
            <SidebarSeparator className="my-2 opacity-40" />
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      className="w-full gap-2 text-xs text-muted-foreground/70 hover:text-muted-foreground hover:bg-muted/30"
                    >
                      <Link href="/privacy">
                        <Shield className="w-3 h-3" />
                        <span>Privacy Policy</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      className="w-full gap-2 text-xs text-muted-foreground/70 hover:text-muted-foreground hover:bg-muted/30"
                    >
                      <Link href="/terms">
                        <FileText className="w-3 h-3" />
                        <span>Terms of Service</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </div>
        </SidebarContent>
      </Sidebar>

      {/* Snap Dialog */}
      <Dialog open={isSnapDialogOpen} onOpenChange={handleDialogClose}>
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
              Upload any image with text to instantly transform it into editable
              notes.
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="upload" className="w-full">
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
                    <img
                      src={uploadedImage}
                      alt="Uploaded image"
                      className="w-full max-h-[300px] object-contain"
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
                    onClick={handleTranslate}
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
              <Button variant="ghost" size="sm">
                Close
              </Button>
            </DialogClose>
            {generatedNotes && (
              <Button size="sm" className="gap-2">
                <FileText className="w-4 h-4" />
                Save to Notes
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

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
  Sparkles,
  ChevronDown,
  ChevronUp,
  Flame,
  CheckCircle2,
} from "lucide-react";
import { useState } from "react";
import { useSubscription } from "../hooks/use-subscription";

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
  const [showProFeatures, setShowProFeatures] = useState(false);
  const { isPro } = useSubscription();

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

  const proFeatures = [
    {
      title: "Deep Semantic Search",
      description: "Find exactly what you need with advanced contextual search",
    },
    {
      title: "Advanced Models",
      description: "Access to our most powerful language models",
    },
    {
      title: "Note Connections",
      description: "Discover relationships between your notes automatically",
    },
    {
      title: "Unlimited Usage",
      description: "No restrictions on usage or message limits",
    },
  ];

  return (
    <Sidebar className="border-r border-border/40">
      <SidebarContent className="flex flex-col h-full">
        <div className="flex-1">
          {/* Compose button with subtle animation */}
          <div className="flex items-center px-4 py-3">
            <Button
              variant="default"
              size="sm"
              className={cn(
                "w-full gap-2 transition-all duration-200 hover:scale-102 shadow-sm",
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
          </div>

          {!isPro && (
            <div className="px-4 py-3">
              <div className="relative overflow-hidden rounded-lg border border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-primary/15 hover:from-primary/15 hover:via-primary/10 hover:to-primary/20 transition-all duration-300 shadow-sm">
                {/* Animated flame background */}
                <div
                  className="absolute inset-0 opacity-5 bg-repeat-x bg-[length:12px_12px] animate-[pulse_4s_ease-in-out_infinite]"
                  style={{
                    backgroundImage:
                      "url(\"data:image/svg+xml,%3Csvg width='12' height='12' viewBox='0 0 12 12' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M6 0C6 0 7 3 7 5C7 6.5 5.5 7 5.5 9C5.5 10.5 6.5 12 6.5 12C6.5 12 4 11 3 9C2 7 3 5 4 3.5C5 2 6 0 6 0Z' fill='%23ff4500'/%3E%3C/svg%3E\")",
                  }}
                ></div>

                {/* Pro badge with better positioning and style */}
                <div className="absolute -right-8 -top-8 rotate-45">
                  <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-10 py-1 shadow-md flex items-center justify-center">
                    <Flame className="w-3 h-3 mr-1 animate-[pulse_2s_ease-in-out_infinite]" />
                    PRO
                  </div>
                </div>

                <div className="p-3.5">
                  <h3 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-orange-500" />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-red-500">
                      Upgrade to Pro
                    </span>
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1 mb-2">
                    Unlock premium features today for maximum productivity
                  </p>

                  {/* View features button */}
                  {!showProFeatures && (
                    <button
                      onClick={() => setShowProFeatures(true)}
                      className="text-xs text-orange-500 hover:text-orange-600 font-medium flex items-center gap-1 mb-3 transition-colors"
                    >
                      <span>View all features</span>
                      <ChevronDown className="h-3 w-3" />
                    </button>
                  )}

                  {showProFeatures && (
                    <div className="space-y-2 mb-3 bg-background/70 rounded-md p-2.5 border border-primary/10 transition-all duration-200 opacity-100">
                      {proFeatures.map((feature, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3 h-3 text-orange-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-xs font-medium">
                              {feature.title}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {feature.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <Button
                      variant="default"
                      size="sm"
                      className="w-full text-xs font-medium bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white border-0 shadow-md animate-[pulse_5s_ease-in-out_infinite]"
                      asChild
                    >
                      <Link href="/subscription">Upgrade Now</Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowProFeatures(!showProFeatures);
                      }}
                    >
                      {showProFeatures ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                      <span className="sr-only">
                        {showProFeatures ? "Hide" : "Show"} Pro Features
                      </span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
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
                                  <span className="truncate">{chat.title}</span>
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
          <SidebarSeparator className="my-2 opacity-40" />
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
  );
}

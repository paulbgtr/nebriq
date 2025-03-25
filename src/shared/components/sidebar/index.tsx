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
  Camera,
} from "lucide-react";
import { useSubscription } from "@/shared/hooks/use-subscription";
import { Snap } from "./snap";

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
import { FeedbackPopover } from "@/shared/components/feedback/feedback-popover";
import { Button } from "@/shared/components/ui/button";
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
  const { isPro, isPending } = useSubscription();

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

              <Snap />
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
    </>
  );
}

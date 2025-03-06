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
} from "lucide-react";

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
  {
    icon: MessageSquarePlus,
    name: "feedback",
    href: "#",
    tooltip: "Share Feedback",
    isPopover: true,
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useUser();
  const { chatHistory, activeChatId, setActiveChatId, deleteChat } =
    useChatHistoryStore();

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
    <Sidebar className="border-r">
      <SidebarContent className="flex flex-col h-full">
        <div className="flex-1">
          <div className="flex items-center px-4 py-2">
            <Button
              variant="default"
              size="sm"
              className={cn(
                "w-full gap-2 transition-all duration-200 hover:scale-105",
                pathname === "/write" && "opacity-50"
              )}
              disabled={pathname === "/write"}
              asChild
            >
              <Link href="/write">
                <Pen className="w-4 h-4" />
                <span>compose</span>
              </Link>
            </Button>
          </div>

          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navItems.map((item) => (
                  <SidebarMenuItem key={item.name}>
                    {item.isPopover ? (
                      <FeedbackPopover>
                        <SidebarMenuButton
                          className={cn(
                            "w-full gap-2 transition-all duration-200",
                            "text-muted-foreground hover:text-foreground"
                          )}
                        >
                          <item.icon className="w-4 h-4" />
                          <span className="capitalize">{item.name}</span>
                        </SidebarMenuButton>
                      </FeedbackPopover>
                    ) : (
                      <SidebarMenuButton
                        asChild
                        className={cn(
                          "w-full gap-2 transition-all duration-200",
                          pathname === item.href
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:text-foreground"
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
                    )}
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {user && chatHistory.length > 0 && (
            <>
              <SidebarSeparator />
              <SidebarGroup>
                <SidebarGroupLabel className="flex items-center gap-1">
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
                                "w-full gap-2 transition-all duration-200 justify-between pr-2",
                                activeChatId === chat.id
                                  ? "bg-primary/10 text-primary"
                                  : "text-muted-foreground hover:text-foreground"
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

        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className="w-full gap-2 text-xs text-muted-foreground hover:text-foreground"
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
                  className="w-full gap-2 text-xs text-muted-foreground hover:text-foreground"
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
      </SidebarContent>
    </Sidebar>
  );
}

"use client";

import { cn } from "@/shared/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  House,
  Waypoints,
  Library,
  MessageSquarePlus,
  Pen,
  FileText,
  Shield,
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
} from "@/shared/components/ui/sidebar";
import { FeedbackPopover } from "./feedback/feedback-popover";
import { Button } from "./ui/button";

const navItems = [
  {
    icon: House,
    name: "home",
    href: "/home",
    tooltip: "Go to Homepage",
  },
  {
    icon: Waypoints,
    name: "connections",
    href: "/graph",
    tooltip: "View Connections",
  },
  {
    icon: Library,
    name: "library",
    href: "/library",
    tooltip: "Browse Library",
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

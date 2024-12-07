"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/components/ui/button";
import { Menu, Pen } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/shared/components/ui/sheet";
import { UserActions } from "./user-actions";
import { useUser } from "@/hooks/use-user";

const navItems = [{ name: "search", href: "/search" }];

export default function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const { user } = useUser();

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center">
          <div className="flex-1 flex items-center justify-start">
            <Button
              onClick={() => router.push("/write")}
              disabled={pathname === "/write"}
              variant="default"
              size="sm"
              className="gap-2"
            >
              <Pen className="w-4 h-4" />
              <span>compose</span>
            </Button>
          </div>
          <div className="hidden sm:block absolute left-1/2 transform -translate-x-1/2">
            <div className="flex space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "relative rounded-md px-4 py-2 text-sm font-medium transition-colors",
                    pathname === item.href
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/50",
                    "group"
                  )}
                >
                  {item.name}
                  {pathname === item.href && (
                    <span className="absolute bottom-0 left-0 h-0.5 w-full bg-primary" />
                  )}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex-1 flex items-center justify-end gap-4">
            <UserActions email={user?.email} />
            <div className="sm:hidden">
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    className="h-9 w-9 p-0 hover:bg-accent/50"
                  >
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="w-[240px] sm:w-[540px] p-0"
                >
                  <div className="flex flex-col py-4">
                    <div className="px-6 pb-4">
                      <Button
                        asChild
                        variant="default"
                        className="w-full gap-2"
                        onClick={() => setIsOpen(false)}
                      >
                        <Link href="/write">
                          <Pen className="w-4 h-4" />
                          <span>New Note</span>
                        </Link>
                      </Button>
                    </div>
                    {navItems.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "px-6 py-3 text-sm font-medium transition-colors",
                          pathname === item.href
                            ? "bg-accent/50 text-primary"
                            : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                        )}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

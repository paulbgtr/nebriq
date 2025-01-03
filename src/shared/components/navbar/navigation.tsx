import { useState, useEffect } from "react";
import { cn } from "@/shared/lib/utils";
import Link from "next/link";
import { Button } from "@/shared/components/ui/button";
import { Library, Menu, Pen, House, Waypoints } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/shared/components/ui/sheet";
import { UserActions } from "./user-actions";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

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
];

type Props = {
  email: string | undefined;
};

export const Navigation = ({ email }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.section
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={cn(
        "sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm transition-all duration-200",
        scrolled && "border-border shadow-sm"
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center">
          <div className="flex-1 flex items-center justify-start">
            <Button
              onClick={() => router.push("/write")}
              disabled={pathname === "/write"}
              variant="default"
              size="sm"
              className={cn(
                "gap-2 transition-all duration-200 hover:scale-105",
                pathname === "/write" && "opacity-50"
              )}
            >
              <Pen className="w-4 h-4" />
              <span>compose</span>
            </Button>
          </div>

          <nav className="hidden sm:block absolute left-1/2 transform -translate-x-1/2">
            <ul className="flex space-x-1">
              {navItems.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={cn(
                      "relative rounded-md px-4 py-2 text-sm font-medium transition-all duration-200",
                      pathname === item.href
                        ? "text-primary bg-primary/10"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted",
                      "group flex items-center gap-2 hover:scale-105"
                    )}
                    aria-current={pathname === item.href ? "page" : undefined}
                  >
                    <item.icon
                      className={cn(
                        "transition-colors duration-200",
                        pathname === item.href
                          ? "text-primary"
                          : "text-muted-foreground"
                      )}
                      size={16}
                    />
                    {item.name}
                    {pathname === item.href && (
                      <motion.span
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 h-0.5 w-full bg-primary"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
                      />
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex-1 flex items-center justify-end gap-4">
            <UserActions email={email} />

            <div className="sm:hidden">
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    className="h-9 w-9 p-0 hover:bg-accent/50 transition-all duration-200"
                    aria-label="Toggle menu"
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="w-[240px] sm:w-[540px] p-0 pt-8 border-l border-border"
                >
                  <AnimatePresence>
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="flex flex-col py-4"
                    >
                      {navItems.map((item, index) => (
                        <motion.div
                          key={item.name}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Link
                            href={item.href}
                            onClick={() => setIsOpen(false)}
                            className={cn(
                              "px-6 py-3 text-sm font-medium transition-colors duration-200",
                              pathname === item.href
                                ? "bg-muted text-primary"
                                : "text-muted-foreground hover:bg-muted hover:text-foreground",
                              "flex items-center gap-2"
                            )}
                          >
                            <item.icon
                              className={cn(
                                "w-4 h-4",
                                pathname === item.href
                                  ? "text-primary"
                                  : "text-muted-foreground"
                              )}
                            />
                            {item.name}
                          </Link>
                        </motion.div>
                      ))}
                    </motion.div>
                  </AnimatePresence>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

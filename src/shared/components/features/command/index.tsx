"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useHotkeys } from "react-hotkeys-hook";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/shared/components/ui/command";
import {
  Settings,
  PaintBucket,
  Pen,
  Waypoints,
  Library,
  HelpCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const commandItems = [
  {
    group: "Main",
    items: [
      {
        icon: Pen,
        label: "Compose",
        shortcut: "⌘N",
        href: "/write",
        description: "Create new content",
      },
      {
        icon: Waypoints,
        label: "Connections",
        shortcut: "⌘G",
        href: "/graph",
        description: "View your network",
      },
      {
        icon: Library,
        label: "Library",
        shortcut: "⌘L",
        href: "/library",
        description: "Browse your content",
      },
    ],
  },
  {
    group: "Settings",
    items: [
      {
        icon: Settings,
        label: "General Settings",
        href: "/settings",
        description: "Configure general app settings",
      },
      {
        icon: PaintBucket,
        label: "Appearance",
        href: "/settings/appearance",
        description: "Customize theme and layout",
      },
    ],
  },
  {
    group: "Help",
    items: [
      {
        icon: HelpCircle,
        label: "Help & Support",
        shortcut: "⌘H",
        href: "/help",
        description: "Get help and documentation",
      },
    ],
  },
];

export default function Command() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useHotkeys("mod+/", () => setOpen(!open));
  useHotkeys("esc", () => setOpen(false));

  const handleSelect = (href?: string) => {
    if (href) {
      router.push(href);
    }
    setOpen(false);
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="border border-border bg-popover rounded-lg shadow-lg"
          >
            <CommandInput
              placeholder="Type a command or search..."
              className="h-11 flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
            />
            <CommandList className="max-h-[400px] overflow-y-auto p-2">
              <CommandEmpty className="py-6 text-center text-sm text-muted-foreground">
                No results found.
              </CommandEmpty>

              {commandItems.map((group, index) => (
                <div key={group.group}>
                  <CommandGroup>
                    <p className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                      {group.group}
                    </p>
                    {group.items.map((item) => (
                      <CommandItem
                        key={item.label}
                        onSelect={() => handleSelect(item.href)}
                        className="flex items-center justify-between px-2 py-3 cursor-pointer hover:bg-muted focus:bg-muted rounded-md"
                        title={item.description}
                      >
                        <div className="flex items-center">
                          <item.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span className="text-foreground">{item.label}</span>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                  {index < commandItems.length - 1 && (
                    <CommandSeparator className="my-2 border-border" />
                  )}
                </div>
              ))}
            </CommandList>
          </motion.div>
        )}
      </AnimatePresence>
    </CommandDialog>
  );
}

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
  PenTool,
  Network,
  Library,
  Search,
} from "lucide-react";

const menuItems = {
  main: [
    {
      icon: <PenTool className="mr-2 h-4 w-4" />,
      label: "Compose",
      href: "/write",
      shortcut: "⌘ N",
    },
    {
      icon: <Network className="mr-2 h-4 w-4" />,
      label: "Connections",
      href: "/graph",
      shortcut: "⌘ G",
    },
    {
      icon: <Library className="mr-2 h-4 w-4" />,
      label: "Library",
      href: "/library",
      shortcut: "⌘ L",
    },
  ],
  settings: [
    {
      icon: <Settings className="mr-2 h-4 w-4" />,
      label: "General",
      href: "/settings",
      shortcut: "⌘ ,",
    },
    {
      icon: <PaintBucket className="mr-2 h-4 w-4" />,
      label: "Appearance",
      href: "/settings/appearance",
    },
  ],
};

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
      <div className="flex items-center border-b px-3">
        <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
        <CommandInput
          placeholder="Type a command or search..."
          className="h-11 flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
        />
      </div>
      <CommandList className="max-h-[300px] overflow-y-auto">
        <CommandEmpty className="py-6 text-center text-sm">
          No results found.
        </CommandEmpty>

        <CommandGroup heading="Suggestions" className="px-2">
          {menuItems.main.map((item) => (
            <CommandItem
              key={item.href}
              onSelect={() => handleSelect(item.href)}
              className="flex items-center justify-between px-2 py-3 cursor-pointer hover:bg-accent rounded-md"
            >
              <div className="flex items-center">
                {item.icon}
                <span>{item.label}</span>
              </div>
              {item.shortcut && (
                <span className="text-xs text-muted-foreground">
                  {item.shortcut}
                </span>
              )}
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator className="my-2" />

        <CommandGroup heading="Settings" className="px-2">
          {menuItems.settings.map((item) => (
            <CommandItem
              key={item.href}
              onSelect={() => handleSelect(item.href)}
              className="flex items-center justify-between px-2 py-3 cursor-pointer hover:bg-accent rounded-md"
            >
              <div className="flex items-center">
                {item.icon}
                <span>{item.label}</span>
              </div>
              {item.shortcut && (
                <span className="text-xs text-muted-foreground">
                  {item.shortcut}
                </span>
              )}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}

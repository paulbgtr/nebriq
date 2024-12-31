import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import {
  LogOut,
  Settings,
  Keyboard,
  PaintBucket,
  HelpCircle,
  Bell,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { logout } from "@/app/actions/supabase/auth";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/shared/components/ui/alert-dialog";

const menuItems = [
  {
    group: "Preferences",
    items: [
      {
        icon: Settings,
        label: "General Settings",
        shortcut: "⌘,",
        href: "/settings",
        description: "Configure general app settings",
      },
      {
        icon: PaintBucket,
        label: "Appearance",
        shortcut: "⌘T",
        href: "/settings/appearance",
        description: "Customize theme and layout",
      },
      {
        icon: Bell,
        label: "Notifications",
        shortcut: "⌘N",
        href: "/settings/notifications",
        description: "Manage reminders and alerts",
      },
    ],
  },
  {
    group: "Help",
    items: [
      {
        icon: Keyboard,
        label: "Shortcuts",
        shortcut: "⌘/",
        href: "/shortcuts",
        description: "View keyboard shortcuts",
      },
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

type UserActionsProps = {
  email: string | undefined;
};

export const UserActions = ({ email }: UserActionsProps) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!email) {
    return <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />;
  }

  const firstLetter = email.charAt(0);
  const username = email.split("@")[0];

  const handleLogout = async () => {
    await logout();
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-8 w-8 rounded-full transition-all duration-200 hover:ring-2 hover:ring-primary/50 hover:ring-offset-2"
        >
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary/10 text-primary">
              {firstLetter.toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <AnimatePresence>
        {isOpen && (
          <DropdownMenuContent className="w-64" align="end" forceMount asChild>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <DropdownMenuLabel className="font-normal p-4">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{username}</p>
                  <p className="text-xs text-muted-foreground">{email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {menuItems.map((group, index) => (
                <div key={group.group}>
                  <DropdownMenuGroup className="p-2">
                    <p className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                      {group.group}
                    </p>
                    {group.items.map((item) => (
                      <DropdownMenuItem
                        key={item.label}
                        asChild
                        className="hover:bg-accent/50 focus:bg-accent/50"
                      >
                        <Link
                          href={item.href}
                          className="flex items-center py-2"
                          title={item.description}
                        >
                          <item.icon className="mr-2 h-4 w-4" />
                          <span>{item.label}</span>
                          <DropdownMenuShortcut>
                            {item.shortcut}
                          </DropdownMenuShortcut>
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuGroup>
                  {index < menuItems.length - 1 && <DropdownMenuSeparator />}
                </div>
              ))}
              <DropdownMenuSeparator />
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <div className="p-2" onClick={(e) => e.stopPropagation()}>
                    <DropdownMenuItem
                      className="hover:bg-destructive/10 focus:bg-destructive/10"
                      onSelect={(e) => e.preventDefault()}
                    >
                      <LogOut className="mr-2 h-4 w-4 text-destructive" />
                      <span className="text-destructive">Log out</span>
                      <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                    </DropdownMenuItem>
                  </div>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Log out of Nebriq?</AlertDialogTitle>
                    <AlertDialogDescription>
                      You will be logged out of Nebriq. If you have unsaved
                      changes, they will be lost. Continue?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleLogout}>
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </motion.div>
          </DropdownMenuContent>
        )}
      </AnimatePresence>
    </DropdownMenu>
  );
};

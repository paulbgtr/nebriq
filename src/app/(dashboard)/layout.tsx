import type { Metadata } from "next";
import { redirect } from "next/navigation";
import {
  SidebarTrigger,
  SidebarProvider,
} from "@/shared/components/ui/sidebar";
export const metadata: Metadata = {
  title: "Dashboard | Nebriq",
  description: "Manage your notes efficiently",
};
import { AppSidebar } from "@/shared/components/sidebar";
import { UserActions } from "@/shared/components/user-actions";
import { NoteTabs } from "@/shared/components/note-tabs";
import { auth } from "@/auth";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  if (!session || !session.user) {
    redirect("/login");
  }

  const { user } = session;

  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />
      <main className="w-full">
        <div className="flex justify-between items-center p-4 bg-background/50 backdrop-blur-sm sticky top-0 z-50 border-b border-border/40">
          <div className="flex items-center gap-4">
            <SidebarTrigger />
          </div>
          <div className="flex-1 mx-4 overflow-hidden">
            <NoteTabs />
          </div>
          <UserActions email={user.email} />
        </div>
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
}

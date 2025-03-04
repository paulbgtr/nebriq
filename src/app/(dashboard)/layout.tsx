import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/shared/lib/supabase/server";
import { VERSION } from "@/shared/config/version";
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

const Version = () => {
  return (
    <div className="absolute z-50 top-20 right-10">
      <p className="text-xs text-muted-foreground/60 text-right">
        Nebriq {VERSION.number} <br />
        {VERSION.releaseDate}
      </p>
    </div>
  );
};

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    redirect("/login");
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full">
        <div className="flex justify-end items-center p-4 bg-background/50 backdrop-blur-sm sticky top-0 z-50 border-b border-border/40">
          <div className="absolute left-4">
            <SidebarTrigger />
          </div>
          <UserActions email={data.user.email} />
        </div>
        <NoteTabs />
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {children}
        </div>
      </main>
      <Version />
    </SidebarProvider>
  );
}

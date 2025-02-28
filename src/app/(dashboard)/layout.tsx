import type { Metadata } from "next";
import Navbar from "@/shared/components/navbar";
import { redirect } from "next/navigation";
import { createClient } from "@/shared/lib/supabase/server";
import AIChat from "@/shared/components/features/chat";
import Command from "@/shared/components/features/command";
import { VERSION } from "@/shared/config/version";

export const metadata: Metadata = {
  title: "Dashboard | Nebriq",
  description: "Manage your notes efficiently",
};

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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      <Version />
      <div className="fixed inset-0 bg-grid-gray-900/[0.04] dark:bg-grid-white/[0.02] bg-[size:20px_20px] pointer-events-none" />

      <div className="fixed top-0 left-0 right-0 z-50">
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
          <Navbar />
        </div>
      </div>

      <main className="relative flex min-h-screen flex-col">
        <div className="flex-1 w-full">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-28 sm:pt-32 pb-10">
            {children}
          </div>
        </div>
      </main>

      <AIChat />
      <Command />
    </div>
  );
}

import type { Metadata } from "next";
import Navbar from "@/shared/components/navbar";
import { redirect } from "next/navigation";
import { createClient } from "@/shared/lib/supabase/server";
import AIChat from "@/shared/components/features/chat";
import Command from "@/shared/components/features/command";

export const metadata: Metadata = {
  title: "Dashboard | Notes App",
  description: "Manage your notes efficiently",
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
    <main className="flex w-full flex-col overflow-hidden">
      <div className="fixed top-0 left-0 w-full z-50">
        <Navbar />
      </div>

      <div className="flex-1 space-y-4 p-4 md:p-6 lg:p-8 xl:px-16 max-w-7xl mx-auto w-full mt-16">
        {children}
      </div>

      <AIChat />
      <Command />
    </main>
  );
}

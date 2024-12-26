import type { Metadata } from "next";
import Navbar from "@/shared/components/navbar";
import { redirect } from "next/navigation";
import { createClient } from "@/shared/lib/supabase/server";
import AIChat from "@/shared/components/features/chat";

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
      <Navbar />
      <div className="flex-1 space-y-4 p-8 px-16 pt-6">{children}</div>
      <AIChat />
    </main>
  );
}

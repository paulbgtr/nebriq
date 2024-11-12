import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | Notes App",
  description: "Manage your notes efficiently",
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex w-full flex-col overflow-hidden">
      <div className="flex-1 space-y-4 p-8 px-16 pt-6">{children}</div>
    </main>
  );
}

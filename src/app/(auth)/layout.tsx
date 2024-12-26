import { redirect } from "next/navigation";
import { createClient } from "@/shared/lib/supabase/server";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const { data } = await supabase.auth.getUser();

  if (data?.user) {
    redirect("/home");
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      {children}
    </div>
  );
}

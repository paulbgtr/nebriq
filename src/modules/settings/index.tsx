"use client";

import { useEffect } from "react";
import { useUser } from "@/hooks/use-user";
import { useSearchParams } from "next/navigation";
import { useToast } from "@/shared/hooks/use-toast";

import { Separator } from "@/shared/components/ui/separator";
import { SkeletonSettings } from "./features/skeleton";
import { EmailSettings } from "./features/email-settings";
import { PasswordSettings } from "./features/password-settings";
import { DangerZone } from "./features/danger-zone";

export default function SettingsModule() {
  const searchParams = useSearchParams();
  const { user, isPending } = useUser();
  const { toast } = useToast();

  useEffect(() => {
    const message = searchParams.get("message");
    if (message === "email_updated") {
      toast({ title: "Email updated successfully", color: "success" });
    } else if (message === "password_updated") {
      toast({ title: "Password updated successfully", color: "success" });
    }
  }, [searchParams]);

  return (
    <div className="container max-w-2xl mx-auto py-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>
      <Separator />

      {isPending ? (
        <SkeletonSettings />
      ) : (
        <>
          <section className="grid gap-6 md:grid-cols-2 w-full">
            <EmailSettings email={user?.email} />
            <PasswordSettings />
          </section>

          <DangerZone />
        </>
      )}
    </div>
  );
}

"use client";

import { useEffect } from "react";
import { useUser } from "@/shared/hooks/data/use-user";
import { useSearchParams } from "next/navigation";
import { useToast } from "@/shared/hooks/use-toast";

import { SettingsHeader } from "../../shared/components/settings-header";
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
  }, [searchParams, toast]);

  return (
    <>
      <SettingsHeader
        title="Settings"
        description="Manage your account settings and preferences."
      />

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
    </>
  );
}

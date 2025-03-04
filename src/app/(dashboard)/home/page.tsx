"use client";

import { useUser } from "@/shared/hooks/use-user";
import { Onboarding } from "@/shared/components/onboarding";
import HomeModule from "@/modules/home";

export default function HomePage() {
  const { isNewUser } = useUser();

  return (
    <main>
      {isNewUser && (
        <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 shrink-0">
          <Onboarding />
        </div>
      )}
      <HomeModule />
    </main>
  );
}

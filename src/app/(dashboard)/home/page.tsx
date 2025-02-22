"use client";

import Search from "@/modules/home/features/search";
import AllNotes from "@/modules/home/features/all-notes";
import { useUser } from "@/hooks/use-user";
import { Onboarding } from "@/shared/components/onboarding";

export default function HomePage() {
  const { isNewUser } = useUser();

  return (
    <main className="min-h-[calc(100vh-12rem)] flex flex-col items-center justify-start px-4 sm:px-6 lg:px-8">
      {isNewUser && <Onboarding />}

      <div className="w-full max-w-5xl mx-auto pt-8 sm:pt-12 lg:pt-16">
        <div className="w-full max-w-2xl mx-auto">
          <Search />
        </div>

        <div className="mt-12 sm:mt-16 lg:mt-20 min-h-[450px] w-full">
          <AllNotes />
        </div>
      </div>
    </main>
  );
}

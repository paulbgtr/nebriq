import Search from "@/modules/home/features/search";
import AllNotes from "@/modules/home/features/all-notes";

export default function HomePage() {
  return (
    <main className="h-[calc(100vh-12rem)] flex flex-col items-center justify-start px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-7xl mx-auto pt-8 sm:pt-12 lg:pt-16">
        <div className="w-full">
          <Search />
        </div>

        <div className="mt-8 sm:mt-12 lg:mt-16 min-h-[450px] w-full">
          <AllNotes />
        </div>
      </div>
    </main>
  );
}

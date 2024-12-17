import Search from "@/modules/search/features/search";
import AllNotes from "@/modules/search/features/all-notes";

export default function SearchPage() {
  return (
    <main className="min-h-[calc(100vh-12rem)] flex flex-col items-center justify-center">
      <div className="my-auto w-full">
        <Search />
      </div>
      <div className="mt-16 min-h-[450px]">
        <AllNotes />
      </div>
    </main>
  );
}

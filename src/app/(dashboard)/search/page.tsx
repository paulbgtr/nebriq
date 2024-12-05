import Search from "@/modules/search/features/search";
import AllNotes from "@/modules/search/features/all-notes";

export default function SearchPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center h-full">
      <div className="my-auto">
        <Search />
      </div>
      <div className="mt-16">
        <AllNotes />
      </div>
    </main>
  );
}

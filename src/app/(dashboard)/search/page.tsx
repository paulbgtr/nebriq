import Search from "@/modules/search/features/search";
import AllNotes from "@/modules/search/features/all-notes";

export default function SearchPage() {
  return (
    <main>
      <div className="min-h-[80vh] grid items-center">
        <Search />
      </div>
      <AllNotes />
    </main>
  );
}

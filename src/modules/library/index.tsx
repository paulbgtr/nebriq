import { SearchHistory } from "./features/search-history";

export default function LibraryModule() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <header className="mb-5">
        <h1 className="text-3xl font-bold tracking-tight mb-4">Library</h1>
        <p>Here you can find your search history.</p>
      </header>
      <SearchHistory />
    </div>
  );
}

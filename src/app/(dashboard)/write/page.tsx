import Tiptap from "@/components/tiptap";

export default function WritePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="prose prose-lg max-w-none dark:prose-invert">
        <Tiptap />
      </div>
    </div>
  );
}

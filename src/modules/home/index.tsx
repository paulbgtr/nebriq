import { cn } from "@/shared/lib/utils";
import { InputArea } from "../../shared/components/chat/input-area";

export default function HomeModule() {
  return (
    <article
      role="main"
      className="fixed inset-0 top-16 flex flex-col bg-background"
    >
      <div className="absolute inset-0 flex flex-col max-w-5xl mx-auto w-full">
        <div className="flex-1 flex h-full overflow-hidden">
          <div
            className={cn(
              "w-full flex flex-col h-full px-4",
              "items-center justify-center"
            )}
          >
            <InputArea />
          </div>
        </div>
      </div>
    </article>
  );
}

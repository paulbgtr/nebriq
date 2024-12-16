import { Visualization } from "./features/visualization";
import { Controls } from "@/modules/graph/features/controls";
import { Sidebar } from "./features/sidebar";

export default function GraphModule() {
  return (
    <div className="flex h-[calc(100vh-11rem)] w-full">
      <div className="relative flex-1 bg-background/95">
        <Visualization />
        <Controls />
      </div>

      <Sidebar />
    </div>
  );
}

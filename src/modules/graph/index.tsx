"use client";

import { Visualization } from "./features/visualization";

export default function GraphModule() {
  return (
    <div className="flex h-[calc(100vh-11rem)] w-full">
      <div className="relative flex-1 bg-background/95 rounded-lg">
        <Visualization />
      </div>
    </div>
  );
}

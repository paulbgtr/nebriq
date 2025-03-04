"use client";

import { Visualization } from "./features/visualization";

export default function GraphModule() {
  return (
    <div className="w-full h-[calc(100vh-8rem)] flex items-center justify-center">
      <Visualization />
    </div>
  );
}

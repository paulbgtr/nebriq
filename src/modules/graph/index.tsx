"use client";

import React, { useRef } from "react";
import { Visualization } from "./features/visualization";
import { Controls } from "@/modules/graph/features/controls";
// import { Sidebar } from "./features/sidebar";

export default function GraphModule() {
  const svgRef = useRef<SVGSVGElement>(null);

  return (
    <div className="flex h-[calc(100vh-11rem)] w-full">
      <div className="relative flex-1 bg-background/95">
        <Visualization svgRef={svgRef} />
        <Controls svgRef={svgRef} />
      </div>

      {/* <Sidebar /> */}
    </div>
  );
}

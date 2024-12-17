import { Search, ZoomIn, ZoomOut, Maximize } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import * as d3 from "d3";
import { useCallback } from "react";

interface ControlsProps {
  svgRef: React.RefObject<SVGSVGElement>;
}

export const Controls = ({ svgRef }: ControlsProps) => {
  const handleZoomIn = useCallback(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    const currentTransform = d3.zoomTransform(svg.node()!);
    svg
      .transition()
      .duration(300)
      .call(
        d3.zoom<SVGSVGElement, unknown>().transform as any,
        d3.zoomIdentity
          .translate(currentTransform.x, currentTransform.y)
          .scale(currentTransform.k * 1.5)
      );
  }, [svgRef]);

  const handleZoomOut = useCallback(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    const currentTransform = d3.zoomTransform(svg.node()!);
    svg
      .transition()
      .duration(300)
      .call(
        d3.zoom<SVGSVGElement, unknown>().transform as any,
        d3.zoomIdentity
          .translate(currentTransform.x, currentTransform.y)
          .scale(currentTransform.k / 1.5)
      );
  }, [svgRef]);

  const handleReset = useCallback(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    svg
      .transition()
      .duration(300)
      .call(
        d3.zoom<SVGSVGElement, unknown>().transform as any,
        d3.zoomIdentity
      );
  }, [svgRef]);

  return (
    <div className="absolute bottom-4 right-4 flex flex-col gap-2">
      <Button variant="secondary" size="icon" onClick={handleZoomIn}>
        <ZoomIn className="h-4 w-4" />
      </Button>
      <Button variant="secondary" size="icon" onClick={handleZoomOut}>
        <ZoomOut className="h-4 w-4" />
      </Button>
      <Button variant="secondary" size="icon" onClick={handleReset}>
        <Maximize className="h-4 w-4" />
      </Button>
    </div>
  );
};

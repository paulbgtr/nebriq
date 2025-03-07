import { useRef, useState, useEffect } from "react";
import * as d3 from "d3";

interface GraphNode extends d3.SimulationNodeDatum {
  id: string;
  title: string;
  connections: number;
}

interface GraphLink extends d3.SimulationLinkDatum<GraphNode> {
  source: string | GraphNode;
  target: string | GraphNode;
  strength: number;
}

export const KnowledgeGraphVisualization = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    if (!svgRef.current) return;

    // Sample data for visualization
    const nodes: GraphNode[] = [
      { id: "note1", title: "Project Ideas", connections: 5 },
      { id: "note2", title: "Meeting Notes", connections: 3 },
      { id: "note3", title: "Research Paper", connections: 4 },
      { id: "note4", title: "Book Summary", connections: 2 },
      { id: "note5", title: "Weekly Goals", connections: 3 },
      { id: "note6", title: "Product Roadmap", connections: 4 },
      { id: "note7", title: "Learning Resources", connections: 2 },
    ];

    const links: GraphLink[] = [
      { source: "note1", target: "note2", strength: 0.7 },
      { source: "note1", target: "note3", strength: 0.5 },
      { source: "note1", target: "note6", strength: 0.8 },
      { source: "note2", target: "note5", strength: 0.6 },
      { source: "note3", target: "note4", strength: 0.4 },
      { source: "note3", target: "note7", strength: 0.5 },
      { source: "note5", target: "note6", strength: 0.7 },
      { source: "note6", target: "note7", strength: 0.3 },
    ];

    // Clear any existing SVG content
    d3.select(svgRef.current).selectAll("*").remove();

    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    // Create SVG
    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    // Add a subtle gradient background
    const defs = svg.append("defs");

    // Create gradient for background
    const bgGradient = defs
      .append("linearGradient")
      .attr("id", "background-gradient")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "100%")
      .attr("y2", "100%");

    bgGradient
      .append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "hsl(var(--background) / 0.5)");

    bgGradient
      .append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "hsl(var(--muted) / 0.1)");

    // Create gradient for links
    const linkGradient = defs
      .append("linearGradient")
      .attr("id", "link-gradient")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "100%")
      .attr("y2", "100%");

    linkGradient
      .append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "hsl(var(--primary) / 0.7)");

    linkGradient
      .append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "hsl(var(--secondary) / 0.7)");

    // Add glow filter
    const filter = defs
      .append("filter")
      .attr("id", "glow")
      .attr("x", "-50%")
      .attr("y", "-50%")
      .attr("width", "200%")
      .attr("height", "200%");

    filter
      .append("feGaussianBlur")
      .attr("stdDeviation", "3")
      .attr("result", "blur");

    filter
      .append("feComposite")
      .attr("in", "SourceGraphic")
      .attr("in2", "blur")
      .attr("operator", "over");

    // Add background rect
    svg
      .append("rect")
      .attr("width", width)
      .attr("height", height)
      .attr("fill", "url(#background-gradient)")
      .attr("rx", 8)
      .attr("ry", 8);

    const container = svg.append("g");

    // Helper function to get node radius based on connections
    const getNodeRadius = (d: GraphNode) => {
      const baseSize = 6;
      const connectionBonus = Math.min(d.connections || 0, 10) * 0.8;
      return baseSize + connectionBonus;
    };

    // Create simulation
    const simulation = d3
      .forceSimulation<GraphNode>(nodes)
      .force("charge", d3.forceManyBody<GraphNode>().strength(-120))
      .force("center", d3.forceCenter<GraphNode>(width / 2, height / 2))
      .force(
        "link",
        d3
          .forceLink<GraphNode, GraphLink>(links)
          .id((d) => d.id)
          .distance(80)
      )
      .force(
        "collision",
        d3.forceCollide<GraphNode>().radius((d) => getNodeRadius(d) + 15)
      );

    // Create links
    const link = container
      .append("g")
      .selectAll<SVGPathElement, GraphLink>("path")
      .data(links)
      .join("path")
      .attr("stroke", "url(#link-gradient)")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", 1.5)
      .attr("fill", "none")
      .style("stroke-dasharray", "4,2");

    // Create nodes
    const node = container
      .append("g")
      .selectAll<SVGGElement, GraphNode>("g")
      .data(nodes)
      .join("g");

    // Add glow circles behind nodes
    node
      .append("circle")
      .attr("r", (d) => getNodeRadius(d) * 2.5)
      .style("fill", "hsl(var(--primary))")
      .style("opacity", 0.2)
      .attr("class", "glow-circle")
      .style("filter", "url(#glow)");

    // Add circles to nodes
    node
      .append("circle")
      .attr("r", (d) => getNodeRadius(d))
      .style("fill", "hsl(var(--primary))")
      .style("stroke", "hsl(var(--background))")
      .style("stroke-width", 1.5);

    // Add labels to nodes
    node
      .append("text")
      .text((d) => d.title)
      .attr("font-size", "8px")
      .attr("text-anchor", "middle")
      .attr("dy", (d) => getNodeRadius(d) + 12)
      .style("fill", "hsl(var(--foreground))")
      .style("pointer-events", "none")
      .style("user-select", "none");

    simulation.on("tick", () => {
      link.attr("d", (d) => {
        const sourceX = (d.source as GraphNode).x || 0;
        const sourceY = (d.source as GraphNode).y || 0;
        const targetX = (d.target as GraphNode).x || 0;
        const targetY = (d.target as GraphNode).y || 0;

        const dx = targetX - sourceX;
        const dy = targetY - sourceY;
        const dr = Math.sqrt(dx * dx + dy * dy) * 2;

        return `M${sourceX},${sourceY}A${dr},${dr} 0 0,1 ${targetX},${targetY}`;
      });

      node.attr("transform", (d) => `translate(${d.x || 0},${d.y || 0})`);
    });

    const dragBehavior = d3
      .drag<SVGGElement, GraphNode>()
      .on("start", (event, d) => {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      })
      .on("drag", (event, d) => {
        d.fx = event.x;
        d.fy = event.y;
      })
      .on("end", (event, d) => {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      });

    // Type assertion needed because d3's type definitions don't perfectly match between Selection and DragBehavior
    node.call(dragBehavior as d3.DragBehavior<SVGGElement, GraphNode, unknown>);

    return () => {
      simulation.stop();
    };
  }, [mounted]);

  return (
    <svg
      ref={svgRef}
      className="w-full h-full"
      style={{ minHeight: "300px" }}
    />
  );
};

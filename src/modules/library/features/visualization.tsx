/* eslint-disable @typescript-eslint/no-explicit-any */

import * as d3 from "d3";
import { z } from "zod";
import { noteSchema } from "@/shared/lib/schemas/note";
import { noteConnectionSchema } from "@/shared/lib/schemas/note-connection";
import { useEffect, useRef, useMemo, useCallback, memo, useState } from "react";
import { useRouter } from "next/navigation";
import { useNotes } from "@/shared/hooks/data/use-notes";
import { useQuery } from "@tanstack/react-query";
import { getAllNoteConnections } from "@/app/actions/supabase/note_connections";
import { FolderPlus, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";

type GraphNode = d3.SimulationNodeDatum & {
  id: string;
  title: string | undefined;
  isHovered?: boolean;
  connections?: number;
};

type GraphLink = d3.SimulationLinkDatum<GraphNode> & {
  source: string;
  target: string;
  strength?: number;
};

type LinePlotProps = {
  notes: z.infer<typeof noteSchema>[];
  connections: z.infer<typeof noteConnectionSchema>[];
  width?: number;
  height?: number;
};

const ForceGraph = memo(
  ({ notes, connections, width = 640, height = 400 }: LinePlotProps) => {
    const router = useRouter();
    const svgRef = useRef<SVGSVGElement>(null);
    const simulationRef = useRef<d3.Simulation<GraphNode, undefined> | null>(
      null
    );
    const tooltipTimeoutRef = useRef<number | null>(null);
    const isDraggingRef = useRef<boolean>(false);
    const [zoomLevel, setZoomLevel] = useState(1);
    const zoomBehaviorRef = useRef<d3.ZoomBehavior<
      SVGSVGElement,
      unknown
    > | null>(null);

    const colors = useMemo(
      () => ({
        node: {
          default: "hsl(var(--primary))",
          hover: "hsl(var(--primary) / 0.8)", // 80% opacity
          connected: "hsl(var(--primary) / 0.6)", // 60% opacity
          dimmed: "hsl(var(--primary) / 0.4)", // 40% opacity
          glow: "hsl(var(--primary) / 0.2)", // 20% opacity for glow effect
        },
        link: {
          default: "hsl(var(--muted-foreground) / 0.5)",
          hover: "hsl(var(--primary))",
          dimmed: "hsl(var(--muted) / 0.3)",
          gradient: {
            start: "hsl(var(--primary) / 0.7)",
            end: "hsl(var(--secondary) / 0.7)",
          },
        },
        text: {
          default: "hsl(var(--foreground))", // Theme text color
          tooltip: "hsl(var(--foreground))",
        },
        background: {
          gradient: {
            start: "hsl(var(--background) / 0.5)",
            end: "hsl(var(--muted) / 0.1)",
          },
        },
      }),
      []
    );

    const { nodes, links } = useMemo(() => {
      // Count connections for each node to determine size
      const connectionCounts = new Map<string, number>();

      connections.forEach((conn) => {
        connectionCounts.set(
          conn.note_id_from,
          (connectionCounts.get(conn.note_id_from) || 0) + 1
        );
        connectionCounts.set(
          conn.note_id_to,
          (connectionCounts.get(conn.note_id_to) || 0) + 1
        );
      });

      const nodes: GraphNode[] = notes.map((note) => ({
        id: note.id,
        title: note.title,
        isHovered: false,
        connections: connectionCounts.get(note.id) || 0,
      }));

      const links: GraphLink[] = connections.map((conn) => ({
        source: conn.note_id_from,
        target: conn.note_id_to,
        strength: 0.5, // Default link strength
      }));

      return { nodes, links };
    }, [notes, connections]);

    const dragHandlers = useMemo(() => {
      const dragstarted = (event: any) => {
        if (!simulationRef.current) return;
        if (!event.active) simulationRef.current.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
        isDraggingRef.current = true;

        // Remove any existing tooltips when drag starts
        d3.selectAll(".tooltip").remove();
      };

      const dragged = (event: any) => {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
      };

      const dragended = (event: any) => {
        if (!simulationRef.current) return;
        if (!event.active) simulationRef.current.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;

        // Set a timeout to reset the dragging flag
        setTimeout(() => {
          isDraggingRef.current = false;
        }, 100);
      };

      return { dragstarted, dragged, dragended };
    }, []);

    const handleNodeClick = useCallback(
      (event: any, d: GraphNode) => {
        event.preventDefault();
        router.push(`/write?id=${d.id}`);
      },
      [router]
    );

    const resetZoom = useCallback(() => {
      if (svgRef.current && zoomBehaviorRef.current) {
        d3.select(svgRef.current)
          .transition()
          .duration(750)
          .call(zoomBehaviorRef.current.transform, d3.zoomIdentity);
        setZoomLevel(1);
      }
    }, []);

    const zoomIn = useCallback(() => {
      if (svgRef.current && zoomBehaviorRef.current) {
        d3.select(svgRef.current)
          .transition()
          .duration(300)
          .call(zoomBehaviorRef.current.scaleBy, 1.3);
        setZoomLevel((prev) => Math.min(prev * 1.3, 4));
      }
    }, []);

    const zoomOut = useCallback(() => {
      if (svgRef.current && zoomBehaviorRef.current) {
        d3.select(svgRef.current)
          .transition()
          .duration(300)
          .call(zoomBehaviorRef.current.scaleBy, 0.7);
        setZoomLevel((prev) => Math.max(prev * 0.7, 0.1));
      }
    }, []);

    useEffect(() => {
      if (!svgRef.current || !nodes.length) return;

      if (simulationRef.current) {
        simulationRef.current.stop();
      }

      const svgSelection = d3.select(svgRef.current);
      svgSelection.selectAll("*").remove();

      // Create a gradient for the background
      const defs = svgSelection.append("defs");

      // Background gradient
      const backgroundGradient = defs
        .append("linearGradient")
        .attr("id", "background-gradient")
        .attr("x1", "0%")
        .attr("y1", "0%")
        .attr("x2", "100%")
        .attr("y2", "100%");

      backgroundGradient
        .append("stop")
        .attr("offset", "0%")
        .attr("stop-color", colors.background.gradient.start);

      backgroundGradient
        .append("stop")
        .attr("offset", "100%")
        .attr("stop-color", colors.background.gradient.end);

      // Link gradient
      const linkGradient = defs
        .append("linearGradient")
        .attr("id", "link-gradient")
        .attr("gradientUnits", "userSpaceOnUse");

      linkGradient
        .append("stop")
        .attr("offset", "0%")
        .attr("stop-color", colors.link.gradient.start);

      linkGradient
        .append("stop")
        .attr("offset", "100%")
        .attr("stop-color", colors.link.gradient.end);

      // Node glow filter
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
        .attr("result", "coloredBlur");

      const feMerge = filter.append("feMerge");
      feMerge.append("feMergeNode").attr("in", "coloredBlur");
      feMerge.append("feMergeNode").attr("in", "SourceGraphic");

      // Add background rect with gradient
      svgSelection
        .append("rect")
        .attr("width", width)
        .attr("height", height)
        .attr("fill", "url(#background-gradient)")
        .attr("rx", 8)
        .attr("ry", 8)
        .style("opacity", 0.8);

      const simulation = d3
        .forceSimulation(nodes)
        .force("charge", d3.forceManyBody().strength(-120).distanceMax(350))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force(
          "link",
          d3
            .forceLink(links)
            .id((d: any) => d.id)
            .distance(120)
        )
        .force(
          "collision",
          d3.forceCollide().radius((d: any) => getNodeRadius(d) + 10)
        )
        .alphaDecay(0.025) // Slightly faster convergence
        .velocityDecay(0.35); // More damping for stability

      simulationRef.current = simulation;

      // Set up SVG and zoom behavior
      const svg = svgSelection.attr("width", width).attr("height", height);

      const zoomBehavior = d3
        .zoom<SVGSVGElement, unknown>()
        .scaleExtent([0.1, 4])
        .on("zoom", (event) => {
          container.attr("transform", event.transform);
          setZoomLevel(event.transform.k);
        });

      zoomBehaviorRef.current = zoomBehavior;
      svg.call(zoomBehavior);

      const container = svg.append("g");

      // Helper function to get node radius based on connections
      function getNodeRadius(d: GraphNode) {
        const baseSize = 6;
        const connectionBonus = Math.min(d.connections || 0, 10) * 0.8;
        return baseSize + connectionBonus;
      }

      // Create links with curved paths and gradients
      const link = container
        .append("g")
        .selectAll("path")
        .data(links)
        .join("path")
        .attr("stroke", "url(#link-gradient)")
        .attr("stroke-opacity", 0.6)
        .attr("stroke-width", 1.5)
        .attr("fill", "none")
        .style("stroke-dasharray", "4,2")
        .style("stroke-dashoffset", 0)
        .style("animation", "dash 30s linear infinite");

      // Create nodes
      const node = container
        .append("g")
        .selectAll<SVGGElement, GraphNode>("g")
        .data(nodes)
        .join("g")
        .call(
          d3
            .drag<SVGGElement, GraphNode, SVGGElement>()
            .on("start", dragHandlers.dragstarted)
            .on("drag", dragHandlers.dragged)
            .on("end", dragHandlers.dragended)
        );

      // Add glow circles behind nodes
      node
        .append("circle")
        .attr("r", (d) => getNodeRadius(d) * 2.5)
        .style("fill", colors.node.glow)
        .style("opacity", 0.4)
        .attr("class", "glow-circle")
        .style("filter", "url(#glow)");

      // Add circles to nodes
      node
        .append("circle")
        .attr("r", (d) => getNodeRadius(d))
        .style("fill", colors.node.default)
        .style("stroke", "hsl(var(--background))")
        .style("stroke-width", 1.5)
        .style("cursor", "pointer")
        .on("click", handleNodeClick)
        .on("mouseover", function (event, d) {
          // Skip tooltip creation if currently dragging
          if (isDraggingRef.current) return;

          // Clear any existing tooltip timeout
          if (tooltipTimeoutRef.current) {
            window.clearTimeout(tooltipTimeoutRef.current);
            tooltipTimeoutRef.current = null;
          }

          // Remove any existing tooltips first to prevent duplicates
          container.selectAll(".tooltip").remove();

          // Optimize hover effects
          d3.select(this)
            .transition()
            .duration(200) // Reduced duration for better responsiveness
            .attr("r", getNodeRadius(d) * 1.5)
            .style("fill", colors.node.hover)
            .style("stroke-width", 2.5);

          // Enhance glow effect on hover
          node
            .selectAll(".glow-circle")
            .filter((n: any) => n.id === d.id)
            .transition()
            .duration(200)
            .attr("r", getNodeRadius(d) * 3)
            .style("opacity", 0.6);

          // Highlight connected nodes
          const connectedNodeIds = new Set<string>();
          links.forEach((l: any) => {
            if (l.source.id === d.id) connectedNodeIds.add(l.target.id);
            if (l.target.id === d.id) connectedNodeIds.add(l.source.id);
          });

          // Optimize link highlighting with curved paths
          link
            .style("stroke", (l: any) => {
              if (l.source.id === d.id || l.target.id === d.id) {
                return "url(#link-gradient)";
              }
              return colors.link.dimmed;
            })
            .style("stroke-opacity", (l: any) =>
              l.source.id === d.id || l.target.id === d.id ? 0.9 : 0.2
            )
            .style("stroke-width", (l: any) =>
              l.source.id === d.id || l.target.id === d.id ? 2 : 0.8
            )
            .style("stroke-dasharray", (l: any) =>
              l.source.id === d.id || l.target.id === d.id ? "5,2" : "4,2"
            );

          // Highlight connected nodes
          node
            .selectAll("circle")
            .filter((n: any) => n.id !== d.id)
            .style("opacity", (n: any) =>
              connectedNodeIds.has(n.id) ? 0.9 : 0.4
            );

          // Skip tooltip creation if currently dragging
          if (isDraggingRef.current) return;

          // Create enhanced tooltip
          const tooltip = container
            .append("g")
            .attr("class", "tooltip")
            .style("opacity", 0)
            .attr("transform", `translate(${event.x + 15},${event.y - 15})`);

          const tooltipWidth = Math.max((d.title?.length || 0) * 8 + 40, 150);

          // Tooltip background with more elegant shape
          tooltip
            .append("rect")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", tooltipWidth)
            .attr("height", 60)
            .attr("rx", 8)
            .attr("ry", 8)
            .style("fill", "hsl(var(--card))")
            .style("stroke", "hsl(var(--border))")
            .style("stroke-width", 1.5)
            .style("filter", "drop-shadow(0px 2px 4px rgba(0,0,0,0.1))");

          // Title text
          tooltip
            .append("text")
            .style("fill", colors.text.default)
            .attr("x", 12)
            .attr("y", 20)
            .text(d.title ?? "Untitled")
            .style("font-size", "14px")
            .style("font-weight", "600");

          // Connection count
          tooltip
            .append("text")
            .style("fill", "hsl(var(--muted-foreground))")
            .attr("x", 12)
            .attr("y", 42)
            .text(
              `${d.connections || 0} connection${
                d.connections !== 1 ? "s" : ""
              }`
            )
            .style("font-size", "12px");

          // Animate tooltip appearance
          tooltip.transition().duration(200).style("opacity", 1);
        })
        .on("mouseout", function () {
          // Skip if currently dragging
          if (isDraggingRef.current) return;

          // Clear any existing tooltip timeout
          if (tooltipTimeoutRef.current) {
            window.clearTimeout(tooltipTimeoutRef.current);
          }

          // Optimize mouseout effects
          d3.select(this)
            .transition()
            .duration(200) // Reduced duration
            .attr("r", (d: any) => getNodeRadius(d))
            .style("fill", colors.node.default)
            .style("stroke-width", 1.5);

          // Reset glow circles
          node
            .selectAll(".glow-circle")
            .transition()
            .duration(200)
            .attr("r", (d: any) => getNodeRadius(d) * 2.5)
            .style("opacity", 0.4);

          // Reset link styles
          link
            .style("stroke", "url(#link-gradient)")
            .style("stroke-opacity", 0.6)
            .style("stroke-width", 1.5)
            .style("stroke-dasharray", "4,2");

          // Reset node styles
          node
            .selectAll("circle:not(.glow-circle)")
            .style("opacity", 1)
            .style("fill", colors.node.default)
            .style("filter", "none");

          // Remove tooltip with a slight delay to prevent flickering
          tooltipTimeoutRef.current = window.setTimeout(() => {
            container
              .selectAll(".tooltip")
              .transition()
              .duration(150)
              .style("opacity", 0)
              .remove();
          }, 50);
        });

      // Add text labels to nodes (only if there are fewer than 50 nodes for performance)
      if (nodes.length < 50) {
        node
          .append("text")
          .text((d) => d.title ?? "Untitled")
          .attr("x", (d) => getNodeRadius(d) + 8)
          .attr("y", 4)
          .style("font-size", "11px")
          .style("font-weight", "500")
          .style("fill", colors.text.default)
          .style("opacity", 0.9)
          .style("pointer-events", "none")
          .style(
            "text-shadow",
            "0 0 3px hsl(var(--background)), 0 0 3px hsl(var(--background))"
          );
      }

      // Use requestAnimationFrame for smoother animation
      let animationFrameId: number | null = null;

      // Helper function to create curved links
      function linkArc(d: any) {
        const dx = d.target.x - d.source.x;
        const dy = d.target.y - d.source.y;
        const dr = Math.sqrt(dx * dx + dy * dy) * 1.2;
        return `M${d.source.x},${d.source.y}A${dr},${dr} 0 0,1 ${d.target.x},${d.target.y}`;
      }

      // Optimize the tick function
      simulation.on("tick", () => {
        // Cancel any existing animation frame
        if (animationFrameId !== null) {
          cancelAnimationFrame(animationFrameId);
        }

        // Schedule the update on the next animation frame
        animationFrameId = requestAnimationFrame(() => {
          // Update link paths with curved lines
          link.attr("d", linkArc);

          // Update node positions
          node.attr("transform", (d: any) => `translate(${d.x},${d.y})`);
        });
      });

      // Cleanup function
      return () => {
        if (simulationRef.current) {
          simulationRef.current.stop();
        }
        if (animationFrameId !== null) {
          cancelAnimationFrame(animationFrameId);
        }
        if (tooltipTimeoutRef.current) {
          clearTimeout(tooltipTimeoutRef.current);
        }
      };
    }, [nodes, links, width, height, colors, dragHandlers, handleNodeClick]);

    // Add display name for the memoized component
    ForceGraph.displayName = "ForceGraph";

    return (
      <div className="relative w-full h-full">
        <svg
          ref={svgRef}
          className="w-full h-full rounded-lg"
          style={{ background: "transparent" }}
        />

        {/* Zoom controls */}
        <div className="absolute bottom-4 right-4 flex flex-col gap-2 bg-background/80 backdrop-blur-sm p-2 rounded-lg shadow-sm">
          <button
            onClick={zoomIn}
            className="p-1.5 rounded-md hover:bg-muted transition-colors"
            title="Zoom in"
          >
            <ZoomIn size={18} />
          </button>
          <button
            onClick={zoomOut}
            className="p-1.5 rounded-md hover:bg-muted transition-colors"
            title="Zoom out"
          >
            <ZoomOut size={18} />
          </button>
          <button
            onClick={resetZoom}
            className="p-1.5 rounded-md hover:bg-muted transition-colors"
            title="Reset view"
          >
            <RotateCcw size={18} />
          </button>
        </div>

        {/* Zoom level indicator */}
        <div className="absolute bottom-4 left-4 text-xs text-muted-foreground bg-background/80 backdrop-blur-sm px-2 py-1 rounded-md">
          {Math.round(zoomLevel * 100)}%
        </div>
      </div>
    );
  }
);

export const Visualization = memo(() => {
  const { getNotesQuery } = useNotes();
  const notesData = getNotesQuery.data || [];

  const { data: noteConnections, isPending } = useQuery({
    queryKey: ["note-connections"],
    queryFn: async () => {
      const data = await getAllNoteConnections();
      return data;
    },
    staleTime: 30 * 1000,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  if (!isPending && notesData.length === 0) {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center p-8 max-w-md bg-background/50 backdrop-blur-sm rounded-xl shadow-sm">
          <div className="mb-4 text-muted-foreground">
            <FolderPlus className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-xl font-medium text-foreground mb-3">
            No notes yet
          </h3>
          <p className="text-sm text-muted-foreground">
            Create your first note to start building your knowledge graph. Your
            notes will be visualized here as an interactive network.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 p-2">
      <div
        className="h-full w-full rounded-lg overflow-hidden"
        id="graph-container"
      >
        {noteConnections && (
          <ForceGraph notes={notesData} connections={noteConnections} />
        )}
      </div>
    </div>
  );
});

// Add display name for the memoized component
Visualization.displayName = "Visualization";

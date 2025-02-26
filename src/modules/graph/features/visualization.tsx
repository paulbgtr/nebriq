/* eslint-disable @typescript-eslint/no-explicit-any */

import * as d3 from "d3";
import { z } from "zod";
import { noteSchema } from "@/shared/lib/schemas/note";
import { noteConnectionSchema } from "@/shared/lib/schemas/note-connection";
import { useEffect, useRef, useMemo, useCallback, memo, useState } from "react";
import { useRouter } from "next/navigation";
import { useNotes } from "@/hooks/use-notes";
import { useQuery } from "@tanstack/react-query";
import { getAllNoteConnections } from "@/app/actions/supabase/note_connections";
import { FolderPlus } from "lucide-react";

type GraphNode = d3.SimulationNodeDatum & {
  id: string;
  title: string | undefined;
  isHovered?: boolean;
};

type GraphLink = d3.SimulationLinkDatum<GraphNode> & {
  source: string;
  target: string;
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

    const colors = useMemo(
      () => ({
        node: {
          default: "hsl(var(--primary))",
          hover: "hsl(var(--primary) / 0.8)", // 80% opacity
          connected: "hsl(var(--primary) / 0.6)", // 60% opacity
          dimmed: "hsl(var(--primary) / 0.4)", // 40% opacity
        },
        link: {
          default: "hsl(var(--muted-foreground))",
          hover: "hsl(var(--primary))",
          dimmed: "hsl(var(--muted))",
        },
        text: {
          default: "hsl(var(--foreground))", // Theme text color
          tooltip: "hsl(var(--foreground))",
        },
      }),
      []
    );

    const { nodes, links } = useMemo(() => {
      const nodes: GraphNode[] = notes.map((note) => ({
        id: note.id,
        title: note.title,
        isHovered: false,
      }));

      const links: GraphLink[] = connections.map((conn) => ({
        source: conn.note_id_from,
        target: conn.note_id_to,
      }));

      return { nodes, links };
    }, [notes, connections]);

    const dragHandlers = useMemo(() => {
      const dragstarted = (event: any) => {
        if (!simulationRef.current) return;
        // Set dragging flag to true
        isDraggingRef.current = true;

        // Remove any existing tooltips when drag starts
        if (svgRef.current) {
          d3.select(svgRef.current).selectAll(".tooltip").remove();
        }

        if (!event.active) simulationRef.current.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
      };

      const dragged = (event: any) => {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
      };

      const dragended = (event: any) => {
        if (!simulationRef.current) return;
        // Reset dragging flag when drag ends
        isDraggingRef.current = false;

        if (!event.active) simulationRef.current.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
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

    useEffect(() => {
      if (!svgRef.current || !nodes.length) return;

      if (simulationRef.current) {
        simulationRef.current.stop();
      }

      const svgSelection = d3.select(svgRef.current);
      svgSelection.selectAll("*").remove();

      const simulation = d3
        .forceSimulation(nodes)
        .force("charge", d3.forceManyBody().strength(-100).distanceMax(300))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force(
          "link",
          d3
            .forceLink(links)
            .id((d: any) => d.id)
            .distance(100)
        )
        .alphaDecay(0.028)
        .velocityDecay(0.4);

      simulationRef.current = simulation;

      const svg = svgSelection.attr("width", width).attr("height", height);

      const zoomBehavior = d3
        .zoom<SVGSVGElement, unknown>()
        .scaleExtent([0.1, 4])
        .on("zoom", (event) => {
          container.attr("transform", event.transform);
        });

      svg.call(zoomBehavior);

      const container = svg.append("g");

      const link = container
        .append("g")
        .selectAll("line")
        .data(links)
        .join("line")
        .style("stroke", colors.link.default)
        .style("stroke-opacity", 0.6)
        .style("stroke-width", 1);

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

      node
        .append("circle")
        .attr("r", 8)
        .style("fill", colors.node.default)
        .style("stroke", "hsl(var(--background))")
        .style("stroke-width", 1.5)
        .style("cursor", "pointer")
        .on("click", handleNodeClick)
        .on("mouseover", function (event, d) {
          // Skip tooltip creation if currently dragging
          if (isDraggingRef.current) return;

          if (tooltipTimeoutRef.current) {
            window.clearTimeout(tooltipTimeoutRef.current);
            tooltipTimeoutRef.current = null;
          }

          d3.select(this)
            .transition()
            .duration(200)
            .attr("r", 12)
            .style("fill", colors.node.hover)
            .style("stroke-width", 2.5);

          link
            .style("stroke", (l: any) =>
              l.source.id === d.id || l.target.id === d.id
                ? colors.link.hover
                : colors.link.dimmed
            )
            .style("stroke-opacity", (l: any) =>
              l.source.id === d.id || l.target.id === d.id ? 0.8 : 0.3
            )
            .style("stroke-width", (l: any) =>
              l.source.id === d.id || l.target.id === d.id ? 2 : 1
            );

          // Remove any existing tooltips before creating a new one
          container.selectAll(".tooltip").remove();

          const tooltip = container
            .append("g")
            .attr("class", "tooltip")
            .style("opacity", 0)
            .attr("transform", `translate(${event.x + 15},${event.y - 15})`);

          tooltip
            .append("rect")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", (d.title?.length || 0) * 8 + 24)
            .attr("height", 30)
            .attr("rx", 6)
            .style("fill", "hsl(var(--background))")
            .style("stroke", "hsl(var(--border))")
            .style("stroke-width", 1.5);

          tooltip
            .append("text")
            .style("fill", colors.text.default)
            .attr("x", 12)
            .attr("y", 20)
            .text(d.title ?? "Untitled")
            .style("font-size", "12px")
            .style("font-weight", "500");

          tooltip.transition().duration(150).style("opacity", 1);
        })
        .on("mouseout", function () {
          // Skip if currently dragging
          if (isDraggingRef.current) return;

          if (tooltipTimeoutRef.current) {
            window.clearTimeout(tooltipTimeoutRef.current);
          }

          d3.select(this)
            .transition()
            .duration(200)
            .attr("r", 8)
            .style("fill", colors.node.default)
            .style("stroke-width", 1.5);

          link
            .style("stroke", colors.link.default)
            .style("stroke-opacity", 0.6)
            .style("stroke-width", 1);

          node
            .selectAll("circle")
            .style("opacity", 1)
            .style("fill", colors.node.default);

          tooltipTimeoutRef.current = window.setTimeout(() => {
            container
              .selectAll(".tooltip")
              .transition()
              .duration(150)
              .style("opacity", 0)
              .remove();
          }, 50);
        });

      if (nodes.length < 50) {
        node
          .append("text")
          .text((d) => d.title ?? "Untitled")
          .attr("x", 12)
          .attr("y", 4)
          .style("font-size", "10px")
          .style("font-weight", "500")
          .style("fill", colors.text.default)
          .style("opacity", 0.8)
          .style("pointer-events", "none");
      }

      let animationFrameId: number | null = null;

      simulation.on("tick", () => {
        if (animationFrameId !== null) {
          cancelAnimationFrame(animationFrameId);
        }

        animationFrameId = requestAnimationFrame(() => {
          link
            .attr("x1", (d: any) => d.source.x)
            .attr("y1", (d: any) => d.source.y)
            .attr("x2", (d: any) => d.target.x)
            .attr("y2", (d: any) => d.target.y);

          node.attr("transform", (d: any) => `translate(${d.x},${d.y})`);
        });
      });

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

    ForceGraph.displayName = "ForceGraph";

    return (
      <div className="relative w-full h-full">
        <svg
          ref={svgRef}
          className="w-full h-full"
          style={{ background: "transparent" }}
        />
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
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes to reduce re-fetching
  });

  if (!isPending && notesData.length === 0) {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center p-8 max-w-md">
          <div className="mb-4 text-muted-foreground">
            <FolderPlus className="w-10 h-10 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">
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
    <div className="absolute inset-0">
      <div className="h-full w-full" id="graph-container">
        {noteConnections && (
          <ForceGraph notes={notesData} connections={noteConnections} />
        )}
      </div>
    </div>
  );
});

Visualization.displayName = "Visualization";

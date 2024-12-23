import * as d3 from "d3";
import { z } from "zod";
import { noteSchema } from "@/shared/lib/schemas/note";
import { noteConnectionSchema } from "@/shared/lib/schemas/note-connection";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Controls } from "./controls";
import { useNotes } from "@/hooks/use-notes";
import { useQuery } from "@tanstack/react-query";
import { getAllNoteConnections } from "@/app/actions/supabase/note_connections";
import { FolderPlus } from "lucide-react";

type GraphNode = d3.SimulationNodeDatum & {
  id: string;
  title: string;
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

function ForceGraph({
  notes,
  connections,
  width = 640,
  height = 400,
}: LinePlotProps) {
  const router = useRouter();
  const svgRef = useRef<SVGSVGElement>(null);

  // Color scheme constants
  const colors = {
    node: {
      default: "#8B1D40", // Burgundy base
      hover: "#B82651", // Lighter burgundy for hover
      connected: "#8B1D40", // Same as default for connected nodes
      dimmed: "#D4A5B3", // Very light burgundy for dimmed state
    },
    link: {
      default: "#D4A5B3", // Light burgundy for links
      hover: "#B82651", // Lighter burgundy for hovered links
      dimmed: "#F2D9E0", // Very light burgundy for dimmed links
    },
    text: {
      default: "#4A0D22", // Dark burgundy for text
      tooltip: "#2D0815", // Darker burgundy for tooltip text
    },
  };

  useEffect(() => {
    if (!svgRef.current || !notes.length) return;

    // Clear previous graph
    d3.select(svgRef.current).selectAll("*").remove();

    // Prepare data
    const nodes: GraphNode[] = notes.map((note) => ({
      id: note.id,
      title: note.title,
      isHovered: false,
    }));

    const links: GraphLink[] = connections.map((conn) => ({
      source: conn.note_id_from,
      target: conn.note_id_to,
    }));

    // Create force simulation
    const simulation = d3
      .forceSimulation(nodes)
      .force("charge", d3.forceManyBody().strength(-100))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force(
        "link",
        d3.forceLink(links).id((d: any) => d.id)
      );

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    // Add zoom behavior
    const zoomBehavior = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on("zoom", (event) => {
        container.attr("transform", event.transform);
      });

    svg.call(zoomBehavior);

    // Create a container for all elements that should be zoomed
    const container = svg.append("g");

    // Create links
    const link = container
      .append("g")
      .selectAll("line")
      .data(links)
      .join("line")
      .style("stroke", colors.link.default)
      .style("stroke-opacity", 0.6)
      .style("stroke-width", 1);

    // Create nodes
    const node = container
      .append("g")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .call(
        d3
          .drag<SVGGElement, GraphNode>()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended) as d3.DragBehavior<SVGGElement, GraphNode>
      );

    // Add circles for nodes
    node
      .append("circle")
      .attr("r", 8)
      .style("fill", colors.node.default)
      .style("stroke", "#fff")
      .style("stroke-width", 1.5)
      .style("cursor", "pointer")
      .style("transition", "stroke-width 0.3s ease-in-out")
      .on("click", (event, d) => {
        event.preventDefault();
        router.push(`/write?id=${d.id}`);
      })
      .on("mouseover", function (event, d) {
        // Smooth node transition
        d3.select(this)
          .transition()
          .duration(300)
          .ease(d3.easeCubicOut)
          .attr("r", 12)
          .style("fill", colors.node.hover)
          .style("stroke-width", 2.5);

        // Highlight connected links with smooth transition
        link
          .transition()
          .duration(300)
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

        // Connected nodes highlight
        node
          .selectAll("circle")
          .transition()
          .duration(300)
          .style("fill", (n: any) => {
            const isConnected = links.some(
              (l) =>
                (l.source.id === d.id && l.target.id === n.id) ||
                (l.target.id === d.id && l.source.id === n.id)
            );
            return n.id === d.id
              ? colors.node.hover
              : isConnected
                ? colors.node.connected
                : colors.node.dimmed;
          })
          .style("opacity", (n: any) => {
            const isConnected = links.some(
              (l) =>
                (l.source.id === d.id && l.target.id === n.id) ||
                (l.target.id === d.id && l.source.id === n.id)
            );
            return isConnected || n.id === d.id ? 1 : 0.3;
          });

        // Enhanced tooltip
        const tooltip = container
          .append("g")
          .attr("class", "tooltip")
          .style("opacity", 0)
          .attr("transform", `translate(${event.x + 15},${event.y - 15})`);

        tooltip
          .append("rect")
          .attr("x", 0)
          .attr("y", 0)
          .attr("width", d.title.length * 8 + 24)
          .attr("height", 30)
          .attr("rx", 6)
          .style("fill", "white")
          .style("stroke", colors.link.default)
          .style("stroke-width", 1.5)
          .style("box-shadow", "0 4px 6px -1px rgba(139, 29, 64, 0.1)");

        tooltip
          .append("text")
          .attr("x", 12)
          .attr("y", 20)
          .text(d.title)
          .style("font-size", "12px")
          .style("font-weight", "500")
          .style("fill", colors.text.tooltip);

        tooltip.transition().duration(200).style("opacity", 1);
      })
      .on("mouseout", function (event, d) {
        // Smooth node transition back
        d3.select(this)
          .transition()
          .duration(300)
          .ease(d3.easeCubicOut)
          .attr("r", 8)
          .style("fill", colors.node.default)
          .style("stroke-width", 1.5);

        // Reset link styles with transition
        link
          .transition()
          .duration(300)
          .style("stroke", colors.link.default)
          .style("stroke-opacity", 0.6)
          .style("stroke-width", 1);

        // Reset all nodes opacity and color
        node
          .selectAll("circle")
          .transition()
          .duration(300)
          .style("opacity", 1)
          .style("fill", colors.node.default);

        // Fade out and remove tooltip
        container
          .selectAll(".tooltip")
          .transition()
          .duration(200)
          .style("opacity", 0)
          .remove();
      });

    // Add labels with improved styling
    node
      .append("text")
      .text((d) => d.title)
      .attr("x", 12)
      .attr("y", 4)
      .style("font-size", "10px")
      .style("font-weight", "500")
      .style("fill", colors.text.default)
      .style("opacity", 0.8)
      .style("pointer-events", "none");

    // Update positions on simulation tick
    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node.attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });

    // Drag functions
    function dragstarted(event: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: any) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: any) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return () => {
      simulation.stop();
    };
  }, [notes, connections, width, height]);

  return (
    <div className="relative w-full h-full">
      <svg
        ref={svgRef}
        className="w-full h-full"
        style={{ background: "transparent" }}
      />
      <Controls svgRef={svgRef} />
    </div>
  );
}

export const Visualization = () => {
  const { getNotesQuery } = useNotes();

  const notesData = getNotesQuery.data || [];

  const { data: noteConnections, isPending } = useQuery({
    queryKey: ["note-connections"],
    queryFn: async () => {
      const data = await getAllNoteConnections();
      return data;
    },
  });

  if (!isPending && notesData.length === 0) {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center p-8 max-w-md">
          <div className="mb-4 text-gray-400">
            <FolderPlus className="w-10 h-10 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No notes yet
          </h3>
          <p className="text-sm text-gray-500">
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
};

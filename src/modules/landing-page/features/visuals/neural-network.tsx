"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { useTheme } from "next-themes";
import * as d3 from "d3";

interface NetworkNode extends d3.SimulationNodeDatum {
  id: string;
  size: number;
  color: string;
  type: "primary" | "secondary" | "accent" | "info" | "warning";
}

interface NetworkLink extends d3.SimulationLinkDatum<NetworkNode> {
  source: string | NetworkNode;
  target: string | NetworkNode;
  strength?: number;
}

interface NeuralNetworkProps {
  disabled?: boolean;
  nodeCount?: number;
}

export const NeuralNetwork = ({
  disabled = false,
  nodeCount = 25,
}: NeuralNetworkProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const simulationRef = useRef<d3.Simulation<NetworkNode, NetworkLink> | null>(
    null
  );
  const animationFrameRef = useRef<number | null>(null);
  const { theme, resolvedTheme } = useTheme();
  const [isMobile, setIsMobile] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0,
  });
  const [mounted, setMounted] = useState(false);

  // Set mounted state after component mounts to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);

    // Initialize dimensions after mount
    if (typeof window !== "undefined") {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
  }, []);

  // Check for reduced motion preference
  useEffect(() => {
    if (typeof window === "undefined") return;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    setIsReducedMotion(prefersReducedMotion);
  }, []);

  // Detect mobile devices
  const checkMobile = useCallback(() => {
    if (typeof window === "undefined") return;
    const mobile = window.innerWidth < 768;
    setIsMobile(mobile);
  }, []);

  // Color schemes based on theme
  const colors = useMemo(() => {
    // Use resolvedTheme which is available after hydration
    const isDark = resolvedTheme === "dark";

    return {
      primary: isDark
        ? "rgba(147, 197, 253, 0.85)" // blue
        : "rgba(59, 130, 246, 0.75)",
      secondary: isDark
        ? "rgba(167, 139, 250, 0.85)" // purple
        : "rgba(99, 102, 241, 0.75)",
      accent: isDark
        ? "rgba(248, 113, 113, 0.85)" // red
        : "rgba(239, 68, 68, 0.75)",
      info: isDark
        ? "rgba(79, 209, 197, 0.85)" // teal
        : "rgba(20, 184, 166, 0.75)",
      warning: isDark
        ? "rgba(251, 191, 36, 0.85)" // amber
        : "rgba(245, 158, 11, 0.75)",
      background: isDark
        ? "rgba(15, 23, 42, 0.9)" // slate-900
        : "rgba(255, 255, 255, 0.9)",
      link: isDark
        ? "rgba(148, 163, 184, 0.3)" // slate-400
        : "rgba(100, 116, 139, 0.3)", // slate-500
      linkHighlight: isDark
        ? "rgba(147, 197, 253, 0.5)" // blue
        : "rgba(59, 130, 246, 0.5)",
    };
  }, [resolvedTheme]);

  // Generate nodes and links
  const { nodes, links } = useMemo(() => {
    if (!mounted || dimensions.width === 0) {
      return { nodes: [], links: [] };
    }

    // Adjust node count for mobile
    const actualNodeCount = isMobile ? Math.min(nodeCount, 15) : nodeCount;

    // Use a fixed seed for random generation to ensure consistency between server and client
    const nodeTypes: (
      | "primary"
      | "secondary"
      | "accent"
      | "info"
      | "warning"
    )[] = [
      "primary",
      "primary",
      "primary", // 30% primary
      "secondary",
      "secondary", // 20% secondary
      "accent",
      "accent", // 20% accent
      "info",
      "info", // 20% info
      "warning", // 10% warning
    ];

    // Create nodes
    const nodes: NetworkNode[] = Array.from({ length: actualNodeCount }).map(
      (_, i) => {
        // Use deterministic values based on index instead of random
        const typeIndex = i % nodeTypes.length;
        const type = nodeTypes[typeIndex];

        // Size based on index pattern rather than random
        const sizeCategory = i % 10;
        const size =
          sizeCategory < 2
            ? isMobile
              ? 3
              : 4 // Large nodes (20%)
            : sizeCategory < 6
              ? isMobile
                ? 2
                : 3 // Medium nodes (40%)
              : isMobile
                ? 1
                : 2; // Small nodes (40%)

        // Deterministic position based on index
        const angle = (i / actualNodeCount) * Math.PI * 2;
        const radius = dimensions.width * 0.3 * (0.6 + (i % 5) * 0.1);
        const x = dimensions.width / 2 + Math.cos(angle) * radius;
        const y = dimensions.height / 2 + Math.sin(angle) * radius;

        return {
          id: `node-${i}`,
          size,
          color: colors[type],
          type,
          x,
          y,
        };
      }
    );

    // Create links (connections between nodes)
    const links: NetworkLink[] = [];
    const maxConnections = isMobile ? 2 : 3;

    nodes.forEach((node, i) => {
      // Deterministic number of connections based on index
      const numConnections = 1 + (i % maxConnections);

      for (let j = 0; j < numConnections; j++) {
        // Deterministic target selection
        const targetIndex = (i + j + 1) % nodes.length;

        // Skip self-connections
        if (targetIndex === i) continue;

        // Add link with deterministic strength
        links.push({
          source: node.id,
          target: nodes[targetIndex].id,
          strength: 0.3 + ((i + j) % 5) * 0.1, // Deterministic strength between 0.3 and 0.7
        });
      }
    });

    return { nodes, links };
  }, [isMobile, nodeCount, colors, dimensions, mounted]);

  // Setup canvas dimensions
  const setupDimensions = useCallback(() => {
    if (typeof window === "undefined") return;

    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }, []);

  // Initialize on mount
  useEffect(() => {
    if (typeof window === "undefined" || disabled || !mounted) return;

    checkMobile();
    setupDimensions();
  }, [checkMobile, setupDimensions, disabled, mounted]);

  // Handle resize with debouncing
  useEffect(() => {
    if (typeof window === "undefined" || disabled) return;

    let resizeTimeout: NodeJS.Timeout;

    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        checkMobile();
        setupDimensions();
      }, 500);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(resizeTimeout);
    };
  }, [checkMobile, setupDimensions, disabled]);

  // Intersection Observer to pause animation when not visible
  useEffect(() => {
    if (typeof window === "undefined" || !containerRef.current || disabled)
      return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(entry.isIntersecting);
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
    };
  }, [disabled]);

  // Main D3 visualization effect
  useEffect(() => {
    if (
      !svgRef.current ||
      disabled ||
      !isVisible ||
      !dimensions.width ||
      !mounted
    )
      return;

    // Stop any existing simulation
    if (simulationRef.current) {
      simulationRef.current.stop();
    }

    // Cancel any animation frame
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    // For reduced motion or mobile, render a static version
    const useStaticVersion = isReducedMotion || isMobile;

    // Select SVG and clear it
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // Set SVG dimensions
    svg
      .attr("width", dimensions.width)
      .attr("height", dimensions.height)
      .attr("viewBox", `0 0 ${dimensions.width} ${dimensions.height}`);

    // Create defs for gradients and filters
    const defs = svg.append("defs");

    // Create glow filter
    const filter = defs
      .append("filter")
      .attr("id", "glow")
      .attr("x", "-50%")
      .attr("y", "-50%")
      .attr("width", "200%")
      .attr("height", "200%");

    filter
      .append("feGaussianBlur")
      .attr("stdDeviation", "2")
      .attr("result", "coloredBlur");

    const feMerge = filter.append("feMerge");
    feMerge.append("feMergeNode").attr("in", "coloredBlur");
    feMerge.append("feMergeNode").attr("in", "SourceGraphic");

    // Create container group
    const container = svg.append("g");

    // Create links
    const link = container
      .append("g")
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", colors.link)
      .attr("stroke-opacity", 0.4)
      .attr(
        "stroke-width",
        (d) => (d.strength || 0.5) * (isMobile ? 0.5 : 0.8)
      );

    // Create nodes
    const node = container.append("g").selectAll("g").data(nodes).join("g");

    // Add glow circles
    node
      .append("circle")
      .attr("r", (d) => d.size * 2)
      .attr("fill", (d) => d.color.replace(/[\d.]+\)$/, "0.2)"))
      .attr("filter", "url(#glow)");

    // Add main circles
    node
      .append("circle")
      .attr("r", (d) => d.size)
      .attr("fill", (d) => d.color);

    // Create simulation
    if (!useStaticVersion) {
      const simulation = d3
        .forceSimulation(nodes)
        .force("charge", d3.forceManyBody().strength(-30))
        .force(
          "center",
          d3.forceCenter(dimensions.width / 2, dimensions.height / 2)
        )
        .force(
          "link",
          d3
            .forceLink(links)
            .id((d: any) => d.id)
            .distance(70)
        )
        .force("x", d3.forceX(dimensions.width / 2).strength(0.01))
        .force("y", d3.forceY(dimensions.height / 2).strength(0.01))
        .force(
          "collision",
          d3.forceCollide().radius((d: any) => d.size * 3)
        )
        .alphaDecay(0.02) // Faster convergence
        .velocityDecay(0.3) // More damping
        .alpha(0.3)
        .restart();

      simulationRef.current = simulation;

      // Update function for animation
      const ticked = () => {
        link
          .attr("x1", (d: any) => d.source.x)
          .attr("y1", (d: any) => d.source.y)
          .attr("x2", (d: any) => d.target.x)
          .attr("y2", (d: any) => d.target.y);

        node.attr("transform", (d: any) => `translate(${d.x},${d.y})`);
      };

      // Use requestAnimationFrame for smoother animation
      simulation.on("tick", () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }

        animationFrameRef.current = requestAnimationFrame(ticked);
      });
    } else {
      // For static version, just position nodes and links once
      nodes.forEach((node) => {
        node.x = node.x || Math.random() * dimensions.width;
        node.y = node.y || Math.random() * dimensions.height;
      });

      link
        .attr("x1", (d: any) =>
          typeof d.source === "object"
            ? d.source.x
            : nodes.find((n) => n.id === d.source)?.x
        )
        .attr("y1", (d: any) =>
          typeof d.source === "object"
            ? d.source.y
            : nodes.find((n) => n.id === d.source)?.y
        )
        .attr("x2", (d: any) =>
          typeof d.target === "object"
            ? d.target.x
            : nodes.find((n) => n.id === d.target)?.x
        )
        .attr("y2", (d: any) =>
          typeof d.target === "object"
            ? d.target.y
            : nodes.find((n) => n.id === d.target)?.y
        );

      node.attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    }

    // Cleanup function
    return () => {
      if (simulationRef.current) {
        simulationRef.current.stop();
      }

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [
    disabled,
    isVisible,
    isReducedMotion,
    isMobile,
    dimensions,
    nodes,
    links,
    colors,
    mounted,
  ]);

  if (disabled) {
    return null;
  }

  // Only render the background div after client-side hydration
  return (
    <div
      ref={containerRef}
      className="fixed inset-0 -z-20 w-full h-full overflow-hidden"
      aria-hidden="true"
    >
      {mounted && (
        <>
          <div
            className="absolute inset-0"
            style={{
              backgroundColor: colors.background,
            }}
          />
          <svg
            ref={svgRef}
            className="w-full h-full"
            style={{
              opacity: 0.8,
            }}
          />
        </>
      )}
    </div>
  );
};

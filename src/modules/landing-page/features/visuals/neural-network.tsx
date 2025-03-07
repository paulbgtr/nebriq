"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { useTheme } from "next-themes";

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  connections: Set<number>; // Using Set for O(1) lookups
  size: number;
  color: string;
  pulseOffset: number;
  glowIntensity: number;
  type: "primary" | "secondary" | "accent";
}

export const NeuralNetwork = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();
  const [isMobile, setIsMobile] = useState(false);
  const animationRef = useRef<number>();
  const nodesRef = useRef<Node[]>([]);
  const lastRenderTimeRef = useRef<number>(0);
  const targetFpsRef = useRef<number>(60);
  const mousePositionRef = useRef<{ x: number; y: number } | null>(null);
  const dimensionsRef = useRef<{ width: number; height: number }>({
    width: typeof window !== "undefined" ? window.innerWidth : 1920,
    height: typeof window !== "undefined" ? window.innerHeight : 1080,
  });

  // Memoize constants
  const constants = useMemo(
    () => ({
      connectionRadius: isMobile ? 130 : 200,
      pulseSpeed: isMobile ? 3000 : 2500,
      nodeCount: isMobile ? 25 : 65,
      maxConnections: isMobile ? 3 : 6,
      nodeSpeed: isMobile ? 0.1 : 0.15,
    }),
    [isMobile]
  );

  // Detect mobile devices and set appropriate FPS
  const checkMobile = useCallback(() => {
    if (typeof window === "undefined") return;
    const mobile = window.innerWidth < 768;
    setIsMobile(mobile);
    targetFpsRef.current = mobile ? 30 : 60;
  }, []);

  // Efficient color management
  const themeColors = useMemo(() => {
    const colors = {
      primary:
        theme === "dark"
          ? ["rgba(147, 197, 253, 0.9)", "rgba(147, 197, 253, 0.8)"]
          : ["rgba(59, 130, 246, 0.8)", "rgba(59, 130, 246, 0.7)"],
      secondary:
        theme === "dark"
          ? ["rgba(167, 139, 250, 0.85)", "rgba(167, 139, 250, 0.75)"]
          : ["rgba(99, 102, 241, 0.75)", "rgba(99, 102, 241, 0.65)"],
      accent:
        theme === "dark"
          ? ["rgba(248, 113, 113, 0.9)", "rgba(248, 113, 113, 0.8)"]
          : ["rgba(239, 68, 68, 0.8)", "rgba(239, 68, 68, 0.7)"],
    };
    return colors;
  }, [theme]);

  // Initialize nodes with optimized data structure
  const initializeNodes = useCallback(() => {
    if (!canvasRef.current) return;

    const nodes: Node[] = Array.from({ length: constants.nodeCount }, () => {
      const type =
        Math.random() > 0.7
          ? "accent"
          : Math.random() > 0.3
            ? "primary"
            : "secondary";
      const size =
        Math.random() > 0.92
          ? isMobile
            ? 4
            : 6
          : Math.random() > 0.65
            ? isMobile
              ? 2.5
              : 3.5
            : isMobile
              ? 1.5
              : 2;

      const colorArray = themeColors[type];
      const color = colorArray[Math.floor(Math.random() * colorArray.length)];

      return {
        x: Math.random() * dimensionsRef.current.width,
        y: Math.random() * dimensionsRef.current.height,
        vx: (Math.random() - 0.5) * constants.nodeSpeed,
        vy: (Math.random() - 0.5) * constants.nodeSpeed,
        connections: new Set<number>(),
        size,
        color,
        type,
        pulseOffset: Math.random() * 2 * Math.PI,
        glowIntensity: 0.5 + Math.random() * 0.5,
      };
    });

    // Initialize connections efficiently
    nodes.forEach((node, i) => {
      for (
        let j = i + 1;
        j < nodes.length && node.connections.size < constants.maxConnections;
        j++
      ) {
        if (nodes[j].connections.size >= constants.maxConnections) continue;

        const dx = node.x - nodes[j].x;
        const dy = node.y - nodes[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < constants.connectionRadius) {
          node.connections.add(j);
          nodes[j].connections.add(i);
        }
      }
    });

    nodesRef.current = nodes;
  }, [constants, isMobile, themeColors]);

  // Setup canvas dimensions
  const setupCanvas = useCallback(() => {
    if (!canvasRef.current || typeof window === "undefined") return;

    const dpr = window.devicePixelRatio || 1;
    const width = window.innerWidth;
    const height = window.innerHeight;

    canvasRef.current.width = width * dpr;
    canvasRef.current.height = height * dpr;
    canvasRef.current.style.width = `${width}px`;
    canvasRef.current.style.height = `${height}px`;

    dimensionsRef.current = { width, height };

    const ctx = canvasRef.current.getContext("2d");
    if (ctx) {
      ctx.scale(dpr, dpr);
      ctx.lineCap = "round";
    }
  }, []);

  // Initialize on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    checkMobile();
    setupCanvas();
    initializeNodes();
  }, [checkMobile, setupCanvas, initializeNodes]);

  // Handle resize with RAF for better performance
  useEffect(() => {
    if (typeof window === "undefined") return;

    let rafId: number;
    let lastWidth = window.innerWidth;
    let lastHeight = window.innerHeight;

    const handleResize = () => {
      rafId = requestAnimationFrame(() => {
        const width = window.innerWidth;
        const height = window.innerHeight;

        if (width === lastWidth && height === lastHeight) return;

        lastWidth = width;
        lastHeight = height;

        setupCanvas();
        checkMobile();
        initializeNodes();
      });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [checkMobile, initializeNodes, setupCanvas]);

  // Optimized mouse tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseLeave = () => {
      mousePositionRef.current = null;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  // Main animation loop with optimized rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const draw = (timestamp: number) => {
      const elapsed = timestamp - lastRenderTimeRef.current;
      const fpsInterval = 1000 / targetFpsRef.current;

      if (elapsed < fpsInterval) {
        animationRef.current = requestAnimationFrame(draw);
        return;
      }

      const delta = Math.min(elapsed / (1000 / 60), 2); // Cap delta time
      lastRenderTimeRef.current = timestamp - (elapsed % fpsInterval);

      // Clear with proper alpha for motion blur effect
      ctx.fillStyle =
        theme === "dark" ? "rgba(0,0,0,0.85)" : "rgba(255,255,255,0.85)";
      ctx.fillRect(
        0,
        0,
        dimensionsRef.current.width,
        dimensionsRef.current.height
      );

      const nodes = nodesRef.current;
      const mousePos = mousePositionRef.current;

      // Update physics
      nodes.forEach((node) => {
        if (mousePos) {
          const dx = mousePos.x - node.x;
          const dy = mousePos.y - node.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            const force = 0.02 * (1 - distance / 150);
            node.vx += (dx / distance) * force * delta;
            node.vy += (dy / distance) * force * delta;
          }
        }

        node.x += node.vx * delta;
        node.y += node.vy * delta;

        // Improved boundary handling
        if (node.x < 0) {
          node.x = 0;
          node.vx *= -0.5;
        }
        if (node.x > dimensionsRef.current.width) {
          node.x = dimensionsRef.current.width;
          node.vx *= -0.5;
        }
        if (node.y < 0) {
          node.y = 0;
          node.vy *= -0.5;
        }
        if (node.y > dimensionsRef.current.height) {
          node.y = dimensionsRef.current.height;
          node.vy *= -0.5;
        }

        node.vx *= 0.99;
        node.vy *= 0.99;
      });

      // Draw connections
      ctx.lineCap = "round";
      nodes.forEach((node, i) => {
        node.connections.forEach((j) => {
          const otherNode = nodes[j];
          const dx = node.x - otherNode.x;
          const dy = node.y - otherNode.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < constants.connectionRadius) {
            const opacity = 1 - distance / constants.connectionRadius;

            // Optimized mouse influence calculation
            let mouseInfluence = 0;
            if (mousePos) {
              const lineLength = distance;
              const t =
                ((mousePos.x - node.x) * dx + (mousePos.y - node.y) * dy) /
                (lineLength * lineLength);
              if (t >= 0 && t <= 1) {
                const closestX = node.x + t * dx;
                const closestY = node.y + t * dy;
                const mouseDistance = Math.hypot(
                  mousePos.x - closestX,
                  mousePos.y - closestY
                );
                if (mouseDistance < 100) {
                  mouseInfluence = 1 - mouseDistance / 100;
                }
              }
            }

            const gradient = ctx.createLinearGradient(
              node.x,
              node.y,
              otherNode.x,
              otherNode.y
            );
            const enhancedOpacity = opacity * (1 + mouseInfluence * 0.5);

            gradient.addColorStop(
              0,
              node.color.replace(/[\d.]+\)$/, `${enhancedOpacity * 0.8})`)
            );
            gradient.addColorStop(
              1,
              otherNode.color.replace(/[\d.]+\)$/, `${enhancedOpacity * 0.8})`)
            );

            ctx.beginPath();
            ctx.strokeStyle = gradient;
            ctx.lineWidth =
              (isMobile ? 0.5 : 0.8) *
              opacity *
              (node.size / 3) *
              (1 + mouseInfluence * 2);
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(otherNode.x, otherNode.y);
            ctx.stroke();

            if (mouseInfluence > 0) {
              ctx.globalAlpha = mouseInfluence * 0.3;
              ctx.lineWidth *= 1.5;
              ctx.stroke();
              ctx.globalAlpha = 1;
            }
          } else {
            node.connections.delete(j);
            otherNode.connections.delete(i);
          }
        });
      });

      // Draw nodes with optimized effects
      nodes.forEach((node) => {
        const mouseInfluence = mousePos
          ? Math.max(
              0,
              1 - Math.hypot(mousePos.x - node.x, mousePos.y - node.y) / 100
            )
          : 0;
        const time = Date.now() / constants.pulseSpeed;
        const pulseScale =
          1 +
          Math.sin(time + node.pulseOffset) * 0.2 * (1 + mouseInfluence * 0.3);
        const radius = node.size * pulseScale;
        const glowSize = node.size * (3 + mouseInfluence * 2);

        // Draw glow
        const gradient = ctx.createRadialGradient(
          node.x,
          node.y,
          0,
          node.x,
          node.y,
          glowSize
        );
        const baseColor = node.color.replace(/[\d.]+\)$/, "");
        const glowIntensity = node.glowIntensity * (1 + mouseInfluence * 1.5);

        gradient.addColorStop(0, node.color);
        gradient.addColorStop(0.5, `${baseColor}${0.2 * glowIntensity})`);
        gradient.addColorStop(1, `${baseColor}0)`);

        ctx.beginPath();
        ctx.fillStyle = gradient;
        ctx.arc(node.x, node.y, glowSize, 0, Math.PI * 2);
        ctx.fill();

        // Draw node
        ctx.beginPath();
        ctx.fillStyle = node.color;
        ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
        ctx.fill();

        // Add highlight
        ctx.beginPath();
        ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
        ctx.arc(
          node.x - radius * 0.3,
          node.y - radius * 0.3,
          radius * 0.4,
          0,
          Math.PI * 2
        );
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(draw);
    };

    animationRef.current = requestAnimationFrame(draw);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [constants, isMobile, theme]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-20 w-full h-full"
      style={{
        filter: isMobile ? "blur(0.5px)" : "blur(0.7px)",
        opacity: 0.95,
      }}
    />
  );
};

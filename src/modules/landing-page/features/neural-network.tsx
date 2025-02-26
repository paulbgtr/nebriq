"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useTheme } from "next-themes";

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  connections: number[];
}

export const NeuralNetwork = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();
  const [isMobile, setIsMobile] = useState(false);
  const animationRef = useRef<number>();
  const nodesRef = useRef<Node[]>([]);
  const lastRenderTimeRef = useRef<number>(0);
  const targetFpsRef = useRef<number>(60);

  // Detect mobile devices and set appropriate FPS
  const checkMobile = useCallback(() => {
    const mobile = window.innerWidth < 768;
    setIsMobile(mobile);
    targetFpsRef.current = mobile ? 30 : 60; // Lower FPS on mobile
  }, []);

  // Handle resize efficiently with debounce
  useEffect(() => {
    let resizeTimer: NodeJS.Timeout;

    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        checkMobile();

        // Only recreate canvas if it exists
        if (canvasRef.current) {
          const canvas = canvasRef.current;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            // Clear the canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Reset canvas dimensions
            const dpr = window.devicePixelRatio || 1;
            canvas.width = window.innerWidth * dpr;
            canvas.height = window.innerHeight * dpr;
            canvas.style.width = `${window.innerWidth}px`;
            canvas.style.height = `${window.innerHeight}px`;
            ctx.scale(dpr, dpr);

            // Recreate nodes
            initializeNodes();
          }
        }
      }, 150); // Debounce resize events
    };

    window.addEventListener("resize", handleResize);
    checkMobile(); // Initial check

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(resizeTimer);
    };
  }, [checkMobile]);

  // Initialize nodes
  const initializeNodes = useCallback(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const nodeCount = isMobile ? 30 : 80;
    const nodeSpeed = isMobile ? 0.15 : 0.3;
    const nodes: Node[] = [];

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * nodeSpeed,
        vy: (Math.random() - 0.5) * nodeSpeed,
        connections: [],
      });
    }

    // Create initial connections
    const connectionRadius = isMobile ? 100 : 150;
    nodes.forEach((node, i) => {
      const maxConnections = isMobile ? 3 : 8;
      let connectionCount = 0;

      nodes.forEach((otherNode, j) => {
        if (i !== j && connectionCount < maxConnections) {
          const dx = node.x - otherNode.x;
          const dy = node.y - otherNode.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < connectionRadius) {
            node.connections.push(j);
            connectionCount++;
          }
        }
      });
    });

    nodesRef.current = nodes;
  }, [isMobile]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    // Set up canvas
    const setupCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
    };

    setupCanvas();
    initializeNodes();

    const connectionRadius = isMobile ? 100 : 150;
    const nodeRadius = isMobile ? 1 : 1.5;
    const pulseSpeed = isMobile ? 3000 : 2000;
    const frameSkip = isMobile ? 2 : 1;
    let frameCount = 0;

    const draw = (timestamp: number) => {
      // Throttle rendering based on target FPS
      const elapsed = timestamp - lastRenderTimeRef.current;
      const fpsInterval = 1000 / targetFpsRef.current;

      if (elapsed < fpsInterval) return;

      // Calculate how much time has passed since last render
      const delta = elapsed / (1000 / 60); // Normalize to 60fps
      lastRenderTimeRef.current = timestamp - (elapsed % fpsInterval);

      // Skip frames on mobile
      frameCount++;
      if (frameCount % frameSkip !== 0) return;

      // Clear with higher opacity to reduce flashing
      ctx.fillStyle =
        theme === "dark" ? "rgba(0,0,0,0.4)" : "rgba(255,255,255,0.4)";
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

      const nodes = nodesRef.current;

      // Update node positions with delta time
      nodes.forEach((node) => {
        node.x += node.vx * delta;
        node.y += node.vy * delta;

        // Bounce off edges
        if (node.x < 0 || node.x > window.innerWidth) node.vx *= -1;
        if (node.y < 0 || node.y > window.innerHeight) node.vy *= -1;

        // Keep within bounds
        node.x = Math.max(0, Math.min(window.innerWidth, node.x));
        node.y = Math.max(0, Math.min(window.innerHeight, node.y));
      });

      // Draw connections
      ctx.beginPath();
      nodes.forEach((node, i) => {
        // Limit connections on mobile
        const maxConnections = isMobile ? 3 : 8;
        const activeConnections = node.connections.slice(0, maxConnections);

        activeConnections.forEach((j) => {
          const otherNode = nodes[j];
          const dx = node.x - otherNode.x;
          const dy = node.y - otherNode.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionRadius) {
            const opacity = 1 - distance / connectionRadius;
            ctx.strokeStyle =
              theme === "dark"
                ? `rgba(99, 102, 241, ${opacity * 0.15})`
                : `rgba(79, 70, 229, ${opacity * 0.08})`;
            ctx.lineWidth = isMobile ? opacity * 0.5 : opacity;

            ctx.moveTo(node.x, node.y);
            ctx.lineTo(otherNode.x, otherNode.y);
          } else {
            // Remove connection if nodes are too far apart
            node.connections = node.connections.filter((conn) => conn !== j);
          }
        });

        // Add new connections if nodes come close (less frequently on mobile)
        if (!isMobile || Math.random() > 0.9) {
          let connectionCount = node.connections.length;

          if (connectionCount < maxConnections) {
            nodes.forEach((otherNode, j) => {
              if (
                !node.connections.includes(j) &&
                i !== j &&
                connectionCount < maxConnections
              ) {
                const dx = node.x - otherNode.x;
                const dy = node.y - otherNode.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < connectionRadius) {
                  node.connections.push(j);
                  connectionCount++;
                }
              }
            });
          }
        }
      });
      ctx.stroke();

      // Draw nodes
      nodes.forEach((node) => {
        ctx.beginPath();
        ctx.arc(node.x, node.y, nodeRadius, 0, Math.PI * 2);
        ctx.fillStyle =
          theme === "dark"
            ? "rgba(99, 102, 241, 0.5)"
            : "rgba(79, 70, 229, 0.3)";
        ctx.fill();

        // Skip glow effect on mobile to improve performance
        if (!isMobile) {
          // Add glow effect
          ctx.beginPath();
          ctx.arc(node.x, node.y, nodeRadius * 2, 0, Math.PI * 2);
          const gradient = ctx.createRadialGradient(
            node.x,
            node.y,
            0,
            node.x,
            node.y,
            nodeRadius * 2
          );
          gradient.addColorStop(
            0,
            theme === "dark"
              ? "rgba(99, 102, 241, 0.3)"
              : "rgba(79, 70, 229, 0.2)"
          );
          gradient.addColorStop(1, "transparent");
          ctx.fillStyle = gradient;
          ctx.fill();
        }

        // Add pulsing effect (simplified for mobile)
        if (!isMobile || Math.random() > 0.8) {
          const pulseScale = 1 + Math.sin(Date.now() / pulseSpeed) * 0.2;
          const currentRadius = nodeRadius * pulseScale;
          ctx.beginPath();
          ctx.arc(node.x, node.y, currentRadius, 0, Math.PI * 2);
          ctx.fillStyle =
            theme === "dark"
              ? "rgba(99, 102, 241, 0.5)"
              : "rgba(79, 70, 229, 0.3)";
          ctx.fill();
        }
      });
    };

    const animate = (timestamp: number) => {
      animationRef.current = requestAnimationFrame(animate);
      draw(timestamp);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      // Clean up canvas
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };
  }, [theme, isMobile, initializeNodes]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-20"
      style={{ filter: isMobile ? "blur(0.5px)" : "blur(1px)" }}
    />
  );
};

"use client";

import { useEffect, useRef } from "react";
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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Create nodes
    const nodes: Node[] = [];
    const nodeCount = 80;
    const connectionRadius = 150;
    const nodeRadius = 1.5;
    const nodeSpeed = 0.3;
    const pulseSpeed = 2000;

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * nodeSpeed,
        vy: (Math.random() - 0.5) * nodeSpeed,
        connections: [],
      });
    }

    // Create initial connections
    nodes.forEach((node, i) => {
      nodes.forEach((otherNode, j) => {
        if (i !== j) {
          const dx = node.x - otherNode.x;
          const dy = node.y - otherNode.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < connectionRadius) {
            node.connections.push(j);
          }
        }
      });
    });

    const draw = () => {
      ctx.fillStyle =
        theme === "dark" ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update node positions
      nodes.forEach((node) => {
        node.x += node.vx;
        node.y += node.vy;

        // Bounce off edges
        if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1;

        // Keep within bounds
        node.x = Math.max(0, Math.min(canvas.width, node.x));
        node.y = Math.max(0, Math.min(canvas.height, node.y));
      });

      // Draw connections
      ctx.beginPath();
      nodes.forEach((node, i) => {
        node.connections.forEach((j) => {
          const otherNode = nodes[j];
          const dx = node.x - otherNode.x;
          const dy = node.y - otherNode.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionRadius) {
            const opacity = 1 - distance / connectionRadius;
            ctx.strokeStyle =
              theme === "dark"
                ? `rgba(99, 102, 241, ${opacity * 0.2})`
                : `rgba(79, 70, 229, ${opacity * 0.1})`;
            ctx.lineWidth = opacity;

            ctx.moveTo(node.x, node.y);
            ctx.lineTo(otherNode.x, otherNode.y);
          } else {
            // Remove connection if nodes are too far apart
            node.connections = node.connections.filter((conn) => conn !== j);
          }
        });

        // Add new connections if nodes come close
        nodes.forEach((otherNode, j) => {
          if (!node.connections.includes(j) && i !== j) {
            const dx = node.x - otherNode.x;
            const dy = node.y - otherNode.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < connectionRadius) {
              node.connections.push(j);
            }
          }
        });
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

        // Add pulsing effect
        const pulseScale = 1 + Math.sin(Date.now() / pulseSpeed) * 0.2;
        const currentRadius = nodeRadius * pulseScale;
        ctx.beginPath();
        ctx.arc(node.x, node.y, currentRadius, 0, Math.PI * 2);
        ctx.fillStyle =
          theme === "dark"
            ? "rgba(99, 102, 241, 0.5)"
            : "rgba(79, 70, 229, 0.3)";
        ctx.fill();
      });
    };

    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      draw();
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      // Clean up canvas
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-20"
      style={{ filter: "blur(1px)" }}
    />
  );
};

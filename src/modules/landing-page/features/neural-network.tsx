"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useTheme } from "next-themes";

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  connections: number[];
  size: number;
  color: string;
  pulseOffset: number;
  glowIntensity: number;
  type: "primary" | "secondary" | "accent";
  targetX?: number; // Target position for smooth transitions
  targetY?: number;
  newConnections?: number[]; // Track new connections for fade-in effect
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
  const isResizingRef = useRef<boolean>(false);
  const resizeTransitionRef = useRef<number>(0);

  // Detect mobile devices and set appropriate FPS
  const checkMobile = useCallback(() => {
    const mobile = window.innerWidth < 768;
    setIsMobile(mobile);
    targetFpsRef.current = mobile ? 30 : 60; // Lower FPS on mobile
  }, []);

  // Handle resize efficiently with debounce
  useEffect(() => {
    let resizeTimer: NodeJS.Timeout;
    let oldWidth = window.innerWidth;
    let oldHeight = window.innerHeight;

    const handleResize = () => {
      clearTimeout(resizeTimer);
      isResizingRef.current = true;
      resizeTransitionRef.current = 0;

      resizeTimer = setTimeout(() => {
        checkMobile();

        // Only adjust canvas if it exists
        if (canvasRef.current) {
          const canvas = canvasRef.current;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            // Calculate scale factors for smooth transition
            const widthRatio = window.innerWidth / oldWidth;
            const heightRatio = window.innerHeight / oldHeight;

            // Update canvas dimensions
            const dpr = window.devicePixelRatio || 1;
            canvas.width = window.innerWidth * dpr;
            canvas.height = window.innerHeight * dpr;
            canvas.style.width = `${window.innerWidth}px`;
            canvas.style.height = `${window.innerHeight}px`;
            ctx.scale(dpr, dpr);

            // If we have existing nodes, adjust their positions proportionally
            const nodes = nodesRef.current;
            if (nodes.length > 0) {
              nodes.forEach((node) => {
                // Store current position as starting point
                const currentX = node.x;
                const currentY = node.y;

                // Calculate target position with scaling
                const scaledX = Math.min(
                  window.innerWidth,
                  currentX * widthRatio
                );
                const scaledY = Math.min(
                  window.innerHeight,
                  currentY * heightRatio
                );

                // Set target position for smooth transition
                node.targetX = Math.max(
                  0,
                  Math.min(window.innerWidth, scaledX)
                );
                node.targetY = Math.max(
                  0,
                  Math.min(window.innerHeight, scaledY)
                );

                // Store current connections to compare later
                node.newConnections = [];
              });
            } else {
              // Only initialize nodes if we don't have any
              initializeNodes();
            }

            // Update connection radius based on new dimensions
            const connectionRadius = isMobile ? 130 : 200;

            // Recalculate connections based on new positions
            nodes.forEach((node, i) => {
              const maxConnections = isMobile ? 3 : 6;
              // Keep existing connections that are still valid
              node.connections = node.connections.filter((j) => {
                if (j >= nodes.length) return false;
                const otherNode = nodes[j];
                // Use target positions if available for more accurate distance calculation
                const x1 = node.targetX !== undefined ? node.targetX : node.x;
                const y1 = node.targetY !== undefined ? node.targetY : node.y;
                const x2 =
                  otherNode.targetX !== undefined
                    ? otherNode.targetX
                    : otherNode.x;
                const y2 =
                  otherNode.targetY !== undefined
                    ? otherNode.targetY
                    : otherNode.y;
                const dx = x1 - x2;
                const dy = y1 - y2;
                const distance = Math.sqrt(dx * dx + dy * dy);
                return distance < connectionRadius;
              });

              // Add new connections if needed
              if (node.connections.length < maxConnections) {
                nodes.forEach((otherNode, j) => {
                  if (
                    i !== j &&
                    !node.connections.includes(j) &&
                    node.connections.length < maxConnections
                  ) {
                    // Use target positions if available for more accurate distance calculation
                    const x1 =
                      node.targetX !== undefined ? node.targetX : node.x;
                    const y1 =
                      node.targetY !== undefined ? node.targetY : node.y;
                    const x2 =
                      otherNode.targetX !== undefined
                        ? otherNode.targetX
                        : otherNode.x;
                    const y2 =
                      otherNode.targetY !== undefined
                        ? otherNode.targetY
                        : otherNode.y;
                    const dx = x1 - x2;
                    const dy = y1 - y2;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < connectionRadius) {
                      node.connections.push(j);
                      // Mark as new connection for fade-in effect
                      if (node.newConnections) {
                        node.newConnections.push(j);
                      }
                    }
                  }
                });
              }
            });
          }
        }

        // Update old dimensions for next resize
        oldWidth = window.innerWidth;
        oldHeight = window.innerHeight;
      }, 150); // Debounce resize events
    };

    window.addEventListener("resize", handleResize);
    checkMobile(); // Initial check
    oldWidth = window.innerWidth; // Initialize old dimensions
    oldHeight = window.innerHeight;

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(resizeTimer);
    };
  }, [checkMobile]);

  // Track mouse position for interactive effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseLeave = () => {
      mousePositionRef.current = null;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  // Get node colors based on theme - using CSS variables from globals.css
  const getThemeColors = useCallback(() => {
    // Helper to convert HSL to RGBA
    const hslToRgba = (h: number, s: number, l: number, a: number) => {
      try {
        // Ensure values are in valid ranges
        h = Math.max(0, Math.min(360, h));
        s = Math.max(0, Math.min(100, s));
        l = Math.max(0, Math.min(100, l));
        a = Math.max(0, Math.min(1, a));

        // Convert HSL to RGB
        s /= 100;
        l /= 100;

        const k = (n: number) => (n + h / 30) % 12;
        const a1 = s * Math.min(l, 1 - l);
        const f = (n: number) =>
          l - a1 * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));

        const r = Math.round(255 * f(0));
        const g = Math.round(255 * f(8));
        const b = Math.round(255 * f(4));

        return `rgba(${r}, ${g}, ${b}, ${a})`;
      } catch {
        console.warn("Error in HSL to RGBA conversion, using fallback color");
        return `rgba(100, 149, 237, ${a})`; // Cornflower blue as fallback
      }
    };

    // Extract HSL values from CSS variables
    const getHslValues = (cssVar: string): [number, number, number] => {
      const style = getComputedStyle(document.documentElement);
      const value = style.getPropertyValue(cssVar).trim();

      try {
        const [h, s, l] = value.split(" ").map(Number);
        // Check if any value is NaN, and provide fallback
        if (isNaN(h) || isNaN(s) || isNaN(l)) {
          console.warn(`Invalid HSL values for ${cssVar}, using fallback`);
          return [210, 100, 50]; // Default blue fallback
        }
        return [h, s, l];
      } catch {
        console.warn(`Error parsing HSL values for ${cssVar}, using fallback`);
        return [210, 100, 50]; // Default blue fallback
      }
    };

    if (theme === "dark") {
      // Dark theme colors
      const primaryHsl = getHslValues("--primary");
      const secondaryHsl = getHslValues("--secondary");
      const accentHsl = getHslValues("--accent");
      const ringHsl = getHslValues("--ring");

      return {
        primary: [
          hslToRgba(primaryHsl[0], primaryHsl[1], primaryHsl[2], 0.85),
          hslToRgba(primaryHsl[0], primaryHsl[1] + 5, primaryHsl[2] + 10, 0.8),
          hslToRgba(primaryHsl[0], primaryHsl[1] - 5, primaryHsl[2] - 5, 0.75),
        ],
        secondary: [
          hslToRgba(
            secondaryHsl[0],
            secondaryHsl[1],
            secondaryHsl[2] + 15,
            0.7
          ),
          hslToRgba(
            secondaryHsl[0],
            secondaryHsl[1] + 5,
            secondaryHsl[2] + 20,
            0.65
          ),
        ],
        accent: [
          hslToRgba(accentHsl[0], accentHsl[1] + 10, accentHsl[2] + 10, 0.8),
          hslToRgba(ringHsl[0], ringHsl[1], ringHsl[2], 0.75),
        ],
      };
    } else {
      // Light theme colors
      const primaryHsl = getHslValues("--primary");
      const secondaryHsl = getHslValues("--secondary");
      const accentHsl = getHslValues("--accent");
      const ringHsl = getHslValues("--ring");

      return {
        primary: [
          hslToRgba(primaryHsl[0], primaryHsl[1], primaryHsl[2], 0.7),
          hslToRgba(primaryHsl[0], primaryHsl[1] + 5, primaryHsl[2] - 5, 0.65),
          hslToRgba(primaryHsl[0], primaryHsl[1] - 5, primaryHsl[2] + 5, 0.6),
        ],
        secondary: [
          hslToRgba(
            secondaryHsl[0],
            secondaryHsl[1] + 10,
            secondaryHsl[2] - 10,
            0.55
          ),
          hslToRgba(
            secondaryHsl[0],
            secondaryHsl[1] + 15,
            secondaryHsl[2] - 5,
            0.5
          ),
        ],
        accent: [
          hslToRgba(accentHsl[0], accentHsl[1] + 15, accentHsl[2] - 5, 0.65),
          hslToRgba(ringHsl[0], ringHsl[1], ringHsl[2], 0.6),
        ],
      };
    }
  }, [theme]);

  // Initialize nodes
  const initializeNodes = useCallback(() => {
    if (!canvasRef.current) return;

    const themeColors = getThemeColors();
    const nodeCount = isMobile ? 25 : 65; // Slightly increased for more density
    const nodeSpeed = isMobile ? 0.1 : 0.15; // Slower movement for more elegance
    const nodes: Node[] = [];

    // Create a distribution of node sizes and types
    for (let i = 0; i < nodeCount; i++) {
      // Determine node type
      let type: "primary" | "secondary" | "accent";
      const typeRandom = Math.random();

      if (typeRandom > 0.7) {
        type = "accent";
      } else if (typeRandom > 0.3) {
        type = "primary";
      } else {
        type = "secondary";
      }

      // Create a variety of node sizes
      const sizeCategory = Math.random();
      let size;

      if (sizeCategory > 0.92) {
        // 8% large nodes
        size = isMobile ? 4 : 6;
      } else if (sizeCategory > 0.65) {
        // 27% medium nodes
        size = isMobile ? 2.5 : 3.5;
      } else {
        // 65% small nodes
        size = isMobile ? 1.5 : 2;
      }

      // Select color based on type
      const colorArray = themeColors[type];
      const color = colorArray[Math.floor(Math.random() * colorArray.length)];

      nodes.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * nodeSpeed,
        vy: (Math.random() - 0.5) * nodeSpeed,
        connections: [],
        size,
        color,
        type,
        pulseOffset: Math.random() * 2 * Math.PI, // Random starting point for pulse
        glowIntensity: 0.5 + Math.random() * 0.5, // Random glow intensity
      });
    }

    // Create initial connections
    const connectionRadius = isMobile ? 130 : 200; // Increased radius for more connections
    nodes.forEach((node, i) => {
      const maxConnections = isMobile ? 3 : 6;
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
  }, [isMobile, getThemeColors]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    // Helper function to ensure valid color strings
    const ensureValidColor = (color: string): string => {
      // Check if it's a valid color format
      try {
        if (!color || color === "undefined" || color === "null") {
          return "rgba(100, 149, 237, 0.7)"; // Fallback color
        }

        // For rgba format, ensure it's properly formatted
        if (color.startsWith("rgba(")) {
          // Make sure it ends with a closing parenthesis
          if (!color.endsWith(")")) {
            color = color + ")";
          }

          // Check if the rgba values are valid
          const rgbaMatch = color.match(
            /rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/
          );
          if (!rgbaMatch) {
            return "rgba(100, 149, 237, 0.7)"; // Fallback color
          }
        }

        return color;
      } catch {
        console.warn("Invalid color format, using fallback", color);
        return "rgba(100, 149, 237, 0.7)"; // Fallback color
      }
    };

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

    const connectionRadius = isMobile ? 130 : 200;
    const pulseSpeed = isMobile ? 3000 : 2500;
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
        theme === "dark" ? "rgba(0,0,0,0.6)" : "rgba(255,255,255,0.6)";
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

      const nodes = nodesRef.current;
      const mousePos = mousePositionRef.current;

      // Handle smooth transition during resize
      if (isResizingRef.current) {
        resizeTransitionRef.current += 0.05 * delta;

        if (resizeTransitionRef.current >= 1) {
          isResizingRef.current = false;
          resizeTransitionRef.current = 1;
        }

        // Apply smooth transition using lerp
        const t = Math.min(1, resizeTransitionRef.current);
        const easeT = t * t * (3 - 2 * t); // Smooth easing function

        nodes.forEach((node) => {
          if (node.targetX !== undefined && node.targetY !== undefined) {
            // Linear interpolation between current and target position
            node.x = node.x + (node.targetX - node.x) * easeT;
            node.y = node.y + (node.targetY - node.y) * easeT;

            // If we're done transitioning, clean up target values
            if (t === 1) {
              node.targetX = undefined;
              node.targetY = undefined;
              node.newConnections = undefined;
            }
          }
        });
      }

      // Draw connections first (so they appear behind nodes)
      ctx.lineCap = "round"; // Rounded line ends

      nodes.forEach((node, i) => {
        // Limit connections on mobile
        const maxConnections = isMobile ? 3 : 6;
        const activeConnections = node.connections.slice(0, maxConnections);

        activeConnections.forEach((j) => {
          const otherNode = nodes[j];
          const dx = node.x - otherNode.x;
          const dy = node.y - otherNode.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionRadius) {
            const opacity = 1 - distance / connectionRadius;

            // Create gradient for connections
            const gradient = ctx.createLinearGradient(
              node.x,
              node.y,
              otherNode.x,
              otherNode.y
            );

            // Extract base colors from node colors
            const nodeColor = node.color.replace(
              /rgba\(([^,]+),([^,]+),([^,]+),[^)]+\)/,
              (_, r, g, b) => `rgba(${r},${g},${b},`
            );
            const otherNodeColor = otherNode.color.replace(
              /rgba\(([^,]+),([^,]+),([^,]+),[^)]+\)/,
              (_, r, g, b) => `rgba(${r},${g},${b},`
            );

            // Check if mouse is near this connection
            let mouseInfluence = 0;
            if (mousePos) {
              // Calculate distance from mouse to line segment
              const lineLength = distance;
              const t =
                ((mousePos.x - node.x) * dx + (mousePos.y - node.y) * dy) /
                (lineLength * lineLength);
              const clampedT = Math.max(0, Math.min(1, t));
              const closestX = node.x + clampedT * dx;
              const closestY = node.y + clampedT * dy;
              const mouseDistance = Math.sqrt(
                Math.pow(mousePos.x - closestX, 2) +
                  Math.pow(mousePos.y - closestY, 2)
              );

              if (mouseDistance < 100) {
                mouseInfluence = 1 - mouseDistance / 100;
              }
            }

            // Check if this is a new connection during resize
            let isNewConnection = false;
            let fadeInOpacity = 1;
            if (isResizingRef.current && node.newConnections) {
              isNewConnection = node.newConnections.includes(j);
              if (isNewConnection) {
                // Fade in new connections
                fadeInOpacity = resizeTransitionRef.current;
              }
            }

            // Enhance opacity based on mouse proximity and fade-in effect
            const enhancedOpacity =
              opacity * (1 + mouseInfluence * 0.5) * fadeInOpacity;

            gradient.addColorStop(
              0,
              ensureValidColor(`${nodeColor}${enhancedOpacity * 0.8})`)
            );
            gradient.addColorStop(
              1,
              ensureValidColor(`${otherNodeColor}${enhancedOpacity * 0.8})`)
            );

            ctx.beginPath();

            // Thicker lines when mouse is near
            const baseWidth =
              (isMobile ? 0.5 : 0.8) * opacity * (node.size / 3);
            ctx.lineWidth = baseWidth * (1 + mouseInfluence * 2);

            ctx.strokeStyle = gradient;
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(otherNode.x, otherNode.y);
            ctx.stroke();

            // Add glow to connections when mouse is near
            if (mouseInfluence > 0) {
              ctx.beginPath();
              ctx.lineWidth = baseWidth * (1 + mouseInfluence * 3);
              ctx.strokeStyle = gradient;
              ctx.globalAlpha = mouseInfluence * 0.3;
              ctx.moveTo(node.x, node.y);
              ctx.lineTo(otherNode.x, otherNode.y);
              ctx.stroke();
              ctx.globalAlpha = 1;
            }
          } else {
            // Remove connection if nodes are too far apart
            node.connections = node.connections.filter((conn) => conn !== j);
          }
        });

        // Add new connections if nodes come close (less frequently on mobile)
        if (!isMobile || Math.random() > 0.95) {
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

      // Update node positions with delta time
      nodes.forEach((node) => {
        // Only apply physics if we're not resizing
        if (!isResizingRef.current) {
          // Apply mouse influence to node movement
          if (mousePos) {
            const dx = mousePos.x - node.x;
            const dy = mousePos.y - node.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 150) {
              // Gentle attraction to mouse
              const force = 0.02 * (1 - distance / 150);
              node.vx += (dx / distance) * force * delta;
              node.vy += (dy / distance) * force * delta;
            }
          }

          // Apply velocity with slight damping
          node.x += node.vx * delta;
          node.y += node.vy * delta;

          // Apply very slight damping to prevent excessive speeds
          node.vx *= 0.995;
          node.vy *= 0.995;

          // Bounce off edges
          if (node.x < 0 || node.x > window.innerWidth) node.vx *= -1;
          if (node.y < 0 || node.y > window.innerHeight) node.vy *= -1;

          // Keep within bounds
          node.x = Math.max(0, Math.min(window.innerWidth, node.x));
          node.y = Math.max(0, Math.min(window.innerHeight, node.y));
        }
      });

      // Draw nodes
      nodes.forEach((node) => {
        // Check if mouse is near this node
        let mouseInfluence = 0;
        if (mousePos) {
          const dx = mousePos.x - node.x;
          const dy = mousePos.y - node.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            mouseInfluence = 1 - distance / 100;
          }
        }

        // Calculate pulse effect
        const time = Date.now() / pulseSpeed;
        const pulseScale = 1 + Math.sin(time + node.pulseOffset) * 0.2;
        // Enhance pulse when mouse is near
        const enhancedPulseScale = pulseScale * (1 + mouseInfluence * 0.3);
        const currentRadius = node.size * enhancedPulseScale;

        // Draw glow effect
        const glowSize = node.size * (3 + mouseInfluence * 2);
        const gradient = ctx.createRadialGradient(
          node.x,
          node.y,
          0,
          node.x,
          node.y,
          glowSize
        );

        // Extract base color from node color
        const baseColor = node.color.replace(
          /rgba\(([^,]+),([^,]+),([^,]+),[^)]+\)/,
          (_, r, g, b) => `rgba(${r},${g},${b},`
        );

        // Enhanced glow when mouse is near
        const glowIntensity = node.glowIntensity * (1 + mouseInfluence * 1.5);

        gradient.addColorStop(0, ensureValidColor(node.color));
        gradient.addColorStop(
          0.5,
          ensureValidColor(`${baseColor}${0.2 * glowIntensity})`)
        );
        gradient.addColorStop(1, ensureValidColor(`${baseColor}0)`));

        ctx.beginPath();
        ctx.fillStyle = gradient;
        ctx.arc(node.x, node.y, glowSize, 0, Math.PI * 2);
        ctx.fill();

        // Draw main node
        ctx.beginPath();
        ctx.fillStyle = node.color;
        ctx.arc(node.x, node.y, currentRadius, 0, Math.PI * 2);
        ctx.fill();

        // Add highlight to create 3D effect
        ctx.beginPath();
        ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
        ctx.arc(
          node.x - currentRadius * 0.3,
          node.y - currentRadius * 0.3,
          currentRadius * 0.4,
          0,
          Math.PI * 2
        );
        ctx.fill();

        // Add extra glow for mouse hover
        if (mouseInfluence > 0) {
          ctx.beginPath();
          const hoverGradient = ctx.createRadialGradient(
            node.x,
            node.y,
            0,
            node.x,
            node.y,
            glowSize * 1.5
          );

          hoverGradient.addColorStop(
            0,
            ensureValidColor(`${baseColor}${0.4 * mouseInfluence})`)
          );
          hoverGradient.addColorStop(
            0.5,
            ensureValidColor(`${baseColor}${0.2 * mouseInfluence})`)
          );
          hoverGradient.addColorStop(1, ensureValidColor(`${baseColor}0)`));

          ctx.fillStyle = hoverGradient;
          ctx.arc(node.x, node.y, glowSize * 1.5, 0, Math.PI * 2);
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
      style={{ filter: isMobile ? "blur(0.5px)" : "blur(0.7px)" }}
    />
  );
};

import React, { useRef, useEffect } from "react";

interface GridNode {
  x: number; // Coordenada base X de la cuadrícula
  y: number; // Coordenada base Y de la cuadrícula
  cx: number; // Coordenada X distorsionada actual
  cy: number; // Coordenada Y distorsionada actual
  vx: number; // Velocidad en X
  vy: number; // Velocidad en Y
  activation: number; // Factor de trayectoria de brillo (0 a 1)
  colorType: "cyan" | "pink"; // Acento de color del nodo
}

export default function InteractiveGrid() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef<{ x: number | null; y: number | null }>({
    x: null,
    y: null,
  });

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Configuración de espaciado de la cuadrícula
    const spacing = 24;
    let nodes: GridNode[] = [];
    let cols = 0;
    let rows = 0;

    const setupGrid = (w: number, h: number) => {
      nodes = [];
      const padding = 10;
      // Squeeze grid boundaries slightly inside the container card border radius
      cols = Math.ceil((w - padding * 2) / spacing) + 1;
      rows = Math.ceil((h - padding * 2) / spacing) + 1;
      const startX = (w - (cols - 1) * spacing) / 2;
      const startY = (h - (rows - 1) * spacing) / 2;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = startX + c * spacing;
          const y = startY + r * spacing;

          nodes.push({
            x,
            y,
            cx: x,
            cy: y,
            vx: 0,
            vy: 0,
            activation: 0,
            // Symmetrical neon styling seeds
            colorType: (r + c) % 2 === 0 ? "cyan" : "pink",
          });
        }
      }
    };

    const handleResize = () => {
      const rect = containerRef.current!.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.scale(dpr, dpr);

      setupGrid(rect.width, rect.height);
    };

    handleResize();
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(containerRef.current);

    // Track mouse coordinates directly on background card
    const handleMouseMove = (e: MouseEvent) => {
      const rect = containerRef.current!.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouseRef.current.x = null;
      mouseRef.current.y = null;
    };

    const parent = containerRef.current?.parentElement || containerRef.current;
    if (parent) {
      parent.addEventListener("mousemove", handleMouseMove);
      parent.addEventListener("mouseleave", handleMouseLeave);
    }

    // ==========================================
    // ANIME TICK FRAME LOOP
    // ==========================================
    let animationId: number;
    const activeRadius = 65; // Distance to hover reaction
    const triggerRadius = 32; // Distance to activate path emission

    const animate = () => {
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      // 1. UPDATE NODES PROPERTIES WITH SPRING DISTORTION
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];

        if (mx !== null && my !== null) {
          const dx = n.x - mx;
          const dy = n.y - my;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < activeRadius) {
            // Distort joint positions dynamically based on cursor range
            const force = (activeRadius - dist) / activeRadius;

            // Neon magnetic repelling vector
            const pushX = n.x + (dx / (dist || 1)) * force * 12;
            const pushY = n.y + (dy / (dist || 1)) * force * 12;

            n.vx += (pushX - n.cx) * 0.12;
            n.vy += (pushY - n.cy) * 0.12;

            // Form path factor if passed directly on top
            if (dist < triggerRadius) {
              const charge = (triggerRadius - dist) / triggerRadius;
              n.activation = Math.min(1.0, n.activation + charge * 0.18);
            }
          } else {
            // Smoothly return joint node to resting state coordinates
            n.vx += (n.x - n.cx) * 0.08;
            n.vy += (n.y - n.cy) * 0.08;
          }
        } else {
          // No mouse - restore grid bones
          n.vx += (n.x - n.cx) * 0.08;
          n.vy += (n.y - n.cy) * 0.08;
        }

        // Apply friction decay & update final coordinates
        n.vx *= 0.75;
        n.vy *= 0.75;
        n.cx += n.vx;
        n.cy += n.vy;

        // Path fade dissipation rate
        n.activation -= 0.008;
        if (n.activation < 0) n.activation = 0;
      }

      // 2. CLEAR FRAME CANVAS
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 3. DRAW EXQUISITE LINK LINES (GRID WEBS)
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const idx = r * cols + c;
          const baseNode = nodes[idx];
          if (!baseNode) continue;

          // Draw Right connection
          if (c < cols - 1) {
            const rightNode = nodes[idx + 1];
            if (rightNode) {
              drawLink(baseNode, rightNode);
            }
          }

          // Draw Down connection
          if (r < rows - 1) {
            const downNode = nodes[idx + cols];
            if (downNode) {
              drawLink(baseNode, downNode);
            }
          }
        }
      }

      // 4. DRAW NODES PLATES (GRID intersections)
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];

        ctx.beginPath();
        if (n.activation > 0) {
          // Fully illuminated activated node intersections
          const activeGlow = n.activation;
          ctx.arc(n.cx, n.cy, 2.5 + activeGlow * 2, 0, Math.PI * 2);
          ctx.fillStyle =
            n.colorType === "pink"
              ? `rgba(253,30,177,${0.3 + activeGlow * 0.7})`
              : `rgba(24,190,199,${0.3 + activeGlow * 0.7})`;
          // Glowing shadow ring
          ctx.shadowColor = n.colorType === "pink" ? "#FD1EB1" : "#18BEC7";
          ctx.shadowBlur = activeGlow * 8;
        } else {
          // Default tiny grid nodes intersections
          ctx.arc(n.cx, n.cy, 1.2, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(24, 190, 199, 0.2)";
          ctx.shadowBlur = 0;
        }
        ctx.fill();
      }

      animationId = requestAnimationFrame(animate);
    };

    // Draw localized connecting pathways
    const drawLink = (n1: GridNode, n2: GridNode) => {
      const activeVal = Math.max(n1.activation, n2.activation);

      ctx.beginPath();
      ctx.moveTo(n1.cx, n1.cy);
      ctx.lineTo(n2.cx, n2.cy);

      if (activeVal > 0.02) {
        // ¡Se forman trazas de color de alto contraste!
        // Configuramos hermosas líneas de degradado activo que representan el flujo de energía
        const grad = ctx.createLinearGradient(n1.cx, n1.cy, n2.cx, n2.cy);
        const c1 =
          n1.colorType === "pink"
            ? `rgba(253,30,177,${activeVal * 0.85})`
            : `rgba(24,190,199,${activeVal * 0.85})`;
        const c2 =
          n2.colorType === "pink"
            ? `rgba(253,30,177,${activeVal * 0.85})`
            : `rgba(24,190,199,${activeVal * 0.85})`;

        grad.addColorStop(0, c1);
        grad.addColorStop(1, c2);

        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.2 + activeVal * 1.8;
        ctx.shadowColor =
          n1.activation > n2.activation
            ? n1.colorType === "pink"
              ? "#FD1EB1"
              : "#18BEC7"
            : n2.colorType === "pink"
              ? "#FD1EB1"
              : "#18BEC7";
        ctx.shadowBlur = activeVal * 6;
      } else {
        // Representación sutil de la conexión de línea inactiva base
        ctx.strokeStyle = "rgba(24, 190, 199, 0.05)";
        ctx.lineWidth = 0.6;
        ctx.shadowBlur = 0;
      }
      ctx.stroke();
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
      if (parent) {
        parent.removeEventListener("mousemove", handleMouseMove);
        parent.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block"
      />
    </div>
  );
}

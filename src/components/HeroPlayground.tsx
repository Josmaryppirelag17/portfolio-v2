import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  Compass,
  Cpu,
  Music,
  Play,
  RefreshCw,
  Zap,
  Volume2,
  VolumeX,
} from "lucide-react";
import { LiaStar } from "react-icons/lia";
import { soundEngine } from "./SoundEngine";
import { useLanguage } from "../LanguageContext";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

type ShapeType = "NEXUS_CRYSTAL" | "HYPERCUBE" | "CYBERGRID" | "ORBITAL_RINGS";
type AccentTheme = "pink" | "cyan" | "lime";

interface CustomShape3D {
  points: [number, number, number][];
  lines: [number, number][];
}

export default function HeroPlayground() {
  const { t } = useLanguage();
  const reducedMotion = usePrefersReducedMotion();
  const [activeShape, setActiveShape] = useState<ShapeType>("NEXUS_CRYSTAL");
  const [accent, setAccent] = useState<AccentTheme>("cyan");
  const [rotationSpeed, setRotationSpeed] = useState<number>(1.5);
  const [wireframeScale, setWireframeScale] = useState<number>(1.2);
  const [isAudioOn, setIsAudioOn] = useState<boolean>(false);
  const [balloonCount, setBalloonCount] = useState<number>(0);
  const [mouseX, setMouseX] = useState<number>(0);
  const [mouseY, setMouseY] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const angleRef = useRef({ x: 0, y: 0 });
  const isMouseDownRef = useRef<boolean>(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Sincronizar dinámicamente los brillos ambientales cuando cambie el acento
  useEffect(() => {
    const root = document.documentElement;
    if (accent === "lime") {
      // Cambiar brillos a verde lima / menta esmeralda
      root.style.setProperty("--glow-color-1", "#a2d80d");
      root.style.setProperty("--glow-color-2", "#34d399");
      root.style.setProperty("--glow-color-3", "#DCF10B");
    } else if (accent === "pink") {
      // Sesgo retro fucsia cálido
      root.style.setProperty("--glow-color-1", "#FD1EB1");
      root.style.setProperty("--glow-color-2", "#9333ea");
      root.style.setProperty("--glow-color-3", "#f43f5e");
    } else {
      // Tema por defecto cian frío de cyberspace
      root.style.setProperty("--glow-color-1", "#FD1EB1");
      root.style.setProperty("--glow-color-2", "#18BEC7");
      root.style.setProperty("--glow-color-3", "#DCF10B");
    }
  }, [accent]);

  // Control maestro de audio
  const toggleSound = () => {
    const newState = soundEngine.toggle();
    setIsAudioOn(newState);
    soundEngine.playToggleSound();
  };

  // Definición de coordenadas para formas 3D
  const getShapeData = (type: ShapeType): CustomShape3D => {
    switch (type) {
      case "HYPERCUBE": {
        // Coordenadas de cubo 3D
        const pts: [number, number, number][] = [
          [-50, -50, -50],
          [50, -50, -50],
          [50, 50, -50],
          [-50, 50, -50],
          [-50, -50, 50],
          [50, -50, 50],
          [50, 50, 50],
          [-50, 50, 50],
        ];
        const lns: [number, number][] = [
          [0, 1],
          [1, 2],
          [2, 3],
          [3, 0], // Back
          [4, 5],
          [5, 6],
          [6, 7],
          [7, 4], // Front
          [0, 4],
          [1, 5],
          [2, 6],
          [3, 7], // Connectors
        ];
        return { points: pts, lines: lns };
      }
      case "CYBERGRID": {
        // Coordenadas de piso de rejilla
        const pts: [number, number, number][] = [];
        const lns: [number, number][] = [];
        let index = 0;
        for (let x = -60; x <= 60; x += 30) {
          for (let z = -60; z <= 60; z += 30) {
            pts.push([x, x % 40 === 0 ? 15 : -15, z]);
          }
        }
        // Connect row lines
        for (let r = 0; r < 5; r++) {
          for (let c = 0; c < 4; c++) {
            lns.push([r * 5 + c, r * 5 + c + 1]);
            lns.push([c * 5 + r, (c + 1) * 5 + r]);
          }
        }
        return { points: pts, lines: lns };
      }
      case "ORBITAL_RINGS": {
        // Múltiples nodos orbitales
        const pts: [number, number, number][] = [];
        const lns: [number, number][] = [];
        const steps = 16;
        // Anillo 1
        for (let i = 0; i < steps; i++) {
          const r = 60;
          const a = (i / steps) * Math.PI * 2;
          pts.push([Math.cos(a) * r, 0, Math.sin(a) * r]);
        }
        // Anillo 2 (Vertical)
        for (let i = 0; i < steps; i++) {
          const r = 60;
          const a = (i / steps) * Math.PI * 2;
          pts.push([0, Math.cos(a) * r, Math.sin(a) * r]);
        }
        // Conexiones
        for (let i = 0; i < steps; i++) {
          lns.push([i, (i + 1) % steps]);
          lns.push([steps + i, steps + ((i + 1) % steps)]);
          if (i % 4 === 0) {
            lns.push([i, steps + i]);
          }
        }
        return { points: pts, lines: lns };
      }
      case "NEXUS_CRYSTAL":
      default: {
        // Doble pirámide / octaedro diamante
        const pts: [number, number, number][] = [
          [0, -75, 0], // Top
          [-55, 0, -55], // Middle coordinates
          [55, 0, -55],
          [55, 0, 55],
          [-55, 0, 55],
          [0, 75, 0], // Bottom
        ];
        const lns: [number, number][] = [
          [0, 1],
          [0, 2],
          [0, 3],
          [0, 4], // Top caps
          [1, 2],
          [2, 3],
          [3, 4],
          [4, 1], // Waist ring
          [5, 1],
          [5, 2],
          [5, 3],
          [5, 4], // Bottom caps
        ];
        return { points: pts, lines: lns };
      }
    }
  };

  // Sincronizar coordenadas del ratón y arrastre rotacional del canvas
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setMouseX(x);
    setMouseY(y);

    if (isMouseDownRef.current) {
      const deltaX = e.clientX - dragStartRef.current.x;
      const deltaY = e.clientY - dragStartRef.current.y;
      angleRef.current.y += deltaX * 0.008;
      angleRef.current.x += deltaY * 0.008;
      dragStartRef.current = { x: e.clientX, y: e.clientY };
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    isMouseDownRef.current = true;
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUpOrLeave = () => {
    isMouseDownRef.current = false;
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches[0]) {
      isMouseDownRef.current = true;
      setIsDragging(true);
      dragStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isMouseDownRef.current && e.touches[0]) {
      const deltaX = e.touches[0].clientX - dragStartRef.current.x;
      const deltaY = e.touches[0].clientY - dragStartRef.current.y;
      angleRef.current.y += deltaX * 0.01;
      angleRef.current.x += deltaY * 0.01;
      dragStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    }
  };

  // Renderizar la geometría del canvas 3D
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let shape = getShapeData(activeShape);

    // Color definitions based on chosen accent theme
    const getColors = () => {
      switch (accent) {
        case "pink":
          return {
            stroke: "#FD1EB1",
            glow: "rgba(253, 30, 177, 0.6)",
            fill: "rgba(253, 30, 177, 0.1)",
          };
        case "lime":
          return {
            stroke: "#DCF10B",
            glow: "rgba(220, 241, 11, 0.6)",
            fill: "rgba(220, 241, 11, 0.1)",
          };
        case "cyan":
        default:
          return {
            stroke: "#18BEC7",
            glow: "rgba(24, 190, 199, 0.6)",
            fill: "rgba(24, 190, 199, 0.1)",
          };
      }
    };

    const draw = () => {
      // Escalar el canvas a las dimensiones del contenedor
      const dpr = window.devicePixelRatio || 1;
      const width = canvas.parentElement?.clientWidth || 400;
      const height = canvas.parentElement?.clientHeight || 400;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);

      ctx.clearRect(0, 0, width, height);

      // Ángulos de rotación impulsados por la velocidad y la tracción del mouse
      angleRef.current.x += 0.005 * rotationSpeed + mouseY * 0.0001;
      angleRef.current.y += 0.005 * rotationSpeed + mouseX * 0.0001;

      const radX = angleRef.current.x;
      const radY = angleRef.current.y;

      const cosX = Math.cos(radX);
      const sinX = Math.sin(radX);
      const cosY = Math.cos(radY);
      const sinY = Math.sin(radY);

      // Tema de color dinámico
      const themes = getColors();

      // Transformar vértices 3D crudos a proyecciones 2D
      const screenCoords: [number, number][] = [];
      const camDst = 280;

      shape.points.forEach(([px, py, pz]) => {
        // Escalar la forma
        const sx = px * wireframeScale;
        const sy = py * wireframeScale;
        const sz = pz * wireframeScale;

        // Matriz de rotación en X
        let y1 = sy * cosX - sz * sinX;
        let z1 = sy * sinX + sz * cosX;

        // Matriz de rotación en Y
        let x2 = sx * cosY + z1 * sinY;
        let z2 = -sx * sinY + z1 * cosY;

        // Proyección de deformación en perspectiva
        const scaleProj = camDst / (camDst + z2);
        const screenX = width / 2 + x2 * scaleProj;
        const screenY = height / 2 + y1 * scaleProj;

        screenCoords.push([screenX, screenY]);
      });

      // Dibujar partículas ambientales sutiles de fondo conectando nodos
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, 90 * wireframeScale, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(27, 28, 64, 0.25)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Dibujar líneas proyectadas
      ctx.shadowBlur = 12;
      ctx.shadowColor = themes.stroke;
      ctx.strokeStyle = themes.stroke;
      ctx.lineWidth = 2.5;

      // Dibujar elemento planetario dinámico brillante cuando la forma es ORBITAL_RINGS
      if (activeShape === "ORBITAL_RINGS") {
        ctx.beginPath();
        ctx.arc(width / 2, height / 2, 22 * wireframeScale, 0, Math.PI * 2);

        const grad = ctx.createRadialGradient(
          width / 2,
          height / 2,
          2 * wireframeScale,
          width / 2,
          height / 2,
          22 * wireframeScale,
        );
        grad.addColorStop(0, "#FFFFFF");
        grad.addColorStop(0.35, themes.stroke);
        grad.addColorStop(1, "transparent");

        ctx.fillStyle = grad;
        ctx.shadowBlur = 30;
        ctx.shadowColor = themes.stroke;
        ctx.fill();
        ctx.shadowBlur = 12; // restore standard shadow
      }

      shape.lines.forEach(([startIdx, endIdx]) => {
        if (screenCoords[startIdx] && screenCoords[endIdx]) {
          ctx.beginPath();
          ctx.moveTo(screenCoords[startIdx][0], screenCoords[startIdx][1]);
          ctx.lineTo(screenCoords[endIdx][0], screenCoords[endIdx][1]);
          ctx.stroke();
        }
      });

      // Dibujar nodos / vértices de neón sólido
      ctx.shadowBlur = 15;
      screenCoords.forEach(([vx, vy], idx) => {
        ctx.beginPath();
        ctx.arc(vx, vy, 4.5, 0, Math.PI * 2);

        // Nodos reactivos multicolor para Orbital Rings
        if (activeShape === "ORBITAL_RINGS") {
          ctx.fillStyle = idx < 16 ? "#FFFFFF" : themes.stroke;
        } else {
          ctx.fillStyle = "#DBEAEC";
        }

        ctx.fill();
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = themes.stroke;
        ctx.stroke();
      });

      ctx.shadowBlur = 0; // reset
      if (!reducedMotion) {
        animId = requestAnimationFrame(draw);
      }
    };

    draw();

    return () => cancelAnimationFrame(animId);
  }, [
    activeShape,
    accent,
    rotationSpeed,
    wireframeScale,
    mouseX,
    mouseY,
    reducedMotion,
  ]);

  // Click triggers synthesizers sound + custom balloon release
  const handleConfiguratorClick = () => {
    soundEngine.playClick();
    setBalloonCount((prev) => prev + 1);

    // Play cool rising melodies in sequence
    const notes = [261.63, 329.63, 392.0, 523.25]; // C4, E4, G4, C5
    const idx = Math.floor(Math.random() * notes.length);
    soundEngine.playSynthKey(notes[idx]);
  };

  return (
    <div
      id="inicio"
      className="relative overflow-hidden w-full bg-brand-bg select-none py-12 md:py-20 lg:py-24 border-b-4 border-brand-bg cyber-grid"
      ref={containerRef}
      onMouseMove={handleMouseMove}
    >
      {/* Decorative Cyber vertical indicators */}
      <div className="absolute top-1/4 right-0 flex flex-col gap-1 pr-2 z-20 pointer-events-none">
        <div className="h-12 w-[3px] bg-[#FD1EB1]"></div>
        <div className="h-4 w-[3px] bg-[#DCF10B]"></div>
        <div className="h-12 w-[3px] bg-[#18BEC7]"></div>
      </div>

      {/* Floating vertical sidebar retro text */}
      <div className="absolute bottom-32 left-8 transform -rotate-90 origin-left text-[9px] font-bold tracking-[0.8em] text-[#18BEC7] opacity-35 uppercase whitespace-nowrap hidden xl:block pointer-events-none">
        CREATIVE DEVELOPER — DESIGNER — OPTIMIZER
      </div>

      {/* Background neon dynamic blobs */}
      <div className="absolute top-10 left-[-10%] w-[350px] h-[350px] glow-spot-pink opacity-25" />
      <div className="absolute bottom-10 right-[-10%] w-[350px] h-[350px] glow-spot-cyan opacity-25" />
      <div className="absolute top-[40%] left-[45%] w-[250px] h-[250px] glow-spot-lime opacity-15" />

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        {/* Left Hand: High impact cyber retro lettering containing balloons */}
        <div className="lg:col-span-7 flex flex-col space-y-6">
          {/* Audio Console Tag */}
          <div className="flex items-center space-x-3">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-pink opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-pink"></span>
            </span>
            <span className="font-mono text-xs tracking-widest text-brand-pale uppercase">
              STATUS // BROADCASTING IMMERSIVE EXPERIENCE
            </span>

            {/* Built-in Sound Master Controller */}
            <button
              onClick={toggleSound}
              className={`ml-auto flex items-center space-x-2 px-3 py-1.5 rounded-md border-2 text-xs font-mono transition-all duration-300 ${
                isAudioOn
                  ? "bg-brand-pink text-white border-brand-pink animate-pulse"
                  : "bg-brand-bg text-brand-cyan border-brand-cyan hover:bg-brand-cyan/10"
              }`}
              title={t("audio_tooltip")}
            >
              {isAudioOn ? (
                <Volume2 size={13} className="shrink-0" />
              ) : (
                <VolumeX size={13} className="shrink-0" />
              )}
              <span>
                {isAudioOn ? t("audio_synths_active") : t("audio_synths_off")}
              </span>
            </button>
          </div>

          {/* Balloon-like display heading, colorful & large */}
          <div className="relative">
            {/* Outline 3D typography drop reflection */}
            <h1
              className="leading-none text-brand-pale tracking-tight font-display text-5xl sm:text-7xl md:text-8xl lg:text-9xl select-none uppercase italic"
              style={{ fontFamily: '"Arial Black", "Syne", sans-serif' }}
            >
              <span
                className="block text-transparent drop-shadow-md select-none"
                style={{ WebkitTextStroke: "2px #DBEAEC" }}
              >
                JOSMARY
              </span>
              <span className="block text-brand-lime flex items-center select-none">
                PIRELA
                <motion.span
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{
                    repeat: Infinity,
                    duration: 4,
                    ease: "easeInOut",
                  }}
                  className="inline-block origin-bottom ml-2 text-4xl sm:text-6xl md:text-7xl"
                >
                  <LiaStar />
                </motion.span>
              </span>
            </h1>

            {/* Designer floating subtitle balloon */}
            <div className="absolute top-[-30px] right-[5%] hidden md:block animate-float">
              <div className="bg-[#FD1EB1] text-[#111232] font-display text-xs px-4 py-1.5 rounded-full border-2 border-[#111232] shadow-[4px_4px_0px_#111232]">
                {t("hero_title_accent")}
              </div>
            </div>
          </div>

          {/* Core tech narrative */}
          <p className="font-sans text-brand-pale/85 text-base sm:text-lg max-w-xl leading-relaxed">
            {t("hero_lead_paragraph")}
          </p>

          {/* Dynamic Interactive Features Badge Buttons */}
          <div className="flex flex-wrap gap-3 pt-2">
            <div className="flex items-center space-x-2 bg-brand-bg/90 px-3.5 py-1.5 rounded-md border border-brand-lime/30 text-xs font-mono text-brand-lime">
              <Cpu size={14} />
              <span>REACT 19 / VITE</span>
            </div>
            <div className="flex items-center space-x-2 bg-brand-bg/90 px-3.5 py-1.5 rounded-md border border-brand-cyan/30 text-xs font-mono text-brand-cyan">
              <Compass size={14} />
              <span>3D CSS WIREFRAMES</span>
            </div>
            <div className="flex items-center space-x-2 bg-brand-bg/90 px-3.5 py-1.5 rounded-md border border-brand-pink/30 text-xs font-mono text-brand-pink">
              <Compass size={14} className="text-brand-pink" />
              <span>WEB AUDIO SYNTHS</span>
            </div>
          </div>

          {/* Instant Quick Interactive Spark Trigger Button */}
          <div className="pt-4 flex flex-col sm:flex-row gap-4">
            <a
              href="#projects"
              onClick={() => soundEngine.playClick()}
              className="px-8 py-4 bg-brand-cyan text-brand-bg hover:bg-brand-pink hover:text-white transition-all duration-300 font-display text-sm tracking-wide text-center neo-brutal-border hover:shadow-[0_0_15px_#18BEC7]"
            >
              {t("btn_explore_exhibitions")}
            </a>

            <button
              onClick={handleConfiguratorClick}
              className="px-6 py-4 bg-brand-bg text-brand-pink border-2 border-brand-pink hover:bg-brand-pink hover:text-white transition-all duration-300 font-mono text-xs tracking-wider flex items-center justify-center space-x-3 cursor-pointer hover:shadow-[0_0_15px_#FD1EB1]"
            >
              <Zap size={14} className="animate-bounce" />
              <span>
                {t("btn_trigger_sparks")} ({balloonCount})
              </span>
            </button>
          </div>
        </div>

        {/* Right Hand: 3D Configurator Terminal Module! */}
        <div className="lg:col-span-15 xl:col-span-5 h-[500px] flex flex-col justify-between p-6 bg-[#111232]/95 border-4 border-[#111232] rounded-xl neo-brutal-border-cyan relative overflow-hidden group">
          {/* CRT scanline overlay */}
          <div className="absolute inset-0 crt-overlay pointer-events-none opacity-40" />

          {/* Header Controller Bar */}
          <div className="flex items-center justify-between border-b border-brand-cyan/20 pb-4 relative z-10">
            <div className="flex space-x-1.5">
              <span
                className={`w-3.5 h-3.5 rounded-full ${accent === "pink" ? "bg-brand-pink" : accent === "lime" ? "bg-brand-lime" : "bg-brand-cyan"}`}
              />
              <div className="font-mono text-[10px] text-brand-pale/50">
                RENDER_STAGE_V1.9
              </div>
            </div>
            <div className="flex items-center space-x-2 text-xs font-mono text-brand-cyan bg-brand-bg/50 px-2.5 py-1 rounded">
              <RefreshCw
                size={11}
                className="animate-spin"
                style={{ animationDuration: "12s" }}
              />
              <span>FPS: 60.00</span>
            </div>
          </div>

          {/* Primary Render Viewer for 3D Geometry */}
          <div
            className="flex-grow flex items-center justify-center relative my-4 cursor-grab active:cursor-grabbing select-none"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUpOrLeave}
            onMouseLeave={handleMouseUpOrLeave}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleMouseUpOrLeave}
            onClick={(e) => {
              // Only trigger clicks if the user was not doing a heavy drag
              if (!isDragging) {
                handleConfiguratorClick();
              }
            }}
            title="Drag mouse/swipe to rotate the 3D space. Click to release sparks!"
          >
            {/* Canvas itself */}
            <canvas ref={canvasRef} className="w-full h-full max-h-[280px]" />

            {/* Inside Watermark */}
            <div className="absolute bottom-1 right-2 pointer-events-none">
              <div
                className={`font-mono text-[9px] uppercase select-none tracking-widest text-right transition-all duration-300 ${
                  isDragging
                    ? "text-brand-cyan animate-pulse font-extrabold [text-shadow:0_0_8px_#18BEC7]"
                    : "text-brand-pale/35"
                }`}
              >
                {t("drag_focus")}
              </div>
            </div>

            {/* Dynamic Balloon Pop alert */}
            <AnimatePresence>
              {balloonCount > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.2, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: -20 }}
                  exit={{ opacity: 0 }}
                  className="absolute p-2 pointer-events-none rounded-md bg-brand-pink text-brand-bg font-display text-[10px] uppercase border border-brand-bg z-20"
                  key={balloonCount}
                >
                  {t("pop_synth_note")}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Interactive Controller Console Row (Input Knobs) */}
          <div className="border-t border-brand-cyan/15 pt-4 flex flex-col space-y-3 relative z-10 bg-brand-bg/85 p-3 rounded-lg">
            {/* Color accent toggles */}
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] text-brand-pale/80 uppercase">
                {t("styling_tint")}
              </span>
              <div className="flex space-x-2">
                {(["pink", "cyan", "lime"] as AccentTheme[]).map((theme) => (
                  <button
                    key={theme}
                    onClick={() => {
                      setAccent(theme);
                      soundEngine.playToggleSound();
                    }}
                    className={`w-5 h-5 rounded-full border border-brand-bg cursor-pointer transition-transform duration-200 hover:scale-125 ${
                      theme === "pink"
                        ? "bg-brand-pink"
                        : theme === "lime"
                          ? "bg-brand-lime"
                          : "bg-brand-cyan"
                    } ${accent === theme ? "ring-2 ring-white scale-110" : "opacity-60"}`}
                  />
                ))}
              </div>
            </div>

            {/* Geometry Selector Toggles */}
            <div className="flex flex-col space-y-1">
              <span className="font-mono text-[9px] text-brand-pale/50 uppercase">
                {t("geometry_model")}
              </span>
              <div className="grid grid-cols-4 gap-1.5">
                {(
                  [
                    "NEXUS_CRYSTAL",
                    "HYPERCUBE",
                    "CYBERGRID",
                    "ORBITAL_RINGS",
                  ] as ShapeType[]
                ).map((sh) => (
                  <button
                    key={sh}
                    onClick={() => {
                      setActiveShape(sh);
                      soundEngine.playClick();
                    }}
                    className={`text-[8px] font-mono py-1.5 px-0.5 rounded text-center transition-all cursor-pointer truncate ${
                      activeShape === sh
                        ? "bg-brand-cyan text-brand-bg font-bold shadow"
                        : "bg-brand-bg border border-brand-pale/10 text-brand-pale hover:bg-brand-pale/10"
                    }`}
                  >
                    {sh.replace("_", " ")}
                  </button>
                ))}
              </div>
            </div>

            {/* Rotation slider */}
            <div className="flex items-center space-x-3 text-[10px] font-mono">
              <span className="text-brand-pale/60 uppercase">{t("speed")}</span>
              <input
                type="range"
                min="0.1"
                max="4"
                step="0.1"
                value={rotationSpeed}
                onChange={(e) => setRotationSpeed(parseFloat(e.target.value))}
                className="flex-grow accent-brand-pink h-1 bg-brand-bg rounded cursor-pointer"
              />
              <span className="text-brand-pink font-bold w-6 text-right font-mono">
                {rotationSpeed}x
              </span>
            </div>

            {/* Sizing scale slider */}
            <div className="flex items-center space-x-3 text-[10px] font-mono">
              <span className="text-brand-pale/60 uppercase">{t("scale")}</span>
              <input
                type="range"
                min="0.5"
                max="2.0"
                step="0.1"
                value={wireframeScale}
                onChange={(e) => setWireframeScale(parseFloat(e.target.value))}
                className="flex-grow accent-brand-lime h-1 bg-brand-bg rounded cursor-pointer"
              />
              <span className="text-brand-lime font-bold w-6 text-right font-mono">
                {wireframeScale}x
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

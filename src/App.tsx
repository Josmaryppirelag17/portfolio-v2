import React, { useState, useEffect, useRef, Suspense, lazy } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Volume2,
  VolumeX,
  Terminal,
  Heart,
  ArrowUp,
  Activity,
  Menu,
  X,
  Satellite,
  Layers,
  Globe,
  Shield,
} from "lucide-react";

import HeroPlayground from "./components/HeroPlayground";
import SectionFallback from "./components/SectionFallback";
import { soundEngine } from "./components/SoundEngine";
import { useLanguage } from "./LanguageContext";
import { usePrefersReducedMotion } from "./hooks/usePrefersReducedMotion";

const AboutSection = lazy(() => import("./components/AboutSection"));
const ExperienceTimeline = lazy(
  () => import("./components/ExperienceTimeline"),
);
const ProjectsShowcase = lazy(() => import("./components/ProjectsShowcase"));
const InteractiveSkills = lazy(() => import("./components/InteractiveSkills"));
const ContactTerminal = lazy(() => import("./components/ContactTerminal"));
const AdminConsole = lazy(() => import("./components/AdminConsole"));

// Fondo de lluvia digital en pantalla completa tipo Matrix
function MatrixRainOverlay({ onClose }: { onClose: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

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

    const matrixChars =
      "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ";
    const charsArr = matrixChars.split("");

    const fontSize = 14;
    const columns = Math.ceil(canvas.width / fontSize);

    const rainDrops: number[] = [];
    for (let x = 0; x < columns; x++) {
      rainDrops[x] = Math.floor(Math.random() * -100); // Stagger start positions
    }

    const draw = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.08)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#00FF66"; // Cyber green
      ctx.font = `bold ${fontSize}px "JetBrains Mono", monospace`;

      for (let i = 0; i < rainDrops.length; i++) {
        const text = charsArr[Math.floor(Math.random() * charsArr.length)];
        const yCoord = rainDrops[i] * fontSize;

        if (yCoord >= 0) {
          ctx.fillText(text, i * fontSize, yCoord);
        }

        if (yCoord > canvas.height && Math.random() > 0.975) {
          rainDrops[i] = 0;
        }
        rainDrops[i]++;
      }
    };

    const interval = setInterval(draw, 35);

    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [reducedMotion]);

  return (
    <div className="fixed inset-0 z-[100] bg-black text-[#00ff66] flex flex-col items-center justify-center font-mono select-none px-6">
      {!reducedMotion && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-cover opacity-85 pointer-events-none"
        />
      )}

      <div className="relative z-10 text-center space-y-6 max-w-xl p-6 sm:p-8 bg-black/95 border-3 border-[#00ff66] rounded-xl shadow-[0_0_50px_rgba(0,255,102,0.4)]">
        <h2 className="text-xl sm:text-2xl font-black tracking-widest uppercase mb-1 flex items-center justify-center space-x-2.5 animate-pulse">
          <span>⚡ MATRIX_BYPASS_ENGAGED ⚡</span>
        </h2>
        <div className="h-0.5 w-full bg-[#00ff66] mb-3" />

        <p className="text-xs text-left leading-relaxed text-[#00ff66]/90 font-mono space-y-1">
          &gt; EXECUTING SUPER-INTELLIGENT KERNEL HIJACK... SUCCESS
          <br />
          &gt; OVERRIDING COMPILER THREAD CACHE CODES: OK
          <br />
          &gt; ARCHITECTURE TINT RECONFIGURED TO NEON HACKER GREEN
          <br />
          &gt; ALL SOUND ESCALATION GATES: PRE-LIMIT AMPLIFIED
        </p>

        <div className="bg-[#051c08] p-4 rounded border border-[#00ff66]/30 font-mono text-[9px] sm:text-[10px] text-left text-[#00ff66] leading-relaxed select-all">
          SYS_OPERATOR: JOSMARY_CRYPT_MAIN
          <br />
          FUSION_CORE_TINT: LIME_OVERCLOCK_ACTIVE
          <br />
          COMPILE_HEALTH: 100% UNINTERRUPTED
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 bg-[#00ff66] text-black font-extrabold text-xs tracking-wider uppercase border-2 border-transparent hover:bg-black hover:text-[#00ff66] hover:border-[#00ff66] transition-all cursor-pointer"
        >
          [ DISMISS BYPASS INTERRUPT ]
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const reducedMotion = usePrefersReducedMotion();
  const [isAudioActive, setIsAudioActive] = useState(false);
  const [timeStr, setTimeStr] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [typedKeys, setTypedKeys] = useState("");
  const [isMatrixActive, setIsMatrixActive] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle(
      "reduce-motion-override",
      reducedMotion,
    );
  }, [reducedMotion]);

  // Sincronizar audio en la primera interacción y actualizar el reloj en tiempo real
  useEffect(() => {
    // Leer valores predeterminados del soundEngine
    setIsAudioActive(soundEngine.isEnabled());

    const updateTime = () => {
      const d = new Date();
      const formatTime =
        d.toISOString().replace("T", " ").substring(0, 19) + " UTC";
      setTimeStr(formatTime);
    };

    updateTime();
    const clockInterval = setInterval(updateTime, 1000);

    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    // Evento global de teclado para activar Matrix / Hack
    const handleKeyDown = (e: KeyboardEvent) => {
      setTypedKeys((prev) => {
        const next = (prev + e.key.toLowerCase()).slice(-20);
        if (next.includes("matrix") || next.includes("hack")) {
          setIsMatrixActive(true);
          soundEngine.playSuccess();
          soundEngine.playSynthKey(523.25); // high crisp note
          return "";
        }
        return next;
      });
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      clearInterval(clockInterval);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const toggleMasterAudio = () => {
    const newState = soundEngine.toggle();
    setIsAudioActive(newState);
    soundEngine.playToggleSound();
  };

  const handleNavClick = (anchorId: string) => {
    soundEngine.playClick();
    setIsMobileMenuOpen(false);
    const elem = document.getElementById(anchorId);
    if (elem) {
      elem.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToTop = () => {
    soundEngine.playSuccess();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-brand-bg text-[#DBEAEC] font-sans selection:bg-brand-pink selection:text-white">
      {/* Top ambient scanline indicator */}
      <div className="fixed top-0 inset-x-0 h-1.5 bg-gradient-to-r from-brand-pink via-brand-cyan to-brand-lime z-50 shadow-[0_2px_10px_rgba(24,190,199,0.3)]" />

      {/* Floating Header Navigation Bar */}
      <header className="sticky top-1.5 inset-x-0 z-40 bg-brand-bg/85 backdrop-blur-md border-b border-brand-pale/10 py-3.5 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo brand */}
          <a
            href="#inicio"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick("inicio");
            }}
            className="flex items-center space-x-2.5 group cursor-pointer border-none bg-transparent text-left no-underline"
          >
            <div className="h-9 w-9 bg-brand-pink rounded flex items-center justify-center font-display text-base text-white neon-brutal-border group-hover:bg-brand-cyan transition-colors">
              JP
            </div>
            <div className="text-left font-mono">
              <span className="block text-xs font-black tracking-widest text-[#DBEAEC]">
                JOSMARY // PIRELA
              </span>
              <span className="block text-[8.5px] text-brand-cyan uppercase tracking-wider">
                CREATIVE_ARCHITECT
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav
            className="hidden lg:flex items-center space-x-1"
            aria-label="Navegación principal"
          >
            {[
              { label: t("nav_about"), id: "about" },
              { label: t("nav_journey"), id: "experience" },
              { label: t("nav_exhibitions"), id: "projects" },
              { label: t("nav_skills"), id: "skills" },
              { label: t("nav_transmitter"), id: "contact" },
            ].map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.id);
                }}
                className="px-3 py-1.5 font-mono text-[11px] tracking-wider text-brand-pale hover:text-brand-lime hover:bg-brand-lime/10 transition-all rounded cursor-pointer border-none bg-transparent no-underline"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Real-time Ticking clock, Language Toggle & Audio Controls panel */}
          <div className="hidden sm:flex items-center space-x-3.5">
            {/* Restricted Access Terminal Trigger Button */}
            <button
              onClick={() => {
                setIsAdminOpen(true);
                soundEngine.playClick();
              }}
              className="px-2.5 py-1.5 font-mono text-[9px] font-bold tracking-widest bg-[#221021] border border-brand-pink/60 text-brand-pink hover:bg-brand-pink hover:text-white transition-all rounded shadow-[0_0_8px_rgba(253,30,177,0.15)] hover:shadow-[0_0_12px_rgba(253,30,177,0.4)] cursor-pointer flex items-center space-x-1"
              title="Decrypt Secure Administrator Operations"
            >
              <Shield size={10} className="animate-pulse" />
              <span>[ RESTRICTED_ACCESS ]</span>
            </button>

            {/* Elegant Language selector */}
            <div className="flex bg-[#111232] border border-brand-pale/10 rounded p-1 space-x-0.5">
              <button
                onClick={() => {
                  if (language !== "es") {
                    setLanguage("es");
                    soundEngine.playSuccess();
                  }
                }}
                className={`px-2 py-1 font-mono text-[9px] font-black tracking-widest transition-all cursor-pointer rounded ${
                  language === "es"
                    ? "bg-brand-lime text-brand-bg font-extrabold shadow-[0_0_8px_#DCF10B]"
                    : "text-brand-pale hover:text-white"
                }`}
                title="Cambiar idioma a Español"
              >
                ES
              </button>
              <button
                onClick={() => {
                  if (language !== "en") {
                    setLanguage("en");
                    soundEngine.playSuccess();
                  }
                }}
                className={`px-2 py-1 font-mono text-[9px] font-black tracking-widest transition-all cursor-pointer rounded ${
                  language === "en"
                    ? "bg-brand-pink text-white font-extrabold shadow-[0_0_10px_#FD1EB1]"
                    : "text-brand-pale hover:text-white"
                }`}
                title="Switch language to English"
              >
                EN
              </button>
            </div>

            {/* Clock ticker */}
            {timeStr && (
              <div className="font-mono text-[10px] text-brand-pale/50 bg-[#111232]/50 px-3 py-1.5 rounded border border-brand-pale/5 flex items-center space-x-2">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-lime animate-pulse" />
                <span>
                  {t("sys_time")}:{" "}
                  <span className="text-[#DBEAEC] font-semibold">
                    {timeStr}
                  </span>
                </span>
              </div>
            )}

            {/* Navbar Audio toggle */}
            <button
              onClick={toggleMasterAudio}
              className={`p-2.5 rounded border-2 cursor-pointer transition-all duration-300 ${
                isAudioActive
                  ? "bg-brand-pink border-brand-pink text-white shadow-[0_0_10px_#FD1EB1] animate-pulse"
                  : "bg-brand-bg border-brand-cyan/30 text-brand-cyan hover:bg-brand-cyan/10"
              }`}
              title={t("audio_tooltip")}
            >
              {isAudioActive ? <Volume2 size={15} /> : <VolumeX size={15} />}
            </button>
          </div>

          {/* Mobile menu and toggles wrapper */}
          <div className="flex items-center space-x-2 lg:hidden">
            {/* Mobile language switch inline */}
            <div className="flex bg-[#111232] border border-brand-pale/10 rounded p-1 space-x-0.5">
              <button
                onClick={() => {
                  if (language !== "es") {
                    setLanguage("es");
                    soundEngine.playSuccess();
                  }
                }}
                className={`px-2 py-0.5 font-mono text-[8.5px] font-bold transition-all ${
                  language === "es"
                    ? "bg-brand-lime text-brand-bg rounded-xs"
                    : "text-brand-pale"
                }`}
              >
                ES
              </button>
              <button
                onClick={() => {
                  if (language !== "en") {
                    setLanguage("en");
                    soundEngine.playSuccess();
                  }
                }}
                className={`px-2 py-0.5 font-mono text-[8.5px] font-bold transition-all ${
                  language === "en"
                    ? "bg-brand-pink text-white rounded-xs"
                    : "text-brand-pale"
                }`}
              >
                EN
              </button>
            </div>

            {/* Inline audio toggle on mobile too */}
            <button
              onClick={toggleMasterAudio}
              className={`p-2 rounded border-2 cursor-pointer ${
                isAudioActive
                  ? "bg-brand-pink border-brand-pink text-white"
                  : "bg-brand-bg border-brand-cyan/30 text-brand-cyan"
              }`}
            >
              {isAudioActive ? <Volume2 size={13} /> : <VolumeX size={13} />}
            </button>

            <button
              onClick={() => {
                soundEngine.playClick();
                setIsMobileMenuOpen(!isMobileMenuOpen);
              }}
              className="p-2 bg-brand-bg border border-brand-pale/10 rounded text-brand-pale cursor-pointer"
            >
              {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu Overlays */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-x-0 top-[70px] bg-[#111232] border-b-4 border-brand-pink z-30 p-6 flex flex-col space-y-4 shadow-xl lg:hidden"
          >
            {/* Mobile Restricted Access Button */}
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsAdminOpen(true);
                soundEngine.playClick();
              }}
              className="w-full text-center py-2.5 bg-[#221021] border border-brand-pink text-brand-pink font-mono text-xs rounded uppercase flex items-center justify-center space-x-2"
            >
              <Shield size={13} className="text-brand-pink animate-pulse" />
              <span>[ RESTRICTED_ACCESS ]</span>
            </button>

            {[
              { label: t("nav_about_mobile"), id: "about" },
              { label: t("nav_journey_mobile"), id: "experience" },
              { label: t("nav_exhibitions_mobile"), id: "projects" },
              { label: t("nav_skills_mobile"), id: "skills" },
              { label: t("nav_transmitter_mobile"), id: "contact" },
            ].map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.id);
                }}
                className="w-full text-left font-mono text-sm py-2.5 border-b border-brand-pale/5 hover:text-brand-lime transition-colors bg-transparent border-none no-underline block text-brand-pale"
              >
                {link.label}
              </a>
            ))}

            <div className="pt-2">
              <div className="font-mono text-[10px] text-brand-pale/40 uppercase">
                {t("sys_time")}: {timeStr}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Container Sections */}
      <main className="relative">
        {/* Hero: carga inmediata (LCP) */}
        <HeroPlayground />

        <Suspense fallback={<SectionFallback />}>
          <AboutSection />
        </Suspense>

        <Suspense fallback={<SectionFallback />}>
          <ExperienceTimeline />
        </Suspense>

        <Suspense fallback={<SectionFallback />}>
          <ProjectsShowcase />
        </Suspense>

        <Suspense fallback={<SectionFallback />}>
          <InteractiveSkills />
        </Suspense>

        <Suspense fallback={<SectionFallback />}>
          <ContactTerminal />
        </Suspense>
      </main>

      {/* Aesthetic Cyberpunk Footer */}
      <footer className="bg-[#111232] border-t-4 border-[#111232] py-12 px-6 relative overflow-hidden">
        <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-brand-lime via-brand-cyan to-brand-pink" />

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Full architectural technology signature log deck */}
          <div className="w-full border-b border-brand-pale/10 pb-6 mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-mono text-[9.5px] tracking-wider text-left">
              <div className="bg-brand-bg/80 p-3.5 rounded border border-brand-pale/10 text-left">
                <span className="text-brand-pink block mb-0.5 uppercase tracking-widest font-extrabold text-[8px]">
                  DEPLOYED_ON:
                </span>
                <span className="text-[#DBEAEC] font-bold">
                  Vercel & Cloud Run Edge
                </span>
              </div>
              <div className="bg-brand-bg/80 p-3.5 rounded border border-brand-pale/10 text-left">
                <span className="text-[#18BEC7] block mb-0.5 uppercase tracking-widest font-extrabold text-[8px]">
                  ARCHITECTURE:
                </span>
                <span className="text-[#DBEAEC] font-bold">
                  Serverless Edge Functions
                </span>
              </div>
              <div className="bg-brand-bg/80 p-3.5 rounded border border-brand-pale/10 text-left">
                <span className="text-brand-lime block mb-0.5 uppercase tracking-widest font-extrabold text-[8px]">
                  DATABASE:
                </span>
                <span className="text-[#DBEAEC] font-bold">
                  Supabase (PostgreSQL)
                </span>
              </div>
              <div className="bg-brand-bg/80 p-3.5 rounded border border-brand-lime/20 text-left flex items-center justify-between">
                <div>
                  <span className="text-brand-lime block mb-0.5 uppercase tracking-widest font-extrabold text-[8px]">
                    SYS_STATUS:
                  </span>
                  <span className="text-brand-lime font-bold">OPERATIONAL</span>
                </div>
                <span className="h-2 w-2 rounded-full bg-brand-lime animate-ping" />
              </div>
            </div>
          </div>

          <nav aria-label="Enlaces profesionales" className="sr-only">
            <a href="https://github.com/josmary">GitHub — Josmary Pirela</a>
          </nav>

          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Left: Branding */}
            <div className="flex items-center space-x-3 text-left">
              <div className="font-display text-sm tracking-wider text-brand-pink">
                JOSMARY.DEV // 2026
              </div>
              <span className="text-brand-pale/40 font-mono text-xs">|</span>
              <div className="font-mono text-[10px] text-brand-pale/50 uppercase">
                {t("rebuilt_paracas")}
              </div>
            </div>

            {/* Right: Credits and Love signatures */}
            <div className="flex items-center space-x-4">
              <div className="font-mono text-[10px] text-brand-pale/60 flex items-center space-x-1.5 bg-[#090b1c] px-3 py-1.5 rounded border border-brand-pale/10">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-cyan animate-pulse" />
                <span>STABILITY: {t("compiler_stable")}</span>
              </div>

              {/* Back to top dynamic button */}
              <button
                onClick={scrollToTop}
                className="p-3 bg-brand-bg text-brand-cyan hover:bg-brand-pink hover:text-white transition-all rounded cursor-pointer neo-brutal-border"
                title="Return coordinates to apex"
              >
                <ArrowUp size={14} />
              </button>
            </div>
          </div>
        </div>
      </footer>

      <Suspense fallback={null}>
        <AdminConsole
          isOpen={isAdminOpen}
          onClose={() => setIsAdminOpen(false)}
        />
      </Suspense>
      {isMatrixActive && (
        <MatrixRainOverlay onClose={() => setIsMatrixActive(false)} />
      )}
    </div>
  );
}

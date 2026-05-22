import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ExternalLink, Github, Code, Flame, Sparkles, AlertCircle, Cpu, Play } from "lucide-react";
import { useLanguage } from "../LanguageContext";
import { soundEngine } from "./SoundEngine";

export default function ProjectsShowcase() {
  const { projects, t } = useLanguage();
  const [activeConsoleTab, setActiveConsoleTab] = useState<"MANIFEST" | "LOGS">("MANIFEST");

  const [selectedProjectId, setSelectedProjectId] = useState<string>(projects[0]?.id || "polyform-3d");

  const selectedProject = projects.find((p) => p.id === selectedProjectId) || projects[0] || {
    id: "polyform-3d",
    title: "Polyform 3D Engine",
    category: "Creative Frontend & Canvas",
    description: "An interactive, browser-based WebGL procedural shape customizer.",
    longDescription: "",
    techStack: [],
    features: [],
    githubUrl: "",
    liveUrl: "",
    imageGlowColor: "#18BEC7",
    accentColor: "brand-cyan"
  };

  const handleProjectSelect = (id: string) => {
    setSelectedProjectId(id);
    soundEngine.playClick();
  };

  const getProjectCodeSnippet = (project: any) => {
    return `// config/manifest.json
{
  "project_name": "${project.title}",
  "architecture": "Full-Stack Serverless Cluster",
  "engine_ports": [80, 443, 3000],
  "modules": ${JSON.stringify(project.techStack)},
  "optimization_level": "PREMIUM_JIT",
  "build_healthy": true,
  "active_deployment": "${project.id}.josmarypirela.dev"
}`;
  };

  const getProjectLogs = (project: any) => {
    switch (project.id) {
      case "polyform-3d":
        return `// logs/server_logs.txt (LIVE CONTAINER OUTPUT)
[POSTGRES_DB]: Connecting to cluster_01_poly3d @ pool.paracas.internal... SUCCESS
[POOL]: Managed pool limits allocated: 45 concurrent pipeline connections.
[KAFKA_STREAM]: Subscribing to topic 'geometry-generation-vectors'... OK
[API_ROUTER]: POST /api/v1/generator/crystal - 200 OK (32ms)
[REDIS]: Cache MISS for key 'mesh_noise_vertex_102'. Regenerating GLSL noise buffer.
[API_ROUTER]: GET /api/v1/generator/polyform-3d/latest - 200 OK (14ms)
[MEMOIZER]: Extrapolating 1,480 vertices onto 3D boundary grid (3ms)
[SYS_MONITOR]: Engine healthy. CPU load: 12% | Memory allocated: 244MB.`;
      case "neon-vibe-synth":
        return `// logs/server_logs.txt (LIVE CONTROLLER AUDIOPROCESS_THREAD)
[POSTGRES_DB]: Connecting to scale_presets_db @ cluster_sound.db... SUCCESS
[PRESETS_API]: Queried 24 custom outrun synthesizer preset waves in 4.5ms.
[API_ROUTER]: GET /api/v1/presets - 200 OK (16ms)
[WEBAUDIO_SERVER]: Web Audio thread initialized on Audio DSP Core 2 (DSP_OK)
[GAIN_NODE_REDUX]: Guarded peak output; safe limiter compression ceiling: -1.5dB
[API_ROUTER]: POST /api/v1/recordings/export - 201 Created (114ms)
[SYS_MONITOR]: Web Audio socket pipeline: STATUS_OPERATIONAL. No jitter.`;
      case "hyper-chat-auth":
        return `// logs/server_logs.txt (LIVE ACCESS AUTHSTREAM)
[POSTGRES_DB]: Connecting to user_credentials_primary @ maincluster_secure_db... SUCCESS
[REDIS]: Fetching active key index 'matrix_coords_992' - Gestural Token verified
[WEBSOCKET_SRV]: TLS Upgrade requested for Client ID _usr_889a74bcd... COMPLETE
[API_ROUTER]: POST /api/v1/auth/pattern-match - 200 OK (22ms)
[WEBSOCKET_SRV]: Broadcast pattern coords to 14 active listening telemetry channels
[API_ROUTER]: GET /api/v1/history/hypersphere - 200 OK (45ms)
[SYS_MONITOR]: DB Active connections checklist: 1,480 concurrent active sockets.`;
      default:
        return `// logs/server_logs.txt
[POSTGRES_DB]: Connecting to cluster_01 @ db.internal... SUCCESS
[API_ROUTER]: GET /api/v1/products - 200 OK (24ms)
[SYS_STATUS]: Healthy.`;
    }
  };

  return (
    <section id="projects" className="py-20 bg-brand-bg border-b-4 border-brand-bg relative overflow-hidden cyber-grid">
      
      {/* Background glowing filters */}
      <div className="absolute top-[30%] left-[-10%] w-[450px] h-[450px] glow-spot-cyan opacity-15" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[450px] h-[450px] glow-spot-pink opacity-20" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Title */}
        <div className="flex flex-col mb-16 items-center text-center">
          <div className="flex items-center space-x-2 text-brand-pink font-mono text-xs tracking-widest uppercase mb-2">
            <Flame size={14} className="animate-pulse text-brand-pink" />
            <span>{t("exhibition_system_file")}</span>
          </div>
          <h2 className="text-5xl sm:text-6xl tracking-tight uppercase italic text-transparent font-bold select-none text-center" style={{ fontFamily: '"Arial Black", "Syne", sans-serif', WebkitTextStroke: "2px #FD1EB1" }}>
            {t("exhibition_heading")}
          </h2>
          <p className="font-sans text-brand-pale/75 text-sm sm:text-base max-w-xl mt-3 leading-relaxed text-center">
            {t("exhibition_subtitle")}
          </p>
          <div className="h-1.5 w-36 bg-brand-pink mt-4" />
        </div>

        {/* Core Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          
          {/* Left Column: Cyber Interactive Selection Nodes */}
          <div className="lg:col-span-12 xl:col-span-5 flex flex-col space-y-4">
            <span className="font-mono text-[9px] text-brand-pale/50 uppercase tracking-widest px-2 text-left">
              SELECT_TELEMETRY_STREAM_NODE:
            </span>

            <div className="space-y-4">
              {projects.map((p) => {
                const isActive = p.id === selectedProjectId;
                const borderClass = p.accentColor === "brand-pink" 
                  ? "hover:border-brand-pink/50" 
                  : p.accentColor === "brand-lime" 
                  ? "hover:border-brand-lime/50" 
                  : "hover:border-brand-cyan/50";
                
                return (
                  <button
                    key={p.id}
                    onClick={() => handleProjectSelect(p.id)}
                    className={`w-full text-left p-5 rounded-xl border-3 transition-all duration-300 relative overflow-hidden flex flex-col space-y-2.5 cursor-pointer ${
                      isActive
                        ? p.accentColor === "brand-pink"
                          ? "bg-[#111232]/95 border-brand-pink shadow-[0_0_15px_rgba(253,30,177,0.3)]"
                          : p.accentColor === "brand-lime"
                          ? "bg-[#111232]/95 border-brand-lime shadow-[0_0_15px_rgba(220,241,11,0.3)]"
                          : "bg-[#111232]/95 border-brand-cyan shadow-[0_0_15px_rgba(24,190,199,0.3)]"
                        : "bg-brand-bg/85 border-brand-pale/10 text-brand-pale/80 " + borderClass
                    }`}
                  >
                    {/* Visual accent color pill */}
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] tracking-widest text-[#18BEC7] uppercase">
                        // {p.id}.sys
                      </span>
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                        isActive 
                          ? p.accentColor === "brand-pink" ? "bg-brand-pink text-white" : p.accentColor === "brand-lime" ? "bg-brand-lime text-brand-bg" : "bg-brand-cyan text-brand-bg"
                          : "bg-brand-bg text-brand-pale/50"
                      }`}>
                        {p.category}
                      </span>
                    </div>

                    <h3 className="font-display text-base tracking-wide uppercase text-brand-pale group-hover:text-white select-none text-left font-bold">
                      {p.title}
                    </h3>

                    <p className="font-sans text-xs text-brand-pale/75 leading-relaxed line-clamp-2 text-left">
                      {p.description}
                    </p>

                    {/* Simple spec tags */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {p.techStack.slice(0, 3).map((tItem, idx) => (
                        <span key={idx} className="font-mono text-[8px] tracking-wider text-brand-pale/60 bg-brand-bg/40 px-1.5 py-0.5 rounded border border-brand-pale/5">
                          {tItem}
                        </span>
                      ))}
                      {p.techStack.length > 3 && (
                        <span className="font-mono text-[8px] text-brand-cyan">
                          +{p.techStack.length - 3} more
                        </span>
                      )}
                    </div>

                    {/* Indicator corner flare */}
                    {isActive && (
                      <div className="absolute top-0 right-0 h-10 w-10 overflow-hidden pointer-events-none">
                        <div className={`absolute top-[-10px] right-[-10px] h-6 w-12 rotate-45 ${
                          p.accentColor === "brand-pink" ? "bg-brand-pink" : p.accentColor === "brand-lime" ? "bg-brand-lime" : "bg-brand-cyan"
                        }`} />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Immersive Large CRT Monitor Project Detail Card */}
          <div className="lg:col-span-12 xl:col-span-7 flex flex-col">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedProjectId}
                initial={{ opacity: 0, scale: 0.98, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.98, x: -25 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="w-full h-full p-6 bg-[#111232]/95 border-4 border-[#111232] rounded-xl relative overflow-hidden flex flex-col justify-between"
                style={{
                  boxShadow: `0 0 25px ${selectedProject.imageGlowColor}33`,
                  borderColor: selectedProject.imageGlowColor
                }}
              >
                {/* CRT Screen scanline overlay */}
                <div className="absolute inset-0 crt-overlay pointer-events-none opacity-30" />

                {/* Section Top Header bar */}
                <div className="flex items-center justify-between border-b border-brand-pale/15 pb-4 mb-4 relative z-10">
                  <div className="flex items-center space-x-2.5">
                    <span className="w-2.5 h-2.5 rounded-full animate-ping" style={{ backgroundColor: selectedProject.imageGlowColor }} />
                    <span className="font-mono text-xs text-brand-pale font-bold uppercase tracking-wider">
                      CONSOLE // {selectedProject.title}
                    </span>
                  </div>
                  <div className="font-mono text-[9px] text-[#18BEC7] bg-brand-bg/60 px-2 py-0.5 rounded">
                    SYS_LOAD: GREEN_PASS
                  </div>
                </div>

                {/* Inside Body Content scroll area */}
                <div className="space-y-5 flex-grow relative z-10 text-left">
                  
                  {/* Category Banner */}
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-display text-brand-pale uppercase text-left font-semibold">
                      {selectedProject.title}
                    </span>
                    <span className="font-mono text-[10px] px-3 py-1 rounded-full text-[#111232] font-extrabold" style={{ backgroundColor: selectedProject.imageGlowColor }}>
                      {selectedProject.category}
                    </span>
                  </div>

                  {/* Fully rich summary paragraph */}
                  <p className="font-sans text-brand-pale/90 text-sm leading-relaxed text-left">
                    {selectedProject.longDescription}
                  </p>

                  {/* Core Features bullets */}
                  <div className="space-y-2 bg-brand-bg/50 p-4 rounded-lg border border-brand-pale/10 text-left">
                    <div className="font-mono text-[9px] text-brand-pale/50 uppercase tracking-widest mb-1.5 flex items-center space-x-1 text-left">
                      <Code size={11} className="text-brand-cyan" />
                      <span>{t("project_features_title")}</span>
                    </div>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-left">
                      {selectedProject.features.map((feature: string, i: number) => (
                        <li key={i} className="flex items-start space-x-1.5 text-xs font-sans text-brand-pale/85 text-left">
                          <span className="text-brand-pink shrink-0 mt-0.5">✦</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Tech stack items row */}
                  <div className="space-y-1.5 text-left">
                    <div className="font-mono text-[9px] text-brand-pale/50 uppercase tracking-widest text-left">
                      DEPLOYED_MODULES_USED:
                    </div>
                    <div className="flex flex-wrap gap-2 text-left">
                      {selectedProject.techStack.map((tech: string, idx: number) => (
                        <span key={idx} className="font-mono text-[10px] tracking-wider text-brand-bg font-extrabold bg-[#DBEAEC] px-2.5 py-1 rounded">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Interactive mock code parameter dashboard block */}
                  <div className="mt-4 text-left">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                      <div className="font-mono text-[9px] text-brand-lime/80 uppercase tracking-widest text-left">
                        CONTAINER_CONSOLE_READER:
                      </div>
                      
                      <div className="flex space-x-2 font-mono text-[9.5px]">
                        <button
                          type="button"
                          onClick={() => { setActiveConsoleTab("MANIFEST"); soundEngine.playClick(); }}
                          className={`px-2.5 py-1 rounded border transition-all cursor-pointer ${
                            activeConsoleTab === "MANIFEST"
                              ? "bg-brand-cyan/15 text-brand-cyan border-brand-cyan/30 shadow-[0_0_8px_rgba(24,190,199,0.2)] font-bold"
                              : "text-brand-pale/40 border-brand-pale/10 hover:text-brand-pale hover:border-brand-pale/25"
                          }`}
                        >
                          [ manifest.json ]
                        </button>
                        <button
                          type="button"
                          onClick={() => { setActiveConsoleTab("LOGS"); soundEngine.playClick(); }}
                          className={`px-2.5 py-1 rounded border transition-all cursor-pointer ${
                            activeConsoleTab === "LOGS"
                              ? "bg-brand-lime/15 text-brand-lime border-brand-lime/30 shadow-[0_0_8px_rgba(220,241,11,0.2)] font-bold"
                              : "text-brand-pale/40 border-brand-pale/10 hover:text-brand-lime hover:border-brand-lime/25"
                          }`}
                        >
                          [ server_logs.txt ]
                        </button>
                      </div>
                    </div>

                    <pre className={`p-3 bg-brand-bg rounded border overflow-x-auto leading-relaxed select-all font-mono text-[9.5px] transition-all duration-300 ${
                      activeConsoleTab === "MANIFEST" 
                        ? "border-brand-cyan/25 text-brand-cyan" 
                        : "border-brand-lime/25 text-[#1ade1a]"
                    }`}>
                      <code>
                        {activeConsoleTab === "MANIFEST" 
                          ? getProjectCodeSnippet(selectedProject)
                          : getProjectLogs(selectedProject)
                        }
                      </code>
                    </pre>
                  </div>

                </div>

                {/* Footer buttons row */}
                <div className="border-t border-brand-pale/15 pt-5 mt-5 flex items-center justify-between relative z-10">
                  <span className="font-mono text-[9px] text-brand-pale/40 uppercase">
                    SYS_BUILD_DATE // 05_2026:OK
                  </span>

                  <div className="flex space-x-3">
                    <a
                      href={selectedProject.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => soundEngine.playClick()}
                      className="flex items-center space-x-2 px-4 py-2 bg-brand-bg text-brand-pale border border-brand-pale/15 hover:border-brand-pink hover:text-brand-pink transition-all text-xs font-mono"
                    >
                      <Github size={13} />
                      <span>{t("btn_github_repo")}</span>
                    </a>

                    {selectedProject.liveUrl ? (
                      <a
                        href={selectedProject.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => {
                          soundEngine.playSuccess();
                        }}
                        className="flex items-center space-x-2 px-5 py-2 text-brand-bg font-extrabold hover:opacity-90 transition-all text-xs font-mono"
                        style={{ backgroundColor: selectedProject.imageGlowColor }}
                      >
                        <ExternalLink size={13} />
                        <span>{t("btn_live_view")}</span>
                      </a>
                    ) : null}
                  </div>
                </div>

              </motion.div>
            </AnimatePresence>
          </div>

        </div>

      </div>
    </section>
  );
}

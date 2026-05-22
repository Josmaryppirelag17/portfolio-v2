/**
 * Types & Data Definitions
 * Josmary Pirela - Hyper-Pop Cyber-Portfolio
 */

export type Language = "es" | "en";

export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  longDescription: string;
  techStack: string[];
  liveUrl: string;
  githubUrl: string;
  imageGlowColor: string; // Tailwind glow or custom color Hex
  accentColor: string; // e.g., 'brand-pink'
  features: string[];
}

export interface CareerMilestone {
  id: string;
  period: string;
  role: string;
  company: string;
  description: string;
  bullets: string[];
  tags: string[];
}

export interface SkillItem {
  name: string;
  category: "Frontend" | "Backend" | "DevOps & Tools" | "Creative & 3D";
  level: number; // 0 to 100
  color: string; // brand-pink, brand-cyan, brand-lime
  iconName: string;
}

export const PROJECTS_DATA: Project[] = [
  {
    id: "polyform-3d",
    title: "Polyform 3D Engine",
    category: "Creative Frontend & Canvas",
    description: "An interactive, browser-based WebGL procedural shape customizer and crystal renderer.",
    longDescription: "A gorgeous, high-performance editor that allows creators to procedurally design, twist, and deform 3D crystals and structures using customized shader matrices. Leverages modern rendering strategies for absolute zero-lag interactions on mobile and desktop.",
    techStack: ["React", "Three.js", "Zustand", "GLSL Shaders", "Tailwind CSS"],
    liveUrl: "",
    githubUrl: "https://github.com/josmary/polyform-3d",
    imageGlowColor: "#18BEC7",
    accentColor: "brand-cyan",
    features: [
      "Custom procedural GLSL noise deformation",
      "Real-time mouse-reactive vertex manipulation",
      "High-fidelity metalness and neon ambient lighting rigs",
      "Instant SVG/OBJ exports for visual designers"
    ]
  },
  {
    id: "neon-vibe-synth",
    title: "Retro Cyber-Synth",
    category: "Web Audio & Synths",
    description: "Multi-waveform modular digital synthesizer with a reactive pixelated matrix step-sequencer.",
    longDescription: "An in-browser digital polyphonic synthesizer built entirely on native Web Audio API oscillators. Features a fully custom retro visualizer, visual knobs with inertial dragging, low-pass filter controls, and interactive neon drum trigger pads.",
    techStack: ["TypeScript", "Web Audio API", "HTML5 Canvas", "Motion", "CSS Grids"],
    liveUrl: "",
    githubUrl: "https://github.com/josmary/retro-cyber-synth",
    imageGlowColor: "#FD1EB1",
    accentColor: "brand-pink",
    features: [
      "Polyphonic rendering with custom envelope ADSR controls",
      "Dynamic pixel art visualizer reacting to band frequency buffers",
      "Binaural spatial pan sliders",
      "Instant recording capability and WAV exporter"
    ]
  },
  {
    id: "hyper-chat-auth",
    title: "HyperSphere Network",
    category: "Full Stack & Real-time",
    description: "Ultra-secure real-time matrix messaging system featuring custom zero-knowledge visual authentication keys.",
    longDescription: "A robust, high-throughput terminal chat room styled with hyper-pop interfaces. Messages are encrypted end-to-end, and login runs via custom drag-and-drop pattern-recognition sequences instead of plain text passwords.",
    techStack: ["Next.js", "Node.js", "WebSockets", "Redis", "Tailwind CSS"],
    liveUrl: "",
    githubUrl: "https://github.com/josmary/hypersphere",
    imageGlowColor: "#DCF10B",
    accentColor: "brand-lime",
    features: [
      "WebSocket event multiplexing for real-time state broadcasts",
      "Visual grid gesture lock screen acting as crypto signature seed",
      "Persistent state with Redis ring arrays",
      "Cyber-retro themes dynamically configurable on the fly"
    ]
  }
];

export const EXPERIENCE_DATA: CareerMilestone[] = [
  {
    id: "exp-1",
    period: "2024 - PRESENT",
    role: "Lead Creative Frontend Architect",
    company: "VibeWave Interactive",
    description: "Designing hyper-immersive digital products and leading engineering for high-traffic promotional pipelines with absolute focus on custom canvas visualizations.",
    bullets: [
      "Built custom in-browser visual configurators driving a 140% spike in user interaction metrics.",
      "Optimized production bundle delivery sizes, shrinking load times by 45% using advanced tree-shaking and client-side memory recycling.",
      "Established modular design systems pairing physics engines with highly responsive Tailwind setups."
    ],
    tags: ["React", "Motion", "Tailwind v4", "Canvas API", "Performance Optimization"]
  },
  {
    id: "exp-2",
    period: "2022 - 2024",
    role: "Senior Full-Stack Developer",
    company: "NeonPulse Labs",
    description: "Engineered robust reactive user interfaces, high-fidelity landing portfolios, and persistent data engines.",
    bullets: [
      "Developed modular UI component packages utilized across 6 separate partner engineering streams.",
      "Architected reliable real-time updates and low-latency API routes handling substantial peak concurrent user requests.",
      "Mentored junior engineers on custom CSS-3D tricks and responsive viewport setups."
    ],
    tags: ["Next.js", "TypeScript", "Node.js", "Web Audio API", "CSS 3D"]
  },
  {
    id: "exp-3",
    period: "2020 - 2022",
    role: "Creative UI Engineer",
    company: "Apex Digital Studios",
    description: "Authored gorgeous storytelling websites, 2D physics puzzles, and highly aesthetic mock designs for luxury brands.",
    bullets: [
      "Crafted smooth interactive animations that won two CSS design award listings.",
      "Ensured high-contrast grade scale compliance, providing seamless accessibility configurations.",
      "Integrated lightweight server rendering pipelines with Vite based microservers."
    ],
    tags: ["HTML Canvas", "Vite", "Sass", "GreenSock GSAP", "Aesthetic UI Design"]
  }
];

export const SKILLS_DATA: SkillItem[] = [
  // Frontend
  { name: "React / React 19", category: "Frontend", level: 98, color: "brand-cyan", iconName: "React" },
  { name: "Next.js Framework", category: "Frontend", level: 95, color: "brand-pink", iconName: "Nextjs" },
  { name: "TypeScript", category: "Frontend", level: 96, color: "brand-cyan", iconName: "TypeScript" },
  { name: "Tailwind CSS v4 & JIT", category: "Frontend", level: 99, color: "brand-lime", iconName: "Tailwind" },
  { name: "CSS 3D / Preservation", category: "Frontend", level: 90, color: "brand-pink", iconName: "Layers" },

  // Backend
  { name: "Node.js & Express", category: "Backend", level: 92, color: "brand-cyan", iconName: "Node" },
  { name: "RESTful & GraphQL APIs", category: "Backend", level: 88, color: "brand-lime", iconName: "Server" },
  { name: "WebSockets / Real-time", category: "Backend", level: 94, color: "brand-pink", iconName: "Radio" },
  { name: "PostgreSQL / Redis", category: "Backend", level: 85, color: "brand-cyan", iconName: "Database" },

  // DevOps & Tools
  { name: "Vite / Esbuild", category: "DevOps & Tools", level: 95, color: "brand-lime", iconName: "Cpu" },
  { name: "Docker Systems", category: "DevOps & Tools", level: 82, color: "brand-pink", iconName: "Box" },
  { name: "Git & Monorepos", category: "DevOps & Tools", level: 94, color: "brand-cyan", iconName: "GitBranch" },

  // Creative & 3D
  { name: "Three.js / Canvas API", category: "Creative & 3D", level: 91, color: "brand-pink", iconName: "Sparkles" },
  { name: "Motion & Keyframes", category: "Creative & 3D", level: 96, color: "brand-lime", iconName: "Flame" },
  { name: "Web Audio Synthesizer", category: "Creative & 3D", level: 89, color: "brand-cyan", iconName: "Music" },
];

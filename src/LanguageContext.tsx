import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import type { Language } from "./types";
import {
  applyHead,
  readLanguageFromUrl,
  writeLanguageToUrl,
} from "./seo/applyHead";

export type { Language } from "./types";

interface TranslationDictionary {
  [key: string]: string;
}

const esTranslations: TranslationDictionary = {
  // Navegación
  nav_about: "//_SOBRE MÍ",
  nav_journey: "//_TRAYECTORIA",
  nav_exhibitions: "//_EXHIBICIONES",
  nav_skills: "//_HABILIDADES",
  nav_transmitter: "//_TRANSMISOR",
  nav_about_mobile: "//_SOBRE MÍ BIO",
  nav_journey_mobile: "//_TRAYECTORIA HISTÓRICA",
  nav_exhibitions_mobile: "//_PROYECTOS DE EXHIBICIÓN",
  nav_skills_mobile: "//_HABILIDADES MATRICIALES",
  nav_transmitter_mobile: "//_TRANSMITIR MENSAJE",
  sys_time: "HORA_SISTEMA",
  compiler_stable: "COMPILACIÓN_ESTABLE",
  rebuilt_paracas: "RECONSTRUIDO CON BRILLO RETRO-POP EN REACT",

  // Controles de audio
  audio_synths_active: "AUDIO: SINTETIZADORES ACTIVO",
  audio_synths_off: "AUDIO: AUDIO APAGADO",
  audio_tooltip: "Haz clic para activar señales de audio sintetizadas pop",

  // Sección Hero
  hero_title_accent: "ESTILO POP ART!",
  hero_lead_paragraph:
    "Soy una Desarrolladora Full-Stack Creativa diseñando productos visuales interactivos y altamente optimizados. Rediseñando sitios web estáticos en entornos de alto rendimiento, visualmente explosivos, con físicas retrofuturistas y paisajes sonoros sintetizados.",
  btn_explore_exhibitions: "EXPLORAR EXHIBICIONES",
  btn_trigger_sparks: "ACTIVAR DESTELLOS CYBER POP",
  pop_synth_note: "⚡ ¡NOTA SINTETIZADA LIBERADA!",
  styling_tint: "TINTE DE ESTILO:",
  geometry_model: "MODELO GEOMÉTRICO ACTIVO:",
  drag_focus: "ARRASTRA MOUSE / CLIC EN CANVAS",
  speed: "VELOCIDAD:",
  scale: "ESCALA:",

  // Sección Acerca de
  about_system_file: "[ ARCHIVO_SISTEMA: JOSMARY_BIO.SYS ]",
  about_heading: "¿QUIÉN ES JOSMARY?",
  boost_interactivity:
    "HAZ CLIC PARA ACTUALIZAR ATRIBUTOS (DIVERSIÓN INTERACTIVA!)",
  tab_bio: "// BIO",
  tab_philosophy: "// FILOSOFÍA",
  tab_vibes: "// VIBRAS",
  philosophy_title: "Dominio Estético Interactivo",
  philosophy_p1:
    "Los sitios web no deberían ser archivos PDF estáticos. Deberían ser campos de juego digitales táctiles. Cada botón, formulario y hover es una oportunidad para generar respuestas físicas usando sintetizadores de sonido y animaciones dinámicas.",
  philosophy_quote: '"Hazlo fuerte, hazlo rápido y hazlo inolvidable."',
  vibes_stationary_title: "PREFERENCIAS",
  vibes_stationary:
    "Retro-consolas cyberpunk, Glitches de neón, Shaders de lienzo",
  vibes_tunes_title: "MÚSICA",
  vibes_tunes: "Synthwave, Vaporwave, Archivos MIDI polifónicos",
  vibes_drinks_title: "BEBIDAS",
  vibes_drinks: "Cold Brew Doble Carga, Té matcha bubble y Espresso helado",
  vibes_hobbies_title: "PASATIEMPOS",
  vibes_hobbies:
    "Animaciones de física procedimental, Teclados mecánicos modulares",
  visual_polish: "Pulido Visual y Estética",
  code_efficiency: "Código Limpio y Lógica Eficiente",
  audio_synths: "Obsesión por Sintetizadores Web Audio",
  caffeine_burn: "Niveles de Cafeína en Sangre",

  // Sección Cronología / Trayectoria
  journey_system_file: "[ HILO_TEMPORAL: PARADIGMAS_HISTORIAL.LOG ]",
  journey_heading: "MI TRAYECTORIA",
  journey_subtitle: "LOGS DE OPERACIÓN CRONOLÓGICA",
  btn_filter_all: "// VER TODO",
  btn_filter_tags: "// FILTRAR POR COMPONENTES:",
  timeline_active_years: "AÑOS OPERATIVOS:",

  // Sección Proyectos / Exhibición
  exhibition_system_file: "[ COMPILACIÓN: ARCHIVOS_MULTIPERSONAL.OBJ ]",
  exhibition_heading: "GALERÍA DE PROYECTOS",
  exhibition_subtitle: "SISTEMAS EXCLUSIVOS DESPLEGADOS",
  tags_label: "COMPONENTES USADOS:",
  btn_live_view: "ENTRAR AL MUNDO LIVE",
  btn_view_details: "ABRIR DOCUMENTO INTEGRAL",
  btn_github_repo: "REPOSITORIO EN GITHUB",
  project_features_title: "ESPECIFICACIONES DE ARQUITECTURA:",
  btn_close_details: "_CERRAR_DOCK",

  // Sección Habilidades Interactivas
  skills_system_file: "[ REGISTRO: CONJUNTO_LOGS_NÚCLEO.DAT ]",
  skills_heading: "HABILIDADES INTEGRADAS",
  skills_subtitle: "Tecnologías aplicadas en proyectos reales y personales",
  skills_hover_hint:
    "Pasa el mouse sobre los núcleos para emitir frecuencias sinusoidales resonantes y ver la tasa de asimilación.",
  level_label: "TASA DE ASIMILACIÓN:",
  skill_levelled: "¡NIVEL AUMENTADO!",
  skill_click_tip: "CLIC PARA SUBIR DE NIVEL",
  skills_disclaimer:
    "Tecnologías usadas en este portfolio y en proyectos a medida para pequeñas empresas.",

  // Sección Contacto / Terminal Transmisor
  contact_system_file: "[ ENLACE: SATÉLITE_TRANSMISOR.LINK ]",
  contact_heading: "TRANSMISOR ENCRIPTADO",
  contact_subtitle: "ESTABLECER CANAL DE COMUNICACIÓN",
  contact_terminal_header:
    "SISTEMA SEGURO DE TRANSFERENCIA DE DATOS DE MENSAJERÍA",
  contact_welcome1: "COMANDO INBOUND LISTO. INGRESA CREDENCIALES DE MENSAJE:",
  contact_name: "NOMBRE_IDENTIFICADOR:",
  contact_email: "CANAL_EMAIL:",
  contact_message: "PAQUETE_DATOS_MENSAJE:",
  contact_submit: "TRANSMITIR PAQUETE DE DATOS DE FORMA SEGURA // ENVIAR",
  contact_success:
    "¡TRANSMISIÓN EXITOSA! SEÑAL ACÚSTICA ENVIADA A LA ÓRBITA DE JOSMARY.",
  contact_sending: "ENCRIPTANDO Y TRANSMITIENDO PAQUETE...",
  contact_placeholder_name: "p. ej. ANfitrion_cyber",
  contact_placeholder_email: "p. ej. usuario@red-secuenciada.net",
  contact_placeholder_msg: "Escribe tus comandos o propuestas aquí...",
  synth_keyboard_aria: "Teclado sintetizador, octava de Do mayor",
  synth_key_aria: "Tecla {label}, nota {note}, {freq} hercios",
  synth_wave_aria: "Seleccionar forma de onda {wave}",

  // Sección Consola Cyber / Bento Maximalista
  telemetry_system_file: "[ MÓDULO_SISTEMA: DIAGNÓSTICO_NUCLEO_ACTIVO ]",
  telemetry_heading: "TELEMETRÍA Y DIAGNÓSTICOS CYBERNETIC",
  telemetry_subtitle: "FLUJO DE DATOS EN TIEMPO REAL // BASE RETRO-POP 2026",
  matrix_stream: "Flujo de Matriz",
  fm_synth: "Sintes FM Monofónico",
  synth_wave_desc: " waveform parameters",
  keyboard_active: "TECLADO ACTIVO",
  osc: "OSC:",
  decay: "DECAIMIENTO:",
  octave: "OCTAVA:",
  fusion_core: "TERMALES DEL NÚCLEO FUSIÓN",
  sys_stable: "SISTEMA_ESTABLE",
  vent_blowing: "HURACÁN_VENT_SOPLANDO",
  shield_flux: "FLUJO DE ESCUDO PLUTONIO",
  plasma_condensate: "CONDENSADO DE PLASMA",
  warp_stretch: "ESTIRAMIENTO DEL NÚCLEO WARP",
  coolant_venting: "EXPULSANDO VAPOR DE ENFRIAMIENTO... ",
  reactor_overload: "⚠️ RETRO_SOBRECARGA",
  depressurize_btn: "¡DEPRESURIZACIÓN DE EMERGENCIA REFRIGERATORIA!",
  warp_flux_average: "PROMEDIO FLUX ACOPLADO:",
  biomonitor: "Sensor Biométrico",
  cardio_sync: "SINC_CARDIO",
  pulse: "PULSO ESTIMULADO:",
  synapse_eff: "EFICIENCIA DE SINAPSIS:",
  ram_scrub_title: "Limpieza RAM cognitiva",
  cache_wipe_tag: "LIMPIEZA_CACHE",
  cache_scanning: "ESCANEO DE SECTORES DAÑADOS...",
  cache_killing: "ELIMINANDO DUDAS_RESIDUALES.DLL...",
  cache_purging: "EXPULSANDO SÍNDROMES DE IMPOSTOR...",
  cache_recons: "RECONSOLIDANDO FIBRAS DE SINAPSIS...",
  cache_optimized: "SISTEMA OPTIMIZADO: ¡CEREBRO CON OVERCLOCK!",
  ram_purge_btn: "DEPURAR RAM DE MEMORIA COGNITIVA",
  ram_purging_btn: "DEPURANDO CACHÉ RESIDUAL...",
  cyber_console_title: "CONSOLA DE CÓDIGOS CYBERNETIC",
  cyber_console_prompt: "ESCRIBE 'help' PARA COMANDOS DE REGISTRO TELEMÉTRICO.",
  warning_alarm_overload:
    "ALERTA CRÍTICA: ¡SOBRECARGA DEL NÚCLEO DETECTADA! ¡AJUSTA LOS DESLIZADORES O SCRIPT 'calm'!",
  warning_alarm_venting:
    "SISTEMA EN VENTILACIÓN COMPILADORA: COOLANT REDISTRIBUYENDO EQUILIBRIO TÉRMICO.",
};

const enTranslations: TranslationDictionary = {
  // Navigation
  nav_about: "//_ABOUT",
  nav_journey: "//_JOURNEY",
  nav_exhibitions: "//_EXHIBITIONS",
  nav_skills: "//_MATRIX_SKILLS",
  nav_transmitter: "//_TRANSMITTER",
  nav_about_mobile: "//_ABOUT BIO",
  nav_journey_mobile: "//_JOURNEY JOURNAL",
  nav_exhibitions_mobile: "//_EXHIBITED PROJECTS",
  nav_skills_mobile: "//_MATRIX_SKILLS",
  nav_transmitter_mobile: "//_TRANSMIT MESSAGE",
  sys_time: "SYS_TIME",
  compiler_stable: "ACTIVE_COMPILE_STABLE",
  rebuilt_paracas: "REBUILT FROM PARACAS WITH CYBER-GLOW & REACT",

  // Audio Toggles
  audio_synths_active: "AUDIO: SYNTHS ACTIVE",
  audio_synths_off: "AUDIO: SYNTHS OFF",
  audio_tooltip: "Click to activate custom synthesized pop audio signals",

  // Hero Section
  hero_title_accent: "POP ART VIBE!",
  hero_lead_paragraph:
    "I am a Creative Full-Stack Developer crafting highly optimized, interactive visual products. Redesigning static sites into high-performance, visually rich environments with retrofuturist physics and synthesized sound landscapes.",
  btn_explore_exhibitions: "EXPLORE EXHIBITIONS",
  btn_trigger_sparks: "TRIGGER CYBER POP SPARKS",
  pop_synth_note: "⚡ POP SYNTH NOTE RELEASED!",
  styling_tint: "STYLING TINT:",
  geometry_model: "ACTIVE GEOMETRY MODEL:",
  drag_focus: "DRAG FOCUS / CLICK CANVAS",
  speed: "SPEED:",
  scale: "SCALE:",

  // About Section
  about_system_file: "[ SYSTEM FILE: JOSMARY_BIO.SYS ]",
  about_heading: "WHO IS JOSMARY?",
  boost_interactivity: "CLICK STAT MODULES TO BOOST THEM (INTERACTIVE FUN!)",
  tab_bio: "// BIO",
  tab_philosophy: "// PHILOSOPHY",
  tab_vibes: "// VIBES",
  philosophy_title: "Interactive Aesthetic Dominance",
  philosophy_p1:
    "Websites should not be static PDF files. They should be tactile digital playgrounds. Every button, input form, and hover state is an opportunity to generate physical responses using synthesized sound waves and fluid keyframes.",
  philosophy_quote: '"Make it loud, make it fast, and make it unforgettable."',
  vibes_stationary_title: "PREFERENCES",
  vibes_stationary: "Cyberpunk Retro-consoles, Neon Glitches, Canvas Shaders",
  vibes_tunes_title: "TUNES",
  vibes_tunes: "Synthwave, Vaporwave, Outrun Polyphonic MIDI files",
  vibes_drinks_title: "DRINKS",
  vibes_drinks: "Double-Shot Cold Brew, Matcha Latte, Matcha bubble-tea",
  vibes_hobbies_title: "HOBBIES",
  vibes_hobbies: "Procedural animations, 3D printing modular keys",
  visual_polish: "Visual Polish & Aesthetics",
  code_efficiency: "Clean Code & Logic Optimizations",
  audio_synths: "Web Audio Synthesizer Craze",
  caffeine_burn: "Caffeine Stream Levels",

  // Timeline / Experience Journey Section
  journey_system_file: "[ TIME_THREAD: SYSTEMA_HISTORIC.LOG ]",
  journey_heading: "MY TRAYECTORIA",
  journey_subtitle: "CHRONOLOGICAL LOGGED ENTRIES",
  btn_filter_all: "// VIEW ALL",
  btn_filter_tags: "// CHOOSE FILTER COMPONENTS:",
  timeline_active_years: "OPERATIONAL DURATION:",

  // Projects / Exhibition Section
  exhibition_system_file: "[ REBUILD: PERSIST_MULTIPERSONAL.OBJ ]",
  exhibition_heading: "PROJECTS EXHIBITION",
  exhibition_subtitle: "PROUD DEPLOYED BLUEPRINTS",
  tags_label: "COMPONENTS INSTALLED:",
  btn_live_view: "ENTER THE LIVE DIMENSION",
  btn_view_details: "OPEN SYSTEM METRICS",
  btn_github_repo: "GITHUB MAIN DIRECTORY",
  project_features_title: "ARCHITECTURE BLUEPRINT:",
  btn_close_details: "_CLOSE_STAGE",

  // Interactive Skills Section
  skills_system_file: "[ REGISTRY: CPU_CORE_LOAD_DATA.DAT ]",
  skills_heading: "INTEGRATED SKILLS",
  skills_subtitle: "Technologies applied in real and personal projects",
  skills_hover_hint:
    "Hover over cores to trigger resonance feedback and view assimilation percentage.",
  level_label: "ASSIMILATION PERCENTAGE:",
  skill_levelled: "BOOSTED ACTIVE!",
  skill_click_tip: "CLICK NODE TO LEVEL UP",
  skills_disclaimer:
    "Technologies used in this portfolio and in custom-built projects for small businesses.",

  // Contact / Transmitter Terminal Section
  contact_system_file: "[ COM_STAGE: TRANSMITTIER_TRANSMITTING.LINK ]",
  contact_heading: "SECURE CHANNEL",
  contact_subtitle: "INITIALIZE BROADCAST LINK",
  contact_terminal_header: "ENCRYPTED USER BROADCAST STATE INTRUSION DATA_GRID",
  contact_welcome1: "INBOUND KEY DETECTED. DEFINE TRANSMISSION BUFFER:",
  contact_name: "NAME_IDENTIFIER:",
  contact_email: "EMAIL_CHANNEL:",
  contact_message: "TRANSMITTABLE_TEXT_BUFFER:",
  contact_submit: "SECURELY TRANSMIT PACKETS PROTOCOL // SEND",
  contact_success:
    "TRANSMISSION SUCCESSFUL! CARRIER SIGNAL FORWARDED TO JOSMARY.",
  contact_sending: "ENCRYPTING AND ROUTING PACKETS UNINTERRUPTED...",
  contact_placeholder_name: "e.g. cyber_host_xp",
  contact_placeholder_email: "e.g. address@network-grid.net",
  contact_placeholder_msg:
    "Express your commands or project configurations here...",
  synth_keyboard_aria: "Synthesizer keyboard, C major octave",
  synth_key_aria: "Key {label}, note {note}, {freq} hertz",
  synth_wave_aria: "Select {wave} waveform",

  // Cyber Console / Maximalist Bento Section
  telemetry_system_file: "[ MODULE_SYS: SUB_SYSTEMS_OVERRIDE_ACTIVE ]",
  telemetry_heading: "CYBERNETIC DIAGNOSTICS & TELEMETRY",
  telemetry_subtitle: "MATRIX DATA OVERFLUIDITY GAUGE // RETRO_POP_2026",
  matrix_stream: "Matrix Stream",
  fm_synth: "Monaural FM Synth",
  synth_wave_desc: " change waveform parameters",
  keyboard_active: "KEYBOARD ACTIVE",
  osc: "OSC:",
  decay: "DECAY:",
  octave: "OCT:",
  fusion_core: "FUSION CORE THERMALS",
  sys_stable: "SYS_STABLE",
  vent_blowing: "VENT_BLOWING",
  shield_flux: "PLUTONIUM SHIELD FLUX",
  plasma_condensate: "PLASMA CONDENSATE",
  warp_stretch: "WARP CORE STRETCH",
  coolant_venting: "COOLANT STEAM FLOOD VENTING... ",
  reactor_overload: "⚠️ RETRO_OVERLOAD",
  depressurize_btn: "EMERGENCY COOLANT DEPRESSURIZE!",
  warp_flux_average: "WARP COMPOSER FLUX:",
  biomonitor: "Biometric Monitor",
  cardio_sync: "CARDIO_SYNC",
  pulse: "STIMULATED PULSE:",
  synapse_eff: "SYNAPSE EFF:",
  ram_scrub_title: "Cognitive RAM scrub",
  cache_wipe_tag: "CACHE_WIPE",
  cache_scanning: "SCANNING CACHED CORRUPTION SECTORS...",
  cache_killing: "KILLING IMPOSING residual_doubts.dll...",
  cache_purging: "PURGING FAKE SYNDROMES...",
  cache_recons: "RECONSOLIDATING NEURAL SYNAPSE FIBERS...",
  cache_optimized: "OPTIMIZATION COMPLETE: INTELLECT OVERCLOCK ACTIVE!",
  ram_purge_btn: "SCRUB COGNITIVE CACHE RAM",
  ram_purging_btn: "EXECUTING PURGE SYSTEM DATA",
  cyber_console_title: "CYBERNETIC CODES CONSOLE",
  cyber_console_prompt: "WRITE 'help' TO QUERY CMD SCRIPTS.",
  warning_alarm_overload:
    "CRITICAL WARNING: FUSION CORE RETRO_OVERLOAD! RESET COMPRESSORS OR RUN 'calm'!",
  warning_alarm_venting:
    "ACTION: VENT SYSTEM IN PROGRESS. COOLANT FLOOD RE-ESTABLISHING THERMAL INTEGRITY.",
};

// Localized projects data resolver hook helper
interface LocalizedProject {
  id: string;
  title: string;
  category: string;
  description: string;
  longDescription: string;
  techStack: string[];
  liveUrl: string;
  githubUrl: string;
  imageGlowColor: string;
  accentColor: string;
  features: string[];
}

const esProjects: LocalizedProject[] = [
  {
    id: "polyform-3d",
    title: "Motor 3D Polyform",
    category: "Frontend Creativo y Canvas",
    description:
      "Un personalizador iterativo de formas procedimentales WebGL y renderizador de cristales.",
    longDescription:
      "Un editor exquisito de alto rendimiento para diseñar de forma interactiva y modular cristales 3D deformando matrices con shaders GLSL. Rendimiento supremo en smartphones y de escritorio sin latencia alguna.",
    techStack: ["React", "Three.js", "Zustand", "GLSL Shaders", "Tailwind CSS"],
    liveUrl: "",
    githubUrl: "https://github.com/josmary/polyform-3d",
    imageGlowColor: "#18BEC7",
    accentColor: "brand-cyan",
    features: [
      "Deformaciones procedimentales por ruido en GLSL",
      "Manipulación interactiva del mouse interactuando con los vértices",
      "Iluminación ambiental de neón y reflectores metálicos de alta calidad",
      "Exportaciones SVG/OBJ de alta fidelidad para creadores visuales",
    ],
  },
  {
    id: "neon-vibe-synth",
    title: "Retro Cyber-Synth",
    category: "Audio y Sintetizadores Web",
    description:
      "Sintetizador digital multipropósito con un secuenciador por pasos integrado sobre una grilla retro.",
    longDescription:
      "Un sintetizador digital polifónico que funciona nativamente sobre la API Web Audio del navegador. Destaca por contar con un analizador gráfico estilo pixel art, perillas visuales fluidas, modificadores pasabanda y triggers táctiles de batería.",
    techStack: [
      "TypeScript",
      "Web Audio API",
      "HTML5 Canvas",
      "Motion",
      "CSS Grids",
    ],
    liveUrl: "",
    githubUrl: "https://github.com/josmary/retro-cyber-synth",
    imageGlowColor: "#FD1EB1",
    accentColor: "brand-pink",
    features: [
      "Polifonía de alto espectro con envolventes ADSR manuales",
      "Espectrograma de píxeles interactuando en tiempo real con las frecuencias",
      "Controles espaciales binaurales de paneo estéreo",
      "Mecanismo de grabación incorporado con exportador WAV instantáneo",
    ],
  },
  {
    id: "hyper-chat-auth",
    title: "HyperSphere Network",
    category: "Full Stack y Real-time",
    description:
      "Mensajería encriptada en tiempo real protegida por llaves de reconocimiento de trayectorias gestuales.",
    longDescription:
      "Una sala de chat de terminal robusta y de alto rendimiento modelada con interfaces vibrantes de corriente hyper-pop. Cuenta con protección robusta extremo a extremo, y un protocolo de registro por gestos arrastrando coordenadas visuales en lugar de contraseñas ordinarias.",
    techStack: ["Next.js", "Node.js", "WebSockets", "Redis", "Tailwind CSS"],
    liveUrl: "",
    githubUrl: "https://github.com/josmary/hypersphere",
    imageGlowColor: "#DCF10B",
    accentColor: "brand-lime",
    features: [
      "Multiplexor WebSocket de eventos distribuyendo coordenadas de sockets",
      "Seguimiento gestual actuando como firma criptográfica de acceso",
      "Cola circular de datos de Redis para persistir transmisiones",
      "Temas de luz neón customizables en tiempo real bajo demanda",
    ],
  },
];

const enProjects: LocalizedProject[] = [
  {
    id: "polyform-3d",
    title: "Polyform 3D Engine",
    category: "Creative Frontend & Canvas",
    description:
      "An interactive, browser-based WebGL procedural shape customizer and crystal renderer.",
    longDescription:
      "A gorgeous, high-performance editor that allows creators to procedurally design, twist, and deform 3D crystals and structures using customized shader matrices. Leverages modern rendering strategies for absolute zero-lag interactions on mobile and desktop.",
    techStack: ["React", "Three.js", "Zustand", "GLSL Shaders", "Tailwind CSS"],
    liveUrl: "",
    githubUrl: "https://github.com/josmary/polyform-3d",
    imageGlowColor: "#18BEC7",
    accentColor: "brand-cyan",
    features: [
      "Custom procedural GLSL noise deformation",
      "Real-time mouse-reactive vertex manipulation",
      "High-fidelity metalness and neon ambient lighting rigs",
      "Instant SVG/OBJ exports for visual designers",
    ],
  },
  {
    id: "neon-vibe-synth",
    title: "Retro Cyber-Synth",
    category: "Web Audio & Synths",
    description:
      "Multi-waveform modular digital synthesizer with a reactive pixelated matrix step-sequencer.",
    longDescription:
      "An in-browser digital polyphonic synthesizer built entirely on native Web Audio API oscillators. Features a fully custom retro visualizer, visual knobs with inertial dragging, low-pass filter controls, and interactive neon drum trigger pads.",
    techStack: [
      "TypeScript",
      "Web Audio API",
      "HTML5 Canvas",
      "Motion",
      "CSS Grids",
    ],
    liveUrl: "",
    githubUrl: "https://github.com/josmary/retro-cyber-synth",
    imageGlowColor: "#FD1EB1",
    accentColor: "brand-pink",
    features: [
      "Polyphonic rendering with custom envelope ADSR controls",
      "Dynamic pixel art visualizer reacting to band frequency buffers",
      "Binaural spatial pan sliders",
      "Instant recording capability and WAV exporter",
    ],
  },
  {
    id: "hyper-chat-auth",
    title: "HyperSphere Network",
    category: "Full Stack & Real-time",
    description:
      "Ultra-secure real-time matrix messaging system featuring custom zero-knowledge visual authentication keys.",
    longDescription:
      "A robust, high-throughput terminal chat room styled with hyper-pop interfaces. Messages are encrypted end-to-end, and login runs via custom drag-and-drop pattern-recognition sequences instead of plain text passwords.",
    techStack: ["Next.js", "Node.js", "WebSockets", "Redis", "Tailwind CSS"],
    liveUrl: "",
    githubUrl: "https://github.com/josmary/hypersphere",
    imageGlowColor: "#DCF10B",
    accentColor: "brand-lime",
    features: [
      "WebSocket event multiplexing for real-time state broadcasts",
      "Visual grid gesture lock screen acting as crypto signature seed",
      "Persistent state with Redis ring arrays",
      "Cyber-retro themes dynamically configurable on the fly",
    ],
  },
];

// Localized milestones experience resolver
interface LocalizedMilestone {
  id: string;
  period: string;
  role: string;
  company: string;
  description: string;
  bullets: string[];
  tags: string[];
}

const esMilestones: LocalizedMilestone[] = [
  {
    id: "exp-1",
    period: "2024 - ACTUALIDAD",
    role: "Desarrolladora Independiente",
    company: "Proyectos Personales y Comisiones",
    description:
      "Construyo soluciones web interactivas para portafolios personales y sistemas de gestión para pequeñas empresas, con énfasis en React, Vite y experiencia visual pulida.",
    bullets: [
      "Diseñé y desarrollé un sistema de control e inventario para un negocio local, integrando formularios, validación y persistencia de datos.",
      "Construí este portfolio interactivo con animaciones Canvas y audio web, cuidando la experiencia en móvil y escritorio.",
      "Implementé APIs serverless en Vercel para contacto, correo y generación dinámica de Open Graph.",
    ],
    tags: ["React", "Vite", "TypeScript", "Tailwind v4", "Vercel"],
  },
  {
    id: "exp-2",
    period: "2022 - 2024",
    role: "Proyectos Freelance",
    company: "Soluciones Web a Medida",
    description:
      "Entregué desarrollos independientes para clientes pequeños, priorizando interfaces intuitivas, automatización básica y despliegues consistentes.",
    bullets: [
      "Creé landing pages y prototipos interactivos con estados claros y microinteracciones suaves.",
      "Construí sistemas de gestión de datos con funciones serverless y control de versiones en Git.",
      "Redacté documentación simple y mantenible para cada entrega, optimizando la transición a producción.",
    ],
    tags: ["HTML", "CSS", "JavaScript", "Git", "API serverless"],
  },
  {
    id: "exp-3",
    period: "2020 - 2022",
    role: "Proyectos de Aprendizaje",
    company: "Laboratorios de Código",
    description:
      "Exploré tecnologías web modernas mediante prototipos, demos de interfaz y experiencias audiovisuales experimentales.",
    bullets: [
      "Construí demos personales de sintetizadores Web Audio, visualizadores Canvas y tableros interactivos.",
      "Apliqué buenas prácticas de accesibilidad y diseño responsive desde el inicio.",
      "Documenté cada proyecto con READMEs claros y estructuras replicables.",
    ],
    tags: [
      "Web Audio API",
      "HTML5 Canvas",
      "Accesibilidad",
      "Responsive",
      "Documentación",
    ],
  },
];

const enMilestones: LocalizedMilestone[] = [
  {
    id: "exp-1",
    period: "2024 - PRESENT",
    role: "Independent Developer",
    company: "Personal Projects & Commissions",
    description:
      "Building interactive web solutions for personal portfolios and small business management systems, focusing on React, Vite and polished visual experiences.",
    bullets: [
      "Designed and delivered an inventory control system for a local business, including forms, validation and data persistence.",
      "Built this interactive portfolio with Canvas animations and Web Audio, optimizing the mobile and desktop experience.",
      "Implemented serverless APIs on Vercel for contact, email and dynamic Open Graph generation.",
    ],
    tags: ["React", "Vite", "TypeScript", "Tailwind v4", "Vercel"],
  },
  {
    id: "exp-2",
    period: "2022 - 2024",
    role: "Freelance Projects",
    company: "Custom Web Solutions",
    description:
      "Delivered independent builds for small clients, prioritizing intuitive interfaces, simple automation and reliable deployments.",
    bullets: [
      "Created landing pages and interactive prototypes with clean state flows and subtle microinteractions.",
      "Built data management systems using serverless functions and Git version control.",
      "Produced concise documentation for each delivery, easing the move to production.",
    ],
    tags: ["HTML", "CSS", "JavaScript", "Git", "Serverless API"],
  },
  {
    id: "exp-3",
    period: "2020 - 2022",
    role: "Learning Projects",
    company: "Code Labs",
    description:
      "Explored modern web technologies through prototypes, UI demos and experimental audiovisual experiences.",
    bullets: [
      "Built personal demos using Web Audio synthesizers, Canvas visualizers and interactive dashboards.",
      "Applied accessibility and responsive design best practices from the start.",
      "Documented each project with clear READMEs and reusable folder structures.",
    ],
    tags: [
      "Web Audio API",
      "HTML5 Canvas",
      "Accessibility",
      "Responsive",
      "Documentation",
    ],
  },
];

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string) => string;
  projects: LocalizedProject[];
  experience: LocalizedMilestone[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(
    () => readLanguageFromUrl() ?? "es",
  );

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    writeLanguageToUrl(lang);
  };

  useEffect(() => {
    applyHead(language);
  }, [language]);

  useEffect(() => {
    writeLanguageToUrl(language);
  }, []);

  const toggleLanguage = () => {
    setLanguage(language === "es" ? "en" : "es");
  };

  const t = (key: string): string => {
    const translations = language === "es" ? esTranslations : enTranslations;
    return translations[key] || key;
  };

  const projects = language === "es" ? esProjects : enProjects;
  const experience = language === "es" ? esMilestones : enMilestones;

  return (
    <LanguageContext.Provider
      value={{ language, setLanguage, toggleLanguage, t, projects, experience }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

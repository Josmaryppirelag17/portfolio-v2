import React, { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Zap, Sparkles, RefreshCw, Sliders, Radio, Terminal, 
  Skull, ShieldAlert, Heart, Cpu, Activity, Flame, RotateCcw, Code 
} from "lucide-react";
import { soundEngine } from "./SoundEngine";

// ====================================================
// WIDGET 1: HOLOGRAPHIC DIGITAL RAIN MATRIX (Canvas)
// ====================================================
function MatrixRainWidget() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [colorScheme, setColorScheme] = useState<"lime" | "pink" | "cyan">("lime");
  const [speed, setSpeed] = useState<number>(1.2);
  const [density, setDensity] = useState<number>(0.65);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = 170);
    let height = (canvas.height = 140);

    const charList = "アカサタナハマヤラワガザダバパイウエオ0123456789%X_#@$◇◆";
    const fontSize = 8;
    let columns = Math.floor(width / fontSize);
    let drops: number[] = Array(columns).fill(1).map(() => Math.floor(Math.random() * -20));

    let frameId: number;

    const draw = () => {
      ctx.fillStyle = "rgba(17, 18, 50, 0.15)";
      ctx.fillRect(0, 0, width, height);

      // Select paint color scheme
      if (colorScheme === "lime") {
        ctx.fillStyle = "#DCF10B";
      } else if (colorScheme === "pink") {
        ctx.fillStyle = "#FD1EB1";
      } else {
        ctx.fillStyle = "#18BEC7";
      }
      ctx.font = `${fontSize}px monospace`;

      // Draw drop trails based on speed & density modifiers
      for (let i = 0; i < drops.length; i++) {
        // Toggle density skip logic
        if (i % 2 === 0 && density < 0.5) continue;
        if (i % 3 === 0 && density < 0.3) continue;

        const text = charList[Math.floor(Math.random() * charList.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > height && Math.random() > 0.965) {
          drops[i] = 0;
        }
        drops[i] += speed * (0.85 + Math.random() * 0.3);
      }

      frameId = requestAnimationFrame(draw);
    };

    draw();

    const resizeObserver = new ResizeObserver(() => {
      if (canvasRef.current) {
        width = canvas.width = canvasRef.current.clientWidth || 170;
        height = canvas.height = canvasRef.current.clientHeight || 140;
        columns = Math.floor(width / fontSize);
        drops = Array(columns).fill(1).map(() => Math.floor(Math.random() * -20));
      }
    });
    resizeObserver.observe(canvas);

    return () => {
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
    };
  }, [colorScheme, speed, density]);

  return (
    <div 
      id="matrix-rain-card"
      className="p-4 bg-brand-bg/95 border border-brand-pale/10 rounded-xl flex flex-col justify-between h-48 select-none relative overflow-hidden"
    >
      <div className="flex items-center justify-between mb-1.5 z-10">
        <span className="flex items-center space-x-1 font-mono text-[9px] text-[#DCF10B] uppercase tracking-widest">
          <Code size={11} className="text-brand-lime" />
          <span>Matrix Stream</span>
        </span>
        <span className="font-mono text-[8px] text-brand-pale/30 uppercase">[HOLO_GEN.EXE]</span>
      </div>

      <div className="flex-grow w-full h-[85px] rounded bg-[#090b1c] border border-brand-lime/10 relative overflow-hidden mb-2">
        <canvas ref={canvasRef} className="absolute inset-0 block w-full h-full" />
      </div>

      {/* Control sliders & layout */}
      <div className="grid grid-cols-3 gap-1 z-10">
        <button
          onClick={() => {
            soundEngine.playClick();
            setColorScheme(colorScheme === "lime" ? "cyan" : colorScheme === "cyan" ? "pink" : "lime");
          }}
          className="py-1 rounded border border-[#DCF10B]/30 font-mono text-[7px] text-center bg-brand-bg/90 hover:bg-brand-lime/10 text-brand-lime transition-all"
        >
          COLOR: {colorScheme.toUpperCase()}
        </button>
        <button
          onClick={() => {
            soundEngine.playHover();
            setSpeed((prev) => (prev >= 2.0 ? 0.6 : prev + 0.45));
          }}
          className="py-1 rounded border border-brand-pale/10 font-mono text-[7px] text-center bg-brand-bg/90 hover:bg-white/5 text-brand-pale transition-all"
        >
          SPEED: {speed.toFixed(1)}x
        </button>
        <button
          onClick={() => {
            soundEngine.playHover();
            setDensity((prev) => (prev >= 0.8 ? 0.25 : prev + 0.25));
          }}
          className="py-1 rounded border border-brand-pale/10 font-mono text-[7px] text-center bg-brand-bg/90 hover:bg-white/5 text-brand-pale transition-all"
        >
          DENSE: {Math.round(density * 100)}%
        </button>
      </div>
    </div>
  );
}

// ====================================================
// WIDGET 2: MONOPHONIC CHIPTUNE SYNTH MASTER
// ====================================================
function PocketSynthWidget() {
  const [oscType, setOscType] = useState<OscillatorType>("triangle");
  const [decay, setDecay] = useState<number>(0.3);
  const [octave, setOctave] = useState<number>(4);
  const [activeKey, setActiveKey] = useState<number | null>(null);

  // Note frequency blueprint data (Octave 4 bases)
  const keys = [
    { label: "C", hz: 261.63, isWhite: true },
    { label: "C#", hz: 277.18, isWhite: false },
    { label: "D", hz: 293.66, isWhite: true },
    { label: "D#", hz: 311.13, isWhite: false },
    { label: "E", hz: 329.63, isWhite: true },
    { label: "F", hz: 349.23, isWhite: true },
    { label: "F#", hz: 369.99, isWhite: false },
    { label: "G", hz: 392.00, isWhite: true },
    { label: "G#", hz: 415.30, isWhite: false },
    { label: "A", hz: 440.00, isWhite: true },
    { label: "A#", hz: 466.16, isWhite: false },
    { label: "B", hz: 493.88, isWhite: true },
    { label: "C5", hz: 523.25, isWhite: true }
  ];

  const triggerNote = (baseHz: number, index: number) => {
    // Multiplier for octave shifting
    const multiplier = Math.pow(2, octave - 4);
    const finalHz = baseHz * multiplier;

    soundEngine.playHover();
    setActiveKey(index);
    setTimeout(() => setActiveKey(null), 150);

    // AudioContext Synthesizer directly matching guidelines
    if (typeof window !== "undefined") {
      try {
        const isMasterAudioOn = soundEngine.isEnabled();
        // Even if master sound is muted in navbar, we play low chime if clicked to demo unless completely suspended
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioCtx) return;
        
        const testCtx = new AudioCtx();
        const osc = testCtx.createOscillator();
        const gain = testCtx.createGain();

        osc.type = oscType;
        osc.frequency.setValueAtTime(finalHz, testCtx.currentTime);

        const playVol = isMasterAudioOn ? 0.16 : 0.02; // soft volume if navbar muted to preserve user privacy
        gain.gain.setValueAtTime(playVol, testCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, testCtx.currentTime + decay);

        osc.connect(gain);
        gain.connect(testCtx.destination);

        osc.start();
        osc.stop(testCtx.currentTime + decay);
      } catch (e) {
        console.warn("Synthesizer context couldn't initialize on locked tab", e);
      }
    }
  };

  const cycleOsc = () => {
    soundEngine.playClick();
    const list: OscillatorType[] = ["sine", "square", "sawtooth", "triangle"];
    const idx = list.indexOf(oscType);
    setOscType(list[(idx + 1) % list.length]);
  };

  return (
    <div 
      id="pocket-synth-card"
      className="p-4 bg-brand-bg/95 border border-brand-pale/10 rounded-xl flex flex-col justify-between h-48 select-none relative overflow-hidden"
    >
      <div className="flex items-center justify-between mb-1">
        <span className="flex items-center space-x-1 font-mono text-[9px] text-[#FD1EB1] uppercase tracking-widest">
          <Radio size={12} className="text-brand-pink animate-pulse" />
          <span>Monaural FM Synth</span>
        </span>
        <span className="font-mono text-[8px] text-brand-pink/60 animate-pulse bg-brand-pink/10 px-1 py-0.2 rounded">
          KEYBOARD ACTIVE
        </span>
      </div>

      {/* Control sliders inside synthesizer */}
      <div className="grid grid-cols-3 gap-1 mb-2">
        <button
          onClick={cycleOsc}
          className="py-1 rounded border border-[#FD1EB1]/30 font-mono text-[7.5px] text-center bg-brand-bg/90 hover:bg-brand-pink/10 text-brand-pink transition-all uppercase"
          title="Change synthesis waveform parameters"
        >
          OSC: {oscType}
        </button>
        <button
          onClick={() => {
            soundEngine.playClick();
            setDecay((d) => (d >= 0.8 ? 0.15 : d + 0.15));
          }}
          className="py-1 rounded border border-brand-pale/10 font-mono text-[7.5px] text-center bg-brand-bg/90 hover:bg-white/5 text-brand-pale transition-all"
        >
          DECAY: {decay.toFixed(2)}s
        </button>
        <button
          onClick={() => {
            soundEngine.playClick();
            setOctave((oct) => (oct >= 6 ? 3 : oct + 1));
          }}
          className="py-1 rounded border border-brand-pale/10 font-mono text-[7.5px] text-center bg-brand-bg/90 hover:bg-white/5 text-brand-pale transition-all"
        >
          OCT: {octave}
        </button>
      </div>

      {/* Synthesizer Touch Board Keys Layout Grid */}
      <div className="flex items-end h-20 w-full bg-[#0a0c1f] rounded border border-brand-pale/5 p-1 relative gap-0.5 overflow-hidden">
        {keys.map((k, idx) => (
          <button
            key={idx}
            onClick={() => triggerNote(k.hz, idx)}
            className={`flex-grow h-full rounded-sm relative text-[8px] font-mono flex flex-col justify-end items-center pb-1 transition-all ${
              k.isWhite 
                ? activeKey === idx
                  ? "bg-brand-pink text-white shadow-[0_0_8px_#FD1EB1]" 
                  : "bg-brand-pale/90 text-brand-bg hover:bg-white"
                : activeKey === idx
                  ? "bg-brand-cyan text-white h-[65%] z-10 shadow-[0_0_8px_#18BEC7]" 
                  : "bg-[#18192a] text-[#FD1EB1]/70 h-[65%] z-10 border border-brand-pink/20 hover:bg-[#20223a]"
            }`}
            style={{
              boxShadow: activeKey === idx ? "0 0 10px rgba(253,30,177,0.7)" : "none"
            }}
          >
            <span>{k.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ====================================================
// WIDGET 3: THERMONUCLEAR NUCLEAR CORE BALANCER (Reactor mini-game)
// ====================================================
interface CoreBalancerProps {
  onCoreStateChange: (state: "stable" | "unstable" | "venting") => void;
}

function CoreBalancerWidget({ onCoreStateChange }: CoreBalancerProps) {
  const [plutonium, setPlutonium] = useState<number>(65);
  const [plasma, setPlasma] = useState<number>(45);
  const [warpCore, setWarpCore] = useState<number>(55);
  const [ventActive, setVentActive] = useState<boolean>(false);

  // Derive core condition
  const averageLoad = (plutonium + plasma + warpCore) / 3;
  const isOverload = averageLoad >= 85;

  useEffect(() => {
    if (ventActive) {
      onCoreStateChange("venting");
    } else if (isOverload) {
      onCoreStateChange("unstable");
    } else {
      onCoreStateChange("stable");
    }
  }, [isOverload, ventActive]);

  const triggerEmergencyClean = () => {
    soundEngine.playSuccess();
    setVentActive(true);

    // Audio sweeps for cooling vent
    if (typeof window !== "undefined") {
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          const testCtx = new AudioCtx();
          const oscIndex = [180, 160, 140, 120, 100];
          oscIndex.forEach((freq, i) => {
            setTimeout(() => {
              const osc = testCtx.createOscillator();
              const gain = testCtx.createGain();
              osc.type = "sawtooth";
              osc.frequency.setValueAtTime(freq, testCtx.currentTime);
              gain.gain.setValueAtTime(0.06, testCtx.currentTime);
              gain.gain.exponentialRampToValueAtTime(0.0001, testCtx.currentTime + 0.5);
              osc.connect(gain);
              gain.connect(testCtx.destination);
              osc.start();
              osc.stop(testCtx.currentTime + 0.5);
            }, i * 150);
          });
        }
      } catch (err) {}
    }

    setTimeout(() => {
      setPlutonium(40);
      setPlasma(35);
      setWarpCore(45);
      setVentActive(false);
    }, 1800);
  };

  return (
    <div 
      id="core-reactor-balancer"
      className={`p-4 bg-brand-bg/95 border rounded-xl flex flex-col justify-between h-48 select-none relative overflow-hidden transition-all duration-300 ${
        ventActive 
          ? "border-brand-lime shadow-[0_0_12px_rgba(220,241,11,0.25)]"
          : isOverload 
            ? "border-brand-pink animate-pulse shadow-[0_0_15px_#FD1EB1]" 
            : "border-brand-pale/10"
      }`}
    >
      <div className="flex items-center justify-between mb-1.5 z-10">
        <span className="flex items-center space-x-1 font-mono text-[9px] text-[#DCF10B] uppercase tracking-widest">
          <Flame size={12} className={isOverload ? "text-brand-pink animate-bounce" : "text-brand-lime"} />
          <span>FUSION CORE THERMALS</span>
        </span>
        <span className={`font-mono text-[8px] px-1 py-0.2 rounded ${
          ventActive 
            ? "bg-brand-lime/25 text-brand-lime"
            : isOverload 
              ? "bg-brand-pink/25 text-brand-pink animate-ping" 
              : "bg-brand-lime/10 text-brand-lime"
        }`}>
          {ventActive ? "VENT_BLOWING" : isOverload ? "⚠️ RETRO_OVERLOAD" : "SYS_STABLE"}
        </span>
      </div>

      <div className="space-y-1.5 flex-grow justify-center flex flex-col z-10">
        {/* Sliders */}
        <div className="space-y-0.5">
          <div className="flex justify-between font-mono text-[7px] text-brand-pale/50 uppercase">
            <span>PLUTONIUM SHIELD FLUX</span>
            <span className="text-[#DCF10B]">{plutonium}%</span>
          </div>
          <input 
            type="range" 
            min="10" 
            max="100" 
            value={plutonium} 
            onChange={(e) => {
              soundEngine.playHover();
              setPlutonium(Number(e.target.value));
            }}
            disabled={ventActive}
            className="w-full accent-[#DCF10B] bg-[#090b1c] h-1.5 rounded cursor-pointer"
          />
        </div>

        <div className="space-y-0.5">
          <div className="flex justify-between font-mono text-[7px] text-brand-pale/50 uppercase">
            <span>plasma CONDENSATE</span>
            <span className="text-brand-cyan">{plasma}%</span>
          </div>
          <input 
            type="range" 
            min="10" 
            max="100" 
            value={plasma} 
            onChange={(e) => {
              soundEngine.playHover();
              setPlasma(Number(e.target.value));
            }}
            disabled={ventActive}
            className="w-full accent-brand-cyan bg-[#090b1c] h-1.5 rounded cursor-pointer"
          />
        </div>

        <div className="space-y-0.5">
          <div className="flex justify-between font-mono text-[7px] text-brand-pale/50 uppercase">
            <span>WARP CORE STRETCH</span>
            <span className="text-brand-pink">{warpCore}%</span>
          </div>
          <input 
            type="range" 
            min="10" 
            max="100" 
            value={warpCore} 
            onChange={(e) => {
              soundEngine.playHover();
              setWarpCore(Number(e.target.value));
            }}
            disabled={ventActive}
            className="w-full accent-brand-pink bg-[#090b1c] h-1.5 rounded cursor-pointer"
          />
        </div>
      </div>

      <div className="h-7 flex items-center justify-center mt-1 z-10">
        <AnimatePresence mode="wait">
          {ventActive ? (
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="w-full h-full text-center flex items-center justify-center bg-brand-lime/10 border border-brand-lime text-brand-lime font-mono text-[8.5px] rounded animate-pulse"
            >
              COOLANT STEAM FLOOD VENTING... {Math.round(averageLoad)}°C
            </motion.div>
          ) : isOverload ? (
            <motion.button
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: [1, 1.03, 1], opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={triggerEmergencyClean}
              className="w-full h-full bg-brand-pink text-white flex items-center justify-center gap-1 font-mono text-[8px] font-bold rounded animate-pulse cursor-pointer border border-[#111232] shadow-[0_0_10px_#FD1EB1] hover:bg-brand-pink/90"
            >
              <ShieldAlert size={12} className="animate-bounce" />
              EMERGENCY COOLANT DEPRESSURIZE!
            </motion.button>
          ) : (
            <div className="w-full h-full flex items-center justify-between px-2 bg-[#090b1c] rounded border border-brand-lime/15 text-[8.5px] font-mono text-brand-pale/70">
              <span>WARP COMPOSER FLUX:</span>
              <span className="text-brand-lime font-bold">{Math.round(averageLoad)}%</span>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ====================================================
// WIDGET 4: BIORHYTHM AND ECG MEDICAL MATRIX
// ====================================================
function BiorhythmECGWidget() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [bpm, setBpm] = useState<number>(75);
  const [cortisol, setCortisol] = useState<number>(32);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = 170);
    let height = (canvas.height = 100);

    let x = 0;
    const points: number[] = Array(width).fill(height / 2);
    let frameId: number;

    const animateECG = () => {
      ctx.fillStyle = "rgba(17, 18, 50, 0.12)";
      ctx.fillRect(0, 0, width, height);

      // Simple grid representation
      ctx.strokeStyle = "rgba(24, 190, 199, 0.04)";
      ctx.lineWidth = 1;
      for (let i = 0; i < width; i += 16) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, height);
        ctx.stroke();
      }
      for (let j = 0; j < height; j += 16) {
        ctx.beginPath();
        ctx.moveTo(0, j);
        ctx.lineTo(width, j);
        ctx.stroke();
      }

      // Compute heart wave cycle
      const pulseCycle = (60 / bpm) * 60; // frames per beat
      const step = x % Math.round(pulseCycle);

      let displacement = height / 2;
      
      // ECG P-Q-R-S-T sequence offsets
      if (step > 15 && step < 20) {
        // P Wave
        displacement -= 4;
      } else if (step >= 20 && step < 24) {
        // Flat segment
      } else if (step === 25) {
        // Q Wave dip
        displacement += 6;
      } else if (step === 26 || step === 27) {
        // R Spurt (High Spike)
        displacement -= 35;
      } else if (step === 28 || step === 29) {
        // S Drop
        displacement += 15;
      } else if (step >= 30 && step < 36) {
        // S-T gap segment
      } else if (step > 35 && step < 44) {
        // T Wave
        displacement -= 9;
      }

      points.push(displacement);
      if (points.length > width) {
        points.shift();
      }

      // Draw the ECG stroke line
      ctx.beginPath();
      ctx.moveTo(0, points[0]);
      for (let k = 1; k < points.length; k++) {
        ctx.lineTo(k, points[k]);
      }
      ctx.strokeStyle = "#18BEC7";
      ctx.lineWidth = 1.6;
      ctx.shadowColor = "#18BEC7";
      ctx.shadowBlur = 4;
      ctx.stroke();
      ctx.shadowBlur = 0;

      x++;
      frameId = requestAnimationFrame(animateECG);
    };

    animateECG();

    const resizeObserver = new ResizeObserver(() => {
      if (canvasRef.current) {
        width = canvas.width = canvasRef.current.clientWidth || 170;
        height = canvas.height = canvasRef.current.clientHeight || 100;
      }
    });
    resizeObserver.observe(canvas);

    return () => {
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
    };
  }, [bpm]);

  return (
    <div 
      id="biomonitor-card"
      className="p-4 bg-brand-bg/95 border border-brand-pale/10 rounded-xl flex flex-col justify-between h-48 select-none relative overflow-hidden"
    >
      <div className="flex items-center justify-between mb-1 z-10">
        <span className="flex items-center space-x-1 font-mono text-[9px] text-brand-cyan uppercase tracking-widest">
          <Activity size={12} className="text-brand-cyan animate-pulse" />
          <span>Biometric Monitor</span>
        </span>
        <span className="font-mono text-[8px] text-brand-cyan/60 uppercase">CARDIO_SYNC</span>
      </div>

      <div className="flex-grow w-full h-[70px] rounded bg-[#090b1c] border border-brand-cyan/15 relative overflow-hidden mb-1.5Packed">
        <canvas ref={canvasRef} className="absolute inset-0 block w-full h-full" />
        
        {/* Heart icon indicator beats dynamically! */}
        <div className="absolute top-2 right-2 bg-brand-bg/90 border border-brand-cyan/20 px-2 py-0.5 rounded flex items-center space-x-1">
          <Heart size={9} className="text-brand-pink fill-brand-pink animate-ping" />
          <span className="font-mono text-[8px] font-bold text-[#DBEAEC]">{bpm} BPM</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-1.5 z-10">
        <div>
          <div className="flex justify-between font-mono text-[7px] text-brand-pale/40 uppercase mb-0.5">
            <span>STIMULATED PULSE:</span>
            <span className="text-brand-cyan">{bpm} BPM</span>
          </div>
          <input 
            type="range"
            min="60" 
            max="180" 
            value={bpm} 
            onChange={(e) => {
              setBpm(Number(e.target.value));
              setCortisol(Math.round(30 + (Number(e.target.value) - 60) * 0.5));
            }}
            className="w-full accent-brand-cyan bg-[#090b1c] h-1 rounded cursor-pointer"
          />
        </div>
        <div className="flex flex-col justify-between">
          <div className="flex justify-between font-mono text-[7px] text-brand-pale/40 uppercase">
            <span>SYNAPSE EFF:</span>
            <span className="text-[#DCF10B]">{cortisol}%</span>
          </div>
          <div className="h-3 w-full bg-[#0a0c1f] rounded border border-brand-pale/5 p-0.5 flex">
            <div 
              className="h-full bg-brand-lime rounded-xs" 
              style={{ width: `${cortisol}%`, transition: 'width 0.2s ease', boxShadow: '0 0 6px #DCF10B' }} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ====================================================
// WIDGET 5: RAM CORE GARBAGE COLLECTOR
// ====================================================
function MemoryCollectorWidget() {
  const [percent, setPercent] = useState<number>(78);
  const [purging, setPurging] = useState<boolean>(false);
  const [logs, setLogs] = useState<string[]>([
    "// SYS STATS LOADED OK.",
    "// STANDBY CACHE READY FOR SCRUB."
  ]);

  const runGarbagePurge = () => {
    if (purging) return;
    soundEngine.playSuccess();
    setPurging(true);
    setPercent(78);

    const steps = [
      { text: "SCANNING CACHED CORRUPTION SECTORS...", pct: 78 },
      { text: "KILLING IMPOSING residual_doubts.dll...", pct: 54 },
      { text: "PURGING FAKE SYNDROMES (imposter_syndrome.bin)...", pct: 36 },
      { text: "RECONSOLIDATING NEURAL SYNAPSE FIBERS...", pct: 18 },
      { text: "OPTIMIZATION COMPLETE: INTELLECT OVERCLOCK ACTIVE!", pct: 21 }
    ];

    setLogs(["// INITIATING RAM INTELLECT CELL SCRUB..."]);

    steps.forEach((step, idx) => {
      setTimeout(() => {
        setPercent(step.pct);
        setLogs(prev => [step.text, ...prev.slice(0, 4)]);
        if (idx === steps.length - 1) {
          setPurging(false);
          soundEngine.playSuccess();
        } else {
          soundEngine.playHover();
        }
      }, (idx + 1) * 650);
    });
  };

  return (
    <div 
      id="memory-cleaner-card"
      className="p-4 bg-brand-bg/95 border border-brand-pale/10 rounded-xl flex flex-col justify-between h-48 select-none relative overflow-hidden"
    >
      <div className="flex items-center justify-between mb-1.5 z-10">
        <span className="flex items-center space-x-1 font-mono text-[9px] text-[#DCF10B] uppercase tracking-widest">
          <Cpu size={12} className="text-brand-lime animate-pulse" />
          <span>Cognitive RAM scrub</span>
        </span>
        <span className="font-mono text-[8px] text-brand-lime/50 uppercase">CACHE_WIPE</span>
      </div>

      <div className="flex-grow w-full bg-[#090b1c] rounded border border-brand-pale/5 flex p-2.5 space-x-3 items-center mb-1.5 overflow-hidden">
        {/* Memory loading circular diagram */}
        <div className="relative shrink-0 flex items-center justify-center">
          <div className="w-14 h-14 rounded-full border-4 border-brand-bg flex items-center justify-center text-[10px] font-mono font-bold text-white relative">
            <svg className="absolute inset-0 transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-white/5"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-brand-lime transition-all duration-300"
                strokeDasharray={`${percent}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                style={{ filter: "drop-shadow(0px 0px 4px #DCF10B)" }}
              />
            </svg>
            <span className="z-10">{percent}%</span>
          </div>
        </div>

        {/* Minimal logger */}
        <div className="flex-grow h-14 overflow-hidden flex flex-col justify-end">
          {logs.slice(0, 3).map((line, lid) => (
            <div key={lid} className="font-mono text-[7px] text-brand-pale/60 tracking-wider truncate mb-0.5">
              {line}
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={runGarbagePurge}
        disabled={purging}
        className={`w-full py-1.5 rounded cursor-pointer flex items-center justify-center space-x-1.5 font-mono text-[9px] font-bold transition-all border ${
          purging
            ? "bg-brand-lime/10 border-brand-lime/40 text-brand-lime animate-pulse text-opacity-50"
            : "bg-brand-bg border-brand-lime text-brand-lime shadow-[0_0_8px_rgba(220,241,11,0.2)] hover:bg-brand-lime/15"
        }`}
      >
        <RefreshCw size={11} className={purging ? "animate-spin" : ""} />
        <span>{purging ? "EXECUTING PURGE SYSTEM DATA" : "SCRUB COGNITIVE CACHE RAM"}</span>
      </button>
    </div>
  );
}

// ====================================================
// WIDGET 6: CRYPTO HACKER INTERACTIVE INPUT TERMINAL
// ====================================================
interface HackerTerminalProps {
  onTriggerGlitch: () => void;
  onTriggerOverload: () => void;
  onCalmReactor: () => void;
}

function RetroTerminalWidget({ onTriggerGlitch, onTriggerOverload, onCalmReactor }: HackerTerminalProps) {
  const [inputVal, setInputVal] = useState<string>("");
  const [history, setHistory] = useState<string[]>([
    "SYSINIT_COMPLETE // CHIP ONLINE.",
    "WRITE 'help' TO QUERY CMD SCRIPTS."
  ]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto scroll down logger
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [history]);

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCmd = inputVal.trim().toLowerCase();
    if (!cleanCmd) return;

    soundEngine.playClick();
    const newHistory = [...history, `> ${inputVal}`];

    if (cleanCmd === "help") {
      newHistory.push(
        "LIST OF PERMITTED CONSOLE PROMPT SCRIPTS:",
        " - 'glitch' : Simulate CSS chromatic aberration glitch lines",
        " - 'laser'  : Emit monophonic musical octave sweeping notes",
        " - 'overload' : Initiate core reactor uranium overdrive",
        " - 'calm'    : Emergency vent reactor rods to 40%",
        " - 'status'  : Query cognitive host and cybernetic diagnostics",
        " - 'clear'   : Wipe log buffers"
      );
    } else if (cleanCmd === "glitch") {
      newHistory.push("EXECUTING PROTOCOL: CHROMATIC GLITCH SCANLINES TRIGGERED OK.");
      onTriggerGlitch();
    } else if (cleanCmd === "laser") {
      newHistory.push("PLAYING MONOPHONIC CHIPTUNE SOUND WAVE SWEEPS...");
      soundEngine.playSuccess();
    } else if (cleanCmd === "overload") {
      newHistory.push("⚠️ WARNING: CRITICAL OVERLOAD COMMAND SENT TO REACTOR RODS!");
      onTriggerOverload();
    } else if (cleanCmd === "calm") {
      newHistory.push("VENTING COOLANT COMPOSITIONS MANUALLY...");
      onCalmReactor();
    } else if (cleanCmd === "status") {
      newHistory.push(
        "TELEMETRY_STATUS:",
        " - HOST_STATUS: COMPILER_STABLE",
        " - AVATAR: SKELETAL_CCDIK_ARM_V3.1",
        " - SOUND: RETRO_POCKET_OSC",
        " - LOCATION: CARACAS // PARACAS HUB"
      );
    } else if (cleanCmd === "clear") {
      setHistory([]);
      setInputVal("");
      return;
    } else {
      soundEngine.playError();
      newHistory.push(`CONSOLE_ERROR: SCRIPT '${cleanCmd}' NOT MAPPED IN TELEMETRY REGISTER.`);
    }

    setHistory(newHistory);
    setInputVal("");
  };

  return (
    <div 
      id="cmd-hacker-terminal"
      className="p-4 bg-brand-bg/95 border border-brand-pale/10 rounded-xl flex flex-col justify-between h-48 select-none relative overflow-hidden"
    >
      <div className="flex items-center justify-between mb-1 z-10">
        <span className="flex items-center space-x-1 font-mono text-[9px] text-[#FD1EB1] uppercase tracking-widest">
          <Terminal size={12} className="text-brand-pink" />
          <span>CYBERNETIC CODES CONSOLE</span>
        </span>
        <span className="font-mono text-[8px] text-brand-pale/30 uppercase">[HOST_TERM]</span>
      </div>

      {/* Terminal logs canvas viewport */}
      <div 
        ref={containerRef}
        className="flex-grow w-full h-[85px] rounded bg-[#090b1c] border border-brand-pink/15 p-2 font-mono text-[7px] text-brand-pale/80 overflow-y-auto mb-2 relative scroll-smooth selection:bg-brand-pink"
      >
        {history.map((line, index) => (
          <div key={index} className="leading-relaxed mb-0.5 tracking-wider font-light">
            {line}
          </div>
        ))}
      </div>

      <form onSubmit={handleCommandSubmit} className="flex gap-1.5 z-10">
        <span className="font-mono text-[#FD1EB1] text-[10px] self-center animate-pulse">{">"}</span>
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder="Type 'help'..."
          className="flex-grow bg-[#090b1c] rounded border border-brand-pink/20 text-[#DBEAEC] px-2 py-1 font-mono text-[10px] focus:outline-none focus:border-brand-pink focus:shadow-[0_0_8px_rgba(253,30,177,0.3)] transition-all"
        />
        <button
          type="submit"
          className="bg-[#090b1c] hover:bg-brand-pink/10 border border-[#FD1EB1]/30 text-[#FD1EB1] rounded px-3.5 py-1 text-[8.5px] font-mono tracking-widest cursor-pointer hover:border-brand-pink hover:text-white transition-all transition-colors"
        >
          EXECUTE
        </button>
      </form>
    </div>
  );
}

// ====================================================
// CONPONENT WRAPPER: CYBER CONSOLE WIDGETS BENTO DASHBOARD
// ====================================================
export default function CyberConsoleWidgets() {
  const [coreState, setCoreState] = useState<"stable" | "unstable" | "venting">("stable");
  const [glitchTriggered, setGlitchTriggered] = useState<boolean>(false);
  const [overloadMultiplier, setOverloadMultiplier] = useState<boolean>(false);
  const [calmRequested, setCalmRequested] = useState<boolean>(false);

  // Trigger glitch flashing
  const triggerGlitchMode = () => {
    soundEngine.playError();
    setGlitchTriggered(true);
    setTimeout(() => {
      setGlitchTriggered(false);
    }, 1200);
  };

  const handleTriggerOverload = () => {
    setOverloadMultiplier(true);
    triggerGlitchMode();
    setTimeout(() => {
      setOverloadMultiplier(false);
    }, 15000); // stable auto reset after safety limit
  };

  const handleCalmReactor = () => {
    setCalmRequested(true);
    setTimeout(() => {
      setCalmRequested(false);
    }, 2000);
  };

  return (
    <div 
      id="maximalist-bento-dock-container" 
      className="w-full relative py-8 px-6 bg-[#0c0d1e]/80 border-y-4 border-brand-bg relative overflow-hidden"
    >
      {/* Glitch Overlay strobe effect indicator */}
      {glitchTriggered && (
        <div className="absolute inset-0 z-40 bg-brand-pink/15 backdrop-invert-[0.15] mix-blend-color-burn animate-hue-rotate pointer-events-none" />
      )}

      {/* Retro background neon matrix rings */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,#18bec708,#00000000)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#fd1eb105,#00000000)] pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        
        {/* Module Title Header Decal */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-2.5 mb-8 border-b-2 border-brand-pale/10 pb-4">
          <div className="flex flex-col text-left">
            <div className="flex items-center space-x-2 text-brand-lime font-mono text-[9px] tracking-widest uppercase">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-lime animate-ping" />
              <span>[ MODULE_SYS: SUB_SYSTEMS_OVERRIDE_ACTIVE ]</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black font-heading text-transparent uppercase text-outline-lime tracking-tight" style={{ WebkitTextStroke: "1px #DCF10B", color: '#DBEAEC' }}>
              CYBERNETIC DIAGNOSTICS & TELEMETRY DOCK
            </h3>
          </div>
          <div className="font-mono text-[8px] tracking-wider text-brand-pale/40 uppercase bg-[#111232] border border-brand-pale/5 px-2.5 py-1 rounded">
            MATRIX DATA OVERFLUIDITY GAUGE // PERSISTENCE: RETRO_POP_2026
          </div>
        </div>

        {/* BENTO GRID MODULE PANELS */}
        <div 
          className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 relative transition-transform duration-300 ${
            glitchTriggered ? "translate-x-1 translate-y-[-1px] filter blur-[0.3px]" : ""
          }`}
        >
          {/* Panel 1: Code Fall matrix rain */}
          <MatrixRainWidget />

          {/* Panel 2: pocket synthesizer */}
          <PocketSynthWidget />

          {/* Panel 3: ECG cardiogram monitor */}
          <BiorhythmECGWidget />

          {/* Panel 4: System power rods core reactor */}
          <CoreBalancerWidget onCoreStateChange={setCoreState} />

          {/* Panel 5: CPU cache RAM optimizer */}
          <MemoryCollectorWidget />

          {/* Panel 6: Input script prompt console */}
          <RetroTerminalWidget 
            onTriggerGlitch={triggerGlitchMode}
            onTriggerOverload={handleTriggerOverload}
            onCalmReactor={handleCalmReactor}
          />
        </div>

        {/* Visual alarms triggered under overload status settings */}
        {coreState === "unstable" && (
          <div className="mt-6 p-3 bg-brand-pink/15 border-2 border-brand-pink rounded-xl flex items-center justify-between text-left animate-pulse">
            <div className="flex items-center space-x-3.5">
              <div className="w-4 h-4 rounded-full bg-brand-pink flex items-center justify-center animate-ping">
                <Skull size={11} className="text-white" />
              </div>
              <p className="font-mono text-[10.5px] text-brand-pink font-bold uppercase tracking-widest leading-none">
                CRITICAL WARNING: FUSION INTRUSION FLUX DETECTED! ADJUST CONSOLE ROD SLIDERS OR SCRIPT 'calm' TO PREVENT RESET INITIATION!
              </p>
            </div>
          </div>
        )}

        {coreState === "venting" && (
          <div className="mt-6 p-3 bg-brand-lime/15 border-2 border-brand-lime rounded-xl flex items-center md:justify-start justify-between text-left">
            <div className="flex items-center space-x-3.5">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-lime animate-ping" />
              <p className="font-mono text-[10.5px] text-brand-lime font-bold uppercase tracking-widest leading-none">
                ACTION: VENT SYSTEM IN PROGRESS. COOLANT FLOOD INTRUSION COMPRESSORS REMEDISTRIBUTING REACTOR THERMALS BACK TO Rest state.
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

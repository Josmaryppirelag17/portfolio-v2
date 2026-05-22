import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Send, Terminal, Disc, Sparkles, Volume2, Key, Star, Radio } from "lucide-react";
import { useLanguage } from "../LanguageContext";
import { appendCyberMessage } from "../lib/cyberMessages";
import { soundEngine } from "./SoundEngine";

interface SynthKey {
  note: string;
  freq: number;
  label: string;
  colorClass: string;
}

function formatSynthKeyAria(
  template: string,
  key: SynthKey
): string {
  return template
    .replace("{label}", key.label)
    .replace("{note}", key.note)
    .replace("{freq}", String(key.freq));
}

export default function ContactTerminal() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({ name: "", email: "", message: "", fax: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [activeNote, setActiveNote] = useState<string | null>(null);
  const [activeWave, setActiveWave] = useState<OscillatorType>("triangle");
  const [terminalLines, setTerminalLines] = useState<string[]>([]);

  // Custom synth scale for user playground
  const synthScale: SynthKey[] = [
    { note: "C4", freq: 261.63, label: "C", colorClass: "bg-brand-pink text-white" },
    { note: "D4", freq: 293.66, label: "D", colorClass: "bg-brand-cyan text-brand-bg" },
    { note: "E4", freq: 329.63, label: "E", colorClass: "bg-brand-lime text-brand-bg" },
    { note: "F4", freq: 349.23, label: "F", colorClass: "bg-white text-brand-bg" },
    { note: "G4", freq: 392.00, label: "G", colorClass: "bg-brand-pink text-white" },
    { note: "A4", freq: 440.00, label: "A", colorClass: "bg-brand-cyan text-brand-bg" },
    { note: "B4", freq: 493.88, label: "B", colorClass: "bg-brand-lime text-brand-bg" },
    { note: "C5", freq: 523.25, label: "C+", colorClass: "bg-white text-brand-bg" },
  ];

  const handleKeyPress = (key: SynthKey) => {
    soundEngine.playSynthKey(key.freq);
    setActiveNote(key.note);
    setTimeout(() => setActiveNote(null), 150);
  };

  const handleWaveChange = (wave: OscillatorType) => {
    setActiveWave(wave);
    soundEngine.setWaveType(wave);
    soundEngine.playClick();
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      soundEngine.playError();
      return;
    }

    setIsSubmitting(true);
    setTerminalLines(["> Initializing transmitter uplink...", "> POSTing info payload to /api/contact..."]);
    soundEngine.playRadioStatic(); // Sonido analógico de estática

    // Pequeño retardo artificial para hacer la simulación del terminal legible y dramática
    const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    try {
      await wait(600);
      setTerminalLines((prev) => [...prev, "> Contacting database pooler..."]);
      soundEngine.playClick();

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      await wait(600);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 429) {
          const retry = errorData.retryAfter
            ? ` Reintenta en ${errorData.retryAfter}s.`
            : "";
          throw new Error(
            `Límite de envíos alcanzado (rate limit).${retry}`
          );
        }
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const resData = await response.json();

      setTerminalLines((prev) => [
        ...prev,
        "> SERVER_ACK_RECEIVED ... Connection verified",
        `> Status: 200 OK (Database: ${resData.db ? "SAVED" : "SKIP"}, Email: ${resData.email ? "SENT" : "SKIP"})`,
        "> Telegram Notification: TRANSMITTED",
      ]);
      soundEngine.playClick();

      await wait(800);

      appendCyberMessage({
        name: formData.name,
        email: formData.email,
        message: formData.message,
      });

      setIsSubmitting(false);
      setIsSent(true);

      // Cascada de arpegio de éxito en Do Mayor
      const successNotes = [
        { note: "C4", freq: 261.63 },
        { note: "E4", freq: 329.63 },
        { note: "G4", freq: 392.00 },
        { note: "C5", freq: 523.25 },
      ];

      successNotes.forEach((item, index) => {
        setTimeout(() => {
          soundEngine.playSynthKey(item.freq);
          setActiveNote(item.note);
          setTimeout(() => setActiveNote(null), 100);
        }, index * 120);
      });
    } catch (err: any) {
      console.error("Error en envío:", err);
      soundEngine.playError();
      setTerminalLines((prev) => [
        ...prev,
        "> ERROR: UPLINK TRANSMISSION INTERRUPTED!",
        `> Code: GATEWAY_ERR_500`,
        `> Diagnostic: ${err.message || "Unknown Connection Failure"}`,
      ]);
      
      await wait(3000); // Dar tiempo para leer el diagnóstico
      setIsSubmitting(false); // Permitir reintentar
    }
  };

  const resetForm = () => {
    setFormData({ name: "", email: "", message: "", fax: "" });
    setIsSent(false);
    setTerminalLines([]);
    soundEngine.playClick();
  };

  return (
    <section id="contact" className="py-20 bg-brand-bg relative overflow-hidden cyber-grid">
      
      {/* Glow backgrounds */}
      <div className="absolute top-[30%] left-[-10%] w-[350px] h-[350px] glow-spot-pink opacity-15" />
      <div className="absolute bottom-[10%] right-[-10%] w-[350px] h-[350px] glow-spot-cyan opacity-20" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col mb-16 items-center text-center">
          <div className="flex items-center space-x-2 text-brand-lime font-mono text-xs tracking-widest uppercase mb-2">
            <Radio size={14} className="animate-pulse text-brand-lime" />
            <span>{t("contact_system_file")}</span>
          </div>
          <h2 className="text-5xl sm:text-6xl tracking-tight uppercase italic text-transparent font-bold select-none text-center" style={{ fontFamily: '"Arial Black", "Syne", sans-serif', WebkitTextStroke: "2px #FD1EB1" }}>
            {t("contact_heading")}
          </h2>
          <p className="font-sans text-brand-pale/75 text-sm sm:text-base max-w-lg mt-3 text-center">
            {t("contact_subtitle")}
          </p>
          <div className="h-1.5 w-32 bg-brand-lime mt-3" />
        </div>

        {/* Core Cockpit Control Panel Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          
          {/* Left Column: Analog Poly-Synth Trigger Console */}
          <div className="lg:col-span-12 xl:col-span-5 flex flex-col justify-between p-6 bg-[#111232]/95 border-4 border-[#111232] rounded-xl neo-brutal-border-lime relative overflow-hidden">
            <div className="absolute inset-0 crt-overlay pointer-events-none opacity-20" />

            <div className="space-y-6 relative z-10">
              <div className="flex items-center justify-between border-b border-brand-lime/20 pb-4">
                <span className="font-mono text-[10px] text-brand-lime font-bold uppercase tracking-wider flex items-center space-x-2">
                  <Terminal size={12} />
                  <span>SYNTH_COCKPIT_INTEGRATOR</span>
                </span>
                <span className="font-mono text-[8.5px] text-brand-pale/40 uppercase">ASTATIC_FREQ: OK</span>
              </div>

              <p className="font-sans text-xs text-brand-pale/85 leading-relaxed text-left">
                {t("synth_explanation") || "Enjoy a fully synthesized custom piano block! Clicking on raw key nodes triggers polyphonic spatial soundwaves using native low-pass web filters."}
              </p>

              {/* Physical Keyboard Deck */}
              <div
                className="p-3 bg-brand-bg/80 rounded-lg border border-brand-lime/20"
                role="group"
                aria-label={t("synth_keyboard_aria")}
              >
                <div className="flex justify-between items-center mb-6">
                  <div className="font-mono text-[9px] text-brand-pale/50 flex items-center space-x-1.5">
                    <Key size={11} className="text-brand-pink" />
                    <span>C_MAJOR_OCTAVE:</span>
                  </div>
                  {activeNote && (
                    <motion.div 
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1.1 }}
                      className="text-[9px] font-mono text-brand-pink bg-brand-pink/10 px-2 py-0.5 rounded border border-brand-pink/20"
                    >
                      NOTE_FREQ_ACTIVE: {activeNote}
                    </motion.div>
                  )}
                </div>

                {/* Key components strip */}
                <div className="grid grid-cols-8 gap-1 h-32">
                  {synthScale.map((key) => {
                    const isActive = activeNote === key.note;
                    return (
                      <button
                        type="button"
                        key={key.note}
                        onClick={() => handleKeyPress(key)}
                        aria-label={formatSynthKeyAria(t("synth_key_aria"), key)}
                        aria-pressed={isActive}
                        className={`rounded-b transition-all duration-150 cursor-pointer flex flex-col justify-between items-center py-3 border border-brand-bg ${key.colorClass} ${
                          isActive 
                            ? "h-[90%] opacity-100 scale-95 shadow-[0_0_12px_#DCF10B] translate-y-1" 
                            : "hover:bg-brand-lime/30 hover:scale-102"
                        }`}
                      >
                        {/* Note badge */}
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-bg/25" />
                        <span className="font-display text-[10px] font-extrabold select-none">
                          {key.label}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Stylish Waveform Selector Row */}
                <div className="mt-4 pt-4 border-t border-brand-lime/10">
                  <div className="font-mono text-[9px] text-brand-pale/50 uppercase tracking-widest mb-2 flex items-center justify-between">
                    <span>SELECT_WAVE_SHAPE:</span>
                    <span className="text-brand-lime font-bold">OSC_{activeWave.toUpperCase()}</span>
                  </div>
                  <div className="grid grid-cols-4 gap-1">
                    {(["triangle", "sine", "sawtooth", "square"] as OscillatorType[]).map((wave) => (
                      <button
                        key={wave}
                        type="button"
                        onClick={() => handleWaveChange(wave)}
                        aria-label={t("synth_wave_aria").replace("{wave}", wave)}
                        aria-pressed={activeWave === wave}
                        className={`text-[8.5px] font-mono py-1.5 px-0.5 rounded border text-center transition-all cursor-pointer ${
                          activeWave === wave
                            ? "bg-[#DCF10B] text-[#111232] border-[#DCF10B] font-black shadow-[0_0_8px_rgba(220,241,11,0.3)]"
                            : "bg-brand-bg/60 border-brand-lime/20 text-brand-lime hover:bg-brand-lime/10"
                        }`}
                      >
                        {wave.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              {/* Fun manual key values */}
              <div className="p-3 bg-brand-bg/40 border border-brand-pale/5 rounded-md text-left">
                <div className="font-mono text-[9.5px] text-brand-pink font-bold uppercase tracking-widest mb-1 text-left">
                  COCKPIT WATERMARK:
                </div>
                <div className="font-mono text-[9px] text-brand-pale/60 leading-normal text-left">
                  OSCILLATORS: MOD_{activeWave.toUpperCase()}_WAVE<br />
                  GAIN_ATTENUATION: LOG_EXPONENTIAL_DECAY<br />
                  BINAURAL_STAGE: SPATIAL_PAN_MONO
                </div>
              </div>

            </div>

            <div className="font-mono text-[9px] text-brand-pale/30 uppercase mt-4 border-t border-brand-lime/10 pt-3 flex justify-between relative z-10">
              <span>SATELLITE_EMITTER_V1</span>
              <span>JOSMARYPIRELADOTDEV</span>
            </div>
          </div>

          {/* Right Column: Encrypted Sender input form */}
          <div className="lg:col-span-12 xl:col-span-7 flex flex-col">
            <AnimatePresence mode="wait">
              {!isSent ? (
                <motion.form
                  key="contact-form"
                  onSubmit={handleSubmit}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="p-6 bg-[#111232]/95 border-4 border-[#111232] rounded-xl neo-brutal-border-pink flex-grow flex flex-col justify-between space-y-5 text-left"
                >
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2.5 border-b border-brand-pale/15 pb-4">
                      <span className="h-2.5 w-2.5 rounded-full bg-brand-pink" />
                      <span className="font-mono text-xs text-brand-pale font-bold uppercase tracking-wider">
                        {t("contact_terminal_header")}
                      </span>
                    </div>

                    {/* ── Honeypot anti-spam (invisible para usuarios, trampa para bots) ── */}
                    <div
                      style={{ position: "absolute", left: "-9999px", top: "-9999px", width: "1px", height: "1px", overflow: "hidden" }}
                      aria-hidden="true"
                    >
                      <label htmlFor="contact-fax-hp">Fax</label>
                      <input
                        id="contact-fax-hp"
                        type="text"
                        name="fax"
                        value={formData.fax}
                        onChange={handleFormChange}
                        tabIndex={-1}
                        autoComplete="off"
                      />
                    </div>

                    {/* Sender Name */}
                    <div className="space-y-1 text-left">
                      <label className="block font-mono text-[10px] text-brand-pale/70 uppercase text-left">
                        {t("contact_name")}
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleFormChange}
                        required
                        className="w-full bg-brand-bg border border-brand-pale/10 rounded px-4 py-2.5 text-sm font-mono text-brand-pale placeholder-brand-pale/30 focus:border-brand-pink focus:outline-none text-left"
                        placeholder={t("contact_placeholder_name")}
                      />
                    </div>

                    {/* Sender Email */}
                    <div className="space-y-1 text-left">
                      <label className="block font-mono text-[10px] text-brand-pale/70 uppercase text-left">
                        {t("contact_email")}
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleFormChange}
                        required
                        className="w-full bg-brand-bg border border-brand-pale/10 rounded px-4 py-2.5 text-sm font-mono text-brand-pale placeholder-brand-pale/30 focus:border-brand-pink focus:outline-none text-left"
                        placeholder={t("contact_placeholder_email")}
                      />
                    </div>

                    {/* Signal Content */}
                    <div className="space-y-1 text-left">
                      <label className="block font-mono text-[10px] text-brand-pale/70 uppercase text-left">
                        {t("contact_message")}
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleFormChange}
                        required
                        rows={4}
                        className="w-full bg-brand-bg border border-brand-pale/10 rounded px-4 py-2.5 text-sm font-mono text-brand-pale placeholder-brand-pale/30 focus:border-brand-pink focus:outline-none resize-none text-left"
                        placeholder={t("contact_placeholder_msg")}
                      />
                    </div>
                  </div>

                  <div className="w-full mt-2">
                    {isSubmitting ? (
                      <div className="w-full p-4 bg-brand-bg border-2 border-brand-pink/50 rounded-md font-mono text-[10px] text-brand-lime leading-relaxed uppercase text-left space-y-1 shadow-[inset_0_0_15px_rgba(27,28,64,0.8)] border-dashed">
                        <div className="text-brand-pink/70 font-bold border-b border-brand-pink/15 pb-1 mb-1 flex justify-between">
                          <span>📡 UPLINK_CORE_LOG:</span>
                          <span className="animate-ping">●</span>
                        </div>
                        {terminalLines.map((line, idx) => (
                          <div key={idx} className="flex items-start space-x-1">
                            <span className="text-brand-pink select-none">❯</span>
                            <span>{line}</span>
                          </div>
                        ))}
                        {terminalLines.length < 3 && (
                          <div className="text-brand-pale/40 animate-pulse flex items-center space-x-1.5 mt-1">
                            <span className="h-1.5 w-1.5 rounded-full bg-brand-pink animate-ping" />
                            <span>Awaiting transmitter handshake sync...</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <button
                        type="submit"
                        className="w-full py-4 bg-brand-pink text-white hover:bg-brand-lime hover:text-brand-bg transition-all duration-300 font-display text-xs tracking-wider uppercase neo-brutal-border flex items-center justify-center space-x-3 cursor-pointer"
                      >
                        <Send size={13} className="animate-pulse" />
                        <span>{t("contact_submit")}</span>
                      </button>
                    )}
                  </div>
                </motion.form>
              ) : (
                <motion.div
                  key="contact-success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-8 bg-[#111232]/95 border-4 border-[#111232] rounded-xl neo-brutal-border-lime flex-grow flex flex-col justify-center items-center text-center space-y-6"
                >
                  <div className="h-16 w-16 rounded-full bg-brand-lime/10 border-2 border-brand-lime flex items-center justify-center text-brand-lime text-2xl animate-bounce">
                    ✓
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-display text-lg text-brand-lime uppercase text-center font-bold">
                      {t("contact_success")}
                    </h3>
                  </div>

                  <div className="p-3 bg-brand-bg rounded border border-brand-pale/10 font-mono text-[9px] text-[#111232] font-semibold bg-[#DBEAEC] uppercase">
                    TEL_MD5: OK_PASS_SECURE
                  </div>

                  <button
                    onClick={resetForm}
                    className="px-6 py-2.5 bg-brand-bg text-brand-lime border border-brand-lime font-mono text-xs hover:bg-brand-lime hover:text-brand-bg transition-all cursor-pointer"
                  >
                    RESET TRANSMITTER DECK
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>

      </div>
    </section>
  );
}

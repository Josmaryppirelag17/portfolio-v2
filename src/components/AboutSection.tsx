import React, { useState } from "react";
import { motion } from "motion/react";
import { Coffee, Gamepad2, Heart, Laptop, Award, Binary, HelpCircle, Target } from "lucide-react";
import { soundEngine } from "./SoundEngine";
import { useLanguage } from "../LanguageContext";
import CyberAvatar from "./CyberAvatar";
import CyberConsoleWidgets from "./CyberConsoleWidgets";

interface StatItem {
  id: string;
  labelKey: string;
  value: number;
  icon: any;
  colorClass: string;
  accentHex: string;
}

export default function AboutSection() {
  const { t } = useLanguage();
  const [stats, setStats] = useState<StatItem[]>([
    { id: "visual_polish", labelKey: "visual_polish", value: 98, icon: Laptop, colorClass: "bg-brand-pink", accentHex: "#FD1EB1" },
    { id: "code_efficiency", labelKey: "code_efficiency", value: 95, icon: Binary, colorClass: "bg-brand-cyan", accentHex: "#18BEC7" },
    { id: "audio_synths", labelKey: "audio_synths", value: 90, icon: Gamepad2, colorClass: "bg-brand-lime", accentHex: "#DCF10B" },
    { id: "caffeine_burn", labelKey: "caffeine_burn", value: 85, icon: Coffee, colorClass: "bg-brand-pink", accentHex: "#FD1EB1" },
  ]);

  const [activeTab, setActiveTab] = useState<"BIO" | "PHILOSOPHY" | "VIBES">("BIO");

  const handleStatBoost = (id: string) => {
    soundEngine.playSuccess();
    setStats((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const newValue = Math.min(100, s.value + 5);
          return { ...s, value: newValue === 100 ? 50 : newValue }; // cycles back for playful interactivity
        }
        return s;
      })
    );
  };

  return (
    <section id="about" className="py-20 bg-[#111232] border-b-4 border-[#111232] relative overflow-hidden">
      {/* Visual background lights */}
      <div className="absolute top-[20%] right-[-5%] w-[300px] h-[300px] glow-spot-lime opacity-10" />
      <div className="absolute bottom-10 left-[-5%] w-[300px] h-[300px] glow-spot-pink opacity-15" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Title */}
        <div className="flex flex-col mb-16">
          <div className="flex items-center space-x-2 text-brand-lime font-mono text-xs tracking-widest uppercase mb-2">
            <span>{t("about_system_file")}</span>
          </div>
          <h2 className="text-5xl sm:text-6xl tracking-tight uppercase italic text-transparent font-bold select-none text-left" style={{ fontFamily: '"Arial Black", "Syne", sans-serif', WebkitTextStroke: "2px #FD1EB1" }}>
            {t("about_heading")}
          </h2>
          <div className="h-1.5 w-32 bg-brand-cyan mt-3" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Playful profile visual card & custom bio info tabs */}
          <div className="lg:col-span-12 xl:col-span-5 space-y-8">
            <div className="p-6 bg-[#111232] border-4 border-[#111232] rounded-xl neo-brutal-border-lime">
              
              {/* Tab navigation headers */}
              <div className="flex border-b border-brand-lime/20 pb-3 gap-2">
                {(["BIO", "PHILOSOPHY", "VIBES"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => {
                      setActiveTab(tab);
                      soundEngine.playClick();
                    }}
                    className={`px-4 py-2 font-mono text-xs tracking-wider cursor-pointer transition-all ${
                      activeTab === tab
                        ? "bg-brand-lime text-brand-bg font-extrabold rounded"
                        : "text-brand-pale hover:text-brand-lime hover:bg-brand-lime/10"
                    }`}
                  >
                    {tab === "BIO" ? t("tab_bio") : tab === "PHILOSOPHY" ? t("tab_philosophy") : t("tab_vibes")}
                  </button>
                ))}
              </div>

              {/* Tab Contents with animations */}
              <div className="py-6 min-h-[220px]">
                {activeTab === "BIO" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <p className="font-sans text-brand-pale/90 leading-relaxed text-base">
                      {t("hero_lead_paragraph")}
                    </p>
                  </motion.div>
                )}

                {activeTab === "PHILOSOPHY" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center space-x-3 text-brand-pink">
                      <Target size={18} />
                      <h4 className="font-display text-xs uppercase text-brand-pink">{t("philosophy_title")}</h4>
                    </div>
                    <p className="font-sans text-brand-pale/85 leading-relaxed text-sm">
                      {t("philosophy_p1")}
                    </p>
                    <p className="font-sans text-brand-pale/75 leading-relaxed text-xs font-mono">
                      {t("philosophy_quote")}
                    </p>
                  </motion.div>
                )}

                {activeTab === "VIBES" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-2 gap-4"
                  >
                    <div className="p-3 bg-brand-bg/55 border border-brand-cyan/20 rounded">
                      <div className="font-display text-xs text-brand-cyan mb-1">{t("vibes_stationary_title")}</div>
                      <div className="font-sans text-xs text-brand-pale/80">{t("vibes_stationary")}</div>
                    </div>
                    <div className="p-3 bg-brand-bg/55 border border-brand-pink/20 rounded">
                      <div className="font-display text-xs text-brand-pink mb-1">{t("vibes_tunes_title")}</div>
                      <div className="font-sans text-xs text-brand-pale/80">{t("vibes_tunes")}</div>
                    </div>
                    <div className="p-3 bg-brand-bg/55 border border-brand-lime/20 rounded">
                      <div className="font-display text-xs text-brand-lime mb-1">{t("vibes_drinks_title")}</div>
                      <div className="font-sans text-xs text-brand-pale/80">{t("vibes_drinks")}</div>
                    </div>
                    <div className="p-3 bg-brand-bg/55 border border-brand-pale/20 rounded">
                      <div className="font-display text-xs text-brand-pale mb-1">{t("vibes_hobbies_title")}</div>
                      <div className="font-sans text-xs text-brand-pale/80">{t("vibes_hobbies")}</div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Bio Footer Tags */}
              <div className="flex items-center justify-between border-t border-brand-lime/20 pt-4">
                <span className="font-mono text-[9px] text-brand-pale/50 uppercase">LOVES FROM CARACAS TO THE GLOBE 🌴</span>
                <span className="flex items-center space-x-1.5 font-mono text-xs text-brand-pink">
                  <Heart size={12} className="fill-brand-pink animate-pulse" />
                  <span>JOSMARY.DEV</span>
                </span>
              </div>

            </div>
          </div>

          {/* Middle Column: WebGL 3D CCD Inverse Kinematics Live Interactive Avatar */}
          <div className="lg:col-span-12 xl:col-span-3 flex flex-col items-center justify-center p-6 bg-[#111232]/80 rounded-2xl border-4 border-[#111232] shadow-[6px_6px_0px_rgba(24,190,199,0.35)] relative overflow-visible neo-brutal-border-cyan">
            <div className="absolute top-2.5 left-4 font-mono text-[8px] text-brand-cyan tracking-widest uppercase mb-1">
              [ PROFILE_RENDERER.EXE ]
            </div>
            <div className="w-full flex justify-center py-2">
              <CyberAvatar />
            </div>
            <div className="text-center mt-4">
              <span className="font-display text-sm text-brand-lime font-bold uppercase tracking-widest">
                JOSMARY PIRELA
              </span>
              <p className="font-mono text-[9px] text-brand-pale/60 uppercase mt-1">
                PORTRAIT // TARGET LOCKED
              </p>
            </div>
          </div>

          {/* Right Column: Custom stats sliders bar graph */}
          <div className="lg:col-span-12 xl:col-span-4 space-y-6">
            <div className="p-6 bg-brand-bg/90 border-4 border-[#111232] rounded-xl neo-brutal-border-pink relative overflow-hidden">
              
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display text-sm text-brand-pink uppercase tracking-wider">
                  STAT_MATRIX (INTERACTIVE BOOT)
                </h3>
                <span className="font-mono text-[9px] text-brand-pale/40 uppercase">CLICK GAUGE TO SYNC DATA</span>
              </div>

              {/* Dynamic stats list */}
              <div className="space-y-6">
                {stats.map((s) => {
                  const IconComp = s.icon;
                  return (
                    <div 
                      key={s.id} 
                      className="group cursor-pointer select-none"
                      onClick={() => handleStatBoost(s.id)}
                    >
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="flex items-center space-x-2.5 font-mono text-xs text-brand-pale group-hover:text-brand-lime transition-colors">
                          <IconComp size={15} style={{ color: s.accentHex }} />
                          <span>{t(s.labelKey)}</span>
                        </span>
                        <span className="font-mono text-xs text-brand-pale/80 font-bold">
                          {s.value}%
                        </span>
                      </div>

                      {/* Bar frame container */}
                      <div className="h-6 w-full bg-[#111232] border border-brand-pale/10 rounded overflow-hidden p-0.5 flex relative group-hover:border-brand-lime/30 transition-all">
                        {/* Interactive fill scale */}
                        <motion.div 
                          className={`h-full ${s.colorClass} rounded-sm flex items-center justify-end px-1.5`}
                          initial={{ width: 0 }}
                          animate={{ width: `${s.value}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          style={{ boxShadow: `0 0 10px ${s.accentHex}` }}
                        >
                          {/* Inner spark */}
                          <div className="w-1.5 h-full bg-white/40 animate-pulse rounded" />
                        </motion.div>
                        
                        {/* Boost badge tooltips */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 text-[9px] font-mono text-white/90">
                          {t("boost_interactivity")}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Cyber Stats Warning */}
              <div className="mt-6 p-3 bg-brand-bg border border-brand-pink/20 rounded-md flex items-center space-x-3">
                <div className="h-2.5 w-2.5 rounded-full bg-brand-pink animate-ping shrink-0" />
                <p className="font-mono text-[10px] text-brand-pale/75 leading-tight">
                  WARNING: OVERCLOCKING WILL INCREASE SPARK DENSITIES AND MAY STIMULATE RETRO SYNTH AUDIO COEFFICIENTS!
                </p>
              </div>

            </div>
          </div>

        </div>

        {/* Dynamic Telemetry & Maximalist Widgets Bento Section */}
        <div className="mt-16 pt-10 border-t border-brand-pale/10">
          <CyberConsoleWidgets />
        </div>

      </div>
    </section>
  );
}

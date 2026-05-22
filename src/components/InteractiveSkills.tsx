import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Cpu,
  Layers,
  Radio,
  Sparkles,
  Filter,
  Percent,
  HelpCircle,
  CheckCircle,
} from "lucide-react";
import { SKILLS_DATA, SkillItem } from "../types";
import { soundEngine } from "./SoundEngine";
import { useLanguage } from "../LanguageContext";

type FilterCategory =
  | "All"
  | "Frontend"
  | "Backend"
  | "DevOps & Tools"
  | "Creative & 3D";

export default function InteractiveSkills() {
  const { t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<FilterCategory>("All");
  const [boostedSkill, setBoostedSkill] = useState<string | null>(null);

  // Filtrar datos de habilidades
  const filteredSkills = SKILLS_DATA.filter((s) => {
    if (activeCategory === "All") return true;
    return s.category === activeCategory;
  });

  const handleCategorySelect = (category: FilterCategory) => {
    setActiveCategory(category);
    soundEngine.playClick();
  };

  const handleSkillClick = (name: string) => {
    soundEngine.playSuccess();
    setBoostedSkill(name);
    setTimeout(() => {
      setBoostedSkill(null);
    }, 1200);
  };

  // Maps custom visual colors for skill blocks
  const getSkillColors = (color: string) => {
    switch (color) {
      case "brand-pink":
        return {
          bg: "bg-brand-pink/10",
          border: "border-brand-pink/30",
          text: "text-brand-pink",
          progressBg: "bg-brand-pink",
          glow: "rgba(253,30,177,0.3)",
        };
      case "brand-lime":
        return {
          bg: "bg-brand-lime/10",
          border: "border-brand-lime/30",
          text: "text-brand-lime",
          progressBg: "bg-brand-lime",
          glow: "rgba(220,241,11,0.3)",
        };
      case "brand-cyan":
      default:
        return {
          bg: "bg-brand-cyan/10",
          border: "border-brand-cyan/30",
          text: "text-brand-cyan",
          progressBg: "bg-brand-cyan",
          glow: "rgba(24,190,199,0.3)",
        };
    }
  };

  return (
    <section
      id="skills"
      className="py-20 bg-[#111232] border-b-4 border-[#111232] relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute top-[40%] right-[-10%] w-[350px] h-[350px] glow-spot-pink opacity-15" />
      <div className="absolute bottom-[10%] left-[-10%] w-[350px] h-[350px] glow-spot-lime opacity-10" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col mb-16 items-start text-left">
          <div className="flex items-center space-x-2 text-brand-cyan font-mono text-xs tracking-widest uppercase mb-2">
            <span>{t("skills_system_file")}</span>
          </div>
          <h2
            className="text-5xl sm:text-6xl tracking-tight uppercase italic text-transparent font-bold select-none text-left"
            style={{
              fontFamily: '"Arial Black", "Syne", sans-serif',
              WebkitTextStroke: "2px #FD1EB1",
            }}
          >
            {t("skills_heading")}
          </h2>
          <div className="h-1.5 w-32 bg-brand-cyan mt-3" />
        </div>

        {/* Category Filter Selector Badges */}
        <div className="flex flex-wrap gap-2.5 mb-10 bg-brand-bg/60 p-3 rounded-lg border border-brand-pane/5 text-left">
          <div className="flex items-center space-x-2 mr-3 px-1 border-r border-brand-pane/15 text-brand-pale/60 font-mono text-xs uppercase shrink-0">
            <Filter size={13} />
            <span>{t("btn_filter_tags")}</span>
          </div>

          {(
            [
              "All",
              "Frontend",
              "Backend",
              "DevOps & Tools",
              "Creative & 3D",
            ] as FilterCategory[]
          ).map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategorySelect(cat)}
              className={`px-4 py-1.5 rounded text-xs font-mono transition-all duration-200 cursor-pointer ${
                activeCategory === cat
                  ? "bg-brand-cyan text-brand-bg font-extrabold shadow-[0_0_10px_rgba(24,190,199,0.4)]"
                  : "text-brand-pale hover:bg-brand-pale/10 hover:text-white"
              }`}
            >
              {cat === "All" ? t("btn_filter_all") : cat.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Grid Lists of Skill Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredSkills.map((skill) => {
              const clrs = getSkillColors(skill.color);
              const isBoosted = boostedSkill === skill.name;

              return (
                <motion.div
                  key={skill.name}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => handleSkillClick(skill.name)}
                  className={`p-5 rounded-lg border-2 bg-brand-bg/85 relative transition-all duration-300 group cursor-pointer select-none ${
                    isBoosted
                      ? "border-brand-lime scale-102 shadow-[0_0_15px_#DCF10B]"
                      : "border-brand-pale/10 hover:border-brand-cyan/20"
                  }`}
                  style={{
                    boxShadow: isBoosted
                      ? undefined
                      : `0 0 10px rgba(17, 18, 50, 0.4)`,
                  }}
                  onMouseEnter={() => soundEngine.playHover()}
                >
                  {/* Skill level tags at top right */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-[9px] tracking-widest text-[#DBEAEC] uppercase opacity-55">
                      // {skill.category}
                    </span>
                    <span
                      className={`font-mono text-[10.5px] font-bold px-2 py-0.5 rounded ${clrs.bg} ${clrs.text}`}
                    >
                      LVL: {skill.level}%
                    </span>
                  </div>

                  {/* Skill title */}
                  <h3 className="font-display text-sm uppercase text-brand-pale mb-3 group-hover:text-white transition-colors">
                    {skill.name}
                  </h3>

                  {/* Inner scale percentage line loader */}
                  <div className="relative h-2 w-full bg-[#111232] rounded overflow-hidden border border-brand-pane/5">
                    <motion.div
                      className={`h-full ${clrs.progressBg}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${skill.level}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      style={{ boxShadow: `0 0 10px ${clrs.glow}` }}
                    />
                  </div>

                  {/* Interactive details */}
                  <div className="flex items-center justify-between mt-3 text-[9px] font-mono">
                    <span className="text-brand-pale/40 uppercase">
                      STATUS: ACTIVE_DEP
                    </span>
                    <span className="text-brand-cyan underline opacity-0 group-hover:opacity-100 transition-opacity">
                      {isBoosted ? t("skill_levelled") : t("skill_click_tip")}
                    </span>
                  </div>

                  {/* High visual spark alert on powerup */}
                  <AnimatePresence>
                    {isBoosted && (
                      <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-x-0 bottom-[-15px] flex justify-center z-20 pointer-events-none"
                      >
                        <div className="bg-brand-lime text-brand-bg px-2.5 py-0.5 rounded font-display text-[8px] uppercase border border-brand-bg shadow-md">
                          ⚡ SPARKS ARPEGGIATED!
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Dynamic skills context message box */}
        <div className="mt-12 p-4 bg-brand-bg/60 border border-brand-cyan/15 rounded-lg flex items-center justify-between">
          <div className="flex items-center space-x-3 text-[#18BEC7] text-left">
            <CheckCircle size={16} className="shrink-0" />
            <p className="font-mono text-[11px] text-[#DBEAEC]/80 leading-normal text-left">
              {t("skills_disclaimer")}
            </p>
          </div>
          <span className="font-mono text-[9px] text-brand-pale/40 uppercase hidden sm:inline ml-4">
            VER: V19.2.4_PASS
          </span>
        </div>
      </div>
    </section>
  );
}

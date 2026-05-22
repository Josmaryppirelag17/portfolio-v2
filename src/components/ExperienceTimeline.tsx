import React, { useState } from "react";
import { motion } from "motion/react";
import { useLanguage } from "../LanguageContext";
import { soundEngine } from "./SoundEngine";

export default function ExperienceTimeline() {
  const [hoveredMilestoneId, setHoveredMilestoneId] = useState<string | null>(null);
  const { experience, t } = useLanguage();

  const handleMilestoneHover = (id: string | null) => {
    setHoveredMilestoneId(id);
    if (id) {
      soundEngine.playHover();
    }
  };

  return (
    <section id="experience" className="py-20 bg-brand-bg border-b-4 border-brand-bg relative overflow-hidden cyber-grid">
      {/* Visual background lights */}
      <div className="absolute top-[20%] right-[-10%] w-[400px] h-[400px] glow-spot-cyan opacity-10" />
      <div className="absolute bottom-[20%] left-[-10%] w-[400px] h-[400px] glow-spot-pink opacity-15" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col mb-16 items-start">
          <div className="flex items-center space-x-2 text-brand-pink font-mono text-xs tracking-widest uppercase mb-2">
            <span>{t("journey_system_file")}</span>
          </div>
          <h2 className="text-5xl sm:text-6xl tracking-tight uppercase italic text-transparent font-bold select-none text-left" style={{ fontFamily: '"Arial Black", "Syne", sans-serif', WebkitTextStroke: "2px #FD1EB1" }}>
            {t("journey_heading")}
          </h2>
          <div className="h-1.5 w-32 bg-brand-pink mt-3" />
        </div>

        {/* Central timeline construct */}
        <div className="relative border-l-4 border-[#111232] ml-4 md:ml-10 pl-6 md:pl-10 space-y-12 py-4">
          
          {experience.map((milestone, idx) => {
            const isHovered = hoveredMilestoneId === milestone.id;
            
            return (
              <div 
                key={milestone.id}
                className="relative cursor-pointer"
                onMouseEnter={() => handleMilestoneHover(milestone.id)}
                onMouseLeave={() => handleMilestoneHover(null)}
                onClick={() => soundEngine.playClick()}
              >
                
                {/* Timeline node bullet point spark */}
                <div className={`absolute left-[-32px] md:left-[-48px] top-1.5 h-6 w-6 rounded-full border-4 border-[#111232] transition-all duration-300 flex items-center justify-center ${
                  isHovered
                    ? "bg-brand-pink scale-135 shadow-[0_0_12px_#FD1EB1]"
                    : "bg-brand-cyan"
                }`}>
                  <div className="h-1 w-1 bg-[#111232] rounded-full" />
                </div>

                {/* Main card box frame */}
                <motion.div
                  className={`p-6 rounded-xl border-3 transition-all duration-300 relative overflow-hidden ${
                    isHovered
                      ? "bg-[#111232]/95 border-brand-pink shadow-[0_0_18px_rgba(253,30,177,0.25)]"
                      : "bg-[#111232]/85 border-brand-pale/10"
                  }`}
                  whileHover={{ y: -3 }}
                >
                  
                  {/* Glowing subtle edge decoration */}
                  <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-gradient-to-b from-brand-cyan to-brand-pink" />

                  {/* Header Row: Role & Details */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between pb-3 border-b border-brand-pale/10 gap-3">
                    <div className="space-y-1 text-left">
                      <span className="font-mono text-[10px] text-brand-lime font-bold tracking-widest uppercase">
                        {milestone.period}
                      </span>
                      <h3 className="font-display text-base tracking-wide text-brand-pale group-hover:text-white uppercase select-none font-bold text-left">
                        {milestone.role}
                      </h3>
                      <div className="font-sans text-xs text-brand-cyan font-bold uppercase tracking-wider">
                        @ {milestone.company}
                      </div>
                    </div>

                    {/* Cyber badge indicator */}
                    <div className="text-[9px] font-mono text-brand-pale/60 bg-brand-bg px-2.5 py-1 rounded self-start md:self-center border border-brand-pale/5 uppercase">
                      SYS_LOG_ENTRY_{idx + 1}
                    </div>
                  </div>

                  {/* Body bullet notes */}
                  <div className="py-4 space-y-3 text-left">
                    <p className="font-sans text-sm text-brand-pale/85 leading-relaxed">
                      {milestone.description}
                    </p>

                    <div className="pl-4 border-l border-brand-cyan/20 space-y-2">
                      {milestone.bullets.map((bullet, bIdx) => (
                        <div key={bIdx} className="flex items-start space-x-2 text-xs font-sans text-brand-pale/80 max-w-2xl leading-relaxed text-left">
                          <span className="text-brand-cyan mt-0.5">»</span>
                          <span>{bullet}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tags footer */}
                  <div className="flex flex-wrap gap-2 pt-2 border-t border-brand-pale/5">
                    {milestone.tags.map((tag, tagIdx) => (
                      <span 
                        key={tagIdx} 
                        className="font-mono text-[9px] tracking-wider text-brand-bg font-extrabold bg-[#DBEAEC] px-2 py-0.5 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                </motion.div>

              </div>
            );
          })}

        </div>

      </div>
    </section>
  );
}

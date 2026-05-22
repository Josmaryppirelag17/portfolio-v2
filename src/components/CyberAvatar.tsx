import React, { useState, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import InteractiveGrid from "./InteractiveGrid";

export default function CyberAvatar() {
  const [blink, setBlink] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Sistemas de resortes de alto rendimiento para un paralaje fluido y sin lag
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 120, damping: 20, mass: 0.8 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Derivar posiciones de profundidad con offsets del ratón
  const hoverHexX = useTransform(smoothX, [-1, 1], [-25, 25]);
  const hoverHexY = useTransform(smoothY, [-1, 1], [-25, 25]);

  // Transformaciones sutiles de paralaje de fondo mejoradas
  const bgGlowX = useTransform(smoothX, [-1, 1], [-18, 18]);
  const bgGlowY = useTransform(smoothY, [-1, 1], [-18, 18]);

  const gridParallaxX = useTransform(smoothX, [-1, 1], [-8, 8]);
  const gridParallaxY = useTransform(smoothY, [-1, 1], [-8, 8]);

  const hudRingsX = useTransform(smoothX, [-1, 1], [-15, 15]);
  const hudRingsY = useTransform(smoothY, [-1, 1], [-15, 15]);

  const hexMatrixX = useTransform(smoothX, [-1, 1], [-28, 28]);
  const hexMatrixY = useTransform(smoothY, [-1, 1], [-28, 28]);

  const avatarX = useTransform(smoothX, [-1, 1], [-14, 14]);
  const avatarY = useTransform(smoothY, [-1, 1], [-10, 10]);
  const avatarRotateY = useTransform(smoothX, [-1, 1], [-18, 18]);
  const avatarRotateX = useTransform(smoothY, [-1, 1], [14, -14]);

  const eyeX = useTransform(smoothX, [-1, 1], [-6, 6]);
  const eyeY = useTransform(smoothY, [-1, 1], [5, -5]);

  const bangSwayX = useTransform(smoothX, [-1, 1], [-5, 5]);
  const bangSwayY = useTransform(smoothY, [-1, 1], [-3, 3]);
  const backHairSwayX = useTransform(smoothX, [-1, 1], [-3, 3]);
  const backHairSwayY = useTransform(smoothY, [-1, 1], [-2, 2]);

  // Bucle automático de parpadeo natural
  useEffect(() => {
    const handleBlink = () => {
      setBlink(true);
      setTimeout(() => setBlink(false), 140);
    };

    const interval = setInterval(() => {
      if (Math.random() < 0.6) {
        handleBlink();
        if (Math.random() < 0.25) {
          setTimeout(handleBlink, 280);
        }
      }
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;

    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  return (
    <div
      className="relative w-80 h-96 mx-auto cursor-pointer flex items-center justify-center select-none overflow-visible"
      style={{ perspective: "1500px" }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      id="cyber-avatar-canvas"
    >
      {/* 1. BRILLOS DE FONDO CYBER EN CAPAS */}
      <motion.div
        className="absolute inset-0 rounded-3xl transition-all duration-700 blur-2xl opacity-45 mix-blend-screen -z-10"
        style={{
          x: bgGlowX,
          y: bgGlowY,
          background: isHovered
            ? "radial-gradient(circle, rgba(253,30,177,0.4) 0%, rgba(24,190,199,0.25) 50%, transparent 80%)"
            : "radial-gradient(circle, rgba(24,190,199,0.25) 0%, rgba(17,18,50,0.4) 75%, transparent 100%)",
        }}
      />

      {/* Segmento de cuadrícula interactiva futurista y hexágonos voladores */}
      <div className="absolute inset-4 overflow-hidden rounded-2xl border border-[#111232] bg-[#090b1c]/80 -z-10 shadow-[inset_0_0_16px_rgba(24,190,199,0.1)]">
        {/* Trazas de cuadrícula neón flexibles y reactivas con paralaje estructural sutil */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            x: gridParallaxX,
            y: gridParallaxY,
          }}
        >
          <InteractiveGrid />
        </motion.div>

        {/* Matrices holográficas hexagonales de fondo (capa profunda independiente de paralaje) */}
        <motion.div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            x: hexMatrixX,
            y: hexMatrixY,
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='49' viewBox='0 0 28 49'%3E%3Cpath fill='%2318BEC7' fill-opacity='0.4' d='M14 0 L28 8 L28 24 L14 32 L0 24 L0 8 Z'/%3E%3C/svg%3E")`,
            backgroundSize: "28px 49px",
            backgroundRepeat: "repeat",
          }}
        />

        {/* Responsive mechanical HUD rings */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none"
          style={{
            x: hudRingsX,
            y: hudRingsY,
          }}
        >
          <div
            className="w-60 h-60 rounded-full border border-dashed border-[#18BEC7]/20 animate-spin"
            style={{ animationDuration: "35s" }}
          />
          <div
            className="absolute w-48 h-48 rounded-full border border-dotted border-[#FD1EB1]/20 animate-spin"
            style={{ animationDuration: "25s", animationDirection: "reverse" }}
          />
        </motion.div>
      </div>

      {/* 2. MAIN CHARACTER ENGINE (SKELETON CONTAINER WITH 3D PRESERVE DEPTH) */}
      <motion.div
        className="relative w-72 h-80 flex items-center justify-center"
        style={{
          transformStyle: "preserve-3d",
          x: avatarX,
          y: avatarY,
          rotateY: avatarRotateY,
          rotateX: avatarRotateX,
        }}
      >
        {/* ========================================================= */}
        {/* BACK HAIR VOLUME (Dark, slightly wavy - Layer 1)         */}
        {/* ========================================================= */}
        <motion.div
          className="absolute w-56 h-72 rounded-full overflow-hidden bg-gradient-to-b from-[#0c0d12] via-[#121319] to-[#08090b] shadow-[0_15px_30px_rgba(0,0,0,0.7)] border-2 border-[#1a1c23]/30"
          style={{
            transform: "translateZ(-30px)",
            borderRadius: "44% 44% 38% 38% / 54% 54% 46% 46%",
            x: backHairSwayX,
            y: backHairSwayY,
          }}
        >
          {/* Subtle dark hair gradients and streaks */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-[#2b2e3c]/20 to-transparent" />

          {/* Slightly wavy side volume shadows representing locks */}
          <div className="absolute -left-6 top-1/3 w-16 h-44 bg-[#0c0d12] rounded-full transform -rotate-12 filter blur-[2px] opacity-90" />
          <div className="absolute -right-6 top-1/3 w-16 h-44 bg-[#0c0d12] rounded-full transform rotate-12 filter blur-[2px] opacity-90" />

          {/* Interactive cyber nano neon fibers embedded inside the back locks */}
          <motion.div
            className="absolute left-10 top-12 w-[1.5px] h-36 bg-gradient-to-b from-[#FD1EB1] to-transparent opacity-40 rounded-full"
            animate={{
              opacity: blink ? 0.9 : isHovered ? 0.7 : 0.4,
              scaleY: blink ? 1.15 : 1.0,
            }}
            transition={{ duration: 0.15 }}
          />
          <motion.div
            className="absolute right-12 top-16 w-[1.5px] h-32 bg-gradient-to-b from-[#18BEC7] to-transparent opacity-40 rounded-full"
            animate={{
              opacity: blink ? 0.9 : isHovered ? 0.7 : 0.4,
              scaleY: blink ? 1.15 : 1.0,
            }}
            transition={{ duration: 0.15 }}
          />

          {/* Micro digital nodes sparking on mouse hover or blink trigger */}
          <motion.div
            className="absolute left-[38px] top-28 w-1 h-1 rounded-full bg-[#FD1EB1]"
            animate={{
              scale: blink ? [1, 2.5, 1] : isHovered ? [1, 1.8, 1] : 1,
              boxShadow: blink
                ? "0 0 12px 3px #FD1EB1, 0 0 4px #FD1EB1"
                : "0 0 6px 1px #FD1EB1",
            }}
            transition={{ duration: 0.35 }}
          />
          <motion.div
            className="absolute right-[46px] top-36 w-1 h-1 rounded-full bg-[#18BEC7]"
            animate={{
              scale: blink ? [1, 2.5, 1] : isHovered ? [1, 1.8, 1] : 1,
              boxShadow: blink
                ? "0 0 12px 3px #18BEC7, 0 0 4px #18BEC7"
                : "0 0 6px 1px #18BEC7",
            }}
            transition={{ duration: 0.35 }}
          />
        </motion.div>

        {/* ========================================================= */}
        {/* SHOULDER AND JACKET OUTFIT (Futuristic Techwear - Layer 2) */}
        {/* ========================================================= */}
        <motion.div
          className="absolute bottom-2 w-64 h-26 overflow-visible"
          style={{
            transform: "translateZ(-15px)",
          }}
        >
          {/* Dark Charcoal futuristic leather-style high collar jacket */}
          <div
            className="w-full h-full bg-[#11121d] border-4 border-[#141525] relative shadow-[0_12px_24px_rgba(0,0,0,0.65)]"
            style={{
              borderRadius: "44% 44% 18% 18% / 70% 70% 0% 0%",
              boxShadow:
                "0px 8px 0px #090a12, inset 0 8px 16px rgba(24,190,199,0.12)",
            }}
          >
            {/* Cyberpunk high-collar neck lining cutout */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1.5 w-22 h-9 bg-[#090a12] rounded-b-3xl flex items-center justify-center border-b border-[#141525]">
              <div className="w-14 h-1 bg-[#18BEC7] animate-pulse" />
            </div>

            {/* Neon Accent Cyber Piping on Jacket seams */}
            <div className="absolute top-4 left-5 w-18 h-1.5 bg-[#FD1EB1] rounded-full transform rotate-12 shadow-[0_0_8px_#FD1EB1]" />
            <div className="absolute top-4 right-5 w-18 h-1.5 bg-[#18BEC7] rounded-full transform -rotate-12 shadow-[0_0_8px_#18BEC7]" />

            {/* Symmetric futuristic zipper core with safety decals */}
            <div className="absolute top-10 left-1/2 -translate-x-1/2 w-2 h-14 bg-[#23253b] border border-[#0d0e1a] rounded-sm">
              <div className="w-3 h-5 bg-[#090a12] border-2 border-[#18BEC7] rounded-sm mx-auto -mt-1 transform rotate-45 shadow-[0_0_4px_rgba(24,190,199,0.5)]" />
            </div>

            {/* Little shoulder rivets indicating armor plates */}
            <div className="absolute top-8 left-10 w-2 h-2 rounded-full bg-[#323652] border border-[#090a12]" />
            <div className="absolute top-8 right-10 w-2 h-2 rounded-full bg-[#323652] border border-[#090a12]" />
          </div>
        </motion.div>

        {/* ========================================================= */}
        {/* THE NECK (Layer 3)                                        */}
        {/* ========================================================= */}
        <div
          className="absolute bottom-18 w-10 h-16 bg-gradient-to-b from-[#947761] to-[#735a47] border-x-4 border-[#090a12]"
          style={{
            transform: "translateZ(-10px)",
            borderRadius: "0 0 8px 8px",
          }}
        />

        {/* ========================================================= */}
        {/* THE OVAL HEAD ASSEMBLY (Aligned and symmetrical - Layer 4) */}
        {/* ========================================================= */}
        <motion.div
          className="absolute w-52 h-68 flex items-center justify-center overflow-visible"
          style={{
            transformStyle: "preserve-3d",
            transform: "translateZ(8px)",
          }}
        >
          <div className="relative w-full h-full flex items-center justify-center">
            {/* ==================================================== */}
            {/* HAIR SIDES / WRAPPING WAVES (Behind Face)            */}
            {/* ==================================================== */}
            <div className="absolute inset-0 z-0">
              {/* Left flowing wavy dark hair bundle */}
              <div
                className="absolute left-[-10px] top-20 w-20 h-44 bg-gradient-to-b from-[#0c0d12] to-[#151620] border-4 border-[#090a12]"
                style={{
                  borderRadius: "50% 50% 30% 60% / 60% 40% 60% 40%",
                  boxShadow: "-4px 6px 0px rgba(0,0,0,0.2)",
                }}
              />
              {/* Right flowing wavy dark hair bundle */}
              <div
                className="absolute right-[-10px] top-20 w-20 h-44 bg-gradient-to-b from-[#0c0d12] to-[#151620] border-4 border-[#090a12]"
                style={{
                  borderRadius: "50% 50% 60% 30% / 40% 60% 40% 60%",
                  boxShadow: "4px 6px 0px rgba(0,0,0,0.2)",
                }}
              />
            </div>

            {/* ==================================================== */}
            {/* THE OVAL SKINNED FACE (Classic Cyborg - Layer 4.2)   */}
            {/* ==================================================== */}
            <div
              className="absolute w-40 h-52 bg-gradient-to-b from-[#a18167] via-[#947761] to-[#7f6049] border-4 border-[#090a12] flex flex-col items-center justify-center relative overflow-visible z-10"
              style={{
                borderRadius: "50% 50% 40% 40% / 55% 55% 45% 45%",
                boxShadow:
                  "0px 10px 0px #090a12, inset 0 4px 12px rgba(255,255,255,0.08)",
              }}
            >
              {/* Ears */}
              <div className="absolute left-[-11px] top-[43%] w-4 h-9 bg-[#947761] border-4 border-r-0 border-[#090a12] rounded-l-full transform -rotate-12" />
              <div className="absolute right-[-11px] top-[43%] w-4 h-9 bg-[#947761] border-4 border-l-0 border-[#090a12] rounded-r-full transform rotate-12" />

              {/* Rosy/Fluorescent cheeks blush */}
              <div className="absolute left-4 top-[54%] w-8 h-4 rounded-full bg-[#FD1EB1] opacity-25 blur-[1.5px] transform -rotate-6" />
              <div className="absolute right-4 top-[54%] w-8 h-4 rounded-full bg-[#FD1EB1] opacity-25 blur-[1.5px] transform rotate-6" />

              {/* Cute button nose with depth shading */}
              <div
                className="absolute top-[50%] w-3.5 h-3.5 rounded-full border-t border-[#0d0e1a] bg-[#80624a]"
                style={{ boxShadow: "inset 0px -1.5px 2px rgba(0,0,0,0.3)" }}
              />

              {/* ==================================================== */}
              {/* DARK EXPRESSIVE EYES (Pupila tracking cursor)       */}
              {/* ==================================================== */}
              <div className="absolute top-[32%] w-full px-5 flex justify-between z-10">
                {/* LEFT EYE */}
                <div
                  className="w-10 h-10 bg-[#fafafc] border-4 border-[#090a12] rounded-full relative overflow-hidden flex items-center justify-center"
                  style={{
                    borderRadius: "50% 50% 45% 45% / 52% 52% 48% 48%",
                    boxShadow: "inset 0px 3px 5px rgba(0,0,0,0.25)",
                  }}
                >
                  {/* Dynamic Dark Pupil / Glistening Iris */}
                  <motion.div
                    className="w-6 h-6 bg-[#16171b] rounded-full relative flex items-center justify-center border border-zinc-950"
                    style={{
                      x: eyeX,
                      y: eyeY,
                    }}
                  >
                    {/* Dark brown interior gloss layer */}
                    <div className="w-4.5 h-4.5 bg-[#251f1c] rounded-full opacity-65 absolute" />

                    {/* Glassy speculums / reflections */}
                    <div className="absolute top-0.5 right-0.5 w-2 h-2 bg-white rounded-full" />
                    <div className="absolute bottom-1 left-1.5 w-1 h-1 bg-white rounded-full opacity-70" />
                  </motion.div>

                  {/* Standard rapid blink animation cover panel */}
                  <motion.div
                    className="absolute inset-x-0 top-0 bg-[#947761] border-b-4 border-[#090a12]"
                    animate={{
                      height: blink ? "100%" : "0%",
                    }}
                    transition={{ duration: 0.12 }}
                  />
                </div>

                {/* RIGHT EYE */}
                <div
                  className="w-10 h-10 bg-[#fafafc] border-4 border-[#090a12] rounded-full relative overflow-hidden flex items-center justify-center"
                  style={{
                    borderRadius: "50% 50% 45% 45% / 52% 52% 48% 48%",
                    boxShadow: "inset 0px 3px 5px rgba(0,0,0,0.25)",
                  }}
                >
                  {/* Dynamic Dark Pupil */}
                  <motion.div
                    className="w-6 h-6 bg-[#16171b] rounded-full relative flex items-center justify-center border border-zinc-950"
                    style={{
                      x: eyeX,
                      y: eyeY,
                    }}
                  >
                    <div className="w-4.5 h-4.5 bg-[#251f1c] rounded-full opacity-65 absolute" />

                    <div className="absolute top-0.5 right-0.5 w-2 h-2 bg-white rounded-full" />
                    <div className="absolute bottom-1 left-1.5 w-1 h-1 bg-white rounded-full opacity-70" />
                  </motion.div>

                  {/* Standard blink cover panel */}
                  <motion.div
                    className="absolute inset-x-0 top-0 bg-[#947761] border-b-4 border-[#090a12]"
                    animate={{
                      height: blink ? "100%" : "0%",
                    }}
                    transition={{ duration: 0.12 }}
                  />
                </div>
              </div>

              {/* Eye Brows */}
              <div className="absolute top-[26%] w-full px-5 flex justify-between z-15">
                <div
                  className="w-10 h-2 bg-[#090a12] rounded-full transform rotate-3"
                  style={{ borderRadius: "50% 50% 10% 10% / 100% 100% 0 0" }}
                />
                <div
                  className="w-10 h-2 bg-[#090a12] rounded-full transform -rotate-3"
                  style={{ borderRadius: "50% 50% 10% 10% / 100% 100% 0 0" }}
                />
              </div>

              {/* ==================================================== */}
              {/* CYBERNETIC GLASSES (Glowing Neon Pink - Layer 4.5)  */}
              {/* ==================================================== */}
              <div
                className="absolute top-[28%] w-full px-1.5 flex justify-between items-center z-20 pointer-events-none"
                style={{
                  transform: "translateZ(14px)",
                }}
              >
                {/* Left Frame Rim with custom cyber shapes */}
                <div
                  className="w-15 h-14 rounded-md border-4 border-[#FD1EB1] bg-[#FD1EB1]/10 flex items-center justify-center shadow-[0_0_12px_#FD1EB1,inset_0_0_6px_rgba(253,30,177,0.3)]"
                  style={{ borderRadius: "40% 40% 30% 30% / 40% 40% 30% 30%" }}
                >
                  {/* Lens light flash overlay */}
                  <div className="w-8 h-1 bg-white/20 rounded-full transform -rotate-45 absolute top-3 left-2" />
                </div>

                {/* Minimal techy central bridge bar */}
                <div className="h-2 bg-[#FD1EB1] flex-grow -mx-1 shadow-[0_0_8px_#FD1EB1]" />

                {/* Right Frame Rim with custom cyber shapes */}
                <div
                  className="w-15 h-14 rounded-md border-4 border-[#FD1EB1] bg-[#FD1EB1]/10 flex items-center justify-center shadow-[0_0_12px_#FD1EB1,inset_0_0_6px_rgba(253,30,177,0.3)]"
                  style={{ borderRadius: "40% 40% 30% 30% / 40% 40% 30% 30%" }}
                >
                  <div className="w-8 h-1 bg-white/20 rounded-full transform -rotate-45 absolute top-3 left-2" />
                </div>
              </div>

              {/* ==================================================== */}
              {/* ASYMMETRIC COOL GRIN / MOUTH (Layer 4.6)              */}
              {/* ==================================================== */}
              <div className="absolute top-[67%] z-15">
                <motion.div
                  className="relative w-11 h-4 border-b-4 border-[#090a12] rounded-b-full bg-transparent transform cursor-pointer"
                  style={{
                    borderRadius: "0 0 100% 100% / 0 0 100% 100%",
                  }}
                  animate={{
                    scaleY: isHovered ? 1.4 : 1.0,
                    rotate: isHovered ? 2 : 0,
                    x: isHovered ? 1 : 0,
                  }}
                >
                  <div className="absolute -right-0.5 -top-0.5 w-1 h-1 rounded-full bg-[#090a12]" />
                </motion.div>
              </div>

              {/* Cyber metallic chin plating strip */}
              <div className="absolute bottom-2.5 w-6 h-1 bg-[#18BEC7] rounded-full opacity-40 animate-pulse" />
            </div>

            {/* ==================================================== */}
            {/* FRONT HAIR BANGS / WAVY CASCADE (Layer 5)            */}
            {/* ==================================================== */}
            <motion.div
              className="absolute inset-0 z-30 pointer-events-none"
              style={{
                x: bangSwayX,
                y: bangSwayY,
              }}
            >
              {/* Large styled swooping dark front bang */}
              <div
                className="absolute left-[-10px] top-[-5px] w-48 h-20 bg-[#0c0d12] border-t-0 border-r-0 border-4 border-[#090a12]"
                style={{
                  borderRadius: "50% 100% 0% 100% / 100% 100% 0% 100%",
                }}
              >
                {/* Embedded Glowing pink fiber-optic strand */}
                <motion.div
                  className="absolute bottom-1 right-6 w-22 h-1 bg-[#FD1EB1] rounded-full"
                  animate={{
                    boxShadow: blink
                      ? "0 0 20px 5px #FD1EB1, 0 0 8px #FD1EB1"
                      : isHovered
                        ? "0 0 12px 2px #FD1EB1, 0 0 5px #FD1EB1"
                        : "0 0 6px #FD1EB1",
                    opacity: isHovered ? 0.95 : 0.75,
                  }}
                  transition={{ duration: 0.12 }}
                />

                {/* Glinting node representation on bang termination */}
                <motion.div
                  className="absolute top-4 right-10 w-1.5 h-1.5 bg-white rounded-full"
                  animate={{
                    scale: blink ? [1, 2.2, 1] : [0.8, 1.2, 0.8],
                    opacity: [0.6, 1, 0.6],
                    boxShadow: "0 0 8px #fff",
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.8,
                    ease: "easeInOut",
                  }}
                />
              </div>

              {/* Secondary right-side hair lock */}
              <div
                className="absolute right-[-10px] top-5 w-26 h-18 bg-[#0c0d12] border-t-0 border-l-0 border-4 border-[#090a12]"
                style={{
                  borderRadius: "100% 50% 100% 0% / 100% 100% 100% 0%",
                }}
              >
                {/* Glowing cyan fiber highlight */}
                <motion.div
                  className="absolute bottom-1.5 left-4 w-14 h-1 bg-[#18BEC7] rounded-full"
                  animate={{
                    boxShadow: blink
                      ? "0 0 20px 5px #18BEC7, 0 0 8px #18BEC7"
                      : isHovered
                        ? "0 0 12px 2px #18BEC7, 0 0 5px #18BEC7"
                        : "0 0 6px #18BEC7",
                    opacity: isHovered ? 0.95 : 0.75,
                  }}
                  transition={{ duration: 0.12 }}
                />
              </div>

              {/* Side burns/fringe extensions hugging the jawline */}
              <div
                className="absolute left-[-12px] top-18 w-6 h-22 bg-[#0c0d12] border-l-4 border-b-4 border-[#090a12]"
                style={{ borderRadius: "100% 0 100% 100% / 100% 0 100% 100%" }}
              />
              <div
                className="absolute right-[-12px] top-18 w-8 h-26 bg-[#0c0d12] border-r-4 border-b-4 border-[#090a12]"
                style={{ borderRadius: "0 100% 100% 100% / 0 100% 100% 100%" }}
              >
                {/* Minimal cyber hairpin cross decoration on side locks */}
                <div className="absolute top-10 right-1.5 w-3 h-0.5 bg-[#18BEC7] transform rotate-45 shadow-[0_0_4px_#18BEC7]">
                  <div className="absolute w-0.5 h-3 bg-[#18BEC7] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>

      {/* 3. SCI-FI CORNER DECORATIONS & METRIC CALLOUTS */}
      <div className="absolute top-2.5 right-4 z-20 pointer-events-none">
        <div className="flex items-center space-x-1 bg-[#090b1c]/90 border border-[#FD1EB1]/35 px-2 py-0.5 rounded backdrop-blur-sm shadow-md">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FD1EB1] animate-ping" />
          <span className="font-mono text-[8px] text-[#FD1EB1] tracking-widest uppercase">
            CSS VIRTUAL_AV_1.0
          </span>
        </div>
      </div>

      <div className="absolute bottom-2.5 left-4 z-20 pointer-events-none">
        <span className="font-mono text-[8px] text-brand-cyan/50 tracking-widest uppercase block">
          SYSTEM: ONLINE
        </span>
      </div>

      <div className="absolute bottom-2.5 right-4 z-20 pointer-events-none">
        <span className="font-mono text-[8px] text-brand-pale/40 tracking-wider uppercase block">
          INTERACTIVE DEEP ENGINE
        </span>
      </div>
    </div>
  );
}

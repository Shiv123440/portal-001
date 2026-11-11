import React from 'react';

interface ShowcaseOverlayProps {
  progress: number; // 0 to 1
  onCancel: () => void;
}

export const ShowcaseOverlay: React.FC<ShowcaseOverlayProps> = ({
  progress,
  onCancel,
}) => {
  // 0-3s: What if you could enter another world?
  // 3-6s: Ancient runes activate, portal opening
  // 6-10s: Hyperspace travel sequence
  // 10-14s: The Enchanted Sylva
  // 14-18s: Neo-Kowloon 2099 Cyberpunk
  // 18-21s: Cosmic Genesis
  // 21-23s: Abyssal Atlantis
  // 23-25s: How many worlds can you discover?

  let title = "WHAT IF YOU COULD ENTER ANOTHER WORLD?";
  let subtitle = "PORTAL 001 | BEYOND REALITY";

  if (progress < 0.12) {
    title = "WHAT IF YOU COULD ENTER ANOTHER WORLD?";
    subtitle = "Ancient Nexus Awakening";
  } else if (progress < 0.24) {
    title = "RUNES ALIGNING. PORTAL OPENING.";
    subtitle = "Dimensional Singularity Formed";
  } else if (progress < 0.40) {
    title = "HYPERSPACE VORTEX ACCELERATION";
    subtitle = "Breaching Space-Time Curvature";
  } else if (progress < 0.56) {
    title = "DIMENSION I: THE ENCHANTED SYLVA";
    subtitle = "Bioluminescent Canopy & Sacred Waters";
  } else if (progress < 0.72) {
    title = "DIMENSION II: NEO-KOWLOON 2099";
    subtitle = "Megastructure Skyline & Neon Corridors";
  } else if (progress < 0.84) {
    title = "DIMENSION III: NEBULA GENESIS";
    subtitle = "Planetary Orbit & Celestial Nursery";
  } else if (progress < 0.92) {
    title = "DIMENSION IV: ABYSSAL ATLANTIS";
    subtitle = "Sunken Colosseum of the Deep";
  } else {
    title = "HOW MANY WORLDS CAN YOU DISCOVER?";
    subtitle = "PORTAL 001 | BEYOND REALITY";
  }

  return (
    <div className="fixed inset-0 z-50 pointer-events-none flex flex-col justify-between p-6 sm:p-12 animate-fade-in">
      {/* Top Progress Bar */}
      <div className="w-full max-w-xl mx-auto flex flex-col items-center gap-1.5">
        <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden border border-white/20">
          <div
            className="h-full bg-gradient-to-r from-portal-cyan via-portal-neon to-portal-gold transition-all duration-100 ease-linear"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
        <div className="flex justify-between w-full text-[10px] font-orbitron text-portal-cyan/80 tracking-widest uppercase">
          <span>CINEMATIC SHOWCASE</span>
          <span>{Math.round(progress * 25)}s / 25s</span>
        </div>
      </div>

      {/* Center Cinematic Proclamation */}
      <div className="text-center my-auto max-w-xl mx-auto">
        <h2 className="font-cinzel text-3xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-portal-cyan to-portal-neon tracking-wider drop-shadow-[0_4px_25px_rgba(0,242,254,0.7)] mb-2">
          {title}
        </h2>
        <p className="font-orbitron text-xs sm:text-sm text-portal-cyan tracking-[0.3em] uppercase">
          {subtitle}
        </p>
      </div>

      {/* Cancel Showcase Action */}
      <div className="flex justify-center pointer-events-auto">
        <button
          onClick={onCancel}
          className="px-5 py-2 rounded-full bg-black/60 hover:bg-black/90 text-neutral-300 hover:text-white border border-white/20 text-xs font-rajdhani tracking-widest uppercase backdrop-blur-md transition-all"
        >
          Skip Showcase
        </button>
      </div>
    </div>
  );
};

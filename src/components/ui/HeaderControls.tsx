import React from 'react';
import { Volume2, VolumeX, Smartphone, Monitor, Film, Play, RotateCcw, Sparkles } from 'lucide-react';
import { AspectRatioMode, QualityTier } from '../../types';

interface HeaderControlsProps {
  isMuted: boolean;
  onToggleMute: () => void;
  aspectMode: AspectRatioMode;
  onToggleAspect: (mode: AspectRatioMode) => void;
  quality: QualityTier;
  onToggleQuality: () => void;
  onStartShowcase: () => void;
  isShowcaseRunning: boolean;
  onResetWorld: () => void;
}

export const HeaderControls: React.FC<HeaderControlsProps> = ({
  isMuted,
  onToggleMute,
  aspectMode,
  onToggleAspect,
  quality,
  onToggleQuality,
  onStartShowcase,
  isShowcaseRunning,
  onResetWorld,
}) => {
  return (
    <header className="fixed top-3 inset-x-3 sm:top-5 sm:inset-x-6 z-40 flex items-center justify-between pointer-events-none">
      {/* Brand & Project Identity */}
      <div className="flex items-center gap-2 sm:gap-3 pointer-events-auto">
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-portal-cyan/50 bg-[#0a0c1a]/80 backdrop-blur-md flex items-center justify-center shadow-[0_0_15px_rgba(0,242,254,0.4)]">
          <div className="w-3 h-3 rounded-full bg-gradient-to-tr from-portal-cyan to-portal-neon animate-pulse" />
        </div>
        <div>
          <h1 className="font-orbitron text-xs sm:text-sm font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-portal-cyan via-white to-portal-neon">
            PORTAL 001
          </h1>
          <p className="font-rajdhani text-[9px] sm:text-[11px] text-portal-cyan/70 tracking-wider uppercase">
            Beyond Reality
          </p>
        </div>
      </div>

      {/* Quick Action Dock */}
      <div className="flex items-center gap-1.5 sm:gap-2 pointer-events-auto bg-[#0a0d1e]/80 backdrop-blur-xl border border-white/10 p-1 sm:p-1.5 rounded-2xl shadow-2xl">
        {/* 25s Showcase Storyboard Button */}
        <button
          onClick={onStartShowcase}
          disabled={isShowcaseRunning}
          title="Play 25-Second Cinematic Showcase"
          className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl font-rajdhani text-xs font-semibold tracking-wider transition-all ${
            isShowcaseRunning
              ? 'bg-portal-cyan text-black font-bold animate-pulse'
              : 'bg-portal-cyan/15 hover:bg-portal-cyan/25 text-portal-cyan border border-portal-cyan/40 shadow-[0_0_12px_rgba(0,242,254,0.3)]'
          }`}
        >
          <Play className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">25s SHOWCASE</span>
        </button>

        {/* 9:16 Short-Form Recording Mode Toggle */}
        <div className="flex items-center bg-black/40 rounded-xl p-0.5 border border-white/10">
          <button
            onClick={() => onToggleAspect('fullscreen')}
            title="Normal Fullscreen View"
            className={`p-1.5 rounded-lg transition-all ${
              aspectMode === 'fullscreen'
                ? 'bg-portal-cyan/30 text-portal-cyan font-bold shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onToggleAspect('9:16')}
            title="9:16 Portrait Recording Frame (Reels & Shorts)"
            className={`flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-rajdhani font-semibold transition-all ${
              aspectMode === '9:16'
                ? 'bg-portal-neon/30 text-portal-neon border border-portal-neon/40 shadow-[0_0_10px_rgba(225,0,255,0.4)]'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="text-[10px]">9:16</span>
          </button>
        </div>

        {/* Quality Level Selector */}
        <button
          onClick={onToggleQuality}
          title={`Performance Quality: ${quality.toUpperCase()}`}
          className="hidden md:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-black/40 text-neutral-300 hover:text-white border border-white/10 text-xs font-rajdhani"
        >
          <Sparkles className="w-3 h-3 text-portal-cyan" />
          <span className="uppercase text-[10px] tracking-wider font-semibold">{quality}</span>
        </button>

        {/* Audio Mute/Unmute */}
        <button
          onClick={onToggleMute}
          title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
          className="p-1.5 sm:p-2 rounded-xl bg-black/40 text-neutral-300 hover:text-white border border-white/10 transition-colors"
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-portal-cyan" />}
        </button>

        {/* Reset / Return to Nexus */}
        <button
          onClick={onResetWorld}
          title="Return to Ancient Nexus Chamber"
          className="p-1.5 sm:p-2 rounded-xl bg-black/40 text-neutral-300 hover:text-white border border-white/10 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};

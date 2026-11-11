import React from 'react';
import { Sparkles, ArrowRight, Zap } from 'lucide-react';
import { PortalState } from '../../types';

interface InteractionOverlayProps {
  portalState: PortalState;
  chargeProgress: number;
  onStartHoldCharge: () => void;
  onEndHoldCharge: () => void;
  onOpenPortalInstant: () => void;
  onStepThrough: () => void;
  currentDimension: string;
  statusNotification: string | null;
}

export const InteractionOverlay: React.FC<InteractionOverlayProps> = ({
  portalState,
  chargeProgress,
  onStartHoldCharge,
  onEndHoldCharge,
  onOpenPortalInstant,
  onStepThrough,
  currentDimension,
  statusNotification,
}) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-30 flex flex-col justify-between p-6 sm:p-10 select-none">
      {/* Top Notification Toast */}
      <div className="flex justify-center pt-14 sm:pt-16">
        {statusNotification && (
          <div className="bg-[#0b0e24]/90 border border-portal-cyan/50 text-portal-cyan px-4 py-2 rounded-full text-xs font-rajdhani tracking-widest uppercase shadow-[0_0_20px_rgba(0,242,254,0.4)] animate-bounce backdrop-blur-md flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{statusNotification}</span>
          </div>
        )}
      </div>

      {/* Center Cinematic Opening Prompts (When in Chamber) */}
      {currentDimension === 'chamber' && portalState === 'dormant' && (
        <div className="flex flex-col items-center justify-center text-center my-auto pointer-events-auto max-w-lg mx-auto bg-black/40 backdrop-blur-sm p-6 rounded-3xl border border-white/5 animate-fade-in">
          <p className="font-orbitron text-xs sm:text-sm tracking-[0.3em] text-portal-cyan/80 uppercase mb-2">
            Nexus Protocol 001
          </p>
          <h2 className="font-cinzel text-3xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-portal-cyan to-portal-blue tracking-wider mb-3 drop-shadow-[0_2px_15px_rgba(0,242,254,0.6)]">
            REALITY IS ONLY A DOORWAY.
          </h2>
          <p className="font-outfit text-xs sm:text-sm text-neutral-300 font-light max-w-sm mb-6 leading-relaxed">
            Four distant dimensions have aligned. Charge the ancient ring runes or trigger the singularity.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            {/* Hold to Charge Button */}
            <button
              onMouseDown={onStartHoldCharge}
              onMouseUp={onEndHoldCharge}
              onTouchStart={onStartHoldCharge}
              onTouchEnd={onEndHoldCharge}
              className="relative overflow-hidden w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-portal-cyan/20 to-portal-blue/20 border border-portal-cyan/60 text-portal-cyan font-orbitron font-bold text-xs tracking-widest flex items-center justify-center gap-2.5 shadow-[0_0_25px_rgba(0,242,254,0.3)] hover:shadow-[0_0_35px_rgba(0,242,254,0.6)] transition-all active:scale-95"
            >
              <div
                className="absolute inset-0 bg-gradient-to-r from-portal-cyan to-portal-neon opacity-40 transition-all"
                style={{ width: `${chargeProgress * 100}%` }}
              />
              <Zap className="w-4 h-4 relative z-10" />
              <span className="relative z-10">
                {chargeProgress > 0 ? `CHARGING ${Math.round(chargeProgress * 100)}%` : 'HOLD TO CHARGE'}
              </span>
            </button>

            {/* Instant Open Alternative */}
            <button
              onClick={onOpenPortalInstant}
              className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white border border-white/15 text-xs font-orbitron tracking-wider transition-all"
            >
              OPEN INSTANTLY
            </button>
          </div>
        </div>
      )}

      {/* Portal Active Prompt (Ready to Step Through) */}
      {currentDimension === 'chamber' && portalState === 'active' && (
        <div className="flex flex-col items-center justify-center text-center my-auto pointer-events-auto max-w-md mx-auto bg-black/60 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-portal-cyan/50 shadow-[0_0_40px_rgba(0,242,254,0.4)] animate-fade-in">
          <div className="w-12 h-12 rounded-full border border-portal-cyan bg-portal-cyan/10 flex items-center justify-center mb-3 text-portal-cyan animate-pulse">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="font-cinzel text-2xl sm:text-4xl font-black text-white tracking-widest mb-2">
            THE OTHER SIDE IS WAITING.
          </h3>
          <p className="font-outfit text-xs text-neutral-300 mb-6">
            Singularity stabilized. Step through the event horizon into the multiverse.
          </p>
          <button
            onClick={onStepThrough}
            className="w-full py-4 px-8 rounded-2xl bg-gradient-to-r from-portal-cyan via-portal-blue to-portal-neon text-black font-orbitron font-extrabold text-sm tracking-widest flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(0,242,254,0.7)] hover:scale-105 active:scale-95 transition-all"
          >
            <span>STEP THROUGH</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Subtle bottom safe spacer */}
      <div className="h-16" />
    </div>
  );
};

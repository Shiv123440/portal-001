import React from 'react';
import { Compass, Sparkles, ArrowRight } from 'lucide-react';
import { DimensionId, DIMENSIONS } from '../../types';

interface DimensionSelectorProps {
  currentDimension: DimensionId;
  onSelectDimension: (dim: DimensionId) => void;
  isTransitioning: boolean;
}

export const DimensionSelector: React.FC<DimensionSelectorProps> = ({
  currentDimension,
  onSelectDimension,
  isTransitioning,
}) => {
  const dimensionList: DimensionId[] = ['chamber', 'forest', 'cyberpunk', 'cosmic', 'underwater'];

  return (
    <nav className="fixed bottom-4 sm:bottom-6 inset-x-0 z-40 flex flex-col items-center pointer-events-none px-4">
      <div className="pointer-events-auto bg-[#0a0d20]/85 backdrop-blur-2xl border border-white/15 p-1.5 sm:p-2 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] flex items-center gap-1 sm:gap-2 max-w-full overflow-x-auto no-scrollbar">
        {dimensionList.map((dimId) => {
          const dim = DIMENSIONS[dimId];
          const isCurrent = currentDimension === dimId;

          return (
            <button
              key={dimId}
              disabled={isTransitioning}
              onClick={() => onSelectDimension(dimId)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-rajdhani font-semibold tracking-wider transition-all whitespace-nowrap ${
                isCurrent
                  ? 'bg-gradient-to-r from-portal-cyan to-portal-blue text-black shadow-[0_0_15px_rgba(0,242,254,0.5)] font-bold'
                  : 'text-neutral-300 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: dim.portalTint }}
              />
              <span className="uppercase text-[11px] sm:text-xs">{dim.name}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SceneCanvas } from './components/SceneCanvas';
import { HeaderControls } from './components/ui/HeaderControls';
import { DimensionSelector } from './components/ui/DimensionSelector';
import { InteractionOverlay } from './components/ui/InteractionOverlay';
import { ShowcaseOverlay } from './components/ui/ShowcaseOverlay';
import { DimensionId, PortalState, AspectRatioMode, QualityTier } from './types';
import { sound } from './audio/soundEngine';

export function App() {
  const [currentDimension, setCurrentDimension] = useState<DimensionId>('chamber');
  const [portalState, setPortalState] = useState<PortalState>('dormant');
  const [chargeProgress, setChargeProgress] = useState<number>(0);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [aspectMode, setAspectMode] = useState<AspectRatioMode>('fullscreen');
  const [quality, setQuality] = useState<QualityTier>('high');
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [statusNotification, setStatusNotification] = useState<string | null>(null);
  const [shockwaveTrigger, setShockwaveTrigger] = useState<number>(0);

  // 25s Automatic Storyboard State
  const [showcaseProgress, setShowcaseProgress] = useState<number | null>(null);
  const showcaseTimerRef = useRef<number | null>(null);
  const chargeIntervalRef = useRef<number | null>(null);

  // Set dimension atmosphere when dimension changes
  useEffect(() => {
    sound.setDimensionAtmosphere(currentDimension);
  }, [currentDimension]);

  const notify = useCallback((msg: string) => {
    setStatusNotification(msg);
    setTimeout(() => {
      setStatusNotification((prev) => (prev === msg ? null : prev));
    }, 2800);
  }, []);

  // Portal Charging Interaction
  const handleStartHoldCharge = () => {
    if (portalState === 'active' || isTransitioning) return;
    setPortalState('charging');
    sound.resume();

    chargeIntervalRef.current = window.setInterval(() => {
      setChargeProgress((prev) => {
        const next = Math.min(1.0, prev + 0.04);
        sound.playChargeHum(next);

        // Check if rune index was reached
        const prevRune = Math.floor(prev * 12);
        const nextRune = Math.floor(next * 12);
        if (nextRune > prevRune) {
          sound.playRuneIgnite(nextRune);
        }

        if (next >= 1.0) {
          if (chargeIntervalRef.current) clearInterval(chargeIntervalRef.current);
          handleActivatePortal();
          return 1.0;
        }
        return next;
      });
    }, 50);
  };

  const handleEndHoldCharge = () => {
    if (chargeIntervalRef.current) {
      clearInterval(chargeIntervalRef.current);
      chargeIntervalRef.current = null;
    }
    if (portalState === 'charging' && chargeProgress < 1.0) {
      setPortalState('dormant');
      setChargeProgress(0);
    }
  };

  const handleActivatePortal = () => {
    setPortalState('active');
    setShockwaveTrigger((k) => k + 1);
    sound.playPortalBurst();
    notify('Singularity Formed • The Event Horizon is Open');
  };

  const handleOpenPortalInstant = () => {
    sound.resume();
    setChargeProgress(1.0);
    handleActivatePortal();
  };

  // Dimensional Travel Sequence
  const handleTravelToDimension = (targetDim: DimensionId) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    sound.playVortexTravel();
    notify(`Hyperspace Jump: ${targetDim.toUpperCase()}`);

    // Hyperspace dive duration
    setTimeout(() => {
      setCurrentDimension(targetDim);
      setIsTransitioning(false);
      setPortalState(targetDim === 'chamber' ? 'dormant' : 'active');
      setChargeProgress(targetDim === 'chamber' ? 0 : 1.0);
    }, 1100);
  };

  const handleStepThrough = () => {
    // Pick the first alien dimension: Enchanted Forest
    handleTravelToDimension('forest');
  };

  const handleResetWorld = () => {
    sound.playVortexTravel();
    handleTravelToDimension('chamber');
  };

  // 25-Second Automatic Cinematic Showcase Storyboard
  const handleStartShowcase = () => {
    sound.resume();
    setCurrentDimension('chamber');
    setPortalState('dormant');
    setChargeProgress(0);
    setShowcaseProgress(0);

    const startTime = performance.now();
    const duration = 25000; // 25.0 seconds

    const updateFrame = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1.0, elapsed / duration);
      setShowcaseProgress(progress);

      // Deterministic trigger points according to storyboard specification:
      // 3-6s: Runes illuminate & portal opens
      if (progress >= 0.12 && progress < 0.24 && portalState !== 'active') {
        setPortalState('active');
        setChargeProgress(1.0);
        sound.playPortalBurst();
      }

      // 10-14s: Dimension I (Enchanted Forest)
      if (progress >= 0.40 && progress < 0.56 && currentDimension !== 'forest') {
        setCurrentDimension('forest');
        sound.setDimensionAtmosphere('forest');
      }

      // 14-18s: Dimension II (Cyberpunk City)
      if (progress >= 0.56 && progress < 0.72 && currentDimension !== 'cyberpunk') {
        setCurrentDimension('cyberpunk');
        sound.setDimensionAtmosphere('cyberpunk');
      }

      // 18-21s: Dimension III (Cosmic Universe)
      if (progress >= 0.72 && progress < 0.84 && currentDimension !== 'cosmic') {
        setCurrentDimension('cosmic');
        sound.setDimensionAtmosphere('cosmic');
      }

      // 21-23s: Dimension IV (Underwater Kingdom)
      if (progress >= 0.84 && progress < 0.92 && currentDimension !== 'underwater') {
        setCurrentDimension('underwater');
        sound.setDimensionAtmosphere('underwater');
      }

      // 23-25s: Return pull-back to Nexus Chamber
      if (progress >= 0.92 && currentDimension !== 'chamber') {
        setCurrentDimension('chamber');
        sound.setDimensionAtmosphere('chamber');
        setPortalState('active');
      }

      if (progress < 1.0) {
        showcaseTimerRef.current = requestAnimationFrame(updateFrame);
      } else {
        setShowcaseProgress(null);
      }
    };

    showcaseTimerRef.current = requestAnimationFrame(updateFrame);
  };

  const handleCancelShowcase = () => {
    if (showcaseTimerRef.current) {
      cancelAnimationFrame(showcaseTimerRef.current);
      showcaseTimerRef.current = null;
    }
    setShowcaseProgress(null);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#030308] flex items-center justify-center select-none font-outfit">
      {/* Aspect Ratio Framing Container for 9:16 Shorts/Reels Mode */}
      <div
        className={`relative overflow-hidden transition-all duration-500 ease-out flex items-center justify-center ${
          aspectMode === '9:16'
            ? 'w-full max-w-[440px] h-[92vh] max-h-[820px] rounded-[36px] border-2 border-portal-cyan/50 shadow-[0_0_80px_rgba(0,242,254,0.35)] ring-8 ring-black/80'
            : aspectMode === '16:9'
            ? 'w-[92vw] max-w-[1280px] h-[52vw] max-h-[720px] rounded-3xl border border-white/20 shadow-2xl'
            : 'w-full h-full'
        }`}
      >
        {/* 3D Scene Canvas */}
        <SceneCanvas
          currentDimension={currentDimension}
          portalActive={portalState === 'active' || currentDimension !== 'chamber'}
          chargeProgress={chargeProgress}
          isTransitioning={isTransitioning}
          aspectMode={aspectMode}
          quality={quality}
          showcaseProgress={showcaseProgress}
          shockwaveTrigger={shockwaveTrigger}
          onInteract={notify}
          onPointerDownPortal={handleStartHoldCharge}
          onPointerUpPortal={handleEndHoldCharge}
        />

        {/* HUD & Interface Layers (Hide during clean 25s showcase) */}
        {showcaseProgress === null && (
          <>
            <HeaderControls
              isMuted={isMuted}
              onToggleMute={() => {
                const next = !isMuted;
                setIsMuted(next);
                sound.setMuted(next);
              }}
              aspectMode={aspectMode}
              onToggleAspect={setAspectMode}
              quality={quality}
              onToggleQuality={() => {
                const tiers: QualityTier[] = ['low', 'medium', 'high'];
                const nextIdx = (tiers.indexOf(quality) + 1) % tiers.length;
                setQuality(tiers[nextIdx]);
                notify(`Quality Preset: ${tiers[nextIdx].toUpperCase()}`);
              }}
              onStartShowcase={handleStartShowcase}
              isShowcaseRunning={showcaseProgress !== null}
              onResetWorld={handleResetWorld}
            />

            <InteractionOverlay
              portalState={portalState}
              chargeProgress={chargeProgress}
              onStartHoldCharge={handleStartHoldCharge}
              onEndHoldCharge={handleEndHoldCharge}
              onOpenPortalInstant={handleOpenPortalInstant}
              onStepThrough={handleStepThrough}
              currentDimension={currentDimension}
              statusNotification={statusNotification}
            />

            <DimensionSelector
              currentDimension={currentDimension}
              onSelectDimension={handleTravelToDimension}
              isTransitioning={isTransitioning}
            />
          </>
        )}

        {/* 25-Second Showcase Overlay */}
        {showcaseProgress !== null && (
          <ShowcaseOverlay
            progress={showcaseProgress}
            onCancel={handleCancelShowcase}
          />
        )}
      </div>
    </div>
  );
}

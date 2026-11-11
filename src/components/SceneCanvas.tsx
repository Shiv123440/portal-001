import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
import * as THREE from 'three';
import { DimensionId, DIMENSIONS, QualityTier } from '../types';
import { PortalRing } from './portal/PortalRing';
import { VortexParticles } from './portal/VortexParticles';
import { ShockwaveRing } from './portal/ShockwaveRing';
import { WarpTunnel } from './portal/WarpTunnel';
import { AncientChamber } from './chamber/AncientChamber';
import { EnchantedForest } from './dimensions/EnchantedForest';
import { CyberpunkCity } from './dimensions/CyberpunkCity';
import { CosmicUniverse } from './dimensions/CosmicUniverse';
import { UnderwaterKingdom } from './dimensions/UnderwaterKingdom';
import { CameraRig } from './camera/CameraRig';

interface SceneCanvasProps {
  currentDimension: DimensionId;
  portalActive: boolean;
  chargeProgress: number;
  isTransitioning: boolean;
  aspectMode: 'fullscreen' | '9:16' | '16:9';
  quality: QualityTier;
  showcaseProgress: number | null;
  shockwaveTrigger: number;
  onInteract: (name: string) => void;
  onPointerDownPortal: () => void;
  onPointerUpPortal: () => void;
}

export const SceneCanvas: React.FC<SceneCanvasProps> = ({
  currentDimension,
  portalActive,
  chargeProgress,
  isTransitioning,
  aspectMode,
  quality,
  showcaseProgress,
  shockwaveTrigger,
  onInteract,
  onPointerDownPortal,
  onPointerUpPortal,
}) => {
  const meta = DIMENSIONS[currentDimension] || DIMENSIONS.chamber;

  return (
    <Canvas
      shadows={quality === 'high'}
      dpr={quality === 'high' ? [1, 2] : [1, 1.5]}
      camera={{ position: [0, 0.4, 8.8], fov: aspectMode === '9:16' ? 62 : 50, near: 0.1, far: 180 }}
      gl={{
        antialias: quality !== 'low',
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.15,
        powerPreference: 'high-performance',
      }}
      className="w-full h-full cursor-grab active:cursor-grabbing"
    >
      {/* Dynamic Atmospheric Fog matching the dimension palette */}
      <color attach="background" args={[meta.fogColor]} />
      <fog attach="fog" args={[meta.fogColor, 10, 55]} />

      {/* Camera Rig & Controls */}
      <CameraRig
        currentDimension={currentDimension}
        isTransitioning={isTransitioning}
        aspectMode={aspectMode}
        showcaseProgress={showcaseProgress}
      />

      {/* Global Illumination */}
      <ambientLight color={meta.ambientColor} intensity={0.4} />
      <directionalLight
        position={[6, 14, 8]}
        color={meta.palette[0]}
        intensity={0.65}
        castShadow={quality === 'high'}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />

      {/* 3D Environment Rendering (Chamber is active in initial nexus state) */}
      {currentDimension === 'chamber' && <AncientChamber tintColor={meta.portalTint} />}
      {currentDimension === 'forest' && <EnchantedForest onInteract={onInteract} />}
      {currentDimension === 'cyberpunk' && <CyberpunkCity onInteract={onInteract} />}
      {currentDimension === 'cosmic' && <CosmicUniverse onInteract={onInteract} />}
      {currentDimension === 'underwater' && <UnderwaterKingdom onInteract={onInteract} />}

      {/* The Central Interdimensional Portal */}
      <PortalRing
        radius={3.2}
        isActive={portalActive || currentDimension !== 'chamber'}
        chargeProgress={chargeProgress}
        tintColor={meta.portalTint}
        onPointerDown={onPointerDownPortal}
        onPointerUp={onPointerUpPortal}
      />

      {/* Swirling Inflow Energy Particles */}
      <VortexParticles
        count={quality === 'low' ? 180 : 380}
        radius={3.2}
        isActive={portalActive || currentDimension !== 'chamber'}
        color={meta.portalTint}
        charge={chargeProgress}
      />

      {/* Activation Burst Shockwave */}
      <ShockwaveRing
        triggerKey={shockwaveTrigger}
        color={meta.portalTint}
      />

      {/* Hyperspace Tunnel during dimension jumps */}
      <WarpTunnel
        active={isTransitioning}
        color={meta.portalTint}
      />

      {/* Postprocessing Bloom */}
      {quality !== 'low' && (
        <EffectComposer multisampling={0}>
          <Bloom
            intensity={quality === 'high' ? 1.25 : 0.85}
            luminanceThreshold={0.35}
            luminanceSmoothing={0.3}
            mipmapBlur={true}
          />
        </EffectComposer>
      )}
    </Canvas>
  );
};

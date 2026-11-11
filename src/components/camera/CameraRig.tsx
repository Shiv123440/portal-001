import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as THREE from 'three';
import { DimensionId } from '../../types';

interface CameraRigProps {
  currentDimension: DimensionId;
  isTransitioning: boolean;
  aspectMode: 'fullscreen' | '9:16' | '16:9';
  showcaseProgress?: number | null; // 0 to 1 during 25s cinematic replay
  onUserInteracted?: () => void;
}

// Camera Presets per Dimension
const CAMERA_PRESETS: Record<DimensionId, { pos: [number, number, number]; target: [number, number, number] }> = {
  chamber: { pos: [0, 0.4, 8.8], target: [0, 0.0, 0] },
  forest: { pos: [0, 0.2, 7.5], target: [0, 0.5, 0] },
  cyberpunk: { pos: [0, 1.2, 8.2], target: [0, 2.0, 0] },
  cosmic: { pos: [0, 0.0, 9.5], target: [0, 0.0, 0] },
  underwater: { pos: [0, 0.5, 7.8], target: [0, 0.2, 0] },
};

export const CameraRig: React.FC<CameraRigProps> = ({
  currentDimension,
  isTransitioning,
  aspectMode,
  showcaseProgress = null,
  onUserInteracted,
}) => {
  const { camera } = useThree();
  const controlsRef = useRef<OrbitControlsImpl>(null);

  const targetPos = useRef(new THREE.Vector3(0, 0.4, 8.8));
  const targetLook = useRef(new THREE.Vector3(0, 0, 0));
  const isAutoMoving = useRef(true);

  // Update target coordinates when dimension changes
  useEffect(() => {
    const preset = CAMERA_PRESETS[currentDimension] || CAMERA_PRESETS.chamber;
    
    // Adjust default Z distance for portrait 9:16 to keep portal framed within safe zones
    const zOffset = aspectMode === '9:16' ? 2.5 : 0;
    targetPos.current.set(preset.pos[0], preset.pos[1], preset.pos[2] + zOffset);
    targetLook.current.set(...preset.target);

    isAutoMoving.current = true;
  }, [currentDimension, aspectMode]);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);

    // 1. Automatic 25-Second Showcase Storyboard Mode
    if (showcaseProgress !== null) {
      if (controlsRef.current) {
        controlsRef.current.enabled = false;
      }

      // Time map:
      // 0.00 - 0.24 (0 - 6s): Chamber establishing & portal activation
      // 0.24 - 0.40 (6 - 10s): Hyperspace vortex tunnel zoom through
      // 0.40 - 0.56 (10 - 14s): Forest sweeping glide
      // 0.56 - 0.72 (14 - 18s): Cyberpunk low upward pan
      // 0.72 - 0.84 (18 - 21s): Cosmic deep orbit
      // 0.84 - 0.92 (21 - 23s): Underwater marine drift
      // 0.92 - 1.00 (23 - 25s): Return pull-back to Nexus Chamber

      if (showcaseProgress < 0.24) {
        // Slow push toward chamber portal
        const p = showcaseProgress / 0.24;
        const camZ = THREE.MathUtils.lerp(10.5, 6.2, p);
        camera.position.set(Math.sin(p * 0.5) * 0.8, 0.4 + p * 0.2, camZ);
        camera.lookAt(0, 0.2, 0);
      } else if (showcaseProgress < 0.40) {
        // Vortex hyperspace dive: camera accelerates through center of ring
        const p = (showcaseProgress - 0.24) / 0.16;
        const camZ = THREE.MathUtils.lerp(6.2, -1.5, p);
        camera.position.set(0, 0, camZ);
        camera.lookAt(0, 0, -20);
      } else if (showcaseProgress < 0.56) {
        // Enchanted Forest glide
        const p = (showcaseProgress - 0.40) / 0.16;
        camera.position.set(Math.sin(p * Math.PI) * 3.5, 0.2 + p * 1.0, 7.5);
        camera.lookAt(0, 1.2, 0);
      } else if (showcaseProgress < 0.72) {
        // Cyberpunk city upward sweep
        const p = (showcaseProgress - 0.56) / 0.16;
        camera.position.set(-2 + p * 4, 1.5 + p * 3, 8.5);
        camera.lookAt(0, 4.0, 0);
      } else if (showcaseProgress < 0.84) {
        // Cosmic planetary orbit
        const p = (showcaseProgress - 0.72) / 0.12;
        const angle = p * Math.PI;
        camera.position.set(Math.cos(angle) * 8.5, Math.sin(p * 2) * 2, Math.sin(angle) * 8.5);
        camera.lookAt(0, 0, 0);
      } else if (showcaseProgress < 0.92) {
        // Underwater bobbing drift
        const p = (showcaseProgress - 0.84) / 0.08;
        camera.position.set(Math.sin(p * 3) * 2, 0.5 - p * 1.5, 7.5);
        camera.lookAt(0, 0.5, 0);
      } else {
        // Final pull-back into Nexus Chamber with portal framed
        const p = (showcaseProgress - 0.92) / 0.08;
        camera.position.set(0, 0.4, THREE.MathUtils.lerp(4.0, 9.5, p));
        camera.lookAt(0, 0.2, 0);
      }
      return;
    }

    // 2. Interdimensional Transition Flight Sequence
    if (isTransitioning) {
      // Accelerate camera directly through the portal event horizon (z = 0)
      camera.position.lerp(new THREE.Vector3(0, 0, -0.8), dt * 5.0);
      if (controlsRef.current) {
        controlsRef.current.target.lerp(new THREE.Vector3(0, 0, -10), dt * 6.0);
        controlsRef.current.update();
      }
      return;
    }

    // 3. Normal Interactive Exploration Mode
    if (controlsRef.current) {
      controlsRef.current.enabled = true;
    }

    if (isAutoMoving.current) {
      camera.position.lerp(targetPos.current, dt * 3.2);
      if (controlsRef.current) {
        controlsRef.current.target.lerp(targetLook.current, dt * 3.5);
        controlsRef.current.update();
      }

      if (camera.position.distanceTo(targetPos.current) < 0.15) {
        isAutoMoving.current = false;
      }
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping={true}
      dampingFactor={0.06}
      rotateSpeed={0.7}
      panSpeed={0.4}
      zoomSpeed={0.9}
      minDistance={2.5}
      maxDistance={22}
      minPolarAngle={Math.PI / 12}
      maxPolarAngle={Math.PI / 1.95} // Prevent camera clipping under the floor
      onStart={() => {
        isAutoMoving.current = false;
        onUserInteracted?.();
      }}
    />
  );
};

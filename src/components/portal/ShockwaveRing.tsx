import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ShockwaveRingProps {
  triggerKey: number; // Increment to trigger expanding pulse
  color?: string;
}

export const ShockwaveRing: React.FC<ShockwaveRingProps> = ({
  triggerKey,
  color = '#00f2fe',
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const scale = useRef(0.1);
  const opacity = useRef(0.0);

  React.useEffect(() => {
    if (triggerKey > 0) {
      scale.current = 0.5;
      opacity.current = 1.0;
    }
  }, [triggerKey]);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    if (opacity.current > 0.01) {
      scale.current += delta * 12.0;
      opacity.current -= delta * 1.4;
      meshRef.current.scale.set(scale.current, scale.current, 1);
      (meshRef.current.material as THREE.MeshBasicMaterial).opacity = Math.max(0, opacity.current);
    } else {
      (meshRef.current.material as THREE.MeshBasicMaterial).opacity = 0;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0.05]}>
      <ringGeometry args={[2.8, 3.2, 48]} />
      <meshBasicMaterial
        color={color}
        transparent={true}
        opacity={0}
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
};

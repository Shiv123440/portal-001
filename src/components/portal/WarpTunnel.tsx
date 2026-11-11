import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface WarpTunnelProps {
  active: boolean;
  color?: string;
}

export const WarpTunnel: React.FC<WarpTunnelProps> = ({ active, color = '#00f2fe' }) => {
  const tunnelRef = useRef<THREE.Points>(null);

  // Generate streak particles passing the camera along Z axis
  const [positions, speeds] = useMemo(() => {
    const count = 500;
    const pos = new Float32Array(count * 3);
    const spd = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 0.8 + Math.random() * 3.5;

      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = Math.sin(angle) * radius;
      pos[i * 3 + 2] = -Math.random() * 30; // Tunnel stretches into distance

      spd[i] = 12 + Math.random() * 18;
    }

    return [pos, spd];
  }, []);

  useFrame((_, delta) => {
    if (!tunnelRef.current || !active) return;
    const posAttr = tunnelRef.current.geometry.attributes.position as THREE.BufferAttribute;
    const arr = posAttr.array as Float32Array;

    for (let i = 0; i < 500; i++) {
      arr[i * 3 + 2] += delta * speeds[i];
      if (arr[i * 3 + 2] > 6.0) {
        arr[i * 3 + 2] = -25.0; // Loop back
      }
    }
    posAttr.needsUpdate = true;
  });

  if (!active) return null;

  return (
    <points ref={tunnelRef} position={[0, 0, 0]}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.12}
        color={color}
        transparent
        opacity={0.9}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

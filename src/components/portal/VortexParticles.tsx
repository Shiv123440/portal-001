import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface VortexParticlesProps {
  count?: number;
  radius?: number;
  isActive?: boolean;
  color?: string;
  charge?: number;
}

export const VortexParticles: React.FC<VortexParticlesProps> = ({
  count = 350,
  radius = 3.2,
  isActive = false,
  color = '#00f2fe',
  charge = 0,
}) => {
  const pointsRef = useRef<THREE.Points>(null);

  // Generate initial particle states (orbital radii, angles, speeds, heights)
  const [positions, colors, meta] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const metaArray = new Float32Array(count * 4); // [currentRadius, angle, speed, zDepth]

    const baseCol = new THREE.Color(color);
    const goldCol = new THREE.Color('#ffd700');
    const purpleCol = new THREE.Color('#7f00ff');

    for (let i = 0; i < count; i++) {
      const r = Math.random() * (radius * 1.8) + 0.5;
      const angle = Math.random() * Math.PI * 2;
      const z = (Math.random() - 0.5) * 3.5;
      const speed = 0.5 + Math.random() * 1.5;

      pos[i * 3] = Math.cos(angle) * r;
      pos[i * 3 + 1] = Math.sin(angle) * r;
      pos[i * 3 + 2] = z;

      // Color variation across particles
      const c = i % 3 === 0 ? baseCol : (i % 3 === 1 ? purpleCol : goldCol);
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;

      metaArray[i * 4] = r;
      metaArray[i * 4 + 1] = angle;
      metaArray[i * 4 + 2] = speed;
      metaArray[i * 4 + 3] = z;
    }

    return [pos, col, metaArray];
  }, [count, radius, color]);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    const posAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
    const array = posAttr.array as Float32Array;

    const pullSpeed = (isActive ? 1.6 : 0.4) + charge * 2.2;
    const rotateSpeed = (isActive ? 2.5 : 0.8) + charge * 3.5;

    for (let i = 0; i < count; i++) {
      let r = meta[i * 4];
      let angle = meta[i * 4 + 1];
      const speed = meta[i * 4 + 2];
      let z = meta[i * 4 + 3];

      // Spiral inwards towards the singularity
      angle += delta * speed * rotateSpeed;
      r -= delta * speed * pullSpeed;
      z *= 0.99; // Flatten into portal plane

      // If particle reaches the center singularity, re-spawn on the outer horizon
      if (r < 0.2) {
        r = radius * 1.6 + Math.random() * 1.2;
        z = (Math.random() - 0.5) * 3.0;
      }

      meta[i * 4] = r;
      meta[i * 4 + 1] = angle;
      meta[i * 4 + 3] = z;

      array[i * 3] = Math.cos(angle) * r;
      array[i * 3 + 1] = Math.sin(angle) * r;
      array[i * 3 + 2] = z;
    }

    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.07}
        vertexColors
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

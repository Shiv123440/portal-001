import React, { useMemo } from 'react';
import * as THREE from 'three';

interface ChamberProps {
  tintColor?: string;
}

export const AncientChamber: React.FC<ChamberProps> = ({ tintColor = '#00f2fe' }) => {
  // PBR Materials for ancient carved stone, damp moss and gold leaf inlays
  const stoneWallMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#151624',
        roughness: 0.85,
        metalness: 0.1,
      }),
    []
  );

  const stoneFloorMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#0e0f1a',
        roughness: 0.35, // Polished wet reflective flagstones
        metalness: 0.4,
      }),
    []
  );

  const goldAccentMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#dfa234',
        roughness: 0.3,
        metalness: 0.85,
      }),
    []
  );

  return (
    <group>
      {/* 1. Reflective Wet Ancient Stone Floor */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -3.2, 0]}
        receiveShadow
        material={stoneFloorMaterial}
      >
        <planeGeometry args={[45, 45, 32, 32]} />
      </mesh>

      {/* Circular Runed Dais beneath the portal */}
      <group position={[0, -3.18, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <cylinderGeometry args={[5.2, 5.8, 0.25, 24]} />
          <meshStandardMaterial color="#1f2033" roughness={0.7} metalness={0.2} />
        </mesh>
        {/* Outer Inscribed Bronze Step */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.15, 0]}>
          <ringGeometry args={[4.8, 5.05, 48]} />
          <primitive object={goldAccentMaterial} attach="material" />
        </mesh>
        {/* Inner Occult Ring */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.16, 0]}>
          <ringGeometry args={[2.8, 2.95, 48]} />
          <primitive object={goldAccentMaterial} attach="material" />
        </mesh>
      </group>

      {/* 2. Massive Carved Monolith Pillars (8 Guardians of the Nexus) */}
      {[
        [-7, -7], [7, -7],
        [-11, 0], [11, 0],
        [-7, 7], [7, 7],
        [-4, 12], [4, 12]
      ].map(([x, z], i) => (
        <group key={i} position={[x, 1.5, z]}>
          {/* Pillar Shaft */}
          <mesh castShadow receiveShadow material={stoneWallMaterial}>
            <boxGeometry args={[1.2, 10, 1.2]} />
          </mesh>
          {/* Gold Inscribed Collar */}
          <mesh position={[0, 2.5, 0]} material={goldAccentMaterial}>
            <boxGeometry args={[1.3, 0.15, 1.3]} />
          </mesh>
          <mesh position={[0, -2.5, 0]} material={goldAccentMaterial}>
            <boxGeometry args={[1.3, 0.15, 1.3]} />
          </mesh>
          {/* Faint mystical sconce torch on inner face */}
          <mesh position={[0, 1.0, 0.65]}>
            <sphereGeometry args={[0.08, 12, 12]} />
            <meshStandardMaterial
              color={tintColor}
              emissive={tintColor}
              emissiveIntensity={1.8}
            />
          </mesh>
        </group>
      ))}

      {/* 3. Ancient Chamber Back and Side Walls */}
      {/* Back Wall */}
      <mesh position={[0, 4, -14]} receiveShadow material={stoneWallMaterial}>
        <boxGeometry args={[35, 15, 1.5]} />
      </mesh>

      {/* Left Wall */}
      <mesh position={[-16, 4, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow material={stoneWallMaterial}>
        <boxGeometry args={[35, 15, 1.5]} />
      </mesh>

      {/* Right Wall */}
      <mesh position={[16, 4, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow material={stoneWallMaterial}>
        <boxGeometry args={[35, 15, 1.5]} />
      </mesh>

      {/* Vaulted Arch Beams overhead */}
      {[-8, 0, 8].map((z, idx) => (
        <mesh key={idx} position={[0, 10.5, z]} material={stoneWallMaterial}>
          <boxGeometry args={[32, 1.0, 1.2]} />
        </mesh>
      ))}

      {/* Atmospheric Volumetric Dust and Mote Particles */}
      <points position={[0, 1, 0]}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[
              new Float32Array(
                Array.from({ length: 450 * 3 }, () => (Math.random() - 0.5) * 22)
              ),
              3,
            ]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.04}
          color="#90b8ff"
          transparent
          opacity={0.35}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
};

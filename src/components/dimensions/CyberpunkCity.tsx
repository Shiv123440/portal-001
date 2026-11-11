import React, { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { sound } from '../../audio/soundEngine';

interface CyberpunkProps {
  onInteract?: (name: string) => void;
}

export const CyberpunkCity: React.FC<CyberpunkProps> = ({ onInteract }) => {
  const vehiclesRef = useRef<THREE.Group>(null);
  const rainRef = useRef<THREE.Points>(null);
  const [targetBuilding, setTargetBuilding] = useState<number | null>(null);

  // Procedural Cyberpunk Skyscrapers
  const buildings = useMemo(() => {
    const list = [];
    const count = 28;
    const colors = ['#ff007f', '#00f0ff', '#7928ca', '#ffe600', '#0038ff'];

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const dist = 11 + (i % 4) * 4.5;
      const x = Math.cos(angle) * dist;
      const z = Math.sin(angle) * dist;
      const height = 14 + (i % 5) * 6;
      const width = 2.5 + (i % 3) * 1.2;
      const neonColor = colors[i % colors.length];

      list.push({ id: i, x, z, height, width, neonColor });
    }
    return list;
  }, []);

  // Flying Vehicles Grid
  const vehicles = useMemo(() => {
    return [
      { id: 0, speed: 4.5, radius: 12, height: 4, color: '#00f0ff' },
      { id: 1, speed: -3.8, radius: 15, height: 7, color: '#ff007f' },
      { id: 2, speed: 5.2, radius: 9, height: 2, color: '#ffe600' },
      { id: 3, speed: -4.0, radius: 18, height: 9, color: '#00f0ff' },
    ];
  }, []);

  // Cyberpunk Acid Rain
  const rainPositions = useMemo(() => {
    const count = 600;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 35;
      pos[i * 3 + 1] = Math.random() * 25 - 3;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 35;
    }
    return pos;
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // Orbit Flying hovercars around the metropolis
    if (vehiclesRef.current) {
      vehiclesRef.current.children.forEach((child, idx) => {
        const v = vehicles[idx];
        if (v) {
          const a = t * (v.speed * 0.15) + idx * 1.5;
          child.position.x = Math.cos(a) * v.radius;
          child.position.z = Math.sin(a) * v.radius;
          child.rotation.y = -a + Math.PI / 2;
        }
      });
    }

    // Downward Cyber Rain
    if (rainRef.current) {
      const posAttr = rainRef.current.geometry.attributes.position as THREE.BufferAttribute;
      const arr = posAttr.array as Float32Array;
      for (let i = 0; i < 600; i++) {
        arr[i * 3 + 1] -= 0.35;
        if (arr[i * 3 + 1] < -3.2) {
          arr[i * 3 + 1] = 20.0;
        }
      }
      posAttr.needsUpdate = true;
    }
  });

  const handleBuildingClick = (id: number) => {
    setTargetBuilding(id);
    sound.playObjectInteract('cyber');
    onInteract?.('Cyber-Grid Megastructure Node Activated');
    setTimeout(() => setTargetBuilding(null), 1500);
  };

  return (
    <group>
      {/* 1. Wet Reflective Asphalt Street */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3.2, 0]} receiveShadow>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial
          color="#06060c"
          roughness={0.12} // Wet rain reflection
          metalness={0.8}
        />
      </mesh>

      {/* Cyber Grid Markings on the Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3.18, 0]}>
        <ringGeometry args={[5, 5.2, 32]} />
        <meshBasicMaterial color="#00f0ff" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3.18, 0]}>
        <ringGeometry args={[8.5, 8.7, 32]} />
        <meshBasicMaterial color="#ff007f" />
      </mesh>

      {/* 2. Procedural Megacity Skyscrapers with Glowing Windows & Neon Ribbons */}
      {buildings.map((b) => {
        const isSelected = targetBuilding === b.id;
        return (
          <group
            key={b.id}
            position={[b.x, b.height / 2 - 3.2, b.z]}
            onClick={(e) => {
              e.stopPropagation();
              handleBuildingClick(b.id);
            }}
          >
            {/* Tower Massing */}
            <mesh castShadow receiveShadow>
              <boxGeometry args={[b.width, b.height, b.width]} />
              <meshStandardMaterial
                color="#0a0a14"
                roughness={0.4}
                metalness={0.7}
              />
            </mesh>

            {/* Neon Accent Light Strips */}
            <mesh position={[0, b.height / 2 - 0.2, 0]}>
              <boxGeometry args={[b.width + 0.1, 0.3, b.width + 0.1]} />
              <meshStandardMaterial
                color={b.neonColor}
                emissive={b.neonColor}
                emissiveIntensity={isSelected ? 5.0 : 2.5}
              />
            </mesh>

            {/* Holographic Rooftop Spire */}
            <mesh position={[0, b.height / 2 + 1.5, 0]}>
              <cylinderGeometry args={[0.05, 0.1, 3, 6]} />
              <meshBasicMaterial color={b.neonColor} />
            </mesh>
          </group>
        );
      })}

      {/* 3. Flying Hovercars Fleet */}
      <group ref={vehiclesRef}>
        {vehicles.map((v) => (
          <group key={v.id} position={[v.radius, v.height, 0]}>
            {/* Aerodynamic Chassis */}
            <mesh>
              <boxGeometry args={[0.6, 0.22, 1.4]} />
              <meshStandardMaterial color="#12121a" roughness={0.3} metalness={0.8} />
            </mesh>
            {/* Glowing Headlight Trail */}
            <mesh position={[0, 0, 0.7]}>
              <boxGeometry args={[0.5, 0.08, 0.1]} />
              <meshBasicMaterial color={v.color} />
            </mesh>
            {/* Ion Propulsion Trail */}
            <mesh position={[0, 0, -0.7]}>
              <boxGeometry args={[0.4, 0.08, 0.1]} />
              <meshBasicMaterial color="#ff0055" />
            </mesh>
          </group>
        ))}
      </group>

      {/* 4. Cyberpunk Neon Rain */}
      <points ref={rainRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[rainPositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.06}
          color="#00f0ff"
          transparent
          opacity={0.5}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Dynamic City Center Uplights */}
      <pointLight position={[0, 8, 0]} color="#00f0ff" intensity={3.0} distance={20} />
      <pointLight position={[-6, 5, -6]} color="#ff007f" intensity={4.0} distance={25} />
      <pointLight position={[6, 5, 6]} color="#7928ca" intensity={4.0} distance={25} />
    </group>
  );
};

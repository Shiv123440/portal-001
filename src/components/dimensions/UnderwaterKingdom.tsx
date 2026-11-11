import React, { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { sound } from '../../audio/soundEngine';

interface UnderwaterProps {
  onInteract?: (name: string) => void;
}

export const UnderwaterKingdom: React.FC<UnderwaterProps> = ({ onInteract }) => {
  const jellyfishGroupRef = useRef<THREE.Group>(null);
  const bubblesRef = useRef<THREE.Points>(null);
  const fishSchoolRef = useRef<THREE.Group>(null);
  const [activeJellyfish, setActiveJellyfish] = useState<number | null>(null);

  // Bioluminescent Jellyfish
  const jellies = useMemo(() => {
    return [
      { id: 0, pos: [-3.8, 1.2, -2], color: '#48cae4', scale: 0.9, speed: 1.1 },
      { id: 1, pos: [4.2, 2.5, -4], color: '#7209b7', scale: 1.2, speed: 0.8 },
      { id: 2, pos: [-1.5, -1.0, 3], color: '#00f5d4', scale: 0.7, speed: 1.4 },
      { id: 3, pos: [3.0, -1.8, 2], color: '#f72585', scale: 0.85, speed: 1.0 },
      { id: 4, pos: [0, 4.2, -6], color: '#90e0ef', scale: 1.4, speed: 0.6 },
    ];
  }, []);

  // School of Tropical Fish
  const fishes = useMemo(() => {
    const list = [];
    for (let i = 0; i < 35; i++) {
      list.push({
        id: i,
        radius: 8 + Math.random() * 6,
        speed: 0.6 + Math.random() * 0.4,
        yOffset: (Math.random() - 0.5) * 5,
        phase: Math.random() * Math.PI * 2,
      });
    }
    return list;
  }, []);

  // Rising Ocean Air Bubbles
  const bubblePositions = useMemo(() => {
    const count = 450;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 26;
      pos[i * 3 + 1] = Math.random() * 18 - 4;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 26;
    }
    return pos;
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // Pulse and Bob Jellyfish bells
    if (jellyfishGroupRef.current) {
      jellyfishGroupRef.current.children.forEach((child, idx) => {
        const j = jellies[idx];
        if (j) {
          const pulse = Math.sin(t * 2.2 * j.speed + idx);
          child.position.y = j.pos[1] + pulse * 0.45;
          child.scale.y = j.scale * (1.0 + pulse * 0.15);
        }
      });
    }

    // Swim Fish school in circular schools
    if (fishSchoolRef.current) {
      fishSchoolRef.current.children.forEach((fish, idx) => {
        const f = fishes[idx];
        if (f) {
          const a = t * f.speed + f.phase;
          fish.position.x = Math.cos(a) * f.radius;
          fish.position.z = Math.sin(a) * f.radius;
          fish.position.y = f.yOffset + Math.sin(t * 1.5 + idx) * 0.3;
          fish.rotation.y = -a;
        }
      });
    }

    // Float bubbles upward
    if (bubblesRef.current) {
      const posAttr = bubblesRef.current.geometry.attributes.position as THREE.BufferAttribute;
      const arr = posAttr.array as Float32Array;
      for (let i = 0; i < 450; i++) {
        arr[i * 3 + 1] += 0.06;
        if (arr[i * 3 + 1] > 14.0) {
          arr[i * 3 + 1] = -4.0;
        }
      }
      posAttr.needsUpdate = true;
    }
  });

  const handleJellyClick = (id: number) => {
    setActiveJellyfish(id);
    sound.playObjectInteract('bubble');
    onInteract?.('Deep Sea Bioluminescence Pulse');
    setTimeout(() => setActiveJellyfish(null), 1600);
  };

  return (
    <group>
      {/* 1. Deep Oceanic Seabed */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3.2, 0]} receiveShadow>
        <planeGeometry args={[50, 50, 24, 24]} />
        <meshStandardMaterial
          color="#011b2b"
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>

      {/* 2. Sunken Atlantean Ruin Pillars & Arches */}
      {[
        [-6, -6], [6, -6], [-7, 5], [7, 6], [-2, -10], [3, -11]
      ].map(([x, z], i) => (
        <group key={i} position={[x, 0, z]} rotation={[0.08 * (i % 3), 0.1 * i, 0.05 * (i % 2)]}>
          <mesh castShadow receiveShadow>
            <cylinderGeometry args={[0.5, 0.65, 7, 12]} />
            <meshStandardMaterial color="#0c3547" roughness={0.7} />
          </mesh>
          <mesh position={[0, 3.6, 0]}>
            <boxGeometry args={[1.4, 0.4, 1.4]} />
            <meshStandardMaterial color="#0077b6" roughness={0.5} />
          </mesh>
        </group>
      ))}

      {/* 3. Glowing Coral Formations */}
      {[
        [-4, -2.8, -4], [4.5, -2.8, -3], [-3, -2.8, 3], [5, -2.8, 4]
      ].map(([cx, cy, cz], idx) => (
        <group key={idx} position={[cx, cy, cz]}>
          <mesh position={[0, 0.4, 0]}>
            <coneGeometry args={[0.6, 1.2, 8]} />
            <meshStandardMaterial
              color="#f72585"
              emissive="#b5179e"
              emissiveIntensity={0.6}
            />
          </mesh>
          <mesh position={[0.4, 0.3, 0.2]}>
            <coneGeometry args={[0.4, 0.8, 6]} />
            <meshStandardMaterial
              color="#00f5d4"
              emissive="#00b4d8"
              emissiveIntensity={0.8}
            />
          </mesh>
        </group>
      ))}

      {/* 4. Interactive Bioluminescent Jellyfish Group */}
      <group ref={jellyfishGroupRef}>
        {jellies.map((j) => {
          const isExcited = activeJellyfish === j.id;
          return (
            <group
              key={j.id}
              position={j.pos as [number, number, number]}
              scale={isExcited ? j.scale * 1.3 : j.scale}
              onClick={(e) => {
                e.stopPropagation();
                handleJellyClick(j.id);
              }}
            >
              {/* Translucent Bell */}
              <mesh>
                <sphereGeometry args={[0.65, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
                <meshStandardMaterial
                  color={j.color}
                  emissive={j.color}
                  emissiveIntensity={isExcited ? 3.5 : 1.2}
                  transparent
                  opacity={0.75}
                  roughness={0.1}
                />
              </mesh>
              {/* Trailing Tentacles */}
              {[0, 1, 2, 3, 4].map((tIdx) => {
                const a = (tIdx / 5) * Math.PI * 2;
                return (
                  <mesh
                    key={tIdx}
                    position={[Math.cos(a) * 0.35, -0.6, Math.sin(a) * 0.35]}
                  >
                    <cylinderGeometry args={[0.02, 0.005, 1.2, 4]} />
                    <meshBasicMaterial color={j.color} transparent opacity={0.6} />
                  </mesh>
                );
              })}
              <pointLight color={j.color} intensity={isExcited ? 4.5 : 1.5} distance={5} />
            </group>
          );
        })}
      </group>

      {/* 5. Swimming Fish School */}
      <group ref={fishSchoolRef}>
        {fishes.map((f) => (
          <mesh key={f.id} position={[f.radius, f.yOffset, 0]}>
            <coneGeometry args={[0.08, 0.35, 4]} />
            <meshStandardMaterial color="#ffd166" emissive="#ffb703" emissiveIntensity={0.4} />
          </mesh>
        ))}
      </group>

      {/* 6. Rising Marine Bubbles */}
      <points ref={bubblesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[bubblePositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.07}
          color="#90e0ef"
          transparent
          opacity={0.65}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Underwater Caustic Light Rays */}
      <directionalLight position={[0, 15, 0]} color="#48cae4" intensity={1.2} />
      <ambientLight color="#011b2b" intensity={0.8} />
    </group>
  );
};

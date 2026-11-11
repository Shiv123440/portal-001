import React, { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { sound } from '../../audio/soundEngine';

interface ForestProps {
  onInteract?: (name: string) => void;
}

export const EnchantedForest: React.FC<ForestProps> = ({ onInteract }) => {
  const firefliesRef = useRef<THREE.Points>(null);
  const waterfallRef = useRef<THREE.Points>(null);
  const [activeMushroom, setActiveMushroom] = useState<number | null>(null);

  // Bioluminescent Mushrooms configuration
  const mushrooms = useMemo(() => {
    return [
      { id: 0, pos: [-4.2, -2.4, 2.5], color: '#05ffa1', scale: 1.1 },
      { id: 1, pos: [-3.5, -2.5, 4.2], color: '#00f5d4', scale: 0.8 },
      { id: 2, pos: [4.8, -2.6, 2.0], color: '#7b2cbf', scale: 1.3 },
      { id: 3, pos: [3.8, -2.7, 3.8], color: '#ff007f', scale: 0.9 },
      { id: 4, pos: [-1.8, -2.8, -3.5], color: '#ffd166', scale: 1.2 },
      { id: 5, pos: [2.5, -2.8, -4.0], color: '#00f5d4', scale: 1.0 },
    ];
  }, []);

  // Ancient Canopy Trees
  const trees = useMemo(() => {
    return [
      { pos: [-8, -3.2, -6], scale: 1.4 },
      { pos: [8, -3.2, -7], scale: 1.5 },
      { pos: [-11, -3.2, 3], scale: 1.6 },
      { pos: [11, -3.2, 4], scale: 1.3 },
      { pos: [-6, -3.2, 10], scale: 1.2 },
      { pos: [7, -3.2, 9], scale: 1.4 },
    ];
  }, []);

  // Fireflies particle coordinates
  const fireflyPositions = useMemo(() => {
    const count = 350;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 26;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 12 + 1;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 26;
    }
    return pos;
  }, []);

  // Waterfall particle system
  const waterfallPositions = useMemo(() => {
    const count = 400;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = -9.5 + (Math.random() - 0.5) * 2.5;
      pos[i * 3 + 1] = Math.random() * 14 - 3;
      pos[i * 3 + 2] = -12 + (Math.random() - 0.5) * 1.5;
    }
    return pos;
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // Sway and drift fireflies with sine waves
    if (firefliesRef.current) {
      const posAttr = firefliesRef.current.geometry.attributes.position as THREE.BufferAttribute;
      const arr = posAttr.array as Float32Array;
      for (let i = 0; i < 350; i++) {
        arr[i * 3] += Math.sin(t * 0.8 + i) * 0.015;
        arr[i * 3 + 1] += Math.cos(t * 0.9 + i) * 0.012;
        arr[i * 3 + 2] += Math.sin(t * 0.7 + i * 2) * 0.015;
      }
      posAttr.needsUpdate = true;
    }

    // Cascade waterfall particles downward
    if (waterfallRef.current) {
      const posAttr = waterfallRef.current.geometry.attributes.position as THREE.BufferAttribute;
      const arr = posAttr.array as Float32Array;
      for (let i = 0; i < 400; i++) {
        arr[i * 3 + 1] -= 0.18;
        if (arr[i * 3 + 1] < -3.2) {
          arr[i * 3 + 1] = 11.0;
        }
      }
      posAttr.needsUpdate = true;
    }
  });

  const handleMushroomClick = (id: number) => {
    setActiveMushroom(id);
    sound.playObjectInteract('sparkle');
    onInteract?.('Bioluminescent Spore Explosion');
    setTimeout(() => setActiveMushroom(null), 1800);
  };

  return (
    <group>
      {/* 1. Lush Mossy Forest Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3.2, 0]} receiveShadow>
        <planeGeometry args={[50, 50, 32, 32]} />
        <meshStandardMaterial
          color="#062118"
          roughness={0.75}
          metalness={0.1}
        />
      </mesh>

      {/* Sacred Pool reflecting the waterfall */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-9, -3.18, -10]}>
        <circleGeometry args={[4.5, 32]} />
        <meshStandardMaterial
          color="#00353b"
          roughness={0.08}
          metalness={0.8}
        />
      </mesh>

      {/* 2. Massive Ancient Giant Trees */}
      {trees.map((tree, i) => (
        <group key={i} position={tree.pos as [number, number, number]} scale={tree.scale}>
          {/* Twisted Trunk */}
          <mesh castShadow receiveShadow position={[0, 4, 0]}>
            <cylinderGeometry args={[0.9, 1.8, 9, 10]} />
            <meshStandardMaterial color="#1a140f" roughness={0.9} />
          </mesh>
          {/* Glowing Bioluminescent Foliage Canopies */}
          <mesh position={[0, 8.5, 0]}>
            <sphereGeometry args={[3.2, 16, 16]} />
            <meshStandardMaterial
              color="#05ffa1"
              emissive="#00f5d4"
              emissiveIntensity={0.25}
              roughness={0.6}
            />
          </mesh>
          <mesh position={[1.5, 9.5, 0.8]}>
            <sphereGeometry args={[2.2, 12, 12]} />
            <meshStandardMaterial
              color="#7b2cbf"
              emissive="#7b2cbf"
              emissiveIntensity={0.35}
              roughness={0.6}
            />
          </mesh>
        </group>
      ))}

      {/* 3. Interactive Bioluminescent Mushrooms */}
      {mushrooms.map((m) => {
        const isPopped = activeMushroom === m.id;
        return (
          <group
            key={m.id}
            position={m.pos as [number, number, number]}
            scale={isPopped ? m.scale * 1.35 : m.scale}
            onClick={(e) => {
              e.stopPropagation();
              handleMushroomClick(m.id);
            }}
          >
            {/* Stem */}
            <mesh position={[0, 0.4, 0]}>
              <cylinderGeometry args={[0.08, 0.16, 0.8, 10]} />
              <meshStandardMaterial color="#e0fbfc" roughness={0.4} />
            </mesh>
            {/* Glowing Cap */}
            <mesh position={[0, 0.85, 0]}>
              <sphereGeometry args={[0.42, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
              <meshStandardMaterial
                color={m.color}
                emissive={m.color}
                emissiveIntensity={isPopped ? 4.5 : 1.8}
                roughness={0.2}
              />
            </mesh>
            {/* PointLight aura */}
            <pointLight
              color={m.color}
              intensity={isPopped ? 5.0 : 1.2}
              distance={4.5}
            />
          </group>
        );
      })}

      {/* 4. Waterfall Cascading from Mountain Cliff */}
      <mesh position={[-9.5, 5, -13]}>
        <boxGeometry args={[4, 16, 2]} />
        <meshStandardMaterial color="#081412" roughness={0.9} />
      </mesh>
      <points ref={waterfallRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[waterfallPositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.12}
          color="#00f5d4"
          transparent
          opacity={0.8}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* 5. Floating Fireflies & Mystic Spores */}
      <points ref={firefliesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[fireflyPositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.08}
          color="#05ffa1"
          transparent
          opacity={0.85}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Forest Atmosphere Lighting */}
      <directionalLight position={[5, 15, 6]} color="#05ffa1" intensity={0.45} />
      <ambientLight color="#02140f" intensity={0.65} />
    </group>
  );
};

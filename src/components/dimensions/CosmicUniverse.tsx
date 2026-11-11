import React, { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { sound } from '../../audio/soundEngine';

interface CosmicProps {
  onInteract?: (name: string) => void;
}

export const CosmicUniverse: React.FC<CosmicProps> = ({ onInteract }) => {
  const starsRef = useRef<THREE.Points>(null);
  const asteroidsRef = useRef<THREE.Group>(null);
  const ringPlanetRef = useRef<THREE.Group>(null);
  const [selectedPlanet, setSelectedPlanet] = useState<number | null>(null);

  // Celestial Orbiting Planets
  const planets = useMemo(() => {
    return [
      {
        id: 0,
        name: 'Aurelia Prime',
        radius: 1.6,
        orbitRadius: 10,
        speed: 0.25,
        color: '#ffbe0b',
        emissive: '#fb5607',
        hasRing: true,
      },
      {
        id: 1,
        name: 'Cygnus Void',
        radius: 1.2,
        orbitRadius: 15,
        speed: -0.18,
        color: '#7209b7',
        emissive: '#3a0ca3',
        hasRing: false,
      },
      {
        id: 2,
        name: 'Elysium Gas Giant',
        radius: 2.2,
        orbitRadius: 21,
        speed: 0.12,
        color: '#4cc9f0',
        emissive: '#4361ee',
        hasRing: true,
      },
      {
        id: 3,
        name: 'Obsidian Moon',
        radius: 0.65,
        orbitRadius: 7,
        speed: 0.4,
        color: '#f72585',
        emissive: '#b5179e',
        hasRing: false,
      },
    ];
  }, []);

  // Deep Cosmos Starfield
  const starPositions = useMemo(() => {
    const count = 900;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 35 + Math.random() * 25;

      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    return pos;
  }, []);

  // Floating Asteroid Belt
  const asteroidPositions = useMemo(() => {
    const list = [];
    for (let i = 0; i < 45; i++) {
      const angle = (i / 45) * Math.PI * 2;
      const dist = 12 + (Math.random() - 0.5) * 4;
      list.push({
        x: Math.cos(angle) * dist,
        y: (Math.random() - 0.5) * 3,
        z: Math.sin(angle) * dist,
        scale: 0.2 + Math.random() * 0.45,
        rotSpeed: Math.random() * 0.5 + 0.2,
      });
    }
    return list;
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // Rotate Deep Starfield slowly
    if (starsRef.current) {
      starsRef.current.rotation.y = t * 0.015;
      starsRef.current.rotation.x = t * 0.008;
    }

    // Orbit Ringed Giant
    if (ringPlanetRef.current) {
      ringPlanetRef.current.rotation.y = t * 0.3;
    }

    // Tumble asteroids
    if (asteroidsRef.current) {
      asteroidsRef.current.rotation.y = t * 0.05;
    }
  });

  const handlePlanetClick = (id: number, name: string) => {
    setSelectedPlanet(id);
    sound.playObjectInteract('cosmic');
    onInteract?.(`Stellar Sensor Lock: ${name}`);
    setTimeout(() => setSelectedPlanet(null), 2000);
  };

  return (
    <group>
      {/* 1. Volumetric Starfield */}
      <points ref={starsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[starPositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.14}
          color="#ffffff"
          transparent
          opacity={0.9}
        />
      </points>

      {/* 2. Vibrant Cosmic Nebular Cloud Background */}
      <mesh position={[0, 0, -25]}>
        <sphereGeometry args={[12, 24, 24]} />
        <meshBasicMaterial
          color="#7209b7"
          wireframe
          transparent
          opacity={0.06}
        />
      </mesh>
      <mesh position={[15, 8, -20]}>
        <sphereGeometry args={[9, 16, 16]} />
        <meshBasicMaterial
          color="#f72585"
          wireframe
          transparent
          opacity={0.05}
        />
      </mesh>

      {/* 3. Orbiting Planets */}
      {planets.map((p) => {
        const isFocused = selectedPlanet === p.id;
        return (
          <group
            key={p.id}
            position={[p.orbitRadius, Math.sin(p.id) * 2, -p.orbitRadius * 0.4]}
            scale={isFocused ? 1.3 : 1.0}
            onClick={(e) => {
              e.stopPropagation();
              handlePlanetClick(p.id, p.name);
            }}
          >
            {/* Planet Body */}
            <mesh castShadow receiveShadow>
              <sphereGeometry args={[p.radius, 32, 32]} />
              <meshStandardMaterial
                color={p.color}
                emissive={p.emissive}
                emissiveIntensity={isFocused ? 1.5 : 0.35}
                roughness={0.5}
                metalness={0.2}
              />
            </mesh>

            {/* Planetary Rings */}
            {p.hasRing && (
              <mesh rotation={[Math.PI / 3, 0, 0]}>
                <ringGeometry args={[p.radius * 1.4, p.radius * 2.3, 32]} />
                <meshBasicMaterial
                  color={p.color}
                  side={THREE.DoubleSide}
                  transparent
                  opacity={0.65}
                />
              </mesh>
            )}

            {/* Local Glow */}
            <pointLight
              color={p.color}
              intensity={isFocused ? 6.0 : 2.0}
              distance={12}
            />
          </group>
        );
      })}

      {/* 4. Orbiting Asteroid Belt */}
      <group ref={asteroidsRef}>
        {asteroidPositions.map((ast, i) => (
          <mesh
            key={i}
            position={[ast.x, ast.y, ast.z]}
            scale={ast.scale}
          >
            <dodecahedronGeometry args={[1, 0]} />
            <meshStandardMaterial color="#2d2a32" roughness={0.9} />
          </mesh>
        ))}
      </group>

      {/* Central Supernova Star Light */}
      <pointLight position={[0, 0, 0]} color="#ffffff" intensity={4.5} distance={50} />
      <ambientLight color="#0c071e" intensity={0.5} />
    </group>
  );
};

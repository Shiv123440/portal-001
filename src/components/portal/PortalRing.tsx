import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { PortalShaderMaterial } from '../../shaders/portalShader';

interface PortalRingProps {
  radius?: number;
  isActive?: boolean;
  chargeProgress?: number; // 0 to 1
  tintColor?: string;
  onPointerDown?: () => void;
  onPointerUp?: () => void;
}

export const PortalRing: React.FC<PortalRingProps> = ({
  radius = 3.2,
  isActive = false,
  chargeProgress = 0,
  tintColor = '#00f2fe',
  onPointerDown,
  onPointerUp,
}) => {
  const shaderRef = useRef<THREE.ShaderMaterial>(null);
  const outerRingRef = useRef<THREE.Group>(null);
  const innerRuneRingRef = useRef<THREE.Group>(null);
  const runesMeshRef = useRef<THREE.Mesh[]>([]);
  const coreLightRef = useRef<THREE.PointLight>(null);

  // Portal Shader Uniforms
  const uniforms = useMemo(() => {
    return {
      uTime: { value: 0 },
      uColorCore: { value: new THREE.Color(tintColor) },
      uColorRim: { value: new THREE.Color('#7f00ff') },
      uColorHighlight: { value: new THREE.Color('#ffffff') },
      uActive: { value: 0.0 },
      uCharge: { value: 0.0 },
      uVortexSpeed: { value: 1.5 },
      uDistortion: { value: 1.2 },
    };
  }, [tintColor]);

  // Generate 12 Ancient Runes positioned angularly around the ring
  const runes = useMemo(() => {
    const list = [];
    const count = 12;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      list.push({
        id: i,
        angle,
        x: Math.cos(angle) * (radius + 0.15),
        y: Math.sin(angle) * (radius + 0.15),
      });
    }
    return list;
  }, [radius]);

  useFrame(({ clock }, delta) => {
    const time = clock.getElapsedTime();

    // Update Shader Uniforms
    if (shaderRef.current) {
      shaderRef.current.uniforms.uTime.value = time;
      shaderRef.current.uniforms.uActive.value = THREE.MathUtils.lerp(
        shaderRef.current.uniforms.uActive.value,
        isActive ? 1.0 : 0.0,
        delta * 3.5
      );
      shaderRef.current.uniforms.uCharge.value = chargeProgress;
      shaderRef.current.uniforms.uColorCore.value.set(tintColor);
    }

    // Slowly rotate outer decorative stone ring
    if (outerRingRef.current) {
      outerRingRef.current.rotation.z = time * 0.04;
    }

    // Counter-rotate rune energy ring
    if (innerRuneRingRef.current) {
      innerRuneRingRef.current.rotation.z = -time * 0.08;
    }

    // Animate Core PointLight
    if (coreLightRef.current) {
      const targetIntensity = isActive ? 12 : 1.5 + chargeProgress * 10;
      coreLightRef.current.intensity = THREE.MathUtils.lerp(
        coreLightRef.current.intensity,
        targetIntensity,
        delta * 4.0
      );
    }
  });

  return (
    <group
      position={[0, 0, 0]}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
    >
      {/* 1. Heavy Ancient Stone / Obsidian Outer Frame */}
      <group ref={outerRingRef}>
        {/* Main Torus Arch Frame */}
        <mesh castShadow receiveShadow>
          <torusGeometry args={[radius + 0.25, 0.45, 16, 48]} />
          <meshStandardMaterial
            color="#12131d"
            roughness={0.75}
            metalness={0.35}
          />
        </mesh>

        {/* Outer Inscribed Bronze / Gold Trim */}
        <mesh>
          <torusGeometry args={[radius + 0.65, 0.08, 12, 48]} />
          <meshStandardMaterial
            color="#dfa234"
            roughness={0.35}
            metalness={0.85}
          />
        </mesh>

        {/* 6 Heavy Structural Keystones / Energy Conductors */}
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const a = (i / 6) * Math.PI * 2;
          return (
            <mesh
              key={i}
              position={[Math.cos(a) * (radius + 0.35), Math.sin(a) * (radius + 0.35), 0]}
              rotation={[0, 0, a]}
            >
              <boxGeometry args={[0.3, 0.65, 0.7]} />
              <meshStandardMaterial
                color="#1b1c2b"
                roughness={0.6}
                metalness={0.5}
              />
            </mesh>
          );
        })}
      </group>

      {/* 2. Inner Ring with 12 Illuminated Ancient Runes */}
      <group ref={innerRuneRingRef}>
        <mesh>
          <torusGeometry args={[radius + 0.15, 0.05, 8, 48]} />
          <meshStandardMaterial
            color="#2a2244"
            roughness={0.5}
            metalness={0.6}
          />
        </mesh>

        {runes.map((rune, idx) => {
          const isIlluminated = isActive || chargeProgress > (idx / 12);
          return (
            <mesh
              key={rune.id}
              ref={(el) => {
                if (el) runesMeshRef.current[idx] = el;
              }}
              position={[rune.x, rune.y, 0.18]}
              rotation={[0, 0, rune.angle]}
            >
              <boxGeometry args={[0.16, 0.26, 0.06]} />
              <meshStandardMaterial
                color={isIlluminated ? tintColor : '#1a1829'}
                emissive={isIlluminated ? tintColor : '#000000'}
                emissiveIntensity={isIlluminated ? 2.5 : 0.0}
                roughness={0.3}
              />
            </mesh>
          );
        })}
      </group>

      {/* 3. The Interdimensional Vortex Surface (Custom GLSL Shader) */}
      <mesh position={[0, 0, 0]}>
        <circleGeometry args={[radius, 64]} />
        <shaderMaterial
          ref={shaderRef}
          vertexShader={PortalShaderMaterial.vertexShader}
          fragmentShader={PortalShaderMaterial.fragmentShader}
          uniforms={uniforms}
          transparent={true}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* 4. Center Singularity PointLight (Projects dramatic environmental light) */}
      <pointLight
        ref={coreLightRef}
        position={[0, 0, 0.5]}
        color={tintColor}
        distance={25}
        decay={2}
        intensity={2}
      />
    </group>
  );
};

import * as THREE from 'three';

export const PortalShaderMaterial = {
  uniforms: {
    uTime: { value: 0 },
    uColorCore: { value: new THREE.Color('#00f2fe') },
    uColorRim: { value: new THREE.Color('#7f00ff') },
    uColorHighlight: { value: new THREE.Color('#ffffff') },
    uActive: { value: 0.0 }, // 0.0 to 1.0 (opening transition)
    uCharge: { value: 0.0 }, // 0.0 to 1.0 (charging glow)
    uVortexSpeed: { value: 1.5 },
    uDistortion: { value: 1.2 },
  },
  vertexShader: `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vViewPosition;

    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      vViewPosition = -mvPosition.xyz;
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  fragmentShader: `
    uniform float uTime;
    uniform vec3 uColorCore;
    uniform vec3 uColorRim;
    uniform vec3 uColorHighlight;
    uniform float uActive;
    uniform float uCharge;
    uniform float uVortexSpeed;
    uniform float uDistortion;

    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vViewPosition;

    // Simplex Noise 2D
    vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
    float snoise(vec2 v){
      const vec4 C = vec4(0.211324865405187, 0.366025403784439,
               -0.577350269189626, 0.024390243902439);
      vec2 i  = floor(v + dot(v, C.yy) );
      vec2 x0 = v -   i + dot(i, C.xx);
      vec2 i1;
      i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;
      i = mod(i, 289.0);
      vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
        + i.x + vec3(0.0, i1.x, 1.0 ));
      vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
        dot(x12.zw,x12.zw)), 0.0);
      m = m*m ;
      m = m*m ;
      vec3 x = 2.0 * fract(p * C.www) - 1.0;
      vec3 h = abs(x) - 0.5;
      vec3 ox = floor(x + 0.5);
      vec3 a0 = x - ox;
      m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
      vec3 g;
      g.x  = a0.x  * x0.x  + h.x  * x0.y;
      g.yz = a0.yz * x12.xz + h.yz * x12.yw;
      return 130.0 * dot(m, g);
    }

    void main() {
      // Center coordinates around (0.0, 0.0)
      vec2 p = vUv * 2.0 - 1.0;
      float dist = length(p);

      // Early discard outside unit circle
      if (dist > 1.0) {
        discard;
      }

      // Polar coordinates for Swirling Vortex
      float angle = atan(p.y, p.x);
      
      // Dynamic rotation speed increases with charge and activation
      float speed = uTime * (uVortexSpeed + uCharge * 2.0);
      float spiral = angle * 3.0 + dist * (8.0 * uDistortion) - speed;

      // Multi-octave procedural noise for nebular turbulence
      float n1 = snoise(vec2(cos(spiral) * 2.0, sin(spiral) * 2.0) + uTime * 0.4);
      float n2 = snoise(p * 3.5 - vec2(uTime * 0.2, speed * 0.3));
      float turbulence = (n1 * 0.6 + n2 * 0.4) * 0.5 + 0.5;

      // Event horizon energy gradient
      float eventHorizon = smoothstep(0.0, 0.35, dist);
      float rimGlow = smoothstep(0.4, 0.98, dist);

      // Color blending
      vec3 col = mix(uColorCore, uColorRim, rimGlow);
      col = mix(col, uColorHighlight, pow(turbulence, 2.5) * 0.8);

      // Central gravitational singularity
      float centerSingularity = smoothstep(0.3, 0.0, dist);
      col = mix(col, vec3(0.02, 0.01, 0.05), centerSingularity * (1.0 - uActive * 0.7));

      // Internal light flare
      float coreFlare = exp(-dist * 4.0) * (uActive * 1.5 + uCharge * 0.8);
      col += uColorHighlight * coreFlare;

      // Active / Dormant brightness transition
      float energyPower = mix(0.12 + uCharge * 0.4, 1.35 + uCharge * 0.5, uActive);
      col *= energyPower;

      // Soft rim alpha feathering for natural integration with frame
      float alpha = smoothstep(1.0, 0.88, dist) * (0.4 + uActive * 0.55 + uCharge * 0.3);

      gl_FragColor = vec4(col, alpha);
    }
  `,
};

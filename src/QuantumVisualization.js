// QuantumVisualization.js
import React, { useRef, useMemo, useEffect, forwardRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Small, cheap-ish pseudo-noise so motion feels organic without heavy math.
 * Uses a few layered trig waves and a hash to reduce repetition.
 */
function triNoise(x, y, z, t) {
  const h = Math.sin(x * 0.73 + y * 1.21 + z * 0.53) * 0.5 + 0.5;
  const w1 = Math.sin(t * 0.9 + x * 1.7 + y * 0.6) * 0.6;
  const w2 = Math.cos(t * 1.3 + y * 1.3 + z * 0.9) * 0.4;
  const w3 = Math.sin(t * 0.6 + z * 1.9 + x * 0.8) * 0.5;
  return (w1 + w2 + w3) * (0.5 + 0.5 * h); //  ~[-0.75, 0.75]
}

const DarkMatterBlob = forwardRef(({
  scale = 1,
  opacity = 1,
  flowDirection = new THREE.Vector3(0, 0, 0),
  isFlowing = false,
  flowProgress = 0
}, ref) => {
  const meshRef = useRef();
  const haloRef = useRef();
  const time = useRef(0);
  const normalTick = useRef(0);

  // Geometry: keep it the same shape but a touch smoother than detail=3
  const geometry = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(scale, 4);
    // Cache original positions
    const pos = geo.attributes.position.array;
    geo.userData.originalPositions = new Float32Array(pos.length);
    geo.userData.originalPositions.set(pos);
    // Mark buffer usage for perf
    geo.attributes.position.setUsage(THREE.DynamicDrawUsage);
    return geo;
  }, [scale]);

  // Material: physical with a punchy emissive core
  const material = useMemo(() => {
    const m = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0x00B7EB),
      metalness: 0.85,
      roughness: 0.15,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      transparent: true,
      opacity: Math.min(1, Math.max(0.05, opacity * 0.95)),
      emissive: new THREE.Color(0x0099ff),
      emissiveIntensity: 0.55,
      // keep depthWrite so the cube walls can occlude correctly; rely on halo for glow
      depthWrite: true
    });

    // Soft Fresnel-like rim without switching to a custom shader:
    m.onBeforeCompile = (shader) => {
      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <emissivemap_fragment>',
        `
          #include <emissivemap_fragment>
          // Fresnel-ish rim to lift edges
          float rim = pow(1.0 - dot(normalize(vViewPosition), normal), 3.0);
          vec3 rimCol = vec3(0.2, 0.55, 1.0) * rim * 0.6;
          totalEmissiveRadiance += rimCol;
        `
      );
    };

    return m;
  }, [opacity]);

  // A subtle “halo” shell for additive glow that won’t obscure the blob
  const haloMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: new THREE.Color(0x4dbfff),
        transparent: true,
        opacity: 0.18,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      }),
    []
  );

  // Keep things clean if this component unmounts
  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
      haloMaterial.dispose();
    };
  }, [geometry, material, haloMaterial]);

  useFrame((_, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;

    time.current += Math.min(delta, 0.033); // clamp for stability on hiccups
    const t = time.current;

    const attr = mesh.geometry.attributes.position;
    const positions = attr.array;
    const original = mesh.geometry.userData.originalPositions;

    // Directional flow handling
    const fd = flowDirection;
    const fdLen = fd.length();
    const dir = fdLen > 0 ? fd.clone().normalize() : null;

    // Smooth morph intensity (eases in/out and loops nicely if you drive flowProgress 0..1)
    const baseMorph =
      isFlowing && flowProgress > 0
        ? (1 - Math.cos(flowProgress * Math.PI)) * 0.25 // [0..0.25]
        : 0.0;

    // Deform vertices
    for (let i = 0; i < positions.length; i += 3) {
      const ox = original[i];
      const oy = original[i + 1];
      const oz = original[i + 2];

      // Organic surface noise
      const n = triNoise(ox * 0.9, oy * 0.9, oz * 0.9, t * 0.9); // ~[-0.75, 0.75]
      const puff = 0.12 * n; // base displacement outward

      // Move outward along original normal
      const len = Math.sqrt(ox * ox + oy * oy + oz * oz) || 1.0;
      const nx = ox / len;
      const ny = oy / len;
      const nz = oz / len;

      let dx = ox + nx * puff;
      let dy = oy + ny * puff;
      let dz = oz + nz * puff;

      // Directional flow (if any)
      if (dir && baseMorph > 0) {
        const flowMag = baseMorph * (0.6 + 0.4 * Math.sin(t * 0.8 + i * 0.001));
        dx += dir.x * flowMag;
        dy += dir.y * flowMag;
        dz += dir.z * flowMag;
      }

      positions[i] = dx;
      positions[i + 1] = dy;
      positions[i + 2] = dz;
    }

    attr.needsUpdate = true;

    // Recompute normals occasionally (not every frame) to save CPU
    if (++normalTick.current % 2 === 0) {
      mesh.geometry.computeVertexNormals();
      normalTick.current = 0;
    }

    // Majestic, slow spin
    mesh.rotation.x += delta * 0.15;
    mesh.rotation.y += delta * 0.22;

    // Keep halo slightly larger and synced
    if (haloRef.current) {
      const s = 1.03; // subtle shell
      haloRef.current.scale.set(s, s, s);
      haloRef.current.rotation.copy(mesh.rotation);
    }
  });

  return (
    <group ref={ref}>
      {/* Core blob */}
      <mesh ref={meshRef} geometry={geometry} material={material} castShadow receiveShadow />
      {/* Additive glow shell */}
      <mesh geometry={geometry} material={haloMaterial} ref={haloRef} />
    </group>
  );
});

const QuantumVisualization = forwardRef(({
  type,
  position = [0, 0, 0],
  scale = 1,
  opacity = 1,
  flowDirection = new THREE.Vector3(0, 0, 0),
  isFlowing = false,
  flowProgress = 0
}, ref) => {
  return (
    <group position={position} ref={ref}>
      <DarkMatterBlob
        scale={scale}
        opacity={opacity}
        flowDirection={flowDirection}
        isFlowing={isFlowing}
        flowProgress={flowProgress}
      />
    </group>
  );
});

export default QuantumVisualization;

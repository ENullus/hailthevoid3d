// QuantumVisualization.js
import React, { useRef, useMemo, useEffect, forwardRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function easeInOut(t) {
  return t * t * (3 - 2 * t); // smoothstep
}

// Map a normalized direction on a sphere to a cube surface (spherified cube projection)
function dirToCube(nx, ny, nz) {
  const ax = Math.abs(nx), ay = Math.abs(ny), az = Math.abs(nz);
  const m = Math.max(ax, ay, az) || 1.0;
  return [nx / m, ny / m, nz / m];
}

// Cheap layered noise for organic motion
function layeredNoise(x, y, z, t) {
  const n1 = Math.sin(t * 0.8 + x * 1.1 + y * 0.6) * 0.6;
  const n2 = Math.cos(t * 1.3 + y * 1.4 + z * 0.9) * 0.4;
  const n3 = Math.sin(t * 0.5 + z * 1.9 + x * 0.8) * 0.5;
  return (n1 + n2 + n3) * 0.5; // ~[-0.75, 0.75] → ~[-0.375, 0.375]
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
  const coreRef = useRef();
  const time = useRef(0);
  const normalTick = useRef(0);

  // Slightly higher detail for smooth morphing and folds
  const geometry = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(scale, 4);
    const pos = geo.attributes.position.array;
    geo.userData.originalPositions = new Float32Array(pos.length);
    geo.userData.originalPositions.set(pos);
    geo.attributes.position.setUsage(THREE.DynamicDrawUsage);
    return geo;
  }, [scale]);

  // Core material with a faint Fresnel-like rim (onBeforeCompile)
  const material = useMemo(() => {
    const m = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0x11a8ff),
      metalness: 0.75,
      roughness: 0.2,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
      transparent: true,
      opacity: Math.min(1, Math.max(0.05, opacity * 0.95)),
      emissive: new THREE.Color(0x1188ff),
      emissiveIntensity: 0.55,
      depthWrite: true
    });
    m.onBeforeCompile = (shader) => {
      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <emissivemap_fragment>',
        `
          #include <emissivemap_fragment>
          // soft rim to keep edges alive
          float rim = pow(1.0 - dot(normalize(vViewPosition), normal), 3.0);
          vec3 rimCol = vec3(0.25, 0.6, 1.0) * rim * 0.5;
          totalEmissiveRadiance += rimCol;
        `
      );
    };
    return m;
  }, [opacity]);

  // Additive halo shell (very subtle)
  const haloMaterial = useMemo(() =>
    new THREE.MeshBasicMaterial({
      color: new THREE.Color(0x66c2ff),
      transparent: true,
      opacity: 0.16,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    }), []);

  // Inner “void of hope” core (dark center that breathes a bit)
  const innerMaterial = useMemo(() =>
    new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0x00030a),
      roughness: 0.9,
      metalness: 0.0,
      transparent: true,
      opacity: 0.8
    }), []);

  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
      haloMaterial.dispose();
      innerMaterial.dispose();
    };
  }, [geometry, material, haloMaterial, innerMaterial]);

  useFrame((_, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;

    time.current += Math.min(delta, 0.033);
    const t = time.current;

    const attr = mesh.geometry.attributes.position;
    const positions = attr.array;
    const original = mesh.geometry.userData.originalPositions;

    // morph factor: sphere (0) → cube (1)
    const m = isFlowing ? easeInOut(THREE.MathUtils.clamp(flowProgress, 0, 1)) : 0;

    const fd = flowDirection;
    const dir = fd.lengthSq() > 0 ? fd.clone().normalize() : null;

    for (let i = 0; i < positions.length; i += 3) {
      const ox = original[i];
      const oy = original[i + 1];
      const oz = original[i + 2];

      // unit direction (sphere)
      const len = Math.sqrt(ox * ox + oy * oy + oz * oz) || 1.0;
      const sx = ox / len, sy = oy / len, sz = oz / len;

      // projected cube direction
      const [cx, cy, cz] = dirToCube(sx, sy, sz);

      // blend sphere ↔︎ cube
      const bx = THREE.MathUtils.lerp(sx, cx, m);
      const by = THREE.MathUtils.lerp(sy, cy, m);
      const bz = THREE.MathUtils.lerp(sz, cz, m);

      // radius with layered folds + a gentle equatorial bias (asymmetry)
      const n = layeredNoise(ox * 0.8, oy * 0.8, oz * 0.8, t);
      const fold =
        1.0 +
        0.14 * n +
        0.06 * Math.sin((sx * 1.7 - sy * 1.1 + sz * 1.3) + t * 0.7) +
        0.04 * Math.sin((sx * 3.1 + sy * 2.9 - sz * 2.7) - t * 0.5);

      // subtle directional flow drift
      let driftX = 0, driftY = 0, driftZ = 0;
      if (dir) {
        const flowMag = 0.18 * Math.sin(t * 0.6 + i * 0.002);
        driftX = dir.x * flowMag;
        driftY = dir.y * flowMag;
        driftZ = dir.z * flowMag;
      }

      // final vertex
      positions[i]     = (bx * fold * scale) + driftX;
      positions[i + 1] = (by * fold * scale) + driftY;
      positions[i + 2] = (bz * fold * scale) + driftZ;
    }

    attr.needsUpdate = true;

    if (++normalTick.current % 2 === 0) {
      mesh.geometry.computeVertexNormals();
      normalTick.current = 0;
    }

    // calm orbital motion
    mesh.rotation.x += delta * 0.12;
    mesh.rotation.y += delta * 0.18;

    // sync halo slightly larger
    if (haloRef.current) {
      const s = 1.035;
      haloRef.current.scale.set(s, s, s);
      haloRef.current.rotation.copy(mesh.rotation);
    }

    // breathe inner core
    if (coreRef.current) {
      const s = 0.45 + 0.03 * Math.sin(t * 1.4);
      coreRef.current.scale.set(s * scale, s * scale, s * scale);
      coreRef.current.rotation.y = mesh.rotation.y * 1.2;
    }
  });

  return (
    <group ref={ref}>
      {/* core blob */}
      <mesh ref={meshRef} geometry={geometry} material={material} castShadow receiveShadow />
      {/* additive glow shell */}
      <mesh geometry={geometry} material={haloMaterial} ref={haloRef} />
      {/* inner hopeful void */}
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[1, 2]} />
        <primitive object={innerMaterial} attach="material" />
      </mesh>
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

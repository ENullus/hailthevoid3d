import React, { useRef, useMemo, forwardRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const DarkMatterBlob = forwardRef(({
  scale = 1,
  opacity = 1,
  flowDirection = new THREE.Vector3(0, 0, 0),
  isFlowing = false,
  flowProgress = 0
}, ref) => {
  const meshRef = useRef();
  const time = useRef(0);

  const geometry = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(scale, 3); // Reduced detail to 3 for smoother low-poly
    const positions = geo.attributes.position.array;
    geo.userData.originalPositions = new Float32Array(positions);
    return geo;
  }, [scale]);

  const material = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0x00B7EB), // Blue tone
      metalness: 0.95,
      roughness: 0.03, // Slightly smoother
      clearcoat: 1.0,
      clearcoatRoughness: 0.0,
      transparent: true,
      opacity: opacity * 0.25, // Much more translucent - reduced from 0.9 to 0.25
      emissive: new THREE.Color(0x00B7EB), // Blue emissive
      emissiveIntensity: 0.15, // Reduced emissive intensity
      transmission: 0.8, // Added transmission for glass-like effect
      ior: 1.5, // Index of refraction for realistic glass
      thickness: 0.5 // Thickness for transmission effect
    });
  }, [opacity]);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    time.current += delta;
    const t = time.current;

    const positions = meshRef.current.geometry.attributes.position.array;
    const original = meshRef.current.geometry.userData.originalPositions;

    for (let i = 0; i < positions.length; i += 3) {
      const x = original[i];
      const y = original[i + 1];
      const z = original[i + 2];

      const chaosFactor = Math.sin(t * 10 + x * 20 + y * 20 + z * 20) * 0.08; // Further reduced for smoother motion
      const chaosX = Math.sin(t * 3 + y * 10) * chaosFactor;
      const chaosY = Math.cos(t * 3.5 + z * 10) * chaosFactor;
      const chaosZ = Math.sin(t * 4 + x * 10) * chaosFactor;

      positions[i] = x + chaosX;
      positions[i + 1] = y + chaosY;
      positions[i + 2] = z + chaosZ;

      if (isFlowing && flowProgress > 0) {
        const morphIntensity = Math.sin(flowProgress * Math.PI * 4) * 0.15; // Softer morph
        positions[i] *= (1 + morphIntensity);
        positions[i + 1] *= (1 + morphIntensity);
        positions[i + 2] *= (1 + morphIntensity);
      }
    }

    meshRef.current.geometry.attributes.position.needsUpdate = true;
    meshRef.current.geometry.computeVertexNormals();

    meshRef.current.rotation.x += delta * 0.15; // Even slower rotation
    meshRef.current.rotation.y += delta * 0.25;
    meshRef.current.rotation.z += delta * 0.08;
  });

  return (
    <group ref={ref}>
      <mesh ref={meshRef} geometry={geometry} material={material} castShadow />
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

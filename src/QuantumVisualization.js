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
    // IcosahedronGeometry with detail 4 is already quite high poly.
    // If you want to simulate higher/lower, you'd need multiple blobs
    // or dynamically change the detail, which is more complex.
    // Let's focus on deformation intensity.
    const geo = new THREE.IcosahedronGeometry(scale, 4);
    const positions = geo.attributes.position.array;
    geo.userData.originalPositions = new Float32Array(positions);
    return geo;
  }, [scale]);

  const material = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0x000000), // Black
      metalness: 0.95,
      roughness: 0.05,
      clearcoat: 1.0,
      clearcoatRoughness: 0.0,
      transparent: true,
      opacity: opacity * 0.9,
      emissive: new THREE.Color(0x000000), // Ensure it's black
      emissiveIntensity: 0 // No emissive light
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

      // Increased chaotic movement multipliers for more deformation
      // Added more sin/cos waves for complexity
      const chaosFactor = Math.sin(t * 15 + x * 25 + y * 25 + z * 25) * 0.15; // Increased multiplier
      const chaosX = Math.sin(t * 4 + y * 15) * chaosFactor;
      const chaosY = Math.cos(t * 4.5 + z * 15) * chaosFactor;
      const chaosZ = Math.sin(t * 5 + x * 15) * chaosFactor;

      // Apply deformation with a slightly larger range
      positions[i] = x + chaosX;
      positions[i + 1] = y + chaosY;
      positions[i + 2] = z + chaosZ;

      // Morph more when flowing - this effect will now be more pronounced
      if (isFlowing && flowProgress > 0) {
        // More aggressive morphing with progress
        const morphIntensity = Math.sin(flowProgress * Math.PI * 6) * 0.3; // Increased intensity
        positions[i] *= (1 + morphIntensity);
        positions[i + 1] *= (1 + morphIntensity);
        positions[i + 2] *= (1 + morphIntensity);
      }
    }

    meshRef.current.geometry.attributes.position.needsUpdate = true;
    meshRef.current.geometry.computeVertexNormals(); // Recompute normals for proper lighting

    // Rotation (can be adjusted for more/less chaos)
    meshRef.current.rotation.x += delta * 0.3; // Slightly faster
    meshRef.current.rotation.y += delta * 0.4; // Slightly faster
    meshRef.current.rotation.z += delta * 0.1; // Add Z rotation
  });

  return (
    <group ref={ref}>
      <mesh ref={meshRef} geometry={geometry} material={material} castShadow />
    </group>
  );
});

const QuantumVisualization = forwardRef(({
  type, // Not used anymore, always quantum
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
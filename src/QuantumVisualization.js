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
    const geo = new THREE.IcosahedronGeometry(scale, 5); // Higher detail for a smoother, more defined shape
    const positions = geo.attributes.position.array;
    geo.userData.originalPositions = new Float32Array(positions);
    return geo;
  }, [scale]);

  const material = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0x00B7EB), // Bright blue base
      metalness: 0.85,
      roughness: 0.1,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      transparent: true,
      opacity: opacity * 0.98, // Nearly solid for prominence
      emissive: new THREE.Color(0x00B7EB).multiplyScalar(3.0), // Intense glow
      emissiveIntensity: 0.8, // Strong radiant effect
      onBeforeCompile: (shader) => {
        shader.uniforms.uTime = { value: 0 };
        shader.vertexShader = `
          uniform float uTime;
          ${shader.vertexShader}
        `.replace(
          '#include <begin_vertex>',
          `
            #include <begin_vertex>
            float rim = 1.0 - dot(normal, viewDirection);
            vColor = vec3(0.0, 0.8, 1.2) * rim * 1.5; // Bold rim lighting
          `
        );
        shader.fragmentShader = `
          varying vec3 vColor;
          ${shader.fragmentShader}
        `.replace(
          '#include <dithering_fragment>',
          `
            #include <dithering_fragment>
            gl_FragColor.rgb += vColor * 0.7; // Enhanced edge glow
          `
        );
      }
    });
  }, [opacity]);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    time.current += delta * 0.4; // Slower, more deliberate motion
    const t = time.current;

    const positions = meshRef.current.geometry.attributes.position.array;
    const original = meshRef.current.geometry.userData.originalPositions;

    for (let i = 0; i < positions.length; i += 3) {
      const x = original[i];
      const y = original[i + 1];
      const z = original[i + 2];

      const chaosFactor = Math.sin(t * 6 + x * 12 + y * 12 + z * 12) * 0.06; // Gentler deformation
      const chaosX = Math.sin(t * 2 + y * 6) * chaosFactor;
      const chaosY = Math.cos(t * 2.3 + z * 6) * chaosFactor;
      const chaosZ = Math.sin(t * 2.6 + x * 6) * chaosFactor;

      positions[i] = x + chaosX;
      positions[i + 1] = y + chaosY;
      positions[i + 2] = z + chaosZ;

      if (isFlowing && flowProgress > 0) {
        const morphIntensity = Math.sin(flowProgress * Math.PI * 1.5) * 0.1; // Smoother flow
        positions[i] += flowDirection.x * morphIntensity;
        positions[i + 1] += flowDirection.y * morphIntensity;
        positions[i + 2] += flowDirection.z * morphIntensity;
      }
    }

    meshRef.current.geometry.attributes.position.needsUpdate = true;
    meshRef.current.geometry.computeVertexNormals();

    meshRef.current.rotation.x += delta * 0.1; // Very slow rotation
    meshRef.current.rotation.y += delta * 0.15;
    meshRef.current.rotation.z += delta * 0.05;
  });

  return (
    <group ref={ref}>
      <mesh ref={meshRef} geometry={geometry} material={material} castShadow receiveShadow />
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

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
  const particlesRef = useRef();

  const geometry = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(scale, 4); // Increased detail to 4 for better shape
    const positions = geo.attributes.position.array;
    geo.userData.originalPositions = new Float32Array(positions);
    return geo;
  }, [scale]);

  const material = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0x00B7EB), // Base blue
      metalness: 0.9,
      roughness: 0.05,
      clearcoat: 1.0,
      clearcoatRoughness: 0.01,
      transparent: true,
      opacity: opacity * 0.85,
      emissive: new THREE.Color(0x00B7EB).multiplyScalar(1.5), // Brighter glow
      emissiveIntensity: 0.4,
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
            vColor = vec3(0.0, 0.5, 1.0) * rim * 0.8;
          `
        );
        shader.fragmentShader = `
          varying vec3 vColor;
          ${shader.fragmentShader}
        `.replace(
          '#include <dithering_fragment>',
          `
            #include <dithering_fragment>
            gl_FragColor.rgb += vColor * 0.3;
          `
        );
      }
    });
  }, [opacity]);

  const particlesGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const vertices = [];
    const count = 50;
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = scale * 1.2 * (0.5 + Math.random() * 0.5);
      vertices.push(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi)
      );
    }
    geo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    return geo;
  }, [scale]);

  const particlesMaterial = useMemo(() => {
    return new THREE.PointsMaterial({
      color: 0x00B7EB,
      size: 0.05,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });
  }, []);

  useFrame((state, delta) => {
    if (!meshRef.current || !particlesRef.current) return;

    time.current += delta * 0.5; // Slower time progression
    const t = time.current;

    const positions = meshRef.current.geometry.attributes.position.array;
    const original = meshRef.current.geometry.userData.originalPositions;

    for (let i = 0; i < positions.length; i += 3) {
      const x = original[i];
      const y = original[i + 1];
      const z = original[i + 2];

      const chaosFactor = Math.sin(t * 8 + x * 15 + y * 15 + z * 15) * 0.08; // Smoother chaos
      const chaosX = Math.sin(t * 2.5 + y * 8) * chaosFactor;
      const chaosY = Math.cos(t * 2.8 + z * 8) * chaosFactor;
      const chaosZ = Math.sin(t * 3.2 + x * 8) * chaosFactor;

      positions[i] = x + chaosX;
      positions[i + 1] = y + chaosY;
      positions[i + 2] = z + chaosZ;

      if (isFlowing && flowProgress > 0) {
        const morphIntensity = Math.sin(flowProgress * Math.PI * 2) * 0.15; // Softer, flowing morph
        positions[i] += flowDirection.x * morphIntensity;
        positions[i + 1] += flowDirection.y * morphIntensity;
        positions[i + 2] += flowDirection.z * morphIntensity;
      }
    }

    meshRef.current.geometry.attributes.position.needsUpdate = true;
    meshRef.current.geometry.computeVertexNormals();

    meshRef.current.rotation.x += delta * 0.15; // Even slower rotation
    meshRef.current.rotation.y += delta * 0.2;
    meshRef.current.rotation.z += delta * 0.1;

    // Update particles
    const particlePositions = particlesRef.current.geometry.attributes.position.array;
    for (let i = 0; i < particlePositions.length; i += 3) {
      particlePositions[i] += Math.sin(t + i) * 0.005;
      particlePositions[i + 1] += Math.cos(t + i) * 0.005;
      particlePositions[i + 2] += Math.sin(t + i * 0.5) * 0.005;
    }
    particlesRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <group ref={ref}>
      <mesh ref={meshRef} geometry={geometry} material={material} castShadow />
      <points ref={particlesRef} geometry={particlesGeometry} material={particlesMaterial} />
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

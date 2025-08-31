// src/Scene.js - Sandy Room with Metallic Cube and Menus
import React, { useRef, useState, useCallback, useEffect, useMemo } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import SectionContent from './SectionContent';
import QuantumVisualization from './QuantumVisualization';

const sections = [
  {
    id: 'music',
    name: "FREQUENCIES",
    materialProps: { color: "#C0C0C0", metalness: 1.0, roughness: 0.1, emissive: "#D3D3D3" },
    targetPos: [4, 0, 0]
  },
  {
    id: 'art',
    name: "DISRUPTIONS",
    materialProps: { color: "#B8B8B8", metalness: 1.0, roughness: 0.1, emissive: "#DCDCDC" },
    targetPos: [-4, 0, 0]
  },
  {
    id: 'about',
    name: "HAIL THE VOID",
    materialProps: { color: "#D3D3D3", metalness: 1.0, roughness: 0.1, emissive: "#E5E5E5" },
    targetPos: [0, 4, 0]
  },
  {
    id: 'submit',
    name: "SHADOWS",
    materialProps: { color: "#A9A9A9", metalness: 1.0, roughness: 0.1, emissive: "#C0C0C0" },
    targetPos: [0, -4, 0]
  },
  {
    id: 'contact',
    name: "COLLAPSE",
    materialProps: { color: "#BEBEBE", metalness: 1.0, roughness: 0.1, emissive: "#D3D3D3" },
    targetPos: [0, 0, 4]
  },
  {
    id: 'video',
    name: "Video Streams",
    materialProps: {
      color: "#E0E0E0", 
      metalness: 1.0,
      roughness: 0.05, 
      emissive: "#F0F0F0"
    },
    targetPos: [0, 0, -4],
    disabled: false
  }
];

// Device detection hook
function useDeviceDetection() {
  const [device, setDevice] = useState({ isMobile: false, isTablet: false, isTouch: false });
  
  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const isTouch = 'ontouchstart' in window;
      const isMobile = width <= 768 || (isTouch && Math.min(width, height) <= 768);
      const isTablet = !isMobile && width <= 1024 && isTouch;
      
      setDevice({ isMobile, isTablet, isTouch });
    };
    
    checkDevice();
    window.addEventListener('resize', checkDevice);
    window.addEventListener('orientationchange', checkDevice);
    
    return () => {
      window.removeEventListener('resize', checkDevice);
      window.removeEventListener('orientationchange', checkDevice);
    };
  }, []);
  
  return device;
}

// Auto-preview hook
function useAutoPreview() {
  const [showWarning, setShowWarning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const timerRef = useRef(null);
  const warningTimerRef = useRef(null);
  const countdownRef = useRef(null);
  
  useEffect(() => {
    const previewHappened = sessionStorage.getItem('voidPreviewShown');
    if (previewHappened) return;
    
    const TOTAL_TIME = 2 * 60 * 1000;
    const WARNING_TIME = 10 * 1000;
    const PREVIEW_DURATION = 30;
    const STATIC_SITE_URL = 'https://hailthevoid.org';
    
    function schedulePreview() {
      warningTimerRef.current = setTimeout(() => {
        setShowWarning(true);
        setTimeLeft(10);
        startCountdown();
      }, TOTAL_TIME - WARNING_TIME);
      
      timerRef.current = setTimeout(() => {
        sessionStorage.setItem('voidPreviewShown', 'true');
        const currentUrl = window.location.href.split('?')[0];
        const previewUrl = `${STATIC_SITE_URL}?auto=true&duration=${PREVIEW_DURATION}&return=${encodeURIComponent(currentUrl)}`;
        window.location.href = previewUrl;
      }, TOTAL_TIME);
    }
    
    function startCountdown() {
      countdownRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(countdownRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    schedulePreview();
    
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, []);
  
  return { showWarning, timeLeft };
}

// Simple Room with Windows
function SandyRoom() {
  return (
    <group>
      {/* Sandy Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -4, 0]}>
        <planeGeometry args={[25, 25]} />
        <meshPhysicalMaterial
          color="#D2B48C"
          metalness={0.1}
          roughness={0.9}
        />
      </mesh>
      
      {/* Simple Walls */}
      <mesh position={[-12, 0, 0]}>
        <boxGeometry args={[0.5, 8, 20]} />
        <meshPhysicalMaterial color="#8B7355" metalness={0.2} roughness={0.8} />
      </mesh>
      
      <mesh position={[12, 0, 0]}>
        <boxGeometry args={[0.5, 8, 20]} />
        <meshPhysicalMaterial color="#8B7355" metalness={0.2} roughness={0.8} />
      </mesh>
      
      <mesh position={[0, 0, -10]}>
        <boxGeometry args={[24, 8, 0.5]} />
        <meshPhysicalMaterial color="#8B7355" metalness={0.2} roughness={0.8} />
      </mesh>
      
      {/* Ceiling */}
      <mesh position={[0, 4, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[24, 20]} />
        <meshPhysicalMaterial color="#A0856B" metalness={0.2} roughness={0.8} />
      </mesh>
    </group>
  );
}

// Simple Light Beams through Windows
function WindowLightBeam({ position, rotation, intensity }) {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      // Subtle animation
      meshRef.current.material.opacity = intensity * (0.8 + Math.sin(state.clock.elapsedTime * 0.5) * 0.2);
    }
  });

  return (
    <mesh ref={meshRef} position={position} rotation={rotation}>
      <coneGeometry args={[3, 12, 8, 1, true]} />
      <meshBasicMaterial
        color="#FFF8DC"
        transparent={true}
        opacity={intensity}
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

// Floating Dust in Light
function DustMotes({ count = 30 }) {
  const pointsRef = useRef();
  const velocities = useRef([]);
  
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    velocities.current = [];
    
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 15;
      pos[i * 3 + 1] = Math.random() * 6 - 2;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 15;
      
      velocities.current.push({
        x: (Math.random() - 0.5) * 0.003,
        y: Math.random() * 0.001,
        z: (Math.random() - 0.5) * 0.003
      });
    }
    
    return pos;
  }, [count]);
  
  useFrame(() => {
    if (pointsRef.current) {
      const positions = pointsRef.current.geometry.attributes.position.array;
      
      for (let i = 0; i < count; i++) {
        const vel = velocities.current[i];
        positions[i * 3] += vel.x;
        positions[i * 3 + 1] += vel.y;
        positions[i * 3 + 2] += vel.z;
        
        // Reset if out of bounds
        if (positions[i * 3] > 8) positions[i * 3] = -8;
        if (positions[i * 3] < -8) positions[i * 3] = 8;
        if (positions[i * 3 + 1] > 4) positions[i * 3 + 1] = -2;
        if (positions[i * 3 + 1] < -2) positions[i * 3 + 1] = 4;
        if (positions[i * 3 + 2] > 8) positions[i * 3 + 2] = -8;
        if (positions[i * 3 + 2] < -8) positions[i * 3 + 2] = 8;
      }
      
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.015}
        color="#FFF8DC"
        transparent={true}
        opacity={0.7}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Energy Orb Trail Component (keeping your existing effects)
function EnergyOrbTrail({ position, opacity, scale, delay }) {
  const meshRef = useRef();
  const time = useRef(delay);

  useFrame((state, delta) => {
    if (meshRef.current) {
      time.current += delta;
      const t = time.current;
      
      meshRef.current.position.x = position[0] + Math.sin(t * 0.5) * 0.5;
      meshRef.current.position.y = position[1] + Math.cos(t * 0.7) * 0.3;
      meshRef.current.position.z = position[2] + Math.sin(t * 0.3) * 0.4;
      
      const pulseScale = scale * (1 + Math.sin(t * 2) * 0.2);
      meshRef.current.scale.setScalar(pulseScale);
      meshRef.current.material.opacity = opacity * (0.7 + Math.sin(t) * 0.3);
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[0.3, 16, 16]} />
      <meshPhysicalMaterial
        color="#C0C0C0"
        metalness={0.9}
        roughness={0.2}
        transparent={true}
        opacity={opacity}
        emissive="#E0E0E0"
        emissiveIntensity={0.5}
      />
    </mesh>
  );
}

// Void Ripple Effect (keeping but making metallic)
function VoidRipple({ origin, scale, opacity }) {
  const meshRef = useRef();
  const time = useRef(0);

  useFrame((state, delta) => {
    if (meshRef.current) {
      time.current += delta;
      const t = time.current;
      
      meshRef.current.scale.setScalar(scale * (1 + t * 2));
      meshRef.current.material.opacity = opacity * Math.max(0, 1 - t * 0.5);
      meshRef.current.rotation.z = t * 1.5;
    }
  });

  return (
    <mesh ref={meshRef} position={origin}>
      <ringGeometry args={[0.5, 0.8, 64]} />
      <meshBasicMaterial 
        color="#C0C0C0" 
        transparent={true} 
        opacity={opacity}
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

// Reality Tear Effect (keeping but metallic)
function RealityTear({ startPos, endPos, progress }) {
  const meshRef = useRef();
  
  useFrame(() => {
    if (meshRef.current && progress < 1) {
      const curve = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(...startPos),
        new THREE.Vector3(
          (startPos[0] + endPos[0]) / 2 + (Math.random() - 0.5) * 1,
          (startPos[1] + endPos[1]) / 2 + (Math.random() - 0.5) * 1,
          (startPos[2] + endPos[2]) / 2 + (Math.random() - 0.5) * 1
        ),
        new THREE.Vector3(...endPos)
      );
      
      const points = curve.getPoints(50);
      const positions = new Float32Array(points.length * 3);
      
      points.forEach((point, i) => {
        if (i / points.length < progress) {
          positions[i * 3] = point.x + (Math.random() - 0.5) * 0.05;
          positions[i * 3 + 1] = point.y + (Math.random() - 0.5) * 0.05;
          positions[i * 3 + 2] = point.z + (Math.random() - 0.5) * 0.05;
        }
      });
      
      meshRef.current.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    }
  });
  
  return (
    <line ref={meshRef}>
      <bufferGeometry />
      <lineBasicMaterial color="#C0C0C0" linewidth={3} transparent opacity={0.8} />
    </line>
  );
}

function MinimalCube({ onFaceClick, visible, opacity = 1 }) {
  const meshRef = useRef();
  const [iceNormalMap, iceRoughnessMap] = useTexture(['/textures/ice_normal.jpg', '/textures/ice_roughness.jpg']);

  const materials = useMemo(() => {
    return sections.map(section => {
      const props = section.materialProps;
      return new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(props.color),
        metalness: props.metalness,
        roughness: props.roughness,
        normalMap: iceNormalMap,
        roughnessMap: iceRoughnessMap,
        normalScale: new THREE.Vector2(1, 1),
        transparent: true,
        transmission: 0.9,
        opacity: opacity,
        ior: 1.33,
        thickness: 1.0,
        emissive: new THREE.Color(props.emissive || '#E0E0E0'),
        emissiveIntensity: 0.4,
      });
    });
  }, [opacity, iceNormalMap, iceRoughnessMap]);

  useFrame(() => {
    if (meshRef.current && visible) {
      // Gentle floating motion
      meshRef.current.position.y = Math.sin(Date.now() * 0.001) * 0.1;
      meshRef.current.rotation.y += 0.005;
    }
  });

  const handleClick = (event) => {
    if (!visible) return;
    event.stopPropagation();
    const materialIndex = event.face?.materialIndex;
    if (materialIndex !== undefined) {
      const section = sections[materialIndex];
      if (section && !section.disabled) {
        console.log("Cube face clicked, section ID:", section.id);
        onFaceClick(section);
      }
    }
  };
  
  return ( 
    <mesh ref={meshRef} onClick={handleClick} material={materials} position={[0,0,0]} visible={visible}> 
      <boxGeometry args={[2,2,2]} /> 
    </mesh> 
  );
}

function Fragment({ position, velocity, scale, color }) {
  const meshRef = useRef();
  const vel = useRef([...velocity]);
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.position.x += vel.current[0] * delta;
      meshRef.current.position.y += vel.current[1] * delta;
      meshRef.current.position.z += vel.current[2] * delta;
      vel.current[0] *= 0.98; vel.current[1] *= 0.98; vel.current[2] *= 0.98;
      meshRef.current.rotation.x += delta; meshRef.current.rotation.y += delta * 1.5;
      meshRef.current.scale.multiplyScalar(0.98);
    }
  });
  
  return ( 
    <mesh ref={meshRef} position={position} scale={scale}> 
      <boxGeometry args={[1,1,1]} /> 
      <meshBasicMaterial color={color || "#C0C0C0"} /> 
    </mesh> 
  );
}

function CameraController({ darkMatterProgress, targetPos }) {
  const { camera } = useThree();
  useFrame(() => {
    if (darkMatterProgress > 0 && targetPos) {
      const currentPos = new THREE.Vector3().lerpVectors(new THREE.Vector3(0,0,0), new THREE.Vector3(...targetPos), darkMatterProgress);
      const cameraPos = currentPos.clone().add(new THREE.Vector3(3,3,3));
      camera.position.lerp(cameraPos, 0.07);
      camera.lookAt(currentPos);
    }
  });
  return null;
}

export default function Scene() {
  const { isMobile, isTablet, isTouch } = useDeviceDetection();
  const { showWarning, timeLeft } = useAutoPreview();
  
  const [cubeVisible, setCubeVisible] = useState(true);
  const [cubeOpacity, setCubeOpacity] = useState(1);
  const [fragments, setFragments] = useState([]);
  const [darkMatterVisible, setDarkMatterVisible] = useState(false);
  const [darkMatterProgress, setDarkMatterProgress] = useState(0);
  const [activeSection, setActiveSection] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [mediaIsPlaying, setMediaIsPlaying] = useState(false);
  const [binauralPaused, setBinauralPaused] = useState(false);
  const [voidRipples, setVoidRipples] = useState([]);
  const [realityTears, setRealityTears] = useState([]);
  const binauralAudioRef = useRef(null);

  // Performance optimizations based on device
  const performanceSettings = useMemo(() => ({
    maxFragments: isMobile ? 4 : 8,
    maxTrails: isMobile ? 2 : 5,
    maxRipples: isMobile ? 1 : 3,
    maxDustMotes: isMobile ? 20 : 40,
    animationSpeed: isMobile ? 0.5 : 1,
    enableBinaural: !isMobile
  }), [isMobile]);

  // Camera settings based on device
  const cameraSettings = useMemo(() => ({
    position: isMobile ? [3, 3, 3] : [5, 5, 5],
    fov: isMobile ? 60 : 50
  }), [isMobile]);

  useEffect(() => {
    const binauralAudio = binauralAudioRef.current;
    if (binauralAudio && performanceSettings.enableBinaural) {
      binauralAudio.play().catch(e => {
        console.warn("Binaural audio autoplay prevented.", e);
      });
    }
    return () => { 
      if (binauralAudio) binauralAudio.pause(); 
    };
  }, [performanceSettings.enableBinaural]);

  useEffect(() => {
    if (binauralAudioRef.current && performanceSettings.enableBinaural) {
      if (mediaIsPlaying || binauralPaused) {
        binauralAudioRef.current.pause();
      } else {
        if (menuVisible || (!darkMatterVisible && !menuVisible)) {
          binauralAudioRef.current.play().catch(e => console.error("Error resuming binaural audio:", e));
        }
      }
    }
  }, [mediaIsPlaying, menuVisible, darkMatterVisible, performanceSettings.enableBinaural, binauralPaused]);

  const handleCubeClick = useCallback((section) => {
    if (!cubeVisible || section.disabled) return;
    setCubeOpacity(0);
    
    if (section.id === 'video' || section.id === 'music') {
      setBinauralPaused(true);
      if (binauralAudioRef.current) {
        binauralAudioRef.current.pause();
      }
    }
    
    // Create metallic fragments
    const frags = [];
    for (let i = 0; i < performanceSettings.maxFragments; i++) {
      frags.push({
        id: i,
        position: [ (Math.random() - 0.5) * 0.5, (Math.random() - 0.5) * 0.5, (Math.random() - 0.5) * 0.5 ],
        velocity: [ (Math.random() - 0.5) * 5, (Math.random() - 0.5) * 5, (Math.random() - 0.5) * 5 ],
        scale: 0.2 + Math.random() * 0.3,
        color: section.materialProps.color
      });
    }
    setFragments(frags);
    
    // Create void ripples
    const ripples = [];
    for (let i = 0; i < performanceSettings.maxRipples; i++) {
      ripples.push({
        id: Date.now() + i,
        origin: [
          (Math.random() - 0.5) * 2,
          (Math.random() - 0.5) * 2,
          (Math.random() - 0.5) * 2
        ],
        scale: 0.5 + Math.random() * 0.5,
        opacity: 0.6 + Math.random() * 0.4,
        delay: i * 0.1
      });
    }
    setVoidRipples(ripples);
    
    // Create reality tears
    const tears = [];
    for (let i = 0; i < 2; i++) {
      tears.push({
        id: Date.now() + i + 100,
        startPos: [0, 0, 0],
        endPos: section.targetPos,
        progress: 0
      });
    }
    setRealityTears(tears);
    
    setTimeout(() => {
      setCubeVisible(false); 
      setDarkMatterVisible(true); 
      setActiveSection(section);
      
      const animate = () => {
        setDarkMatterProgress(prev => {
          const next = prev + 0.01;
          if (next >= 1) { 
            setTimeout(() => setMenuVisible(true), 800); 
            return 1; 
          }
          requestAnimationFrame(animate); 
          return next;
        });
      };
      animate();
    }, 500);
    
    setTimeout(() => setFragments([]), 1000);
  }, [cubeVisible, performanceSettings.maxFragments, performanceSettings.maxRipples]);

  const handleReset = useCallback(() => {
    setMenuVisible(false); 
    setMediaIsPlaying(false);
    setBinauralPaused(false);
    setVoidRipples([]);
    setRealityTears([]);
    
    if (binauralAudioRef.current && performanceSettings.enableBinaural) {
      binauralAudioRef.current.play().catch(e => console.error("Error resuming binaural audio:", e));
    }
    
    const animate = () => {
      setDarkMatterProgress(prev => {
        const next = prev - 0.015;
        if (next <= 0) {
          setDarkMatterVisible(false); 
          setCubeVisible(true); 
          setActiveSection(null); 
          setCubeOpacity(1); 
          return 0;
        }
        requestAnimationFrame(animate); 
        return next;
      });
    };
    animate();
  }, [performanceSettings.enableBinaural]);

  const handleMediaPlayingChange = useCallback((isPlaying) => { 
    setMediaIsPlaying(isPlaying); 
  }, []);

  // Update reality tears animation
  useEffect(() => {
    if (realityTears.length > 0) {
      const animate = () => {
        setRealityTears(prev => prev.map(tear => ({
          ...tear,
          progress: Math.min(tear.progress + 0.03, 1)
        })).filter(tear => tear.progress < 1));
        
        if (realityTears.length > 0) {
          requestAnimationFrame(animate);
        }
      };
      requestAnimationFrame(animate);
    }
  }, [realityTears.length]);
  
  // Clean up ripples after they expand
  useEffect(() => {
    const cleanup = setTimeout(() => {
      setVoidRipples([]);
    }, 3000);
    return () => clearTimeout(cleanup);
  }, [voidRipples.length]);

  return (
    <>
      <Canvas 
        camera={{ position: cameraSettings.position, fov: cameraSettings.fov }} 
        style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          width: '100vw', 
          height: '100vh', 
          background: 'linear-gradient(to bottom, #F4E4BC 0%, #D2B48C 70%, #8B7355 100%)',
          touchAction: 'none'
        }}
      >
        {/* Warm room lighting */}
        <ambientLight intensity={0.4} color="#F0E68C" />
        <directionalLight 
          position={[10, 8, 5]} 
          intensity={1.8} 
          color="#FFFACD"
          castShadow
        />
        <directionalLight 
          position={[-8, 6, 3]} 
          intensity={1.2} 
          color="#F5DEB3"
        />
        <pointLight 
          position={[0, 2, 8]} 
          intensity={0.8} 
          color="#FFF8DC"
          distance={20}
        />

        {/* Simple room geometry */}
        <SandyRoom />
        
        {/* Window light beams */}
        <WindowLightBeam 
          position={[8, 1, 2]} 
          rotation={[0, -0.5, 0]} 
          intensity={0.3}
        />
        <WindowLightBeam 
          position={[-6, 2, 1]} 
          rotation={[0, 0.4, 0]} 
          intensity={0.25}
        />
        <WindowLightBeam 
          position={[2, 3, 6]} 
          rotation={[0.3, 0, 0]} 
          intensity={0.2}
        />
        
        {/* Floating dust motes */}
        <DustMotes count={performanceSettings.maxDustMotes} />

        <MinimalCube onFaceClick={handleCubeClick} visible={cubeVisible} opacity={cubeOpacity} />
        {fragments.map(frag => <Fragment key={frag.id} {...frag} />)}
        
        {darkMatterVisible && activeSection && (
          <>
            {/* Main quantum visualization */}
            <group position={[ 
              darkMatterProgress * activeSection.targetPos[0], 
              darkMatterProgress * activeSection.targetPos[1], 
              darkMatterProgress * activeSection.targetPos[2] 
            ]}>
              <QuantumVisualization
                position={[0,0,0]} 
                scale={1.2 - darkMatterProgress * 0.4} 
                opacity={1}
                flowDirection={new THREE.Vector3(...activeSection.targetPos).normalize()}
                isFlowing={true} 
                flowProgress={darkMatterProgress}
              />
            </group>
            
            {/* Trailing energy orbs */}
            {[...Array(performanceSettings.maxTrails)].map((_, i) => (
              <EnergyOrbTrail
                key={i}
                position={[
                  darkMatterProgress * activeSection.targetPos[0] * (0.7 - i * 0.1),
                  darkMatterProgress * activeSection.targetPos[1] * (0.7 - i * 0.1),
                  darkMatterProgress * activeSection.targetPos[2] * (0.7 - i * 0.1)
                ]}
                opacity={0.5 - i * 0.05}
                scale={0.5 - i * 0.08}
                delay={i * 0.3}
              />
            ))}
          </>
        )}
        
        {/* Render void ripples */}
        {voidRipples.map(ripple => (
          <VoidRipple
            key={ripple.id}
            origin={ripple.origin}
            scale={ripple.scale}
            opacity={ripple.opacity}
          />
        ))}
        
        {/* Render reality tears */}
        {realityTears.map(tear => (
          <RealityTear
            key={tear.id}
            startPos={tear.startPos}
            endPos={tear.endPos}
            progress={tear.progress}
          />
        ))}
        
        {darkMatterVisible && activeSection && <CameraController darkMatterProgress={darkMatterProgress} targetPos={activeSection.targetPos} />}
        <OrbitControls 
          enablePan={false} 
          enabled={!darkMatterVisible}
          enableDamping={true}
          dampingFactor={0.05}
          maxDistance={isMobile ? 8 : 15}
          minDistance={isMobile ? 2 : 3}
        />
      </Canvas>
      
      <SectionContent section={menuVisible ? activeSection : null} onReset={handleReset} onMediaPlayingChange={handleMediaPlayingChange} />
      
      {performanceSettings.enableBinaural && (
        <audio ref={binauralAudioRef} loop preload="auto" src="/audio/binaural_loop.mp3" />
      )}
      
      {/* Auto-preview warning */}
      {showWarning && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'linear-gradient(145deg, #2C2C2C 0%, #1A1A1A 100%)',
          border: '2px solid #C0C0C0',
          borderRadius: '8px',
          padding: '30px',
          textAlign: 'center',
          color: '#E0E0E0',
          fontFamily: 'monospace',
          fontSize: '18px',
          zIndex: 10000,
          boxShadow: '0 0 30px rgba(192,192,192,0.3), inset 0 2px 4px rgba(255,255,255,0.1)'
        }}>
          <div style={{ 
            marginBottom: '20px', 
            color: '#C0C0C0',
            textShadow: '0 0 10px rgba(192,192,192,0.5)'
          }}>
            ⚠ INITIATING VOID GLIMPSE ⚠
          </div>
          <div style={{ color: '#E0E0E0' }}>
            Dimensional breach in {timeLeft} seconds...
          </div>
          <div style={{ 
            fontSize: '14px', 
            marginTop: '15px', 
            color: '#A0A0A0',
            fontStyle: 'italic'
          }}>
            Move to cancel
          </div>
        </div>
      )}
      
      {/* Device info for debugging */}
      {process.env.NODE_ENV === 'development' && (
        <div style={{
          position: 'fixed',
          top: 10,
          left: 10,
          background: 'linear-gradient(145deg, #2C2C2C 0%, #1A1A1A 100%)',
          color: '#E0E0E0',
          padding: '8px 12px',
          fontSize: '12px',
          fontFamily: 'monospace',
          zIndex: 9999,
          border: '1px solid #404040',
          borderRadius: '4px',
          boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.1)'
        }}>
          Device: {isMobile ? 'Mobile' : isTablet ? 'Tablet' : 'Desktop'} | Touch: {isTouch ? 'Yes' : 'No'}
        </div>
      )}
    </>
  );
}

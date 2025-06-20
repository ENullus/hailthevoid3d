// src/Scene.js - Mobile Optimized Version
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
    materialProps: { color: "#1a1a1a", metalness: 0.9, roughness: 0.1, emissive: "#000000" },
    targetPos: [4, 0, 0]
  },
  {
    id: 'art',
    name: "DISRUPTIONS",
    materialProps: { color: "#0d0d0d", metalness: 0.9, roughness: 0.1, emissive: "#000000" },
    targetPos: [-4, 0, 0]
  },
  {
    id: 'about',
    name: "HAIL THE VOID",
    materialProps: { color: "#262626", metalness: 0.9, roughness: 0.1, emissive: "#000000" },
    targetPos: [0, 4, 0]
  },
  {
    id: 'submit',
    name: "SHADOWS",
    materialProps: { color: "#333333", metalness: 0.9, roughness: 0.1, emissive: "#000000" },
    targetPos: [0, -4, 0]
  },
  {
    id: 'contact',
    name: "COLLAPSE",
    materialProps: { color: "#1f1f1f", metalness: 0.9, roughness: 0.1, emissive: "#000000" },
    targetPos: [0, 0, 4]
  },
  {
    id: 'video',
    name: "Video Streams",
    materialProps: {
      color: "#2C2C2C", 
      metalness: 0.9,
      roughness: 0.05, 
      emissive: "#000000"
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

// Auto-preview hook (once per visit after 2 minutes)
function useAutoPreview() {
  const [showWarning, setShowWarning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const timerRef = useRef(null);
  const warningTimerRef = useRef(null);
  const countdownRef = useRef(null);
  
  useEffect(() => {
    // Check if preview already happened this session
    const previewHappened = sessionStorage.getItem('voidPreviewShown');
    if (previewHappened) return;
    
    const TOTAL_TIME = 2 * 60 * 1000; // 2 minutes total
    const WARNING_TIME = 10 * 1000; // Show warning 10 seconds before
    const PREVIEW_DURATION = 30; // 30 seconds
    
    const STATIC_SITE_URL = 'https://hailthevoid.org';
    
    function schedulePreview() {
      // Schedule warning
      warningTimerRef.current = setTimeout(() => {
        setShowWarning(true);
        setTimeLeft(10);
        startCountdown();
      }, TOTAL_TIME - WARNING_TIME);
      
      // Schedule preview
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
    
    // Start the timer
    schedulePreview();
    
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, []);
  
  return { showWarning, timeLeft };
}

// Dark Matter Trail Component
function DarkMatterTrail({ position, opacity, scale, delay }) {
  const meshRef = useRef();
  const time = useRef(delay);

  useFrame((state, delta) => {
    if (meshRef.current) {
      time.current += delta;
      const t = time.current;
      
      // Floating motion
      meshRef.current.position.x = position[0] + Math.sin(t * 0.5) * 0.5;
      meshRef.current.position.y = position[1] + Math.cos(t * 0.7) * 0.3;
      meshRef.current.position.z = position[2] + Math.sin(t * 0.3) * 0.4;
      
      // Pulsing scale
      const pulseScale = scale * (1 + Math.sin(t * 2) * 0.2);
      meshRef.current.scale.setScalar(pulseScale);
      
      // Fade based on distance
      meshRef.current.material.opacity = opacity * (0.5 + Math.sin(t) * 0.5);
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[0.3, 16, 16]} />
      <meshPhysicalMaterial
        color="#444444"
        metalness={0.8}
        roughness={0.2}
        transparent={true}
        opacity={opacity}
        emissive="#666666"
        emissiveIntensity={0.3}
      />
    </mesh>
  );
}

// Abstract Void Ripple Effect
function VoidRipple({ origin, scale, opacity }) {
  const meshRef = useRef();
  const time = useRef(0);

  useFrame((state, delta) => {
    if (meshRef.current) {
      time.current += delta;
      const t = time.current;
      
      // Expand outward
      meshRef.current.scale.setScalar(scale * (1 + t * 3));
      
      // Fade and distort
      meshRef.current.material.opacity = opacity * Math.max(0, 1 - t);
      meshRef.current.rotation.z = t * 2;
      
      // Warping effect
      const positions = meshRef.current.geometry.attributes.position.array;
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 2] = Math.sin(positions[i] * 10 + t * 5) * 0.1;
      }
      meshRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <mesh ref={meshRef} position={origin}>
      <ringGeometry args={[0.5, 0.8, 64]} />
      <meshBasicMaterial 
        color="#000000" 
        transparent={true} 
        opacity={opacity}
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

// Reality Tear Effect - like space is ripping
function RealityTear({ startPos, endPos, progress }) {
  const meshRef = useRef();
  
  useFrame(() => {
    if (meshRef.current && progress < 1) {
      const curve = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(...startPos),
        new THREE.Vector3(
          (startPos[0] + endPos[0]) / 2 + (Math.random() - 0.5) * 2,
          (startPos[1] + endPos[1]) / 2 + (Math.random() - 0.5) * 2,
          (startPos[2] + endPos[2]) / 2 + (Math.random() - 0.5) * 2
        ),
        new THREE.Vector3(...endPos)
      );
      
      const points = curve.getPoints(50);
      const positions = new Float32Array(points.length * 3);
      
      points.forEach((point, i) => {
        if (i / points.length < progress) {
          positions[i * 3] = point.x + (Math.random() - 0.5) * 0.1;
          positions[i * 3 + 1] = point.y + (Math.random() - 0.5) * 0.1;
          positions[i * 3 + 2] = point.z + (Math.random() - 0.5) * 0.1;
        }
      });
      
      meshRef.current.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    }
  });
  
  return (
    <line ref={meshRef}>
      <bufferGeometry />
      <lineBasicMaterial color="#000000" linewidth={3} transparent opacity={0.8} />
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
        emissive: new THREE.Color(props.emissive || '#000000'),
        emissiveIntensity: props.emissiveIntensity || 0.1,
      });
    });
  }, [opacity, iceNormalMap, iceRoughnessMap]);

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
  return ( <mesh ref={meshRef} onClick={handleClick} material={materials} position={[0,0,0]} visible={visible}> <boxGeometry args={[2,2,2]} /> </mesh> );
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
  return ( <mesh ref={meshRef} position={position} scale={scale}> <boxGeometry args={[1,1,1]} /> <meshBasicMaterial color={color || "#222222"} /> </mesh> );
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
    animationSpeed: isMobile ? 0.5 : 1,
    enableBinaural: !isMobile // Disable background audio on mobile to save battery
  }), [isMobile]);

  // Camera settings based on device
  const cameraSettings = useMemo(() => ({
    position: isMobile ? [3, 3, 3] : [5, 5, 5],
    fov: isMobile ? 60 : 50
  }), [isMobile]);

  useEffect(() => {
    if (binauralAudioRef.current && performanceSettings.enableBinaural) {
      binauralAudioRef.current.play().catch(e => {
        console.warn("Binaural audio autoplay prevented.", e);
      });
    }
    return () => { if (binauralAudioRef.current) binauralAudioRef.current.pause(); };
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
    
    // Stop binaural audio for video and music sections and keep it off
    if (section.id === 'video' || section.id === 'music') {
      setBinauralPaused(true);
      if (binauralAudioRef.current) {
        binauralAudioRef.current.pause();
      }
    }
    
    // Create fragments with performance optimization
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
    
    // Create void ripples with performance limits
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
  }, [cubeVisible, performanceSettings]);

  const handleReset = useCallback(() => {
    setMenuVisible(false); 
    setMediaIsPlaying(false);
    setBinauralPaused(false); // Resume binaural audio
    setVoidRipples([]);
    setRealityTears([]);
    
    // Resume binaural audio when returning to main menu
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
  }, []);

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
          background: 'white',
          touchAction: 'none' // Prevent scrolling on touch
        }}
      >
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 10, 7.5]} intensity={1.0} />
        <directionalLight position={[-5, -5, -5]} intensity={0.6} />

        <MinimalCube onFaceClick={handleCubeClick} visible={cubeVisible} opacity={cubeOpacity} />
        {fragments.map(frag => <Fragment key={frag.id} {...frag} />)}
        
        {darkMatterVisible && activeSection && (
          <>
            {/* Main dark matter with larger scale */}
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
            
            {/* Trailing dark matter pieces with performance optimization */}
            {[...Array(performanceSettings.maxTrails)].map((_, i) => (
              <DarkMatterTrail
                key={i}
                position={[
                  darkMatterProgress * activeSection.targetPos[0] * (0.7 - i * 0.1),
                  darkMatterProgress * activeSection.targetPos[1] * (0.7 - i * 0.1),
                  darkMatterProgress * activeSection.targetPos[2] * (0.7 - i * 0.1)
                ]}
                opacity={0.3 - i * 0.05}
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
        )        )}
        
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
      
      {/* Only load binaural audio if performance allows */}
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
          background: 'rgba(0,0,0,0.9)',
          border: '2px solid #ff0000',
          padding: '30px',
          textAlign: 'center',
          color: 'white',
          fontFamily: 'monospace',
          fontSize: '18px',
          zIndex: 10000,
          boxShadow: '0 0 30px rgba(255,0,0,0.5)'
        }}>
          <div style={{ marginBottom: '20px', color: '#ff0000' }}>
            ⚠ INITIATING VOID GLIMPSE ⚠
          </div>
          <div>
            Dimensional breach in {timeLeft} seconds...
          </div>
          <div style={{ fontSize: '14px', marginTop: '15px', color: '#888' }}>
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
          background: 'rgba(0,0,0,0.7)',
          color: 'white',
          padding: '5px',
          fontSize: '12px',
          fontFamily: 'monospace',
          zIndex: 9999
        }}>
          Device: {isMobile ? 'Mobile' : isTablet ? 'Tablet' : 'Desktop'} | Touch: {isTouch ? 'Yes' : 'No'}
        </div>
      )}
    </>
  );
}
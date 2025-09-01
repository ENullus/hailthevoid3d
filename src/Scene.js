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
    materialProps: { color: "#C0C0C0", metalness: 1.0, roughness: 0.1, emissive: "#E0E0E0" },
    targetPos: [4, 0, 0]
  },
  {
    id: 'art',
    name: "DISRUPTIONS",
    materialProps: { color: "#B8B8B8", metalness: 1.0, roughness: 0.05, emissive: "#D3D3D3" },
    targetPos: [-4, 0, 0]
  },
  {
    id: 'about',
    name: "HAIL THE VOID",
    materialProps: { color: "#D3D3D3", metalness: 1.0, roughness: 0.1, emissive: "#F0F0F0" },
    targetPos: [0, 4, 0]
  },
  {
    id: 'submit',
    name: "SHADOWS",
    materialProps: { color: "#A9A9A9", metalness: 1.0, roughness: 0.15, emissive: "#C0C0C0" },
    targetPos: [0, -4, 0]
  },
  {
    id: 'contact',
    name: "COLLAPSE",
    materialProps: { color: "#BEBEBE", metalness: 1.0, roughness: 0.08, emissive: "#D8D8D8" },
    targetPos: [0, 0, 4]
  },
  {
    id: 'video',
    name: "Video Streams",
    materialProps: {
      color: "#E0E0E0",
      metalness: 1.0,
      roughness: 0.05,
      emissive: "#F5F5F5"
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

// Metallic Trail Component
function MetallicTrail({ position, opacity, scale, delay }) {
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
      meshRef.current.material.opacity = opacity * (0.5 + Math.sin(t) * 0.5);
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[0.3, 16, 16]} />
      <meshPhysicalMaterial
        color="#C0C0C0"
        metalness={1.0}
        roughness={0.1}
        transparent={true}
        opacity={opacity}
        emissive="#E0E0E0"
        emissiveIntensity={0.3}
      />
    </mesh>
  );
}

// Metallic Void Ripple Effect
function MetallicRipple({ origin, scale, opacity }) {
  const meshRef = useRef();
  const time = useRef(0);

  useFrame((state, delta) => {
    if (meshRef.current) {
      time.current += delta;
      const t = time.current;

      meshRef.current.scale.setScalar(scale * (1 + t * 3));
      meshRef.current.material.opacity = opacity * Math.max(0, 1 - t);
      meshRef.current.rotation.z = t * 2;

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
        color="#C0C0C0"
        transparent={true}
        opacity={opacity}
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

// Metallic Reality Tear Effect
function MetallicTear({ startPos, endPos, progress }) {
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
      <lineBasicMaterial color="#C0C0C0" linewidth={3} transparent opacity={0.8} />
    </line>
  );
}

// Seamless morphing cube that transforms into quantum blob
function MorphingCube({ onFaceClick, visible, morphProgress = 0, targetSection }) {
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
        transmission: 0.5,
        opacity: 1,
        ior: 1.5,
        thickness: 0.8,
        emissive: new THREE.Color(props.emissive),
        emissiveIntensity: 0.4,
        clearcoat: 1.0,
        clearcoatRoughness: 0.05
      });
    });
  }, [iceNormalMap, iceRoughnessMap]);

  // Seamless morphing animation
  useFrame((state) => {
    if (meshRef.current && morphProgress > 0) {
      const t = state.clock.getElapsedTime();
      
      // Morph the cube geometry into more organic shapes
      const geometry = meshRef.current.geometry;
      const positionAttribute = geometry.attributes.position;
      const positions = positionAttribute.array;
      
      for (let i = 0; i < positions.length; i += 3) {
        const x = positions[i];
        const y = positions[i + 1];
        const z = positions[i + 2];
        
        // Apply organic distortion based on morph progress
        const distortion = morphProgress * 0.3;
        const noise = Math.sin(x * 3 + t) * Math.cos(y * 3 + t) * Math.sin(z * 3 + t);
        
        positions[i] = x * (1 - morphProgress * 0.2) + noise * distortion;
        positions[i + 1] = y * (1 - morphProgress * 0.2) + noise * distortion * 0.8;
        positions[i + 2] = z * (1 - morphProgress * 0.2) + noise * distortion * 0.6;
      }
      
      positionAttribute.needsUpdate = true;
      
      // Scale and position transformation
      const scale = 1 + morphProgress * 0.5;
      meshRef.current.scale.setScalar(scale);
      
      // Rotation during morph
      meshRef.current.rotation.x += morphProgress * 0.02;
      meshRef.current.rotation.y += morphProgress * 0.015;
      meshRef.current.rotation.z += morphProgress * 0.01;
    }
  });

  const handleClick = (event) => {
    if (!visible || morphProgress > 0) return;
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
    <mesh ref={meshRef} onClick={handleClick} material={materials} position={[0, 0, 0]} visible={visible}>
      <boxGeometry args={[2, 2, 2]} />
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
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial color={color || "#C0C0C0"} />
    </mesh>
  );
}

function CameraController({ darkMatterProgress, targetPos }) {
  const { camera } = useThree();
  useFrame(() => {
    if (darkMatterProgress > 0 && targetPos) {
      const currentPos = new THREE.Vector3().lerpVectors(new THREE.Vector3(0, 0, 0), new THREE.Vector3(...targetPos), darkMatterProgress);
      const cameraPos = currentPos.clone().add(new THREE.Vector3(3, 3, 3));
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
  const [morphProgress, setMorphProgress] = useState(0);
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

  const performanceSettings = useMemo(() => ({
    maxFragments: isMobile ? 4 : 8,
    maxTrails: isMobile ? 2 : 5,
    maxRipples: isMobile ? 1 : 3,
    animationSpeed: isMobile ? 0.5 : 1,
    enableBinaural: !isMobile
  }), [isMobile]);

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
    if (!cubeVisible || section.disabled || morphProgress > 0) return;

    if (section.id === 'video' || section.id === 'music') {
      setBinauralPaused(true);
      if (binauralAudioRef.current) {
        binauralAudioRef.current.pause();
      }
    }

    setActiveSection(section);

    // Start seamless morphing sequence
    const morphAnimate = () => {
      setMorphProgress(prev => {
        const next = prev + 0.02;
        if (next >= 1) {
          // Cube fully morphed, now transition to quantum blob
          setCubeVisible(false);
          setDarkMatterVisible(true);
          
          // Start quantum blob animation
          const quantumAnimate = () => {
            setDarkMatterProgress(prev => {
              const next = prev + 0.015;
              if (next >= 1) {
                setTimeout(() => setMenuVisible(true), 400);
                return 1;
              }
              requestAnimationFrame(quantumAnimate);
              return next;
            });
          };
          quantumAnimate();
          
          return 1;
        }
        requestAnimationFrame(morphAnimate);
        return next;
      });
    };

    // Create fragments during morph
    const frags = [];
    for (let i = 0; i < performanceSettings.maxFragments; i++) {
      frags.push({
        id: i,
        position: [(Math.random() - 0.5) * 0.5, (Math.random() - 0.5) * 0.5, (Math.random() - 0.5) * 0.5],
        velocity: [(Math.random() - 0.5) * 5, (Math.random() - 0.5) * 5, (Math.random() - 0.5) * 5],
        scale: 0.2 + Math.random() * 0.3,
        color: section.materialProps.color
      });
    }
    setFragments(frags);

    // Create ripples
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

    // Start the morphing
    morphAnimate();

    setTimeout(() => setFragments([]), 2000);
  }, [cubeVisible, morphProgress, performanceSettings.maxFragments, performanceSettings.maxRipples]);

  const handleReset = useCallback(() => {
    setMenuVisible(false);
    setMediaIsPlaying(false);
    setBinauralPaused(false);
    setVoidRipples([]);
    setRealityTears([]);

    if (binauralAudioRef.current && performanceSettings.enableBinaural) {
      binauralAudioRef.current.play().catch(e => console.error("Error resuming binaural audio:", e));
    }

    // Reverse the process - quantum blob back to cube
    const reverseAnimate = () => {
      setDarkMatterProgress(prev => {
        const next = prev - 0.02;
        if (next <= 0) {
          setDarkMatterVisible(false);
          setCubeVisible(true);
          setActiveSection(null);
          
          // Reset morph progress back to 0 (fully formed cube)
          setMorphProgress(0);
          
          return 0;
        }
        requestAnimationFrame(reverseAnimate);
        return next;
      });
    };
    reverseAnimate();
  }, [performanceSettings.enableBinaural]);

  const handleMediaPlayingChange = useCallback((isPlaying) => {
    setMediaIsPlaying(isPlaying);
  }, []);

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

  useEffect(() => {
    if (voidRipples.length > 0) {
      const cleanup = setTimeout(() => {
        setVoidRipples([]);
      }, 3000);
      return () => clearTimeout(cleanup);
    }
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
          background: 'linear-gradient(145deg, #E8E8E8 0%, #D0D0D0 30%, #C0C0C0 70%, #A8A8A8 100%)',
          touchAction: 'none'
        }}
      >
        <ambientLight intensity={0.6} color="#F0E68C" />
        <directionalLight position={[5, 10, 7.5]} intensity={1.2} color="#FFFACD" />
        <directionalLight position={[-5, -5, -5]} intensity={0.8} color="#F5DEB3" />

        <MorphingCube 
          onFaceClick={handleCubeClick} 
          visible={cubeVisible} 
          morphProgress={morphProgress}
          targetSection={activeSection}
        />
        
        {fragments.map(frag => <Fragment key={frag.id} {...frag} />)}

        {darkMatterVisible && activeSection && (
          <>
            <group position={[
              darkMatterProgress * activeSection.targetPos[0],
              darkMatterProgress * activeSection.targetPos[1],
              darkMatterProgress * activeSection.targetPos[2]
            ]}>
              <QuantumVisualization
                position={[0, 0, 0]}
                scale={1.2 - darkMatterProgress * 0.4}
                opacity={1}
                flowDirection={new THREE.Vector3(...activeSection.targetPos).normalize()}
                isFlowing={true}
                flowProgress={darkMatterProgress}
              />
            </group>

            {[...Array(performanceSettings.maxTrails)].map((_, i) => (
              <MetallicTrail
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

        {voidRipples.map(ripple => (
          <MetallicRipple
            key={ripple.id}
            origin={ripple.origin}
            scale={ripple.scale}
            opacity={ripple.opacity}
          />
        ))}

        {realityTears.map(tear => (
          <MetallicTear
            key={tear.id}
            startPos={tear.startPos}
            endPos={tear.endPos}
            progress={tear.progress}
          />
        ))}

        {darkMatterVisible && activeSection && <CameraController darkMatterProgress={darkMatterProgress} targetPos={activeSection.targetPos} />}
        <OrbitControls
          enablePan={false}
          enabled={!darkMatterVisible && morphProgress === 0}
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

      {showWarning && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'linear-gradient(145deg, #E8E8E8 0%, #D0D0D0 30%, #C0C0C0 70%, #A8A8A8 100%)',
          border: '4px solid #808080',
          borderRadius: '12px',
          padding: '35px',
          textAlign: 'center',
          color: '#1A1A1A',
          fontFamily: 'monospace',
          fontSize: '18px',
          fontWeight: 'bold',
          zIndex: 10000,
          boxShadow: '0 0 50px rgba(0,0,255,0.3), inset 0 3px 8px rgba(255,255,255,0.4), inset 0 -3px 8px rgba(0,0,0,0.2)',
          textShadow: '0 0 5px rgba(0,0,255,0.3)'
        }}>
          <div style={{
            marginBottom: '20px',
            color: '#2C2C2C',
            textShadow: '0 0 5px rgba(0,0,255,0.3)'
          }}>
            ⚠ INITIATING VOID GLIMPSE ⚠
          </div>
          <div style={{
            color: '#1A1A1A',
            textShadow: '0 0 5px rgba(0,0,255,0.3)'
          }}>
            Dimensional breach in {timeLeft} seconds...
          </div>
          <div style={{
            fontSize: '14px',
            marginTop: '15px',
            color: '#4A4A4A',
            fontStyle: 'italic',
            textShadow: '0 0 5px rgba(0,0,255,0.3)'
          }}>
            Move to cancel
          </div>
        </div>
      )}

      {process.env.NODE_ENV === 'development' && (
        <div style={{
          position: 'fixed',
          top: 10,
          left: 10,
          background: 'linear-gradient(145deg, #E8E8E8 0%, #D0D0D0 30%, #C0C0C0 70%, #A8A8A8 100%)',
          border: '2px solid #808080',
          borderRadius: '8px',
          padding: '10px',
          color: '#2C2C2C',
          fontFamily: 'monospace',
          fontSize: '12px',
          fontWeight: 'bold',
          zIndex: 9999,
          boxShadow: '0 0 20px rgba(0,0,255,0.2), inset 0 2px 4px rgba(255,255,255,0.4), inset 0 -2px 4px rgba(0,0,0,0.2)',
          textShadow: '0 0 5px rgba(0,0,255,0.3)'
        }}>
          Device: {isMobile ? 'Mobile' : isTablet ? 'Tablet' : 'Desktop'} | Touch: {isTouch ? 'Yes' : 'No'}
        </div>
      )}
    </>
  );
}

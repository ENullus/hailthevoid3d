// Scene.js
import React, { useRef, useState, useCallback, useEffect, useMemo } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import SectionContent from './SectionContent';
import QuantumVisualization from './QuantumVisualization';

// ---------------- sections ----------------
const sections = [
  { id: 'music',  name: "FREQUENCIES",   materialProps: { color: "#C0C0C0", metalness: 1.0, roughness: 0.1,  emissive: "#E0E0E0" }, targetPos: [ 4,  0,  0] },
  { id: 'art',    name: "DISRUPTIONS",   materialProps: { color: "#B8B8B8", metalness: 1.0, roughness: 0.05, emissive: "#D3D3D3" }, targetPos: [-4,  0,  0] },
  { id: 'about',  name: "HAIL THE VOID", materialProps: { color: "#D3D3D3", metalness: 1.0, roughness: 0.1,  emissive: "#F0F0F0" }, targetPos: [ 0,  4,  0] },
  { id: 'submit', name: "SHADOWS",       materialProps: { color: "#A9A9A9", metalness: 1.0, roughness: 0.15, emissive: "#C0C0C0" }, targetPos: [ 0, -4,  0] },
  { id: 'contact',name: "COLLAPSE",      materialProps: { color: "#BEBEBE", metalness: 1.0, roughness: 0.08, emissive: "#D8D8D8" }, targetPos: [ 0,  0,  4] },
  { id: 'video',  name: "Video Streams", materialProps: { color: "#E0E0E0", metalness: 1.0, roughness: 0.05, emissive: "#F5F5F5" }, targetPos: [ 0,  0, -4], disabled: false }
];

// ---------------- helpers ----------------
const clamp01 = (x) => Math.min(1, Math.max(0, x));
const easeInOut = (t) => t * t * (3 - 2 * t); // smoothstep

function tween({ from, to, duration = 800, easing = easeInOut, onUpdate, onComplete }) {
  const start = performance.now();
  let raf;
  const loop = (now) => {
    const t = clamp01((now - start) / duration);
    const v = from + (to - from) * easing(t);
    onUpdate?.(v);
    if (t < 1) raf = requestAnimationFrame(loop);
    else { onUpdate?.(to); onComplete?.(); }
  };
  raf = requestAnimationFrame(loop);
  return () => cancelAnimationFrame(raf);
}

// ---------------- device + preview ----------------
function useDeviceDetection() {
  const [device, setDevice] = useState({ isMobile: false, isTablet: false, isTouch: false });
  useEffect(() => {
    const checkDevice = () => {
      const w = window.innerWidth, h = window.innerHeight;
      const isTouch = 'ontouchstart' in window;
      const isMobile = w <= 768 || (isTouch && Math.min(w, h) <= 768);
      const isTablet = !isMobile && w <= 1024 && isTouch;
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

    function startCountdown() {
      countdownRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) { clearInterval(countdownRef.current); return 0; }
          return prev - 1;
        });
      }, 1000);
    }

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

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, []);

  return { showWarning, timeLeft };
}

// ---------------- FX bits ----------------
function MetallicTrail({ position, opacity, scale, delay }) {
  const meshRef = useRef();
  const time = useRef(delay);
  useFrame((_, delta) => {
    const m = meshRef.current; if (!m) return;
    time.current += delta;
    const t = time.current;
    m.position.x = position[0] + Math.sin(t * 0.5) * 0.5;
    m.position.y = position[1] + Math.cos(t * 0.7) * 0.3;
    m.position.z = position[2] + Math.sin(t * 0.3) * 0.4;
    const pulseScale = scale * (1 + Math.sin(t * 2) * 0.2);
    m.scale.setScalar(pulseScale);
    m.material.opacity = opacity * (0.5 + Math.sin(t) * 0.5);
  });
  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[0.3, 16, 16]} />
      <meshPhysicalMaterial
        color="#C0C0C0"
        metalness={1.0}
        roughness={0.1}
        transparent
        opacity={opacity}
        emissive="#E0E0E0"
        emissiveIntensity={0.3}
      />
    </mesh>
  );
}

function MetallicRipple({ origin, scale, opacity }) {
  const meshRef = useRef();
  const time = useRef(0);
  useFrame((_, delta) => {
    const m = meshRef.current; if (!m) return;
    time.current += delta;
    const t = time.current;
    m.scale.setScalar(scale * (1 + t * 3));
    m.material.opacity = opacity * Math.max(0, 1 - t);
    m.rotation.z = t * 2;
    const positions = m.geometry.attributes.position.array;
    for (let i = 0; i < positions.length; i += 3) {
      positions[i + 2] = Math.sin(positions[i] * 10 + t * 5) * 0.1;
    }
    m.geometry.attributes.position.needsUpdate = true;
  });
  return (
    <mesh ref={meshRef} position={origin}>
      <ringGeometry args={[0.5, 0.8, 64]} />
      <meshBasicMaterial
        color="#C0C0C0"
        transparent
        opacity={opacity}
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

function MetallicTear({ startPos, endPos, progress }) {
  const meshRef = useRef();
  const pointsRef = useRef([]);
  
  useEffect(() => {
    // Calculate points only once
    const mid = [(startPos[0]+endPos[0])/2, (startPos[1]+endPos[1])/2, (startPos[2]+endPos[2])/2];
    const curve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(...startPos),
      new THREE.Vector3(mid[0] + (Math.random()-0.5)*2, mid[1] + (Math.random()-0.5)*2, mid[2] + (Math.random()-0.5)*2),
      new THREE.Vector3(...endPos)
    );
    pointsRef.current = curve.getPoints(50);
  }, [startPos, endPos]);
  
  useFrame(() => {
    const m = meshRef.current; if (!m || !pointsRef.current.length) return;
    const points = pointsRef.current;
    const positions = new Float32Array(points.length * 3);
    points.forEach((p, i) => {
      if (i / points.length < progress) {
        positions[i*3]   = p.x + (Math.random()-0.5)*0.1;
        positions[i*3+1] = p.y + (Math.random()-0.5)*0.1;
        positions[i*3+2] = p.z + (Math.random()-0.5)*0.1;
      }
    });
    m.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
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
  const [texturesLoaded, setTexturesLoaded] = useState(false);
  
  // Use fallback if textures don't exist
  const iceNormalMap = useTexture('/textures/ice_normal.jpg', 
    () => setTexturesLoaded(true),
    () => {
      console.warn('Ice normal texture not found, using default');
      setTexturesLoaded(true);
    }
  );
  
  const iceRoughnessMap = useTexture('/textures/ice_roughness.jpg', 
    undefined,
    () => console.warn('Ice roughness texture not found, using default')
  );
  
  const materials = useMemo(() => sections.map(section => {
    const props = section.materialProps;
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(props.color),
      metalness: props.metalness,
      roughness: props.roughness,
      normalMap: texturesLoaded ? iceNormalMap : null,
      roughnessMap: texturesLoaded ? iceRoughnessMap : null,
      normalScale: new THREE.Vector2(1, 1),
      transparent: true,
      transmission: 0.5,
      opacity,
      ior: 1.5,
      thickness: 0.8,
      emissive: new THREE.Color(props.emissive),
      emissiveIntensity: 0.4,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05
    });
  }), [opacity, iceNormalMap, iceRoughnessMap, texturesLoaded]);

  const handleClick = useCallback((e) => {
    if (!visible) return;
    e.stopPropagation();
    const idx = e.face?.materialIndex;
    if (idx !== undefined) {
      const section = sections[idx];
      if (section && !section.disabled) onFaceClick(section);
    }
  }, [visible, onFaceClick]);
  
  return (
    <mesh ref={meshRef} onClick={handleClick} material={materials} position={[0,0,0]} visible={visible}>
      <boxGeometry args={[2,2,2]} />
    </mesh>
  );
}

function Fragment({ position, velocity, scale, color }) {
  const meshRef = useRef();
  const vel = useRef([...velocity]);
  useFrame((_, delta) => {
    const m = meshRef.current; if (!m) return;
    m.position.x += vel.current[0] * delta;
    m.position.y += vel.current[1] * delta;
    m.position.z += vel.current[2] * delta;
    vel.current[0]*=0.98; vel.current[1]*=0.98; vel.current[2]*=0.98;
    m.rotation.x += delta; m.rotation.y += delta * 1.5;
    m.scale.multiplyScalar(0.98);
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

// ---------------- main Scene ----------------
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

  const performanceSettings = useMemo(() => ({
    maxFragments: isMobile ? 4 : 8,
    maxTrails: isMobile ? 2 : 5,
    maxRipples: isMobile ? 1 : 3,
    animationSpeed: isMobile ? 0.5 : 1,
    enableBinaural: !isMobile
  }), [isMobile]);

  const cameraSettings = useMemo(() => ({
    position: isMobile ? [3,3,3] : [5,5,5],
    fov: isMobile ? 60 : 50
  }), [isMobile]);

  // binaural audio management
  useEffect(() => {
    const a = binauralAudioRef.current;
    if (a && performanceSettings.enableBinaural) {
      a.play().catch(() => {});
    }
    return () => { a && a.pause(); };
  }, [performanceSettings.enableBinaural]);

  useEffect(() => {
    const a = binauralAudioRef.current;
    if (!a || !performanceSettings.enableBinaural) return;
    if (mediaIsPlaying || binauralPaused) {
      a.pause();
    } else if (menuVisible || (!darkMatterVisible && !menuVisible)) {
      a.play().catch(() => {});
    }
  }, [mediaIsPlaying, menuVisible, darkMatterVisible, performanceSettings.enableBinaural, binauralPaused]);

  // ---------- cube → blob ----------
  const handleCubeClick = useCallback((section) => {
    if (!cubeVisible || section.disabled) return;

    if (section.id === 'video' || section.id === 'music') {
      setBinauralPaused(true);
      if (binauralAudioRef.current) {
        binauralAudioRef.current.pause();
      }
    }

    const frags = [];
    for (let i = 0; i < performanceSettings.maxFragments; i++) {
      frags.push({
        id: i,
        position: [(Math.random()-0.5)*0.5, (Math.random()-0.5)*0.5, (Math.random()-0.5)*0.5],
        velocity: [(Math.random()-0.5)*5, (Math.random()-0.5)*5, (Math.random()-0.5)*5],
        scale: 0.2 + Math.random()*0.3,
        color: section.materialProps.color
      });
    }
    setFragments(frags);

    const ripples = [];
    for (let i = 0; i < performanceSettings.maxRipples; i++) {
      ripples.push({
        id: Date.now() + i,
        origin: [(Math.random()-0.5)*2, (Math.random()-0.5)*2, (Math.random()-0.5)*2],
        scale: 0.5 + Math.random()*0.5,
        opacity: 0.6 + Math.random()*0.4,
        delay: i * 0.1
      });
    }
    setVoidRipples(ripples);

    const tears = [];
    for (let i = 0; i < 2; i++) {
      tears.push({ id: Date.now() + i + 100, startPos: [0,0,0], endPos: section.targetPos, progress: 0 });
    }
    setRealityTears(tears);

    setActiveSection(section);
    setDarkMatterVisible(true);
    setMenuVisible(false);

    // crossfade + morph
    tween({
      from: cubeOpacity,
      to: 0,
      duration: 750,
      onUpdate: (v) => setCubeOpacity(v),
      onComplete: () => setCubeVisible(false)
    });

    tween({
      from: 0,
      to: 1,
      duration: 1100,
      onUpdate: (v) => setDarkMatterProgress(v),
      onComplete: () => setTimeout(() => setMenuVisible(true), 400)
    });

    setTimeout(() => setFragments([]), 1000);
  }, [cubeVisible, cubeOpacity, performanceSettings.maxFragments, performanceSettings.maxRipples]);

  // ---------- blob → cube ----------
  const handleReset = useCallback(() => {
    setMenuVisible(false);
    setMediaIsPlaying(false);
    setBinauralPaused(false);
    setVoidRipples([]);
    setRealityTears([]);

    if (binauralAudioRef.current && performanceSettings.enableBinaural) {
      binauralAudioRef.current.play().catch(() => {});
    }

    setCubeVisible(true);

    tween({
      from: darkMatterProgress,
      to: 0,
      duration: 1000,
      onUpdate: (v) => setDarkMatterProgress(v),
      onComplete: () => {
        setDarkMatterVisible(false);
        setActiveSection(null);
      }
    });

    tween({
      from: 0,
      to: 1,
      duration: 650,
      onUpdate: (v) => setCubeOpacity(v)
    });
  }, [darkMatterProgress, performanceSettings.enableBinaural]);

  const handleMediaPlayingChange = useCallback((isPlaying) => setMediaIsPlaying(isPlaying), []);

  // animate tears progress
  useEffect(() => {
    if (realityTears.length === 0) return;
    let raf;
    const step = () => {
      setRealityTears(prev => prev.map(t => ({ ...t, progress: Math.min(t.progress + 0.03, 1) })).filter(t => t.progress < 1));
      if (realityTears.some(t => t.progress < 1)) {
        raf = requestAnimationFrame(step);
      }
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [realityTears.length]);

  // auto-clear ripples
  useEffect(() => {
    if (voidRipples.length > 0) {
      const cleanup = setTimeout(() => setVoidRipples([]), 3000);
      return () => clearTimeout(cleanup);
    }
  }, [voidRipples.length]);

  // living flowDirection wobble so blob never looks perfectly circular
  const flowDirRef = useRef(new THREE.Vector3(1,0,0));
  useFrame(({ clock }) => {
    if (!activeSection) return;
    const t = clock.getElapsedTime();
    const base = new THREE.Vector3(...activeSection.targetPos).normalize();
    const wobble = new THREE.Vector3(Math.sin(t*0.5)*0.15, Math.cos(t*0.4)*0.1, Math.sin(t*0.3+1.2)*0.12);
    flowDirRef.current.copy(base).add(wobble).normalize();
  });

  return (
    <>
      {/* Gradient backdrop under a truly transparent canvas */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(145deg, #E8E8E8 0%, #D0D0D0 30%, #C0C0C0 70%, #A8A8A8 100%)'
        }}
      />

      <Canvas
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
        camera={{ position: cameraSettings.position, fov: cameraSettings.fov }}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'transparent',
          touchAction: 'none'
        }}
        onCreated={({ gl }) => {
          gl.outputColorSpace = THREE.SRGBColorSpace;
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.0;
          if (gl.setClearAlpha) gl.setClearAlpha(0);
          gl.setClearColor(0x000000, 0);
        }}
      >
        <ambientLight intensity={0.6} color="#F0E68C" />
        <directionalLight position={[5,10,7.5]} intensity={1.2} color="#FFFACD" />
        <directionalLight position={[-5,-5,-5]} intensity={0.8} color="#F5DEB3" />

        <MinimalCube onFaceClick={handleCubeClick} visible={cubeVisible} opacity={cubeOpacity} />

        {fragments.map(frag => <Fragment key={frag.id} {...frag} />)}

        {darkMatterVisible && activeSection && (
          <>
            <group position={[
              darkMatterProgress * activeSection.targetPos[0],
              darkMatterProgress * activeSection.targetPos[1],
              darkMatterProgress * activeSection.targetPos[2]
            ]}>
              <QuantumVisualization
                position={[0,0,0]}
                scale={1.15 - darkMatterProgress * 0.35}
                opacity={1}
                flowDirection={flowDirRef.current}
                isFlowing={true}
                flowProgress={darkMatterProgress}
              />
            </group>

            {[...Array(isMobile ? 2 : 5)].map((_, i) => (
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

        {voidRipples.map(r => (
          <MetallicRipple key={r.id} origin={r.origin} scale={r.scale} opacity={r.opacity} />
        ))}

        {realityTears.map(t => (
          <MetallicTear key={t.id} startPos={t.startPos} endPos={t.endPos} progress={t.progress} />
        ))}

        {darkMatterVisible && activeSection && (
          <CameraController darkMatterProgress={darkMatterProgress} targetPos={activeSection.targetPos} />
        )}

        <OrbitControls
          enablePan={false}
          enabled={!darkMatterVisible}
          enableDamping
          dampingFactor={0.05}
          maxDistance={isMobile ? 8 : 15}
          minDistance={isMobile ? 2 : 3}
        />
      </Canvas>

      <SectionContent
        section={menuVisible ? activeSection : null}
        onReset={handleReset}
        onMediaPlayingChange={handleMediaPlayingChange}
      />

      {(!isMobile) && (
        <audio ref={binauralAudioRef} loop preload="auto" src="/audio/binaural_loop.mp3" />
      )}

      {showWarning && (
        <div style={{
          position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          background: 'linear-gradient(145deg, #E8E8E8 0%, #D0D0D0 30%, #C0C0C0 70%, #A8A8A8 100%)',
          border: '4px solid #808080', borderRadius: '12px', padding: '35px', textAlign: 'center',
          color: '#1A1A1A', fontFamily: 'monospace', fontSize: '18px', fontWeight: 'bold',
          zIndex: 10000, boxShadow: '0 0 50px rgba(0,0,255,0.3), inset 0 3px 8px rgba(255,255,255,0.4), inset 0 -3px 8px rgba(0,0,0,0.2)',
          textShadow: '0 0 5px rgba(0,0,255,0.3)'
        }}>
          <div style={{ marginBottom: 20 }}>⚠ INITIATING VOID GLIMPSE ⚠</div>
          <div>Dimensional breach in {timeLeft} seconds...</div>
          <div style={{ fontSize: 14, marginTop: 15, color: '#4A4A4A', fontStyle: 'italic' }}>
            Move to cancel
          </div>
        </div>
      )}

      {process.env.NODE_ENV === 'development' && (
        <div style={{
          position: 'fixed', top: 10, left: 10,
          background: 'linear-gradient(145deg, #E8E8E8 0%, #D0D0D0 30%, #C0C0C0 70%, #A8A8A8 100%)',
          border: '2px solid #808080', borderRadius: '8px', padding: '10px',
          color: '#2C2C2C', fontFamily: 'monospace', fontSize: '12px', fontWeight: 'bold',
          zIndex: 9999, boxShadow: '0 0 20px rgba(0,0,255,0.2), inset 0 2px 4px rgba(255,255,255,0.4), inset 0 -2px 4px rgba(0,0,0,0.2)',
          textShadow: '0 0 5px rgba(0,0,255,0.3)'
        }}>
          Device: {isMobile ? 'Mobile' : isTablet ? 'Tablet' : 'Desktop'} | Touch: {isTouch ? 'Yes' : 'No'}
        </div>
      )}
    </>
  );
}

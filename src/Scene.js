import React, {
  useRef, useState, useCallback, useEffect, useMemo, Suspense
} from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, useTexture, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import SectionContent from './SectionContent';
import QuantumVisualization from './QuantumVisualization';

/* =============================== CONFIG ================================== */
// Choose your About video provider + ID
// ABOUT_PROVIDER: 'youtube' | 'vimeo'
const ABOUT_PROVIDER = 'youtube';           // <-- set 'vimeo' if using Vimeo
const ABOUT_VIDEO_ID = 'jwr1EOvAxQI';     // <-- replace with your real ID

// Asset paths
const FACE_SHELL_PATH = '/models/faceShell.glb';
const TEX_BASE   = '/textures/ethereal_base.png';
const TEX_NORMAL = '/textures/ethereal_normal.png';
const TEX_ROUGH  = '/textures/ethereal_roughness.png';
const TEX_METAL  = '/textures/ethereal_metallic.png';

/* BoxGeometry material indices:
   0:+X 1:-X 2:+Y 3:-Y 4:+Z(front) 5:-Z(back) */
const sections = [
  { id: 'music',   name: "FREQUENCIES",  materialProps: { color: "#C0C0C0", metalness: 1.0, roughness: 0.1,  emissive: "#E0E0E0" }, targetPos: [ 4,  0,  0] },
  { id: 'art',     name: "DISRUPTIONS",  materialProps: { color: "#B8B8B8", metalness: 1.0, roughness: 0.05, emissive: "#D3D3D3" }, targetPos: [-4,  0,  0] },
  { id: 'contact', name: "COLLAPSE",     materialProps: { color: "#BEBEBE", metalness: 1.0, roughness: 0.08, emissive: "#D8D8D8" }, targetPos: [ 0,  4,  0] },
  { id: 'submit',  name: "SHADOWS",      materialProps: { color: "#A9A9A9", metalness: 1.0, roughness: 0.15, emissive: "#C0C0C0" }, targetPos: [ 0, -4,  0] },
  { id: 'about',   name: "HAIL THE VOID",materialProps: { color: "#D3D3D3", metalness: 1.0, roughness: 0.10, emissive: "#F0F0F0" }, targetPos: [ 0,  0,  4] }, // FRONT
  { id: 'video',   name: "Video Streams",materialProps: { color: "#E0E0E0", metalness: 1.0, roughness: 0.05, emissive: "#F5F5F5" }, targetPos: [ 0,  0, -4], disabled: false }
];

/* ============================== UTIL: scripts ============================= */
function useScript(src, attrs = {}, enabled = true) {
  // Extract attrs keys to a stable dependency
  const attrsKeys = useMemo(() => Object.keys(attrs).sort().join(','), [attrs]);
  
  useEffect(() => {
    if (!enabled) return;
    // if script already exists, reuse
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) return;
    const s = document.createElement('script');
    s.src = src;
    Object.entries(attrs).forEach(([k, v]) => s.setAttribute(k, v));
    s.async = true;
    document.body.appendChild(s);
    return () => { /* keep SDKs cached */ };
  }, [src, enabled, attrsKeys, attrs]);
}

/* ============================== ERROR BOUNDARY ============================ */
class ErrorBoundary extends React.Component {
  constructor(props){ super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError(){ return { hasError: true }; }
  componentDidCatch(err, info){ console.error('[ErrorBoundary]', err, info); }
  render(){ return this.state.hasError ? null : this.props.children; }
}

/* ============================= DEVICE DETECTION =========================== */
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

/* ================================ AUTO PREVIEW ============================ */
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

/* =================================== FX =================================== */
function MetallicTrail({ position, opacity, scale, delay }) {
  const meshRef = useRef(); const time = useRef(delay);
  useFrame((_, delta) => {
    if (meshRef.current) {
      time.current += delta; const t = time.current;
      meshRef.current.position.x = position[0] + Math.sin(t * 0.5) * 0.5;
      meshRef.current.position.y = position[1] + Math.cos(t * 0.7) * 0.3;
      meshRef.current.position.z = position[2] + Math.sin(t * 0.3) * 0.4;
      const s = scale * (1 + Math.sin(t * 2) * 0.2);
      meshRef.current.scale.setScalar(s);
      meshRef.current.material.opacity = opacity * (0.5 + Math.sin(t) * 0.5);
    }
  });
  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[0.3, 16, 16]} />
      <meshPhysicalMaterial color="#C0C0C0" metalness={1.0} roughness={0.1} transparent opacity={opacity} emissive="#E0E0E0" emissiveIntensity={0.3} />
    </mesh>
  );
}
function MetallicRipple({ origin, scale, opacity }) {
  const meshRef = useRef(); const time = useRef(0);
  useFrame((_, delta) => {
    if (meshRef.current) {
      time.current += delta; const t = time.current;
      meshRef.current.scale.setScalar(scale * (1 + t * 3));
      meshRef.current.material.opacity = opacity * Math.max(0, 1 - t);
      meshRef.current.rotation.z = t * 2;
      const positions = meshRef.current.geometry.attributes.position.array;
      for (let i = 0; i < positions.length; i += 3) positions[i + 2] = Math.sin(positions[i] * 10 + t * 5) * 0.1;
      meshRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });
  return (
    <mesh ref={meshRef} position={origin}>
      <ringGeometry args={[0.5, 0.8, 64]} />
      <meshBasicMaterial color="#C0C0C0" transparent opacity={opacity} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} />
    </mesh>
  );
}
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
      points.forEach((p, i) => {
        if (i / points.length < progress) {
          positions[i * 3] = p.x + (Math.random() - 0.5) * 0.1;
          positions[i * 3 + 1] = p.y + (Math.random() - 0.5) * 0.1;
          positions[i * 3 + 2] = p.z + (Math.random() - 0.5) * 0.1;
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

/* =============================== PBR TEXTURES ============================= */
function useEtherealTextures() {
  const [baseMap, normalMap, roughnessMap, metallicMap] = useTexture([TEX_BASE, TEX_NORMAL, TEX_ROUGH, TEX_METAL]);
  baseMap.colorSpace = THREE.SRGBColorSpace;
  normalMap.colorSpace = THREE.NoColorSpace;
  roughnessMap.colorSpace = THREE.NoColorSpace;
  metallicMap.colorSpace = THREE.NoColorSpace;

  baseMap.wrapS = baseMap.wrapT = THREE.RepeatWrapping;
  normalMap.wrapS = normalMap.wrapT = THREE.RepeatWrapping;
  roughnessMap.wrapS = roughnessMap.wrapT = THREE.RepeatWrapping;
  metallicMap.wrapS = metallicMap.wrapT = THREE.RepeatWrapping;

  return { baseMap, normalMap, roughnessMap, metallicMap };
}

/* =============================== MORPHING CUBE ============================ */
function MorphingCube({ onFaceClick, visible, morphProgress = 0 }) {
  const meshRef = useRef();
  const { baseMap, normalMap, roughnessMap, metallicMap } = useEtherealTextures();

  const materials = useMemo(() => {
    return sections.map(section => {
      const props = section.materialProps;
      return new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(props.color),
        map: baseMap,
        normalMap,
        roughnessMap,
        metalnessMap: metallicMap,
        metalness: 1.0,
        roughness: 1.0,
        normalScale: new THREE.Vector2(1, 1),
        transparent: true,
        transmission: 0.5,
        opacity: 1,
        ior: 1.5,
        thickness: 0.8,
        emissive: new THREE.Color(props.emissive),
        emissiveIntensity: 0.35,
        clearcoat: 1.0,
        clearcoatRoughness: 0.05
      });
    });
  }, [baseMap, normalMap, roughnessMap, metallicMap]);

  useFrame((state) => {
    if (meshRef.current && morphProgress > 0) {
      const t = state.clock.getElapsedTime();
      const geometry = meshRef.current.geometry;
      const positionAttribute = geometry.attributes.position;
      const positions = positionAttribute.array;
      for (let i = 0; i < positions.length; i += 3) {
        const x = positions[i], y = positions[i + 1], z = positions[i + 2];
        const d = morphProgress * 0.3;
        const noise = Math.sin(x * 3 + t) * Math.cos(y * 3 + t) * Math.sin(z * 3 + t);
        positions[i]     = x * (1 - morphProgress * 0.2) + noise * d;
        positions[i + 1] = y * (1 - morphProgress * 0.2) + noise * d * 0.8;
        positions[i + 2] = z * (1 - morphProgress * 0.2) + noise * d * 0.6;
      }
      positionAttribute.needsUpdate = true;
      const scale = 1 + morphProgress * 0.5;
      meshRef.current.scale.setScalar(scale);
      meshRef.current.rotation.x += morphProgress * 0.02;
      meshRef.current.rotation.y += morphProgress * 0.015;
      meshRef.current.rotation.z += morphProgress * 0.01;
    }
  });

  const handleClick = (e) => {
    if (!visible || morphProgress > 0) return;
    e.stopPropagation();
    const materialIndex = e.face?.materialIndex;
    if (materialIndex !== undefined) {
      const section = sections[materialIndex];
      if (section && !section.disabled) onFaceClick(section);
    }
  };

  return (
    <mesh ref={meshRef} onClick={handleClick} material={materials} position={[0, 0, 0]} visible={visible} key={visible ? "cube" : "hidden"}>
      <boxGeometry args={[2, 2, 2]} />
    </mesh>
  );
}

/* ============================= FACE GLB OVERLAY =========================== */
function FaceShellOverlay() {
  const { scene } = useGLTF(FACE_SHELL_PATH);
  const { baseMap, normalMap, roughnessMap, metallicMap } = useEtherealTextures();

  useEffect(() => {
    if (!scene) return;
    const box = new THREE.Box3().setFromObject(scene);
    const size = new THREE.Vector3(); box.getSize(size);
    const center = new THREE.Vector3(); box.getCenter(center);
    scene.position.sub(center);
    const targetWidth = 1.96;
    const s = targetWidth / Math.max(size.x, size.y);
    scene.scale.setScalar(s);
    scene.position.z = 1.01; // sit just in front of +Z face

    scene.traverse(o => {
      if (o.isMesh) {
        o.castShadow = o.receiveShadow = false;
        o.renderOrder = 2;
      }
    });
    console.log('[FaceShellOverlay] GLB loaded + PBR matched');
  }, [scene, baseMap, normalMap, roughnessMap, metallicMap]);

  return <primitive object={scene} />;
}
useGLTF.preload(FACE_SHELL_PATH);

/* =========================== CAMERA CONTROLLER ============================ */
function CameraController({ darkMatterProgress, targetPos }) {
  const { camera } = useThree();
  useFrame(() => {
    if (darkMatterProgress > 0 && targetPos) {
      const currentPos = new THREE.Vector3().lerpVectors(new THREE.Vector3(0, 0, 0), new THREE.Vector3(...targetPos), darkMatterProgress);
      const cameraPos = currentPos.clone().add(new THREE.Vector3(3, 3, 3));
      camera.position.lerp(cameraPos, 0.07);
      camera.lookAt(currentPos);
    } else {
      camera.position.set(5, 5, 5);
      camera.lookAt(0, 0, 0);
    }
  });
  return null;
}

/* ============================== ABOUT OVERLAY ============================= */
function AboutOverlay({ open, onClose }) {
  const containerRef = useRef(null);
  const readyRef = useRef(false);
  const closeTimeoutRef = useRef(null);

  // Load provider SDK
  useScript('https://www.youtube.com/iframe_api', {}, open && ABOUT_PROVIDER === 'youtube');
  useScript('https://player.vimeo.com/api/player.js', {}, open && ABOUT_PROVIDER === 'vimeo');

  // Build embed URL
  const embedUrl = useMemo(() => {
    if (ABOUT_PROVIDER === 'youtube') {
      // autoplay muted, controls visible, related off, inline
      return `https://www.youtube.com/embed/${ABOUT_VIDEO_ID}?autoplay=1&mute=1&controls=1&rel=0&playsinline=1&enablejsapi=1`;
    } else {
      // autoplay muted, minimal chrome, inline
      return `https://player.vimeo.com/video/${ABOUT_VIDEO_ID}?autoplay=1&muted=1&title=0&byline=0&portrait=0&playsinline=1&app_id=122963`;
    }
  }, []);

  // init player + end listener
  useEffect(() => {
    if (!open) return;

    // fallback autoclose after 90s
    closeTimeoutRef.current = setTimeout(() => onClose(), 90000);

    if (ABOUT_PROVIDER === 'youtube') {
      window.onYouTubeIframeAPIReady = () => { /* noop; we create player directly */ };
      const checkYT = () => (window.YT && window.YT.Player);
      const startYT = () => {
        if (!containerRef.current) return;
        // clear container
        containerRef.current.innerHTML = '';
        const iframe = document.createElement('iframe');
        iframe.src = embedUrl;
        iframe.allow = 'autoplay; fullscreen; picture-in-picture';
        iframe.style.border = 'none';
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.setAttribute('allowfullscreen', '1');
        iframe.id = 'about-youtube-iframe';
        containerRef.current.appendChild(iframe);

        // Build YT Player to get ended event
        new window.YT.Player(iframe, {
          events: {
            onReady: () => { readyRef.current = true; },
            onStateChange: (e) => {
              // 0 == ended
              if (e.data === window.YT.PlayerState.ENDED) onClose();
            }
          }
        });
      };
      const wait = setInterval(() => {
        if (checkYT()) { clearInterval(wait); startYT(); }
      }, 50);
      return () => clearInterval(wait);
    }

    if (ABOUT_PROVIDER === 'vimeo') {
      const startVimeo = () => {
        if (!containerRef.current || !window.Vimeo) return;
        containerRef.current.innerHTML = '';
        const iframe = document.createElement('iframe');
        iframe.src = embedUrl;
        iframe.allow = 'autoplay; fullscreen; picture-in-picture';
        iframe.style.border = 'none';
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.setAttribute('allowfullscreen', '1');
        containerRef.current.appendChild(iframe);

        const vimeoPlayer = new window.Vimeo.Player(iframe);
        vimeoPlayer.on('loaded', () => { readyRef.current = true; });
        vimeoPlayer.on('ended', () => onClose());
      };
      const wait = setInterval(() => {
        if (window.Vimeo && window.Vimeo.Player) { clearInterval(wait); startVimeo(); }
      }, 50);
      return () => clearInterval(wait);
    }
  }, [open, embedUrl, onClose]);

  useEffect(() => () => { if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current); }, []);

  if (!open) return null;
  return (
    <div style={{
      position: 'fixed', inset: 0, background: '#fff',
      display: 'grid', placeItems: 'center', zIndex: 100000,
      animation: 'fadein 250ms ease-out'
    }}>
      <div
        ref={containerRef}
        style={{ width: '92vw', height: '52vw', maxWidth: 1280, maxHeight: 720, background: '#fff', borderRadius: 8, overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.12)' }}
      />
      <button
        onClick={onClose}
        style={{ position: 'fixed', top: 20, right: 20, padding: '8px 12px', borderRadius: 8, border: '1px solid #ccc', background: '#fff' }}
        aria-label="Close"
      >
        ✕
      </button>
      <style>{`@keyframes fadein { from { opacity: 0 } to { opacity: 1 } }`}</style>
    </div>
  );
}

/* ================================== SCENE ================================= */
export default function Scene() {
  const { isMobile, isTablet, isTouch } = useDeviceDetection();
  const { showWarning, timeLeft } = useAutoPreview();

  const [cubeVisible, setCubeVisible] = useState(true);
  const [cubeKey, setCubeKey] = useState(0);
  const [morphProgress, setMorphProgress] = useState(0);
  const [darkMatterVisible, setDarkMatterVisible] = useState(false);
  const [darkMatterProgress, setDarkMatterProgress] = useState(0);
  const [activeSection, setActiveSection] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [mediaIsPlaying, setMediaIsPlaying] = useState(false);
  const [binauralPaused, setBinauralPaused] = useState(false);
  const [voidRipples, setVoidRipples] = useState([]);
  const [realityTears, setRealityTears] = useState([]);
  const [aboutOpen, setAboutOpen] = useState(false);

  const aboutClose = useCallback(() => setAboutOpen(false), []);
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
    const a = binauralAudioRef.current;
    if (a && performanceSettings.enableBinaural) a.play().catch(() => {});
    return () => { if (a) a.pause(); };
  }, [performanceSettings.enableBinaural]);

  useEffect(() => {
    const a = binauralAudioRef.current;
    if (!a) return;
    if (mediaIsPlaying || binauralPaused || aboutOpen) a.pause();
    else if (performanceSettings.enableBinaural) a.play().catch(() => {});
  }, [mediaIsPlaying, menuVisible, darkMatterVisible, performanceSettings.enableBinaural, binauralPaused, aboutOpen]);

  const startAboutOverlay = useCallback(() => {
    setAboutOpen(true);
    setBinauralPaused(true);
    setMenuVisible(false);
    setDarkMatterVisible(false);
    setActiveSection(null);
    setMorphProgress(0);
    setCubeVisible(true);
  }, []);

  const handleCubeClick = useCallback((section) => {
    if (!cubeVisible || section.disabled || morphProgress > 0) return;

    if (section.id === 'about') { // front face → video overlay
      startAboutOverlay();
      return;
    }

    if (section.id === 'video' || section.id === 'music') {
      setBinauralPaused(true);
      if (binauralAudioRef.current) binauralAudioRef.current.pause();
    }

    setActiveSection(section);

    const morphAnimate = () => {
      setMorphProgress(prev => {
        const next = prev + 0.02;
        if (next >= 1) {
          setCubeVisible(false);
          setDarkMatterVisible(true);
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

    const ripples = [];
    for (let i = 0; i < performanceSettings.maxRipples; i++) {
      ripples.push({
        id: Date.now() + i,
        origin: [(Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2],
        scale: 0.5 + Math.random() * 0.5,
        opacity: 0.6 + Math.random() * 0.4,
        delay: i * 0.1
      });
    }
    setVoidRipples(ripples);

    const tears = [];
    for (let i = 0; i < 2; i++) {
      tears.push({ id: Date.now() + i + 100, startPos: [0, 0, 0], endPos: section.targetPos, progress: 0 });
    }
    setRealityTears(tears);
    morphAnimate();
  }, [cubeVisible, morphProgress, performanceSettings.maxRipples, startAboutOverlay]);

  const handleReset = useCallback(() => {
    setCubeKey(k => k + 1); // hard remount cube (cleans morph artifacts)
    setMenuVisible(false);
    setMediaIsPlaying(false);
    setBinauralPaused(false);
    setVoidRipples([]);
    setRealityTears([]);
    setDarkMatterVisible(false);
    setActiveSection(null);
    setMorphProgress(0);
    setCubeVisible(true);
    setDarkMatterProgress(0);
    setAboutOpen(false);
    if (binauralAudioRef.current && !isMobile) {
      binauralAudioRef.current.play().catch(() => {});
    }
  }, [isMobile]);

  const handleMediaPlayingChange = useCallback((isPlaying) => setMediaIsPlaying(isPlaying), []);

  useEffect(() => {
    if (realityTears.length > 0) {
      const animate = () => {
        setRealityTears(prev => prev.map(tear => ({ ...tear, progress: Math.min(tear.progress + 0.03, 1) }))
          .filter(tear => tear.progress < 1));
        if (realityTears.some(t => t.progress < 1)) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    }
  }, [realityTears]);

  useEffect(() => {
    if (voidRipples.length > 0) {
      const cleanup = setTimeout(() => setVoidRipples([]), 3000);
      return () => clearTimeout(cleanup);
    }
  }, [voidRipples.length]);

  return (
    <>
      <Canvas
        camera={{ position: cameraSettings.position, fov: cameraSettings.fov }}
        style={{
          position: 'absolute', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'linear-gradient(145deg, #E8E8E8 0%, #D0D0D0 30%, #C0C0C0 70%, #A8A8A8 100%)',
          touchAction: 'none'
        }}
      >
        <ambientLight intensity={0.6} color="#F0E68C" />
        <directionalLight position={[5, 10, 7.5]} intensity={1.2} color="#FFFACD" />
        <directionalLight position={[-5, -5, -5]} intensity={0.8} color="#F5DEB3" />
        <directionalLight position={[0, 0, 10]} intensity={0.3} color="#87CEEB" />

        <Suspense fallback={null}>
          <MorphingCube
            key={cubeKey}
            onFaceClick={handleCubeClick}
            visible={cubeVisible}
            morphProgress={morphProgress}
          />

          {cubeVisible && morphProgress === 0 && (
            <ErrorBoundary>
              <FaceShellOverlay />
            </ErrorBoundary>
          )}

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
                  opacity={1 - darkMatterProgress}
                  flowDirection={new THREE.Vector3(...activeSection.targetPos).normalize()}
                  isFlowing={true}
                  flowProgress={darkMatterProgress}
                />
              </group>

              {[...Array((isMobile ? 2 : 5))].map((_, i) => (
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
        </Suspense>

        {darkMatterVisible && activeSection && (
          <CameraController darkMatterProgress={darkMatterProgress} targetPos={activeSection.targetPos} />
        )}
        <OrbitControls
          enablePan={false}
          enabled={!darkMatterVisible && morphProgress === 0 && !aboutOpen}
          enableDamping dampingFactor={0.05}
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

      {/* About overlay (YouTube/Vimeo embed with SDK end detection) */}
      <AboutOverlay open={aboutOpen} onClose={aboutClose} />

      {/* Auto-preview warning */}
      {showWarning && (
        <div style={{
          position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          background: 'linear-gradient(145deg, #E8E8E8 0%, #D0D0D0 30%, #C0C0C0 70%, #A8A8A8 100%)',
          border: '4px solid #808080', borderRadius: '12px', padding: '35px',
          textAlign: 'center', color: '#1A1A1A', fontFamily: 'monospace', fontSize: '18px', fontWeight: 'bold',
          zIndex: 10000, boxShadow: '0 0 50px rgba(0,0,255,0.3), inset 0 3px 8px rgba(255,255,255,0.4), inset 0 -2px 4px rgba(0,0,0,0.2)',
          textShadow: '0 0 5px rgba(0,0,255,0.3)'
        }}>
          <div style={{ marginBottom: 10 }}>⚠ INITIATING VOID GLIMPSE ⚠</div>
          <div>Dimensional breach in {timeLeft} seconds...</div>
          <div style={{ fontSize: 14, marginTop: 12, opacity: 0.8 }}>Move to cancel</div>
        </div>
      )}

      {/* Dev HUD */}
      {process.env.NODE_ENV === 'development' && (
        <div style={{
          position: 'fixed', top: 10, left: 10,
          background: 'linear-gradient(145deg, #E8E8E8 0%, #D0D0D0 30%, #C0C0C0 70%, #A8A8A8 100%)',
          border: '2px solid #808080', borderRadius: '8px', padding: '10px',
          color: '#2C2C2C', fontFamily: 'monospace', fontSize: '12px', fontWeight: 'bold',
          zIndex: 9999, boxShadow: '0 0 20px rgba(0,0,255,0.2), inset 0 2px 4px rgba(255,255,255,0.4), inset 0 -2px 4px rgba(0,0,0,0.2)'
        }}>
          Device: {isMobile ? 'Mobile' : isTablet ? 'Tablet' : 'Desktop'} | Touch: {isTouch ? 'Yes' : 'No'}
        </div>
      )}
    </>
  );
}

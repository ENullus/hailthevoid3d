import React, { useEffect, useRef, useState, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

function SymbolMesh() {
  // Load the same “material vibe” as the cube
  const [iceNormalMap, iceRoughnessMap, alphaMap] = useTexture([
    "/textures/ice_normal.jpg",
    "/textures/ice_roughness.jpg",
    "/textures/void_symbol_alpha.png", // white shape, transparent bg
  ]);

  const meshRef = useRef();
  const tRef = useRef(0);

  useFrame((_, delta) => {
    tRef.current += delta;
    const t = tRef.current;

    // Slow ceremonial drift
    if (meshRef.current) {
      meshRef.current.rotation.z = Math.sin(t * 0.4) * 0.08;
      meshRef.current.rotation.x = Math.sin(t * 0.25) * 0.06;
      const s = 1.2 + Math.sin(t * 0.5) * 0.02;
      meshRef.current.scale.set(s, s, s);
    }
  });

  // Plane with alphaMap shaped like the symbol
  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[2.4, 2.4, 128, 128]} />
      <meshPhysicalMaterial
        color={new THREE.Color("#C0C0C0")}
        metalness={1.0}
        roughness={0.1}
        normalMap={iceNormalMap}
        roughnessMap={iceRoughnessMap}
        normalScale={new THREE.Vector2(1, 1)}
        transparent
        alphaMap={alphaMap}
        alphaTest={0.05}
        transmission={0.55}
        ior={1.5}
        thickness={0.85}
        clearcoat={1.0}
        clearcoatRoughness={0.05}
        emissive={new THREE.Color("#E0E0E0")}
        emissiveIntensity={0.35}
      />
    </mesh>
  );
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.6} color="#F0E68C" />
      <directionalLight position={[3, 6, 5]} intensity={1.25} color="#FFFACD" />
      <directionalLight position={[-5, -3, -4]} intensity={0.8} color="#F5DEB3" />
    </>
  );
}

export default function IntroPage({ onEnter }) {
  const [mounted, setMounted] = useState(false);
  const [flashCount, setFlashCount] = useState(0);
  const [doWhiteOut, setDoWhiteOut] = useState(false);

  // fade in container on mount
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 15);
    return () => clearTimeout(t);
  }, []);

  // run the "LET GO OF PREDICTION" streak 3x then white-out
  useEffect(() => {
    // 3 passes; each pass ~900ms, slight delay between
    const passes = [0, 900, 1800];
    const timers = passes.map((ms, i) =>
      setTimeout(() => setFlashCount(i + 1), ms)
    );

    const final = setTimeout(() => {
      setDoWhiteOut(true);
      // complete white in 900ms, then enter
      setTimeout(() => onEnter?.(), 900);
    }, 2800);

    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(final);
    };
  }, [onEnter]);

  // allow click/tap to skip immediately
  const skip = useCallback(() => {
    if (doWhiteOut) return;
    setDoWhiteOut(true);
    setTimeout(() => onEnter?.(), 700);
  }, [doWhiteOut, onEnter]);

  return (
    <div
      onClick={skip}
      className="intro-container"
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 9999,
        pointerEvents: "auto",
        overflow: "hidden",
        opacity: mounted ? 1 : 0,
        transition: "opacity 700ms ease",
      }}
    >
      <style>{`
        .intro-bg {
          position: absolute; inset: 0;
          background: linear-gradient(145deg,#E8E8E8 0%,#D0D0D0 30%,#C0C0C0 70%,#A8A8A8 100%);
        }

        .intro-title {
          position: absolute; left: 50%; bottom: 10vh; transform: translateX(-50%);
          font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial, "Noto Sans", "Liberation Sans", sans-serif;
          letter-spacing: .16em;
          font-weight: 800;
          color: #2A2A2A;
          text-shadow: 0 1px 2px rgba(255,255,255,.7), 0 -1px 1px rgba(0,0,0,.25);
          font-size: clamp(22px, 5vw, 52px);
          user-select: none;
          pointer-events: none;
        }

        .flash-line {
          position: absolute; top: 40%; left: -40%;
          transform: translateY(-50%);
          color: #2A2A2A;
          font-weight: 800;
          letter-spacing: .25em;
          font-size: clamp(12px, 2.3vw, 22px);
          text-transform: uppercase;
          text-shadow: 0 1px 2px rgba(255,255,255,.9), 0 -1px 1px rgba(0,0,0,.25);
          opacity: 0;
          pointer-events: none;
        }

        /* streak anim: slide across + flicker */
        @keyframes streak {
          0% { opacity: 0; transform: translate(-40%, -50%) skewX(-12deg); filter: blur(1px); }
          10% { opacity: 1; }
          50% { opacity: 1; transform: translate(30vw, -50%) skewX(-12deg); }
          80% { opacity: 0.35; }
          100% { opacity: 0; transform: translate(80vw, -50%) skewX(-12deg); filter: blur(0); }
        }
        .flash-on { animation: streak 900ms cubic-bezier(.23,1,.32,1) both; }

        /* white-out overlay */
        .whiteout {
          position: absolute; inset: 0; background: #fff;
          pointer-events: none; opacity: 0;
        }
        .whiteout.on { opacity: 1; transition: opacity 700ms ease; }

        /* Canvas should sit above bg but below text */
        .intro-canvas { position: absolute; inset: 0; }
      `}</style>

      {/* metallic gradient backdrop */}
      <div className="intro-bg" />

      {/* 3D symbol with cube-like material */}
      <Canvas className="intro-canvas" camera={{ position: [0, 0, 3.2], fov: 40 }}>
        <Lights />
        {/* gentle parallax group */}
        <group position={[0, 0.1, 0]}>
          <SymbolMesh />
        </group>
      </Canvas>

      {/* Title */}
      <div className="intro-title">HAIL THE VOID</div>

      {/* Flashing line (rendered 3 times by toggling class) */}
      <div className={`flash-line ${flashCount >= 1 ? "flash-on" : ""}`}>
        LET&nbsp;GO&nbsp;OF&nbsp;PREDICTION
      </div>
      <div className={`flash-line ${flashCount >= 2 ? "flash-on" : ""}`} style={{ top: "46%" }}>
        LET&nbsp;GO&nbsp;OF&nbsp;PREDICTION
      </div>
      <div className={`flash-line ${flashCount >= 3 ? "flash-on" : ""}`} style={{ top: "52%" }}>
        LET&nbsp;GO&nbsp;OF&nbsp;PREDICTION
      </div>

      {/* White fade to enter */}
      <div className={`whiteout ${doWhiteOut ? "on" : ""}`} />
    </div>
  );
}

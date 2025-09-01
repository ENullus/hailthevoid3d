// src/IntroPage.jsx
import React, { useEffect, useRef, useState, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

function SymbolMesh({ onTrigger }) {
  const [iceNormalMap, iceRoughnessMap, alphaMap] = useTexture([
    "/textures/ice_normal.jpg",
    "/textures/ice_roughness.jpg",
    "/textures/void_symbol_alpha.png", // white symbol, transparent bg
  ]);

  const meshRef = useRef();

  return (
    <mesh
      ref={meshRef}
      onPointerDown={(e) => { e.stopPropagation(); onTrigger?.(); }}
      onPointerOver={(e) => (document.body.style.cursor = "pointer")}
      onPointerOut={(e) => (document.body.style.cursor = "default")}
    >
      {/* square plane that the alphaMap cuts into the symbol */}
      <planeGeometry args={[2.8, 2.8, 1, 1]} />
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
        emissive={new THREE.Color("#E0E0E0")}
        emissiveIntensity={0.4}
        clearcoat={1.0}
        clearcoatRoughness={0.05}
        side={THREE.DoubleSide}
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
  const [strobe, setStrobe] = useState(false);
  const [whiteout, setWhiteout] = useState(false);
  const [locked, setLocked] = useState(false); // prevent double-trigger

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 10);
    return () => clearTimeout(t);
  }, []);

  const trigger = useCallback(() => {
    if (locked) return;
    setLocked(true);
    setStrobe(true);
    // run the strobe for ~1.2s, then whiteout → enter
    setTimeout(() => {
      setWhiteout(true);
      setTimeout(() => onEnter?.(), 700);
    }, 1200);
  }, [locked, onEnter]);

  return (
    <div
      className="intro-root"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        opacity: mounted ? 1 : 0,
        transition: "opacity 600ms ease",
        pointerEvents: "auto",
        overflow: "hidden",
      }}
    >
      <style>{`
        .intro-bg {
          position: absolute; inset: 0;
          background: linear-gradient(145deg,#E8E8E8 0%,#D0D0D0 30%,#C0C0C0 70%,#A8A8A8 100%);
        }
        .intro-canvas { position: absolute; inset: 0; }

        .title {
          position: absolute; left: 50%; top: 8vh; transform: translateX(-50%);
          font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif;
          font-weight: 900; letter-spacing: .18em;
          color: #D9D9D9; /* lighter grey */
          text-shadow: 0 1px 2px rgba(255,255,255,.75), 0 -1px 1px rgba(0,0,0,.25);
          font-size: clamp(22px, 4.8vw, 56px);
          user-select: none; pointer-events: none;
        }

        .strobe {
          position: absolute; inset: 0; display: grid; place-items: center;
          pointer-events: none; /* click goes to the symbol only */
        }
        .strobeText {
          font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif;
          color: #222; font-weight: 900; letter-spacing: .24em;
          text-transform: uppercase;
          font-size: clamp(14px, 3vw, 28px);
          opacity: 0;
          text-shadow: 0 1px 2px rgba(255,255,255,.9), 0 -1px 1px rgba(0,0,0,.25);
        }

        /* strobe: very fast on/off bursts, subliminal */
        @keyframes strobeFlicker {
          0%, 8% { opacity: 0; }
          9%, 12% { opacity: 1; }
          13%, 28% { opacity: 0; }
          29%, 32% { opacity: 1; }
          33%, 58% { opacity: 0; }
          59%, 62% { opacity: 1; }
          63%, 78% { opacity: 0; }
          79%, 82% { opacity: 1; }
          83%, 100% { opacity: 0; }
        }
        .strobeOn .strobeText {
          animation: strobeFlicker 1200ms steps(60, end) forwards;
        }

        .whiteout {
          position: absolute; inset: 0; background:#fff; opacity:0; pointer-events:none;
          transition: opacity 700ms ease;
        }
        .whiteout.on { opacity: 1; }
      `}</style>

      <div className="intro-bg" />

      {/* Still symbol in the foreground */}
      <Canvas className="intro-canvas" camera={{ position: [0, 0, 3.1], fov: 40 }}>
        <Lights />
        <group position={[0, 0.1, 0]}>
          <SymbolMesh onTrigger={trigger} />
        </group>
      </Canvas>

      {/* Title */}
      <div className="title">HAIL THE VOID</div>

      {/* Subliminal strobe text appears ONLY after click */}
      <div className={`strobe ${strobe ? "strobeOn" : ""}`}>
        <div className="strobeText">LET&nbsp;GO&nbsp;OF&nbsp;PREDICTION</div>
      </div>

      {/* Fade to white -> enter */}
      <div className={`whiteout ${whiteout ? "on" : ""}`} />
    </div>
  );
}

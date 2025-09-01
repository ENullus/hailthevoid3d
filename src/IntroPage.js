// IntroPage.jsx
import React, { useEffect, useRef } from 'react';

function IntroPage({ onEnter }) {
  const containerRef = useRef(null);
  const overlayRef = useRef(null);

  const introContainerStyle = {
    position: 'fixed',
    inset: 0,
    background: 'linear-gradient(145deg, #E8E8E8 0%, #D0D0D0 30%, #C0C0C0 70%, #A8A8A8 100%)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#1A1A1A',
    fontFamily: 'monospace',
    fontSize: '3em',
    fontWeight: 'bold',
    textShadow: '0 2px 4px rgba(255,255,255,0.8), 0 -1px 2px rgba(0,0,0,0.3)',
    zIndex: 999,
    opacity: 0,
    transition: 'opacity 600ms ease-out'
  };

  const buttonStyle = {
    marginTop: '50px',
    padding: '20px 50px',
    background: 'linear-gradient(145deg, #F2F2F2 0%, #E4E4E4 50%, #D6D6D6 100%)',
    color: '#1A1A1A',
    border: '3px solid #808080',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '1.2em',
    fontWeight: 'bold',
    letterSpacing: '3px',
    textTransform: 'uppercase',
    textShadow: '0 1px 2px rgba(255,255,255,0.8), 0 -1px 1px rgba(0,0,0,0.25)',
    boxShadow: '0 0 22px rgba(0,0,255,0.25), inset 0 3px 8px rgba(255,255,255,0.45), inset 0 -3px 8px rgba(0,0,0,0.15)',
    transition: 'transform 200ms ease, box-shadow 200ms ease',
    fontFamily: 'monospace'
  };

  const buttonHoverStyle = {
    transform: 'translateY(-2px)',
    boxShadow: '0 0 30px rgba(0,0,255,0.4), inset 0 3px 8px rgba(255,255,255,0.6), inset 0 -3px 8px rgba(0,0,0,0.08)'
  };

  useEffect(() => {
    const el = containerRef.current;
    if (el) el.style.opacity = 1; // Fade in on mount
  }, []);

  const handleButtonClick = () => {
    const container = containerRef.current;
    const overlay = overlayRef.current;
    if (!container || !overlay) return;

    // Start white overlay fade-in slightly before container fade-out finishes
    overlay.style.pointerEvents = 'none';
    overlay.style.opacity = 1;          // fade white in
    container.style.opacity = 0;        // fade UI out

    // Match to CSS durations below (overlay 700ms)
    setTimeout(onEnter, 700);
  };

  return (
    <>
      <style>{`
        @keyframes metallicPulse {
          0%, 100% {
            text-shadow: 0 2px 4px rgba(255,255,255,0.8), 0 -1px 2px rgba(0,0,0,0.3), 0 0 14px rgba(0,0,255,0.25);
          }
          50% {
            text-shadow: 0 2px 4px rgba(255,255,255,0.9), 0 -1px 2px rgba(0,0,0,0.25), 0 0 28px rgba(0,0,255,0.45);
          }
        }
        @keyframes scanLine {
          0% { transform: translateX(-100vw); }
          100% { transform: translateX(100vw); }
        }
      `}</style>

      {/* White overlay that fades IN on exit */}
      <div
        ref={overlayRef}
        style={{
          position: 'fixed',
          inset: 0,
          background: '#ffffff',
          opacity: 0,
          transition: 'opacity 700ms ease',
          zIndex: 1000
        }}
      />

      <div className="intro-container" ref={containerRef} style={introContainerStyle}>
        {/* Scanning line */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: 0,
          width: '2px',
          height: '100px',
          background: 'linear-gradient(180deg, transparent, #00B7EB, transparent)',
          animation: 'scanLine 3s infinite',
          zIndex: 1
        }} />

        {/* Metallic frame */}
        <div style={{
          position: 'absolute',
          top: '30%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '80%',
          height: '40%',
          border: '4px solid #808080',
          borderRadius: '15px',
          background: 'linear-gradient(145deg, rgba(232,232,232,0.1) 0%, rgba(168,168,168,0.1) 100%)',
          boxShadow: 'inset 0 3px 8px rgba(255,255,255,0.2), inset 0 -3px 8px rgba(0,0,0,0.2)',
          zIndex: -1
        }} />

        {/* Corner beacons */}
        {[0, 1, 2, 3].map(i => (
          <div key={i} style={{
            position: 'absolute',
            width: '20px',
            height: '20px',
            background: 'radial-gradient(circle, #00B7EB, #000)',
            borderRadius: '50%',
            boxShadow: '0 0 10px rgba(0,183,235,0.5)',
            ...(i === 0 && { top: '25%', left: '15%' }),
            ...(i === 1 && { top: '25%', right: '15%' }),
            ...(i === 2 && { bottom: '25%', left: '15%' }),
            ...(i === 3 && { bottom: '25%', right: '15%' })
          }} />
        ))}

        <div style={{
          fontSize: '1.5em',
          color: '#1A1A1A',
          animation: 'metallicPulse 2s infinite',
          marginBottom: '20px',
          letterSpacing: '4px'
        }}>
          HAIL THE VOID
        </div>

        {/* Status */}
        <div style={{
          display: 'flex',
          gap: '20px',
          marginBottom: '30px',
          color: '#2C2C2C',
          fontSize: '0.4em',
          textShadow: '0 1px 1px rgba(255,255,255,0.8)'
        }}>
          <div>REALITY_MATRIX: <span style={{color: '#0066CC'}}>LOADED</span></div>
          <div>VOID_LINK: <span style={{color: '#0066CC'}}>STABLE</span></div>
          <div>CONSCIOUSNESS: <span style={{color: '#0066CC'}}>READY</span></div>
        </div>

        <button
          onClick={handleButtonClick}
          style={buttonStyle}
          onMouseEnter={e => Object.assign(e.currentTarget.style, {...buttonStyle, ...buttonHoverStyle})}
          onMouseLeave={e => Object.assign(e.currentTarget.style, buttonStyle)}
        >
          LET GO OF PREDICTION
        </button>

        <div style={{
          marginTop: '30px',
          fontSize: '0.3em',
          color: '#4A4A4A',
          textAlign: 'center',
          lineHeight: '1.4'
        }}>
          ⚠ DIMENSIONAL INTERFACE ACTIVE ⚠<br/>
          PREPARE FOR CONSCIOUSNESS SHIFT
        </div>
      </div>
    </>
  );
}

export default IntroPage;

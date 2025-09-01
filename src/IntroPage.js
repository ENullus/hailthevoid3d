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
    transition: 'opacity 600ms ease-out',
  };

  useEffect(() => {
    const el = containerRef.current;
    if (el) el.style.opacity = 1; // fade in
  }, []);

  const handleButtonClick = () => {
    const container = containerRef.current;
    const overlay = overlayRef.current;
    if (!container || !overlay) return;

    // enable overlay only during fade
    overlay.style.pointerEvents = 'auto';
    overlay.style.opacity = 1;
    container.style.opacity = 0;

    setTimeout(onEnter, 700);
  };

  return (
    <>
      {/* White overlay (non-blocking until active) */}
      <div
        ref={overlayRef}
        style={{
          position: 'fixed',
          inset: 0,
          background: '#ffffff',
          opacity: 0,
          transition: 'opacity 700ms ease',
          zIndex: 1000,
          pointerEvents: 'none', // ✅ let clicks pass through
        }}
      />

      <div className="intro-container" ref={containerRef} style={introContainerStyle}>
        <div style={{ marginBottom: '20px', fontSize: '1.5em' }}>
          HAIL THE VOID
        </div>
        <button
          onClick={handleButtonClick}
          style={{
            marginTop: '50px',
            padding: '20px 50px',
            background: '#E0E0E0',
            border: '3px solid #808080',
            borderRadius: '10px',
            cursor: 'pointer',
            fontFamily: 'monospace',
          }}
        >
          LET GO OF PREDICTION
        </button>
      </div>
    </>
  );
}

export default IntroPage;

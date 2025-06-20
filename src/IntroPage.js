// src/IntroPage.js
import React from 'react';

function IntroPage({ onEnter }) {
  const introContainerStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'black',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
    fontFamily: '"Orbitron", monospace',
    fontSize: '3em',
    textShadow: '0 0 15px rgba(255, 255, 255, 0.7)', // White glow
    zIndex: 999,
    opacity: 1,
    transition: 'opacity 1s ease-out',
  };

  const buttonStyle = {
    marginTop: '50px',
    padding: '15px 40px',
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // B&W
    color: 'white',                     // B&W
    border: '2px solid white',          // B&W
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1.5em',
    fontWeight: 'bold',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    boxShadow: '0 0 20px rgba(255, 255, 255, 0.5)', // B&W glow
    transition: 'background-color 0.3s, box-shadow 0.3s, color 0.3s',
  };

  const buttonHoverStyle = {
    backgroundColor: 'white', // B&W
    color: 'black',           // B&W
    boxShadow: '0 0 30px rgba(255, 255, 255, 0.8)', // B&W glow
  };

  const handleButtonClick = (event) => {
    event.currentTarget.closest('.intro-container').style.opacity = 0;
    setTimeout(onEnter, 1000);
  };

  return (
    <div className="intro-container" style={introContainerStyle}>
      <div style={{
        fontSize: '1.5em',
        textShadow: '0 0 10px rgba(255, 255, 255, 0.8)', // B&W glow
        color: 'white' // B&W
      }}>ENTER THE VOID</div>
      <button
        onClick={handleButtonClick}
        style={buttonStyle}
        onMouseEnter={e => Object.assign(e.currentTarget.style, buttonHoverStyle)}
        onMouseLeave={e => Object.assign(e.currentTarget.style, buttonStyle)}
      >
        LET GO OF PREDICTION
      </button>
    </div>
  );
}

export default IntroPage;

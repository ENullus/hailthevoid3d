// src/App.js
import React, { useState } from 'react';
import './App.css'; // Your main CSS file
import Scene from './Scene';
import IntroPage from './IntroPage';

function App() {
  const [showIntro, setShowIntro] = useState(true);

  const handleEnterVoid = () => {
    setShowIntro(false);
  };

  return (
    <div className="App">
      {showIntro ? (
        <IntroPage onEnter={handleEnterVoid} />
      ) : (
        // New container for your main content layout
        <div className="main-layout-container">
          <Scene /> {/* Your existing 3D scene (background) */}
          {/* SectionContent will now be positioned via CSS in this container */}
        </div>
      )}
    </div>
  );
}

export default App;
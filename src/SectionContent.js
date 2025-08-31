// src/SectionContent.js - Metallic UI Fixed
import React, { useEffect, useState } from 'react';

const sectionContents = {
  about: {
    title: "HAIL THE VOID",
    subtitle: "LET THE DEPTHS CONSUME THE NOISE",
    content: "Everything is connected. Black holes aren't empty space - they're information processors, conscious masses that think and consume reality. The separation between you and me and the void is a lie we tell ourselves to feel safe. We're not individuals floating in space. We're expressions of the same underlying system, the universe looking back at itself through billions of eyes. The void isn't out there - it's the space between thoughts, the pause between heartbeats, the darkness that makes light possible. Most people spend their lives running from this truth. They build walls, create identities, pretend they're separate from the chaos. But the void sees through all of it. It knows we're already one thing pretending to be many. To hail the void is to stop pretending. Stop performing separation. Stop believing in the containers that divide us. The boundaries are imaginary. The darkness is alive. And we're already part of it whether we admit it or not."
  },
  music: { 
    title: "FREQUENCIES",
    subtitle: "IT'S WHAT YOU'RE HEARING"
  },
  art: { 
    title: "DISRUPTIONS",
    subtitle: "VISUAL ARCHIVE"
  },
  video: { 
    title: "VIDEO STREAMS",
    subtitle: "OUTSIDE AND INSIDE REALITY"
  },
  submit: { 
    title: "SHADOWS",
    subtitle: "SUBMIT TO THE VOID"
  },
  contact: { 
    title: "COLLAPSE",
    subtitle: "CONTACT"
  }
};

// Commented out for now - uncomment when you need to use CMS functionality
// function useCMSContent(sectionId) {
//   const [content, setContent] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     if (!sectionId) {
//       setLoading(false);
//       return;
//     }

//     const fetchContent = async () => {
//       try {
//         setLoading(true);
        
//         const collectionMap = {
//           'music': '_3d_music',
//           'art': '_3d_art', 
//           'video': '_3d_videos',
//           'submit': '_3d_submissions'
//         };

//         const collection = collectionMap[sectionId];
//         if (!collection) {
//           setContent([]);
//           setLoading(false);
//           return;
//         }

//         const repoUrl = 'https://api.github.com/repos/ENullus/HailTheVoidOrg/contents';
//         const folderUrl = `${repoUrl}/${collection}`;
        
//         const response = await fetch(folderUrl);
        
//         if (!response.ok) {
//           if (response.status === 404) {
//             setContent([]);
//             setLoading(false);
//             return;
//           }
//           throw new Error(`HTTP ${response.status}`);
//         }

//         const files = await response.json();
//         const markdownFiles = files.filter(file => file.name.endsWith('.md'));
        
//         const contentPromises = markdownFiles.map(async (file) => {
//           const fileResponse = await fetch(file.download_url);
//           const fileContent = await fileResponse.text();
          
//           const frontMatterMatch = fileContent.match(/^---\n([\s\S]*?)\n---/);
//           if (frontMatterMatch) {
//             const frontMatter = frontMatterMatch[1];
//             const content = fileContent.replace(frontMatterMatch[0], '').trim();
            
//             const data = {};
//             frontMatter.split('\n').forEach(line => {
//               const [key, ...valueParts] = line.split(':');
//               if (key && valueParts.length > 0) {
//                 let value = valueParts.join(':').trim();
//                 value = value.replace(/^["']|["']$/g, '');
//                 data[key.trim()] = value;
//               }
//             });
            
//             return {
//               ...data,
//               content,
//               filename: file.name
//             };
//           }
//           return null;
//         });

//         const resolvedContent = await Promise.all(contentPromises);
//         const validContent = resolvedContent.filter(item => item !== null);
        
//         validContent.sort((a, b) => {
//           if (a.date && b.date) {
//             return new Date(b.date) - new Date(a.date);
//           }
//           return 0;
//         });

//         setContent(validContent);
//       } catch (err) {
//         console.error('Failed to fetch CMS content:', err);
//         setError(err.message);
//         setContent([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchContent();
//   }, [sectionId]);

//   return { content, loading, error };
// }

function SectionContent({ section, onReset, onMediaPlayingChange }) {
  // Removed unused variables - uncomment and implement when needed
  // const { content: cmsContent, loading: cmsLoading, error: cmsError } = useCMSContent(section?.id);
  // const videoRef = useRef(null);

  useEffect(() => {
    if (typeof onMediaPlayingChange === 'function') {
      onMediaPlayingChange(false);
    }
  }, [section, onMediaPlayingChange]);

  const currentSectionData = section && sectionContents[section.id]
    ? sectionContents[section.id]
    : null;

  if (!section || !currentSectionData) {
    return null;
  }

  const mainPanelStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    background: 'rgba(0, 0, 0, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    pointerEvents: 'auto'
  };

  const contentPanelStyle = {
    width: '90%',
    maxWidth: '800px',
    maxHeight: '85vh',
    background: 'linear-gradient(145deg, #E8E8E8 0%, #D0D0D0 30%, #C0C0C0 70%, #A8A8A8 100%)',
    border: '4px solid #808080',
    borderRadius: '12px',
    boxShadow: '0 0 50px rgba(0,0,0,0.3), inset 0 3px 8px rgba(255,255,255,0.4), inset 0 -3px 8px rgba(0,0,0,0.2)',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column'
  };

  const headerStyle = {
    background: 'linear-gradient(145deg, #E0E0E0 0%, #C8C8C8 50%, #B0B0B0 100%)',
    borderBottom: '3px solid #808080',
    padding: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.3), inset 0 -2px 4px rgba(0,0,0,0.2)'
  };

  const titleStyle = {
    margin: 0,
    color: '#1A1A1A',
    fontSize: '1.8rem',
    fontWeight: 'bold',
    letterSpacing: '2px',
    textShadow: '0 2px 4px rgba(255,255,255,0.8), 0 -1px 2px rgba(0,0,0,0.4)'
  };

  const subtitleStyle = {
    color: '#2C2C2C',
    fontSize: '1rem',
    fontWeight: '600',
    marginTop: '5px',
    textShadow: '0 1px 2px rgba(255,255,255,0.6)'
  };

  const closeButtonStyle = {
    background: 'linear-gradient(145deg, #E0E0E0 0%, #C0C0C0 50%, #A0A0A0 100%)',
    border: '2px solid #808080',
    borderRadius: '6px',
    width: '40px',
    height: '40px',
    color: '#1A1A1A',
    fontSize: '1.2rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.3), inset 0 -2px 4px rgba(0,0,0,0.2)',
    textShadow: '0 1px 1px rgba(255,255,255,0.8)'
  };

  const contentStyle = {
    flex: 1,
    overflow: 'auto',
    padding: '20px'
  };

  const footerStyle = {
    background: 'linear-gradient(145deg, #D8D8D8 0%, #C0C0C0 50%, #A8A8A8 100%)',
    borderTop: '3px solid #808080',
    padding: '15px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.3), inset 0 -2px 4px rgba(0,0,0,0.2)'
  };

  const sectorStyle = {
    color: '#2C2C2C',
    fontSize: '0.9rem',
    fontWeight: 'bold',
    textShadow: '0 1px 1px rgba(255,255,255,0.8)'
  };

  const returnButtonStyle = {
    background: 'linear-gradient(145deg, #E8E8E8 0%, #D0D0D0 50%, #B8B8B8 100%)',
    border: '3px solid #808080',
    borderRadius: '8px',
    padding: '12px 25px',
    color: '#1A1A1A',
    fontWeight: 'bold',
    fontSize: '1rem',
    letterSpacing: '1px',
    textShadow: '0 1px 2px rgba(255,255,255,0.8), 0 -1px 1px rgba(0,0,0,0.3)',
    boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.4), inset 0 -2px 4px rgba(0,0,0,0.2), 0 4px 8px rgba(0,0,0,0.1)',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  };

  const statusLightStyle = {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    background: 'linear-gradient(45deg, #32CD32, #90EE90)',
    boxShadow: '0 0 10px rgba(50, 205, 50, 0.5), inset 0 1px 2px rgba(255,255,255,0.3)'
  };

  let sectionContent = null;

  if (section.id === 'about') {
    sectionContent = (
      <div style={{ color: '#1A1A1A', textShadow: '0 1px 2px rgba(255,255,255,0.8)' }}>
        <p style={{ lineHeight: '1.6', fontSize: '1rem' }}>{currentSectionData.content}</p>
      </div>
    );
  } else if (section.id === 'submit') {
    const mailtoLink = `mailto:submission@hailthevoid.net?subject=Art Submission: Hail The Void&body=Greetings,%0D%0A%0D%0AI would like to submit my artwork for consideration.%0D%0A%0D%0A[Link to my art/portfolio or attach files]%0D%0A%0D%0AThank you.`;
    
    sectionContent = (
      <div style={{ textAlign: 'center' }}>
        <p style={{ 
          color: '#1A1A1A', 
          textShadow: '0 1px 2px rgba(255,255,255,0.8)',
          marginBottom: '30px'
        }}>
          Your artistic transmissions must resonate with the void's frequency.
        </p>
        <a 
          href={mailtoLink}
          style={{
            display: 'inline-block',
            background: 'linear-gradient(145deg, #E8E8E8 0%, #D0D0D0 50%, #B8B8B8 100%)',
            border: '3px solid #808080',
            borderRadius: '8px',
            padding: '15px 30px',
            color: '#1A1A1A',
            textDecoration: 'none',
            fontWeight: 'bold',
            fontSize: '1.1rem',
            letterSpacing: '2px',
            textShadow: '0 1px 2px rgba(255,255,255,0.8), 0 -1px 1px rgba(0,0,0,0.3)',
            boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.4), inset 0 -2px 4px rgba(0,0,0,0.2)'
          }}
        >
          OPEN PORTAL
        </a>
      </div>
    );
  } else if (section.id === 'contact') {
    sectionContent = (
      <div>
        <p style={{ 
          color: '#1A1A1A', 
          textShadow: '0 1px 2px rgba(255,255,255,0.8)',
          marginBottom: '20px'
        }}>
          Establish quantum entanglement. Your transmission will echo through the void.
        </p>
        
        <form action="https://formspree.io/f/YOUR_UNIQUE_FORM_ID" method="POST">
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="contact-name" style={{
              display: 'block',
              color: '#2C2C2C',
              fontWeight: 'bold',
              marginBottom: '5px',
              textShadow: '0 1px 1px rgba(255,255,255,0.8)'
            }}>
              ENTITY_DESIGNATION
            </label>
            <input 
              type="text" 
              id="contact-name" 
              name="name" 
              required 
              style={{
                width: '100%',
                padding: '12px',
                background: 'linear-gradient(145deg, #F0F0F0 0%, #E0E0E0 50%, #D0D0D0 100%)',
                border: '2px solid #999',
                borderRadius: '6px',
                color: '#1A1A1A',
                fontWeight: 'bold'
              }}
            />
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="contact-email" style={{
              display: 'block',
              color: '#2C2C2C',
              fontWeight: 'bold',
              marginBottom: '5px',
              textShadow: '0 1px 1px rgba(255,255,255,0.8)'
            }}>
              RETURN_FREQUENCY
            </label>
            <input 
              type="email" 
              id="contact-email" 
              name="email" 
              required 
              style={{
                width: '100%',
                padding: '12px',
                background: 'linear-gradient(145deg, #F0F0F0 0%, #E0E0E0 50%, #D0D0D0 100%)',
                border: '2px solid #999',
                borderRadius: '6px',
                color: '#1A1A1A',
                fontWeight: 'bold'
              }}
            />
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="contact-message" style={{
              display: 'block',
              color: '#2C2C2C',
              fontWeight: 'bold',
              marginBottom: '5px',
              textShadow: '0 1px 1px rgba(255,255,255,0.8)'
            }}>
              DATA_PACKET
            </label>
            <textarea 
              id="contact-message" 
              name="message" 
              rows="6" 
              required 
              style={{
                width: '100%',
                padding: '12px',
                background: 'linear-gradient(145deg, #F0F0F0 0%, #E0E0E0 50%, #D0D0D0 100%)',
                border: '2px solid #999',
                borderRadius: '6px',
                color: '#1A1A1A',
                fontWeight: 'bold',
                resize: 'vertical'
              }}
            />
          </div>
          
          <button 
            type="submit" 
            style={returnButtonStyle}
          >
            TRANSMIT
          </button>
        </form>
      </div>
    );
  } else {
    sectionContent = (
      <div style={{ 
        color: '#1A1A1A', 
        textShadow: '0 1px 2px rgba(255,255,255,0.8)',
        textAlign: 'center',
        fontSize: '1.1rem'
      }}>
        {currentSectionData.subtitle}
      </div>
    );
  }

  return (
    <div style={mainPanelStyle}>
      <div style={contentPanelStyle}>
        <div style={headerStyle}>
          <div>
            <h2 style={titleStyle}>
              {currentSectionData.title || section.name?.toUpperCase()}
            </h2>
            {currentSectionData.subtitle && (
              <div style={subtitleStyle}>
                {currentSectionData.subtitle}
              </div>
            )}
          </div>
          <button onClick={onReset} style={closeButtonStyle}>
            ✕
          </button>
        </div>
        
        <div style={contentStyle}>
          {sectionContent}
        </div>
        
        <div style={footerStyle}>
          <div style={sectorStyle}>
            <span>SECTOR: </span>
            <span style={{ color: '#1A1A1A' }}>{section.id?.toUpperCase()}</span>
          </div>
          
          <button onClick={onReset} style={returnButtonStyle}>
            RETURN TO CONTAINER
          </button>
          
          <div style={statusLightStyle} />
        </div>
      </div>
    </div>
  );
}

export default SectionContent;

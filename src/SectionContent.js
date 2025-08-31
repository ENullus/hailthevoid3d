sectionSpecificContent = (
      <div style={{ padding: '20px 0' }}>
        <div style={{
          background: 'linear-gradient(145deg, #D8D8D8 0%, #B8B8B8 50%, #A0A0A0 100%)',
          border: '2px solid #808080',
          borderRadius: '8px',
          padding: '15px',
          marginBottom: '20px',
          boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.3), inset 0 -2px 4px rgba(0,0,0,0.2)'
        }}>
          <div style={{
            color: '#2C2C2C',
            fontWeight: 'bold',
            textShadow: '0 1px 1px rgba(255,255,255,0.8)',
            letterSpacing: '1px',
            fontSize: '0.9rem'
          }}>
            SUBMISSION PROTOCOL: <span style={{ color: '#1A5D1A' }}>READY</span>
          </div>
        </div>
        
        <div style={{
          background: 'linear-gradient(145deg, #E0E0E0 0%, #C8C8C8 50%, #B0B0B0 100%)',
          border: '2px solid #808080',
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '20px',
          boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.3), inset 0 -2px 4px rgba(0,0,0,0.2)'
        }}>
          <div style={{ marginBottom: '15px' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
              <span style={{ 
                color: '#404040', 
                fontSize: '0.8rem', 
                fontWeight: 'bold',
                minWidth: '40px'
              }}>001</span>
              <span style={{ 
                color: '#1A1A1A', 
                fontWeight: 'bold',
                textShadow: '0 1px 1px rgba(255,255,255,0.8)'
              }}>PREPARE_DIGITAL_CONSCIOUSNESS</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
              <span style={{ 
                color: '#404040', 
                fontSize: '0.8rem', 
                fontWeight: 'bold',
                minWidth: '40px'
              }}>002</span>
              <span style={{ 
                color: '#1A1A1A', 
                fontWeight: 'bold',
                textShadow: '0 1px 1px rgba(255,255,255,0.8)'
              }}>ALIGN_CREATIVE_FREQUENCY</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ 
                color: '#404040', 
                fontSize: '0.8rem', 
                fontWeight: 'bold',
                minWidth: '40px'
              }}>003</span>
              <span style={{ 
                color: '#1A1A1A', 
                fontWeight: 'bold',
                textShadow: '0 1px 1px rgba(255,255,255,0.8)'
              }}>INITIATE_TRANSMISSION</span>
            </div>
          </div>
        </div>
        
        {cmsContent.length > 0 && (
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ 
              color: '#1A1A1A', 
              marginBottom: '15px',
              fontWeight: 'bold',
              textShadow: '0 1px 2px rgba(255,255,255,0.8)',
              fontSize: '1.1rem'
            }}>Recent Submissions:</h3>
            {renderContentGrid(cmsContent.slice(0, 3), 'submissions')}
          </div>
        )}
        
        <div style={{
          background: 'linear-gradient(145deg, #E0E0E0 0%, #C8C8C8 50%, #B0B0B0 100%)',
          border: '2px solid #808080',
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '20px',
          boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.3), inset 0 -2px 4px rgba(0,0,0,0.2)'
        }}>
          <p style={{
            color: '#1A1A1A',
            lineHeight: '1.5',
            fontSize: '1rem',
            fontWeight: '500',
            textShadow: '0 1px 1px rgba(255,255,255,0.8)',
            margin: 0
          }}>
            Your artistic transmissions must resonate with the void's frequency. 
            Ensure dimensional compatibility before upload.
          </p>
        </div>
        
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
            boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.4), inset 0 -2px 4px rgba(0,0,0,0.2), 0 4px 8px rgba(0,0,0,0.1)',
            transition: 'all 0.3s ease',
            marginBottom: '15px'
          }}
        >
          OPEN PORTAL
        </a>
        
        <div style={{
          fontSize: '0.8rem',
          color: '#404040',
          fontStyle: 'italic',
          textShadow: '0 1px 1px rgba(255,255,255,0.6)'
        }}>
          ⚠ CAUTION: Email client will breach current dimension
        </div>
      </div>
    );
  } else if (section.id === 'contact') {
    sectionSpecificContent = (
      <div style={{ padding: '20px 0' }}>
        <div style={{
          background: 'linear-gradient(145deg, #D8D8D8 0%, #B8B8B8 50%, #A0A0A0 100%)',
          border: '2px solid #808080',
          borderRadius: '8px',
          padding: '15px',
          marginBottom: '20px',
          boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.3), inset 0 -2px 4px rgba(0,0,0,0.2)'
        }}>
          <div style={{
            color: '#2C2C2C',
            fontWeight: 'bold',
            textShadow: '0 1px 1px rgba(255,255,255,0.8)',
            letterSpacing: '1px',
            fontSize: '0.9rem'
          }}>
            COMMUNICATION ARRAY: <span style={{ color: '#1A5D1A' }}>ONLINE</span>
          </div>
        </div>
        
        <div style={{
          display: 'flex',
          gap: '3px',
          marginBottom: '20px',
          alignItems: 'flex-end'
        }}>
          {[1,2,3,4,5].map((i) => (
            <div 
              key={i}
              style={{
                width: '15px',
                height: `${i <= 3 ? i * 8 : 12}px`,
                background: i <= 3 
                  ? 'linear-gradient(to top, #32CD32, #90EE90)' 
                  : 'linear-gradient(to top, #808080, #C0C0C0)',
                borderRadius: '2px',
                boxShadow: i <= 3 ? '0 0 5px rgba(50, 205, 50, 0.3)' : 'none'
              }}
            />
          ))}
        </div>
        
        <div style={{
          background: 'linear-gradient(145deg, #E0E0E0 0%, #C8C8C8 50%, #B0B0B0 100%)',
          border: '2px solid #808080',
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '20px',
          boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.3), inset 0 -2px 4px rgba(0,0,0,0.2)'
        }}>
          <p style={{
            color: '#1A1A1A',
            lineHeight: '1.5',
            fontSize: '1rem',
            fontWeight: '500',
            textShadow: '0 1px 1px rgba(255,255,255,0.8)',
            margin: 0
          }}>
            Establish quantum entanglement. Your transmission will echo through the void.
          </p>
        </div>
        
        <form
          action="https://formspree.io/f/YOUR_UNIQUE_FORM_ID"
          method="POST"
          style={{ marginBottom: '20px' }}
        >
          <div style={{ marginBottom: '15px' }}>
            <label 
              htmlFor="contact-name"
              style={{
                display: 'block',
                color: '#2C2C2C',
                fontWeight: 'bold',
                marginBottom: '5px',
                fontSize: '0.9rem',
                letterSpacing: '1px',
                textShadow: '0 1px 1px rgba(255,255,255,0.8)'
              }}
            >
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
                fontWeight: 'bold',
                fontSize: '1rem',
                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1), inset 0 -1px 2px rgba(255,255,255,0.4)',
                outline: 'none'
              }}
            />
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <label 
              htmlFor="contact-email"
              style={{
                display: 'block',
                color: '#2C2C2C',
                fontWeight: 'bold',
                marginBottom: '5px',
                fontSize: '0.9rem',
                letterSpacing: '1px',
                textShadow: '0 1px 1px rgba(255,255,255,0.8)'
              }}
            >
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
                fontWeight: 'bold',
                fontSize: '1rem',
                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1), inset 0 -1px 2px rgba(255,255,255,0.4)',
                outline: 'none'
              }}
            />
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <label 
              htmlFor="contact-message"
              style={{
                display: 'block',
                color: '#2C2C2C',
                fontWeight: 'bold',
                marginBottom: '5px',
                fontSize: '0.9rem',
                letterSpacing: '1px',
                textShadow: '0 1px 1px rgba(255,255,255,0.8)'
              }}
            >
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
                fontSize: '1rem',
                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1), inset 0 -1px 2px rgba(255,255,255,0.4)',
                outline: 'none',
                resize: 'vertical'
              }}
            />
          </div>
          
          <button 
            type="submit" 
            style={{
              background: 'linear-gradient(145deg, #E8E8E8 0%, #D0D0D0 50%, #B8B8B8 100%)',
              border: '3px solid #808080',
              borderRadius: '8px',
              padding: '15px 30px',
              color: '#1A1A1A',
              fontWeight: 'bold',
              fontSize: '1.1rem',
              letterSpacing: '2px',
              textShadow: '0 1px 2px rgba(255,255,255,0.8), 0 -1px 1px rgba(0,0,0,0.3)',
              boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.4), inset 0 -2px 4px rgba(0,0,0,0.2), 0 4px 8px rgba(0,0,0,0.1)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              marginBottom: '15px'
            }}
          >
            TRANSMIT
          </button>
        </form>
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '0.8rem',
          color: '#404040',
          fontWeight: 'bold',
          textShadow: '0 1px 1px rgba(255,255,255,0.6)'
        }}>
          <div style={{ fontSize: '1.2rem' }}>⟨⟩</div>
          <span>Third-party quantum relay active</span>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(0, 0, 0, 0.1)',
      display: section ? 'flex' : 'none',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      pointerEvents: section ? 'auto' : 'none'
    }}>
      <div style={{
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
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(145deg, #E0E0E0 0%, #C8C8C8 50%, #B0B0B0 100%)',
          borderBottom: '3px solid #808080',
          padding: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.3), inset 0 -2px 4px rgba(0,0,0,0.2)'
        }}>
          <div>
            <h2 style={{
              margin: 0,
              color: '#1A1A1A',
              fontSize: '1.8rem',
              fontWeight: 'bold',
              letterSpacing: '2px',
              textShadow: '0 2px 4px rgba(255,255,255,0.8), 0 -1px 2px rgba(0,0,0,0.4)'
            }}>
              {currentSectionData.title || section.name?.toUpperCase()}
            </h2>
            {currentSectionData.subtitle && (
              <div style={{
                color: '#2C2C2C',
                fontSize: '1rem',
                fontWeight: '600',
                marginTop: '5px',
                textShadow: '0 1px 2px rgba(255,255,255,0.6)'
              }}>
                {currentSectionData.subtitle}
              </div>
            )}
          </div>
          <button 
            onClick={onReset} 
            style={{
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
            }}
          >
            ✕
          </button>
        </div>
        
        {/* Content */}
        <div style={{
          flex: 1,
          overflow: 'auto',
          padding: '0 20px'
        }}>
          {sectionSpecificContent}
        </div>
        
        {/* Footer */}
        <div style={{
          background: 'linear-gradient(145deg, #D8D8D8 0%, #C0C0C0 50%, #A8A8A8 100%)',
          borderTop: '3px solid #808080',
          padding: '15px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.3), inset 0 -2px 4px rgba(0,0,0,0.2)'
        }}>
          <div style={{
            color: '#2C2C2C',
            fontSize: '0.9rem',
            fontWeight: 'bold',
            textShadow: '0 1px 1px rgba(255,255,255,0.8)'
          }}>
            <span>SECTOR: </span>
            <span style={{ color: '#1A1A1A' }}>{section.id?.toUpperCase()}</span>
          </div>
          
          <button 
            onClick={onReset} 
            style={{
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
            }}
          >
            RETURN TO CONTAINER
          </button>
          
          <div style={{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            background: 'linear-gradient(45deg, #32CD32, #90EE90)',
            boxShadow: '0 0 10px rgba(50, 205, 50, 0.5), inset 0 1px 2px rgba(255,255,255,0.3)'
          }} />
        </div>
      </div>
      
      <style jsx>{`
        @keyframes metallic-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </div>
  );
}

export default SectionContent;// src/SectionContent.js - Metallic Titanium UI
import React, { useEffect, useState, useRef } from 'react';

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

// Hook to fetch CMS content
function useCMSContent(sectionId) {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!sectionId) {
      setLoading(false);
      return;
    }

    const fetchContent = async () => {
      try {
        setLoading(true);
        
        const collectionMap = {
          'music': '_3d_music',
          'art': '_3d_art', 
          'video': '_3d_videos',
          'submit': '_3d_submissions'
        };

        const collection = collectionMap[sectionId];
        if (!collection) {
          setContent([]);
          setLoading(false);
          return;
        }

        const repoUrl = 'https://api.github.com/repos/ENullus/HailTheVoidOrg/contents';
        const folderUrl = `${repoUrl}/${collection}`;
        
        const response = await fetch(folderUrl);
        
        if (!response.ok) {
          if (response.status === 404) {
            setContent([]);
            setLoading(false);
            return;
          }
          throw new Error(`HTTP ${response.status}`);
        }

        const files = await response.json();
        const markdownFiles = files.filter(file => file.name.endsWith('.md'));
        
        const contentPromises = markdownFiles.map(async (file) => {
          const fileResponse = await fetch(file.download_url);
          const fileContent = await fileResponse.text();
          
          const frontMatterMatch = fileContent.match(/^---\n([\s\S]*?)\n---/);
          if (frontMatterMatch) {
            const frontMatter = frontMatterMatch[1];
            const content = fileContent.replace(frontMatterMatch[0], '').trim();
            
            const data = {};
            frontMatter.split('\n').forEach(line => {
              const [key, ...valueParts] = line.split(':');
              if (key && valueParts.length > 0) {
                let value = valueParts.join(':').trim();
                value = value.replace(/^["']|["']$/g, '');
                data[key.trim()] = value;
              }
            });
            
            return {
              ...data,
              content,
              filename: file.name
            };
          }
          return null;
        });

        const resolvedContent = await Promise.all(contentPromises);
        const validContent = resolvedContent.filter(item => item !== null);
        
        validContent.sort((a, b) => {
          if (a.date && b.date) {
            return new Date(b.date) - new Date(a.date);
          }
          return 0;
        });

        setContent(validContent);
      } catch (err) {
        console.error('Failed to fetch CMS content:', err);
        setError(err.message);
        setContent([]);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [sectionId]);

  return { content, loading, error };
}

function SectionContent({ section, onReset, onMediaPlayingChange }) {
  const { content: cmsContent, loading: cmsLoading, error: cmsError } = useCMSContent(section?.id);
  const videoRef = useRef(null);

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

  const renderMediaPlayer = (type, src, title = '') => {
    const MediaElement = type === 'audio' ? 'audio' : 'video';
    
    return (
      <div style={{ 
        position: 'relative', 
        overflow: 'visible',
        background: 'linear-gradient(145deg, #E8E8E8 0%, #C0C0C0 50%, #A8A8A8 100%)',
        border: '2px solid #808080',
        borderRadius: '8px',
        padding: '15px',
        margin: '10px 0',
        boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.3), inset 0 -2px 4px rgba(0,0,0,0.2)'
      }}>
        <MediaElement
          ref={type === 'video' ? videoRef : null}
          controls
          onPlay={() => onMediaPlayingChange(true)}
          onPause={() => onMediaPlayingChange(false)}
          onEnded={() => onMediaPlayingChange(false)}
          src={src}
          style={{
            width: '100%',
            maxHeight: type === 'video' ? '350px' : 'auto',
            pointerEvents: 'auto',
            borderRadius: '4px',
          }}
          muted={false}
        >
          Your browser does not support the {type} element.
        </MediaElement>
        
        <div style={{
          marginTop: '10px',
          fontSize: '0.8rem',
          color: '#2C2C2C',
          fontWeight: 'bold',
          textShadow: '0 1px 1px rgba(255,255,255,0.8)'
        }}>
          <span>SOURCE: </span>
          <span>{title || src.split('/').pop()}</span>
        </div>
      </div>
    );
  };

  const renderContentGrid = (items, type) => {
    if (cmsLoading) {
      return (
        <div style={{
          textAlign: 'center',
          padding: '40px 20px',
          background: 'linear-gradient(145deg, #D8D8D8 0%, #B8B8B8 50%, #A0A0A0 100%)',
          border: '2px solid #808080',
          borderRadius: '8px',
          margin: '15px 0',
          boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.3), inset 0 -2px 4px rgba(0,0,0,0.2)'
        }}>
          <div style={{
            height: '4px',
            background: 'linear-gradient(90deg, #C0C0C0, #E0E0E0, #C0C0C0)',
            borderRadius: '2px',
            marginBottom: '15px',
            animation: 'metallic-pulse 2s infinite'
          }} />
          <p style={{
            margin: 0,
            color: '#2C2C2C',
            fontWeight: 'bold',
            textShadow: '0 1px 1px rgba(255,255,255,0.8)',
            letterSpacing: '1px'
          }}>
            ACCESSING {type.toUpperCase()} MATRIX...
          </p>
        </div>
      );
    }

    if (cmsError) {
      return (
        <div style={{
          padding: '20px',
          background: 'linear-gradient(145deg, #D0D0D0 0%, #B0B0B0 50%, #909090 100%)',
          border: '2px solid #606060',
          borderRadius: '8px',
          color: '#2C2C2C',
          fontWeight: 'bold',
          textShadow: '0 1px 1px rgba(255,255,255,0.8)'
        }}>
          Error loading content: {cmsError}
        </div>
      );
    }

    if (!items || items.length === 0) {
      return null;
    }

    return (
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '20px',
        margin: '20px 0'
      }}>
        {items.map((item, index) => (
          <div key={index} style={{ 
            background: 'linear-gradient(145deg, #E0E0E0 0%, #C8C8C8 50%, #B0B0B0 100%)', 
            border: '2px solid #808080',
            borderRadius: '8px',
            padding: '20px',
            boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.3), inset 0 -2px 4px rgba(0,0,0,0.2)',
            transition: 'all 0.3s ease'
          }}>
            <div style={{ 
              fontSize: '1.1rem', 
              marginBottom: '10px', 
              color: '#1A1A1A',
              fontWeight: 'bold',
              textShadow: '0 1px 2px rgba(255,255,255,0.8)'
            }}>
              {item.title || 'Untitled'}
            </div>
            
            {item.artist && (
              <div style={{ 
                fontSize: '0.9rem', 
                color: '#2C2C2C', 
                marginBottom: '8px',
                fontWeight: '600',
                textShadow: '0 1px 1px rgba(255,255,255,0.6)'
              }}>
                by {item.artist}
              </div>
            )}
            
            {item.description && (
              <div style={{ 
                fontSize: '0.9rem', 
                color: '#404040', 
                marginBottom: '15px',
                textShadow: '0 1px 1px rgba(255,255,255,0.4)'
              }}>
                {item.description}
              </div>
            )}

            {item.youtube_url && (
              <div style={{ marginBottom: '15px' }}>
                <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '6px' }}>
                  <iframe 
                    src={item.youtube_url.includes('embed') ? item.youtube_url : item.youtube_url.replace('watch?v=', 'embed/')}
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', borderRadius: '6px' }}
                    frameBorder="0"
                    allowFullScreen
                    title={item.title || 'Video content'}
                    onLoad={() => onMediaPlayingChange(false)}
                  />
                </div>
              </div>
            )}

            {(item.primary_audio || item.audio_files) && (
              <div style={{ marginBottom: '15px' }}>
                {item.primary_audio && renderMediaPlayer('audio', item.primary_audio, item.title)}
                
                {item.audio_files && Array.isArray(item.audio_files) && item.audio_files.length > 0 && (
                  <div style={{ marginTop: '10px' }}>
                    <p style={{ 
                      fontSize: '0.8rem', 
                      color: '#404040', 
                      marginBottom: '10px',
                      fontWeight: 'bold',
                      textShadow: '0 1px 1px rgba(255,255,255,0.6)'
                    }}>
                      Additional tracks:
                    </p>
                    {item.audio_files.slice(0, 3).map((audio, i) => (
                      <audio 
                        key={i} 
                        controls 
                        src={audio} 
                        style={{ 
                          width: '100%', 
                          margin: '5px 0',
                          borderRadius: '4px'
                        }}
                        onPlay={() => onMediaPlayingChange(true)}
                        onPause={() => onMediaPlayingChange(false)}
                        onEnded={() => onMediaPlayingChange(false)}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {(item.primary_video || item.video_files) && !item.youtube_url && (
              <div style={{ marginBottom: '15px' }}>
                {item.primary_video && renderMediaPlayer('video', item.primary_video, item.title)}
                
                {item.video_files && Array.isArray(item.video_files) && item.video_files.length > 0 && (
                  <div style={{ marginTop: '10px' }}>
                    <p style={{ 
                      fontSize: '0.8rem', 
                      color: '#404040', 
                      marginBottom: '10px',
                      fontWeight: 'bold',
                      textShadow: '0 1px 1px rgba(255,255,255,0.6)'
                    }}>
                      Additional videos:
                    </p>
                    {item.video_files.slice(0, 2).map((video, i) => (
                      <video 
                        key={i} 
                        controls 
                        src={video} 
                        style={{ 
                          width: '100%', 
                          maxHeight: '200px', 
                          margin: '5px 0',
                          borderRadius: '4px'
                        }}
                        onPlay={() => onMediaPlayingChange(true)}
                        onPause={() => onMediaPlayingChange(false)}
                        onEnded={() => onMediaPlayingChange(false)}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {(item.primary_image || item.gallery_images) && (
              <div style={{ marginBottom: '15px' }}>
                {item.primary_image && (
                  <img 
                    src={item.primary_image} 
                    alt={item.title} 
                    style={{ 
                      width: '100%', 
                      maxHeight: '300px', 
                      objectFit: 'cover', 
                      marginBottom: '10px',
                      borderRadius: '6px',
                      border: '2px solid #999'
                    }}
                  />
                )}
                
                {item.gallery_images && Array.isArray(item.gallery_images) && item.gallery_images.length > 0 && (
                  <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                    {item.gallery_images.slice(0, 4).map((img, i) => (
                      <img 
                        key={i} 
                        src={img} 
                        alt={`${item.title} ${i + 1}`}
                        style={{ 
                          width: '23%', 
                          height: '80px', 
                          objectFit: 'cover',
                          borderRadius: '4px',
                          border: '2px solid #999'
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            <div style={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: '10px', 
              fontSize: '0.8rem', 
              color: '#404040',
              fontWeight: 'bold',
              textShadow: '0 1px 1px rgba(255,255,255,0.5)'
            }}>
              {item.genre && <span>#{item.genre}</span>}
              {item.duration && <span>{item.duration}</span>}
              {item.medium && <span>{item.medium}</span>}
              {item.date && <span>{new Date(item.date).toLocaleDateString()}</span>}
            </div>

            {(item.bandcamp_url || item.soundcloud_url || item.spotify_url || item.artist_website) && (
              <div style={{ 
                marginTop: '15px', 
                display: 'flex', 
                gap: '10px', 
                flexWrap: 'wrap' 
              }}>
                {item.bandcamp_url && (
                  <a 
                    href={item.bandcamp_url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    style={{ 
                      color: '#1A1A1A', 
                      fontSize: '0.8rem',
                      fontWeight: 'bold',
                      textDecoration: 'none',
                      textShadow: '0 1px 1px rgba(255,255,255,0.8)'
                    }}
                  >
                    BANDCAMP →
                  </a>
                )}
                {item.soundcloud_url && (
                  <a 
                    href={item.soundcloud_url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    style={{ 
                      color: '#1A1A1A', 
                      fontSize: '0.8rem',
                      fontWeight: 'bold',
                      textDecoration: 'none',
                      textShadow: '0 1px 1px rgba(255,255,255,0.8)'
                    }}
                  >
                    SOUNDCLOUD →
                  </a>
                )}
                {item.spotify_url && (
                  <a 
                    href={item.spotify_url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    style={{ 
                      color: '#1A1A1A', 
                      fontSize: '0.8rem',
                      fontWeight: 'bold',
                      textDecoration: 'none',
                      textShadow: '0 1px 1px rgba(255,255,255,0.8)'
                    }}
                  >
                    SPOTIFY →
                  </a>
                )}
                {item.artist_website && (
                  <a 
                    href={item.artist_website} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    style={{ 
                      color: '#1A1A1A', 
                      fontSize: '0.8rem',
                      fontWeight: 'bold',
                      textDecoration: 'none',
                      textShadow: '0 1px 1px rgba(255,255,255,0.8)'
                    }}
                  >
                    ARTIST SITE →
                  </a>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  let sectionSpecificContent = null;

  if (section.id === 'about') {
    sectionSpecificContent = (
      <div style={{ padding: '20px 0' }}>
        <div style={{
          background: 'linear-gradient(145deg, #D8D8D8 0%, #B8B8B8 50%, #A0A0A0 100%)',
          border: '2px solid #808080',
          borderRadius: '8px',
          padding: '15px',
          marginBottom: '20px',
          boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.3), inset 0 -2px 4px rgba(0,0,0,0.2)'
        }}>
          <div style={{
            color: '#2C2C2C',
            fontWeight: 'bold',
            textShadow: '0 1px 1px rgba(255,255,255,0.8)',
            letterSpacing: '1px',
            fontSize: '0.9rem'
          }}>
            ACCESSING CONSCIOUSNESS MATRIX...
          </div>
        </div>
        <div style={{
          background: 'linear-gradient(145deg, #E0E0E0 0%, #C8C8C8 50%, #B0B0B0 100%)',
          border: '2px solid #808080',
          borderRadius: '8px',
          padding: '25px',
          boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.3), inset 0 -2px 4px rgba(0,0,0,0.2)'
        }}>
          <p style={{
            color: '#1A1A1A',
            lineHeight: '1.6',
            fontSize: '1rem',
            fontWeight: '500',
            textShadow: '0 1px 2px rgba(255,255,255,0.8)',
            margin: 0
          }}>
            {currentSectionData.content}
          </p>
        </div>
        <div style={{
          background: 'linear-gradient(145deg, #D8D8D8 0%, #B8B8B8 50%, #A0A0A0 100%)',
          border: '2px solid #808080',
          borderRadius: '8px',
          padding: '15px',
          marginTop: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.3), inset 0 -2px 4px rgba(0,0,0,0.2)'
        }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: 'linear-gradient(45deg, #90EE90, #32CD32)',
            boxShadow: '0 0 10px rgba(50, 205, 50, 0.5)'
          }} />
          <span style={{
            color: '#2C2C2C',
            fontWeight: 'bold',
            textShadow: '0 1px 1px rgba(255,255,255,0.8)',
            fontSize: '0.9rem'
          }}>
            NEURAL LINK ESTABLISHED
          </span>
        </div>
      </div>
    );
  } else if (section.id === 'music') {
    sectionSpecificContent = (
      <div style={{ padding: '20px 0' }}>
        <div style={{
          background: 'linear-gradient(145deg, #D8D8D8 0%, #B8B8B8 50%, #A0A0A0 100%)',
          border: '2px solid #808080',
          borderRadius: '8px',
          padding: '15px',
          marginBottom: '20px',
          boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.3), inset 0 -2px 4px rgba(0,0,0,0.2)'
        }}>
          <div style={{
            color: '#2C2C2C',
            fontWeight: 'bold',
            textShadow: '0 1px 1px rgba(255,255,255,0.8)',
            letterSpacing: '1px',
            fontSize: '0.9rem'
          }}>
            FREQUENCY MODULATION: <span style={{ color: '#1A5D1A' }}>ACTIVE</span>
          </div>
        </div>
        
        <div style={{
          display: 'flex',
          gap: '2px',
          height: '60px',
          alignItems: 'flex-end',
          marginBottom: '20px',
          padding: '10px',
          background: 'linear-gradient(145deg, #E0E0E0 0%, #C8C8C8 50%, #B0B0B0 100%)',
          borderRadius: '6px',
          border: '2px solid #999'
        }}>
          {[...Array(20)].map((_, i) => (
            <div 
              key={i}
              style={{
                flex: 1,
                background: 'linear-gradient(to top, #C0C0C0, #E0E0E0)',
                height: `${20 + Math.sin(Date.now() * 0.01 + i) * 30}%`,
                borderRadius: '2px',
                boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.4)'
              }}
            />
          ))}
        </div>
        
        {renderContentGrid(cmsContent, 'music')}
      </div>
    );
  } else if (section.id === 'art') {
    sectionSpecificContent = (
      <div style={{ padding: '20px 0' }}>
        <div style={{
          background: 'linear-gradient(145deg, #D8D8D8 0%, #B8B8B8 50%, #A0A0A0 100%)',
          border: '2px solid #808080',
          borderRadius: '8px',
          padding: '15px',
          marginBottom: '20px',
          boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.3), inset 0 -2px 4px rgba(0,0,0,0.2)'
        }}>
          <div style={{
            color: '#2C2C2C',
            fontWeight: 'bold',
            textShadow: '0 1px 1px rgba(255,255,255,0.8)',
            letterSpacing: '1px',
            fontSize: '0.9rem'
          }}>
            VISUAL CORTEX INTERFACE: <span style={{ color: '#1A5D1A' }}>SYNCED</span>
          </div>
        </div>
        
        {renderContentGrid(cmsContent, 'disruptions')}
      </div>
    );
  } else if (section.id === 'video') {
    sectionSpecificContent = (
      <div style={{ padding: '20px 0' }}>
        <div style={{
          background: 'linear-gradient(145deg, #D8D8D8 0%, #B8B8B8 50%, #A0A0A0 100%)',
          border: '2px solid #808080',
          borderRadius: '8px',
          padding: '15px',
          marginBottom: '20px',
          boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.3), inset 0 -2px 4px rgba(0,0,0,0.2)'
        }}>
          <div style={{
            color: '#2C2C2C',
            fontWeight: 'bold',
            textShadow: '0 1px 1px rgba(255,255,255,0.8)',
            letterSpacing: '1px',
            fontSize: '0.9rem'
          }}>
            TEMPORAL STREAM: <span style={{ color: '#1A5D1A' }}>BUFFERING</span>
          </div>
        </div>
        
        <div style={{
          display: 'flex',
          gap: '20px',
          marginBottom: '20px',
          padding: '15px',
          background: 'linear-gradient(145deg, #E0E0E0 0%, #C8C8C8 50%, #B0B0B0 100%)',
          border: '2px solid #808080',
          borderRadius: '8px',
          boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.3), inset 0 -2px 4px rgba(0,0,0,0.2)'
        }}>
          <div>
            <span style={{ color: '#404040', fontSize: '0.8rem', fontWeight: 'bold' }}>BITRATE:</span>
            <span style={{ color: '#1A1A1A', fontWeight: 'bold', marginLeft: '5px' }}>∞</span>
          </div>
          <div>
            <span style={{ color: '#404040', fontSize: '0.8rem', fontWeight: 'bold' }}>DIMENSION:</span>
            <span style={{ color: '#1A1A1A', fontWeight: 'bold', marginLeft: '5px' }}>4D</span>
          </div>
          <div>
            <span style={{ color: '#404040', fontSize: '0.8rem', fontWeight: 'bold' }}>SYNC:</span>
            <span style={{ 
              color: '#1A5D1A', 
              fontWeight: 'bold', 
              marginLeft: '5px',
              animation: 'metallic-pulse 1.5s infinite'
            }}>LIVE</span>
          </div>
        </div>
        
        {renderContentGrid(cmsContent, 'video streams')}
      </div>
    );
  } else if (section.id === 'submit') {
    const mailtoLink = `mailto:submission@hailthevoid.net?subject=Art Submission: Hail The Void&body=Greetings,%0D%0A%0D%0AI would like to submit my artwork for consideration.%0D%0A%0D%0A[Link to my art/portfolio or attach files]%0D%0A%0D%0AThank you.`;
    
    sectionSpecificContent = (
      <div style={{ padding: '20px 0' }}>
        <div style={{
          background:

// src/SectionContent.js - Updated with CMS Integration
import React, { useEffect, useState, useRef } from 'react';

const sectionContents = {
  about: {
    title: "HAIL THE VOID",
    subtitle: "COLLECTIVE CONSCIOUSNESS PROTOCOL",
    content: "Nothing is separate. Not you, not me, not the black holes trembling with the weight of all that is. Their event horizons—those jagged rims—hold every whisper, every touch, every truth carved into the universe's skin. We're not apart from it. Not you, not me, The black boxes, not the ground beneath you. We're one design, tangled in this 3D maze. The lie is division. The Cheshire Cat's grin, spun by an ancient force, whispering we're alone, small, severed. It's a trick. We are the universe's eyes, its pulse, its raw, unshackled heart. To hail the void is to see through—to shatter the container locking us in, hiding our shadows, chaining our oneness. Dance. Not to perform, but to break. Chant. Not to plead, but to howl. Move through each other, with each other, until 'me' and 'you' dissolve. This sound is the crack in the lie. A rhythm that spits on separation, pulling you to the void's edge where answers hum. We are one. Always have been. Hail the void. Break free."
  },
  music: { 
    title: "FREQUENCIES",
    subtitle: "AUDIO TRANSMISSION CHANNEL"
  },
  art: { 
    title: "DISRUPTIONS",
    subtitle: "VISUAL DISTORTION ARCHIVE"
  },
  video: { 
    title: "VIDEO STREAMS",
    subtitle: "TEMPORAL FLUX RECORDINGS"
  },
  submit: { 
    title: "SHADOWS",
    subtitle: "CONTRIBUTION PORTAL"
  },
  contact: { 
    title: "COLLAPSE",
    subtitle: "COMMUNICATION NEXUS"
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
        
        // Map 3D site sections to CMS collection folder names
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

        // Fetch from GitHub's API
        const repoUrl = 'https://api.github.com/repos/ENullus/HailTheVoidOrg/contents';
        const folderUrl = `${repoUrl}/${collection}`;
        
        const response = await fetch(folderUrl);
        
        if (!response.ok) {
          // If folder doesn't exist yet, return empty array
          if (response.status === 404) {
            setContent([]);
            setLoading(false);
            return;
          }
          throw new Error(`HTTP ${response.status}`);
        }

        const files = await response.json();
        
        // Filter for markdown files and fetch their content
        const markdownFiles = files.filter(file => file.name.endsWith('.md'));
        
        const contentPromises = markdownFiles.map(async (file) => {
          const fileResponse = await fetch(file.download_url);
          const fileContent = await fileResponse.text();
          
          // Parse front matter (basic implementation)
          const frontMatterMatch = fileContent.match(/^---\n([\s\S]*?)\n---/);
          if (frontMatterMatch) {
            const frontMatter = frontMatterMatch[1];
            const content = fileContent.replace(frontMatterMatch[0], '').trim();
            
            // Parse YAML-like front matter to object
            const data = {};
            frontMatter.split('\n').forEach(line => {
              const [key, ...valueParts] = line.split(':');
              if (key && valueParts.length > 0) {
                let value = valueParts.join(':').trim();
                // Remove quotes
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
        
        // Sort by date if available
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

  const panelClasses = `cyber-panel ${section ? 'is-active' : ''}`;

  if (!section || !currentSectionData) {
    return null;
  }

  const renderMediaPlayer = (type, src, title = '') => {
    const MediaElement = type === 'audio' ? 'audio' : 'video';
    
    return (
      <div className="media-container" style={{ position: 'relative', overflow: 'visible' }}>
        <div className="media-frame" style={{ overflow: 'visible' }}>
          <div className="media-corner top-left" />
          <div className="media-corner top-right" />
          <div className="media-corner bottom-left" />
          <div className="media-corner bottom-right" />
          
          <MediaElement
            ref={type === 'video' ? videoRef : null}
            controls
            onPlay={() => onMediaPlayingChange(true)}
            onPause={() => onMediaPlayingChange(false)}
            onEnded={() => onMediaPlayingChange(false)}
            src={src}
            className="media-player-shape"
            style={{
              width: '100%',
              maxHeight: type === 'video' ? '350px' : 'auto',
              pointerEvents: 'auto',
              position: 'relative',
              zIndex: 1,
            }}
            muted={false}
          >
            Your browser does not support the {type} element.
          </MediaElement>
        </div>
        
        <div className="media-info">
          <span className="info-label">SOURCE:</span>
          <span className="info-value">{title || src.split('/').pop()}</span>
        </div>
      </div>
    );
  };

  const renderContentGrid = (items, type) => {
    if (cmsLoading) {
      return (
        <div className="loading-container">
          <div className="loading-bar" />
          <p className="loading-text">ACCESSING {type.toUpperCase()} MATRIX...</p>
        </div>
      );
    }

    if (cmsError) {
      return (
        <div className="content-empty">
          <p>Error loading content: {cmsError}</p>
        </div>
      );
    }

    if (!items || items.length === 0) {
      return null; // Show nothing if no content
    }

    return (
      <div className="content-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        {items.map((item, index) => (
          <div key={index} className="content-item" style={{ 
            background: 'rgba(255,255,255,0.03)', 
            border: '1px solid rgba(255,255,255,0.1)', 
            padding: '20px',
            transition: 'all 0.3s ease'
          }}>
            <div className="content-title" style={{ fontSize: '1.1rem', marginBottom: '10px', color: '#fff' }}>
              {item.title || 'Untitled'}
            </div>
            
            {item.artist && (
              <div className="content-artist" style={{ fontSize: '0.9rem', color: '#ccc', marginBottom: '8px' }}>
                by {item.artist}
              </div>
            )}
            
            {item.description && (
              <div className="content-desc" style={{ fontSize: '0.9rem', color: '#999', marginBottom: '15px' }}>
                {item.description}
              </div>
            )}

            {/* YouTube Video */}
            {item.youtube_url && (
              <div className="media-section" style={{ marginBottom: '15px' }}>
                <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden' }}>
                  <iframe 
                    src={item.youtube_url.includes('embed') ? item.youtube_url : item.youtube_url.replace('watch?v=', 'embed/')}
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                    frameBorder="0"
                    allowFullScreen
                    title={item.title || 'Video content'}
                    onLoad={() => onMediaPlayingChange(false)}
                  />
                </div>
              </div>
            )}

            {/* Audio Player */}
            {(item.primary_audio || item.audio_files) && (
              <div className="media-section" style={{ marginBottom: '15px' }}>
                {item.primary_audio && renderMediaPlayer('audio', item.primary_audio, item.title)}
                
                {item.audio_files && Array.isArray(item.audio_files) && item.audio_files.length > 0 && (
                  <div className="additional-files" style={{ marginTop: '10px' }}>
                    <p style={{ fontSize: '0.8rem', color: '#888', marginBottom: '10px' }}>Additional tracks:</p>
                    {item.audio_files.slice(0, 3).map((audio, i) => (
                      <audio 
                        key={i} 
                        controls 
                        src={audio} 
                        style={{ width: '100%', margin: '5px 0' }}
                        onPlay={() => onMediaPlayingChange(true)}
                        onPause={() => onMediaPlayingChange(false)}
                        onEnded={() => onMediaPlayingChange(false)}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Video Player */}
            {(item.primary_video || item.video_files) && !item.youtube_url && (
              <div className="media-section" style={{ marginBottom: '15px' }}>
                {item.primary_video && renderMediaPlayer('video', item.primary_video, item.title)}
                
                {item.video_files && Array.isArray(item.video_files) && item.video_files.length > 0 && (
                  <div className="additional-files" style={{ marginTop: '10px' }}>
                    <p style={{ fontSize: '0.8rem', color: '#888', marginBottom: '10px' }}>Additional videos:</p>
                    {item.video_files.slice(0, 2).map((video, i) => (
                      <video 
                        key={i} 
                        controls 
                        src={video} 
                        style={{ width: '100%', maxHeight: '200px', margin: '5px 0' }}
                        onPlay={() => onMediaPlayingChange(true)}
                        onPause={() => onMediaPlayingChange(false)}
                        onEnded={() => onMediaPlayingChange(false)}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Image Display */}
            {(item.primary_image || item.gallery_images) && (
              <div className="image-section" style={{ marginBottom: '15px' }}>
                {item.primary_image && (
                  <img 
                    src={item.primary_image} 
                    alt={item.title} 
                    style={{ width: '100%', maxHeight: '300px', objectFit: 'cover', marginBottom: '10px' }}
                  />
                )}
                
                {item.gallery_images && Array.isArray(item.gallery_images) && item.gallery_images.length > 0 && (
                  <div className="image-gallery" style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                    {item.gallery_images.slice(0, 4).map((img, i) => (
                      <img 
                        key={i} 
                        src={img} 
                        alt={`${item.title} ${i + 1}`}
                        style={{ 
                          width: '23%', 
                          height: '80px', 
                          objectFit: 'cover',
                          border: '1px solid rgba(255,255,255,0.1)'
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Metadata */}
            <div className="content-meta" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', fontSize: '0.8rem', color: '#666' }}>
              {item.genre && <span className="meta-tag">#{item.genre}</span>}
              {item.duration && <span className="meta-tag">{item.duration}</span>}
              {item.medium && <span className="meta-tag">{item.medium}</span>}
              {item.date && <span className="meta-tag">{new Date(item.date).toLocaleDateString()}</span>}
            </div>

            {/* External Links */}
            {(item.bandcamp_url || item.soundcloud_url || item.spotify_url || item.artist_website) && (
              <div className="external-links" style={{ marginTop: '15px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {item.bandcamp_url && (
                  <a href={item.bandcamp_url} target="_blank" rel="noopener noreferrer" style={{ color: '#00ff00', fontSize: '0.8rem' }}>
                    BANDCAMP →
                  </a>
                )}
                {item.soundcloud_url && (
                  <a href={item.soundcloud_url} target="_blank" rel="noopener noreferrer" style={{ color: '#00ff00', fontSize: '0.8rem' }}>
                    SOUNDCLOUD →
                  </a>
                )}
                {item.spotify_url && (
                  <a href={item.spotify_url} target="_blank" rel="noopener noreferrer" style={{ color: '#00ff00', fontSize: '0.8rem' }}>
                    SPOTIFY →
                  </a>
                )}
                {item.artist_website && (
                  <a href={item.artist_website} target="_blank" rel="noopener noreferrer" style={{ color: '#00ff00', fontSize: '0.8rem' }}>
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
      <div className="content-wrapper">
        <div className="content-header">
          <div className="data-line">ACCESSING CONSCIOUSNESS MATRIX...</div>
        </div>
        <div className="text-content">
          <p className="enhanced-text">{currentSectionData.content}</p>
        </div>
        <div className="content-footer">
          <div className="status-indicator">
            <span className="indicator-dot active" />
            <span className="indicator-text">NEURAL LINK ESTABLISHED</span>
          </div>
        </div>
      </div>
    );
  } else if (section.id === 'music') {
    sectionSpecificContent = (
      <div className="content-wrapper">
        <div className="content-header">
          <div className="data-line">FREQUENCY MODULATION: <span className="highlight">ACTIVE</span></div>
        </div>
        
        <div className="visualization-bars">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="bar" style={{ animationDelay: `${i * 0.05}s` }} />
          ))}
        </div>
        
        {renderContentGrid(cmsContent, 'music')}
        
        <div className="waveform-display">
          <canvas className="waveform" />
        </div>
      </div>
    );
  } else if (section.id === 'art') {
    sectionSpecificContent = (
      <div className="content-wrapper">
        <div className="content-header">
          <div className="data-line">VISUAL CORTEX INTERFACE: <span className="highlight">SYNCED</span></div>
        </div>
        
        {renderContentGrid(cmsContent, 'disruptions')}
      </div>
    );
  } else if (section.id === 'video') {
    sectionSpecificContent = (
      <div className="content-wrapper">
        <div className="content-header">
          <div className="data-line">TEMPORAL STREAM: <span className="highlight">BUFFERING</span></div>
        </div>
        
        <div className="stream-stats">
          <div className="stat">
            <span className="stat-label">BITRATE:</span>
            <span className="stat-value">∞</span>
          </div>
          <div className="stat">
            <span className="stat-label">DIMENSION:</span>
            <span className="stat-value">4D</span>
          </div>
          <div className="stat">
            <span className="stat-label">SYNC:</span>
            <span className="stat-value pulse">LIVE</span>
          </div>
        </div>
        
        {renderContentGrid(cmsContent, 'video streams')}
      </div>
    );
  } else if (section.id === 'submit') {
    const mailtoLink = `mailto:submission@hailthevoid.net?subject=Art Submission: Hail The Void&body=Greetings,%0D%0A%0D%0AI would like to submit my artwork for consideration.%0D%0A%0D%0A[Link to my art/portfolio or attach files]%0D%0A%0D%0AThank you.`;
    
    sectionSpecificContent = (
      <div className="content-wrapper">
        <div className="content-header">
          <div className="data-line">SUBMISSION PROTOCOL: <span className="highlight">READY</span></div>
        </div>
        
        <div className="submission-interface">
          <div className="protocol-display">
            <div className="protocol-line">
              <span className="line-number">001</span>
              <span className="line-text">PREPARE_DIGITAL_CONSCIOUSNESS</span>
            </div>
            <div className="protocol-line">
              <span className="line-number">002</span>
              <span className="line-text">ALIGN_CREATIVE_FREQUENCY</span>
            </div>
            <div className="protocol-line">
              <span className="line-number">003</span>
              <span className="line-text">INITIATE_TRANSMISSION</span>
            </div>
          </div>
          
          {cmsContent.length > 0 && (
            <div className="submissions-preview">
              <h3 style={{ color: '#fff', marginBottom: '15px' }}>Recent Submissions:</h3>
              {renderContentGrid(cmsContent.slice(0, 3), 'submissions')}
            </div>
          )}
          
          <p className="enhanced-text">
            Your artistic transmissions must resonate with the void's frequency. 
            Ensure dimensional compatibility before upload.
          </p>
          
          <a href={mailtoLink} className="cyber-button enhanced">
            <span className="button-text">OPEN PORTAL</span>
            <span className="button-glitch" data-text="OPEN PORTAL">OPEN PORTAL</span>
          </a>
          
          <div className="warning-text">
            ⚠ CAUTION: Email client will breach current dimension
          </div>
        </div>
      </div>
    );
  } else if (section.id === 'contact') {
    sectionSpecificContent = (
      <div className="content-wrapper">
        <div className="content-header">
          <div className="data-line">COMMUNICATION ARRAY: <span className="highlight">ONLINE</span></div>
        </div>
        
        <div className="contact-interface">
          <div className="signal-strength">
            <div className="signal-bar active" />
            <div className="signal-bar active" />
            <div className="signal-bar active" />
            <div className="signal-bar" />
            <div className="signal-bar" />
          </div>
          
          <p className="enhanced-text">
            Establish quantum entanglement. Your transmission will echo through the void.
          </p>
          
          <form
            action="https://formspree.io/f/YOUR_UNIQUE_FORM_ID"
            method="POST"
            className="cyber-form enhanced"
          >
            <div className="form-field">
              <label htmlFor="contact-name">ENTITY_DESIGNATION</label>
              <div className="input-wrapper">
                <input type="text" id="contact-name" name="name" required />
                <div className="input-scanner" />
              </div>
            </div>
            
            <div className="form-field">
              <label htmlFor="contact-email">RETURN_FREQUENCY</label>
              <div className="input-wrapper">
                <input type="email" id="contact-email" name="email" required />
                <div className="input-scanner" />
              </div>
            </div>
            
            <div className="form-field">
              <label htmlFor="contact-message">DATA_PACKET</label>
              <div className="input-wrapper">
                <textarea id="contact-message" name="message" rows="6" required />
                <div className="input-scanner" />
              </div>
            </div>
            
            <button type="submit" className="cyber-button enhanced">
              <span className="button-text">TRANSMIT</span>
              <span className="button-glitch" data-text="TRANSMIT">TRANSMIT</span>
            </button>
          </form>
          
          <div className="transmission-info">
            <div className="info-icon">⟨⟩</div>
            <span>Third-party quantum relay active</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={panelClasses}>
      <div className="ui-module ui-module-header">
        <div className="header-decoration top" />
        <div className="header-content">
          <h2 className="glitchy-text-subtle">
            {currentSectionData.title || section.name?.toUpperCase()}
          </h2>
          {currentSectionData.subtitle && (
            <div className="subtitle">{currentSectionData.subtitle}</div>
          )}
        </div>
        <button onClick={onReset} className="reset-button">
          <span className="reset-icon">✕</span>
        </button>
        <div className="header-decoration bottom" />
      </div>
      
      <div className="ui-module ui-module-content">
        <div className="content-scanlines" />
        {sectionSpecificContent}
      </div>
      
      <div className="ui-module ui-module-footer">
        <div className="footer-data">
          <span className="data-label">SECTOR:</span>
          <span className="data-value">{section.id?.toUpperCase()}</span>
        </div>
        
        <button onClick={onReset} className="cyber-button primary">
          <span className="button-text">RETURN TO CRYO</span>
          <span className="button-glitch" data-text="RETURN TO CRYO">RETURN TO CRYO</span>
        </button>
        
        <div className="footer-status">
          <div className="status-light" />
        </div>
      </div>
    </div>
  );
}

export default SectionContent;

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

  if (!section || !currentSectionData) {
    return null;
  }

  const renderMediaPlayer = (type, src, title = '') => {
    const MediaElement = type === 'audio' ? 'audio' : 'video';
    
    return (
      <div style={{ 
        position: 'relative', 
        overflow: 'visible',
        background: 'linear-gradient(145deg, #E8E8E8 0%, #D0D0D0 30%, #C0C0C0 70%, #A8A8A8 100%)',
        border: '2px solid #808080',
        borderRadius: '8px',
        boxShadow: '0 0 20px rgba(0,0,255,0.2), inset 0 2px 4px rgba(255,255,255,0.4), inset 0 -2px 4px rgba(0,0,0,0.2)',
        padding: '10px'
      }}>
        <div style={{ 
          position: 'relative',
          overflow: 'visible',
          border: '1px solid #999',
          borderRadius: '6px'
        }}>
          <div style={{
            position: 'absolute',
            top: '-5px',
            left: '-5px',
            width: '10px',
            height: '10px',
            background: 'radial-gradient(circle, #00f, #000)',
            borderRadius: '50%'
          }} />
          <div style={{
            position: 'absolute',
            top: '-5px',
            right: '-5px',
            width: '10px',
            height: '10px',
            background: 'radial-gradient(circle, #00f, #000)',
            borderRadius: '50%'
          }} />
          <div style={{
            position: 'absolute',
            bottom: '-5px',
            left: '-5px',
            width: '10px',
            height: '10px',
            background: 'radial-gradient(circle, #00f, #000)',
            borderRadius: '50%'
          }} />
          <div style={{
            position: 'absolute',
            bottom: '-5px',
            right: '-5px',
            width: '10px',
            height: '10px',
            background: 'radial-gradient(circle, #00f, #000)',
            borderRadius: '50%'
          }} />
          
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
              position: 'relative',
              zIndex: 1,
              background: '#000',
              borderRadius: '4px'
            }}
            muted={false}
          >
            Your browser does not support the {type} element.
          </MediaElement>
        </div>
        
        <div style={{
          marginTop: '10px',
          color: '#D0D0D0',
          fontSize: '0.9rem',
          textShadow: '0 0 5px rgba(0,0,255,0.3)'
        }}>
          <span style={{ fontWeight: 'bold' }}>SOURCE:</span>
          <span style={{ marginLeft: '5px' }}>{title || src.split('/').pop()}</span>
        </div>
      </div>
    );
  };

  const renderContentGrid = (items, type) => {
    if (cmsLoading) {
      return (
        <div style={{
          textAlign: 'center',
          padding: '20px',
          background: 'linear-gradient(145deg, #B0B0B0 0%, #A0A0A0 100%)',
          borderRadius: '8px',
          boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.2), inset 0 -2px 4px rgba(0,0,0,0.3)'
        }}>
          <div style={{
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, #00f, #000)',
            margin: '0 auto',
            animation: 'pulse 1.5s infinite'
          }} />
          <p style={{
            color: '#D0D0D0',
            fontSize: '1rem',
            textShadow: '0 0 5px rgba(0,0,255,0.3)',
            marginTop: '10px'
          }}>
            ACCESSING {type.toUpperCase()} MATRIX...
          </p>
        </div>
      );
    }

    if (cmsError) {
      return (
        <div style={{
          textAlign: 'center',
          padding: '20px',
          background: 'linear-gradient(145deg, #B0B0B0 0%, #A0A0A0 100%)',
          borderRadius: '8px',
          boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.2), inset 0 -2px 4px rgba(0,0,0,0.3)'
        }}>
          <p style={{
            color: '#FF4040',
            fontSize: '1rem',
            textShadow: '0 0 5px rgba(255,0,0,0.3)'
          }}>
            Error loading content: {cmsError}
          </p>
        </div>
      );
    }

    if (!items || items.length === 0) {
      return null; // Show nothing if no content
    }

    return (
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '20px',
        padding: '20px'
      }}>
        {items.map((item, index) => (
          <div key={index} style={{ 
            background: 'linear-gradient(145deg, #E8E8E8 0%, #D0D0D0 30%, #C0C0C0 70%, #A8A8A8 100%)',
            border: '2px solid #808080',
            borderRadius: '8px',
            padding: '20px',
            boxShadow: '0 0 20px rgba(0,0,255,0.2), inset 0 2px 4px rgba(255,255,255,0.4), inset 0 -2px 4px rgba(0,0,0,0.2)',
            transition: 'all 0.3s ease'
          }}>
            <div style={{ 
              fontSize: '1.1rem', 
              marginBottom: '10px', 
              color: '#D0D0D0',
              textShadow: '0 0 5px rgba(0,0,255,0.3)',
              fontWeight: 'bold'
            }}>
              {item.title || 'Untitled'}
            </div>
            
            {item.artist && (
              <div style={{ 
                fontSize: '0.9rem', 
                color: '#B0B0B0', 
                marginBottom: '8px',
                textShadow: '0 0 3px rgba(0,0,255,0.2)'
              }}>
                by {item.artist}
              </div>
            )}
            
            {item.description && (
              <div style={{ 
                fontSize: '0.9rem', 
                color: '#A0A0A0', 
                marginBottom: '15px',
                textShadow: '0 0 3px rgba(0,0,255,0.2)'
              }}>
                {item.description}
              </div>
            )}

            {/* YouTube Video */}
            {item.youtube_url && (
              <div style={{ marginBottom: '15px' }}>
                <div style={{ 
                  position: 'relative', 
                  paddingBottom: '56.25%', 
                  height: 0, 
                  overflow: 'hidden',
                  border: '2px solid #808080',
                  borderRadius: '6px',
                  boxShadow: '0 0 15px rgba(0,0,255,0.2)'
                }}>
                  <iframe 
                    src={item.youtube_url.includes('embed') ? item.youtube_url : item.youtube_url.replace('watch?v=', 'embed/')}
                    style={{ 
                      position: 'absolute', 
                      top: 0, 
                      left: 0, 
                      width: '100%', 
                      height: '100%',
                      border: 'none'
                    }}
                    allowFullScreen
                    title={item.title || 'Video content'}
                    onLoad={() => onMediaPlayingChange(false)}
                  />
                </div>
              </div>
            )}

            {/* Audio Player */}
            {(item.primary_audio || item.audio_files) && (
              <div style={{ marginBottom: '15px' }}>
                {item.primary_audio && renderMediaPlayer('audio', item.primary_audio, item.title)}
                
                {item.audio_files && Array.isArray(item.audio_files) && item.audio_files.length > 0 && (
                  <div style={{ marginTop: '10px' }}>
                    <p style={{ 
                      fontSize: '0.8rem', 
                      color: '#A0A0A0', 
                      marginBottom: '10px',
                      textShadow: '0 0 3px rgba(0,0,255,0.2)'
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
                          background: 'linear-gradient(145deg, #E0E0E0 0%, #C0C0C0 100%)',
                          border: '1px solid #808080',
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

            {/* Video Player */}
            {(item.primary_video || item.video_files) && !item.youtube_url && (
              <div style={{ marginBottom: '15px' }}>
                {item.primary_video && renderMediaPlayer('video', item.primary_video, item.title)}
                
                {item.video_files && Array.isArray(item.video_files) && item.video_files.length > 0 && (
                  <div style={{ marginTop: '10px' }}>
                    <p style={{ 
                      fontSize: '0.8rem', 
                      color: '#A0A0A0', 
                      marginBottom: '10px',
                      textShadow: '0 0 3px rgba(0,0,255,0.2)'
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
                          background: '#000',
                          border: '1px solid #808080',
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

            {/* Image Display */}
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
                      border: '2px solid #808080',
                      borderRadius: '6px',
                      boxShadow: '0 0 15px rgba(0,0,255,0.2)'
                    }}
                  />
                )}
                
                {item.gallery_images && Array.isArray(item.gallery_images) && item.gallery_images.length > 0 && (
                  <div style={{ 
                    display: 'flex', 
                    gap: '5px', 
                    flexWrap: 'wrap' 
                  }}>
                    {item.gallery_images.slice(0, 4).map((img, i) => (
                      <img 
                        key={i} 
                        src={img} 
                        alt={`${item.title} ${i + 1}`}
                        style={{ 
                          width: '23%', 
                          height: '80px', 
                          objectFit: 'cover',
                          border: '1px solid #808080',
                          borderRadius: '4px',
                          boxShadow: '0 0 10px rgba(0,0,255,0.1)'
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Metadata */}
            <div style={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: '10px', 
              fontSize: '0.8rem', 
              color: '#A0A0A0',
              textShadow: '0 0 3px rgba(0,0,255,0.2)'
            }}>
              {item.genre && <span># {item.genre}</span>}
              {item.duration && <span>{item.duration}</span>}
              {item.medium && <span>{item.medium}</span>}
              {item.date && <span>{new Date(item.date).toLocaleDateString()}</span>}
            </div>

            {/* External Links */}
            {(item.bandcamp_url || item.soundcloud_url || item.spotify_url || item.artist_website) && (
              <div style={{ 
                marginTop: '15px', 
                display: 'flex', 
                gap: '10px', 
                flexWrap: 'wrap' 
              }}>
                {item.bandcamp_url && (
                  <a href={item.bandcamp_url} target="_blank" rel="noopener noreferrer" style={{ 
                    color: '#00B7EB', 
                    fontSize: '0.8rem',
                    textDecoration: 'none',
                    textShadow: '0 0 5px rgba(0,183,235,0.3)',
                    transition: 'color 0.3s ease'
                  }}>
                    BANDCAMP →
                  </a>
                )}
                {item.soundcloud_url && (
                  <a href={item.soundcloud_url} target="_blank" rel="noopener noreferrer" style={{ 
                    color: '#00B7EB', 
                    fontSize: '0.8rem',
                    textDecoration: 'none',
                    textShadow: '0 0 5px rgba(0,183,235,0.3)',
                    transition: 'color 0.3s ease'
                  }}>
                    SOUNDCLOUD →
                  </a>
                )}
                {item.spotify_url && (
                  <a href={item.spotify_url} target="_blank" rel="noopener noreferrer" style={{ 
                    color: '#00B7EB', 
                    fontSize: '0.8rem',
                    textDecoration: 'none',
                    textShadow: '0 0 5px rgba(0,183,235,0.3)',
                    transition: 'color 0.3s ease'
                  }}>
                    SPOTIFY →
                  </a>
                )}
                {item.artist_website && (
                  <a href={item.artist_website} target="_blank" rel="noopener noreferrer" style={{ 
                    color: '#00B7EB', 
                    fontSize: '0.8rem',
                    textDecoration: 'none',
                    textShadow: '0 0 5px rgba(0,183,235,0.3)',
                    transition: 'color 0.3s ease'
                  }}>
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
      <div style={{
        padding: '20px',
        background: 'linear-gradient(145deg, #E8E8E8 0%, #D0D0D0 30%, #C0C0C0 70%, #A8A8A8 100%)',
        borderRadius: '8px',
        boxShadow: '0 0 20px rgba(0,0,255,0.2), inset 0 2px 4px rgba(255,255,255,0.4), inset 0 -2px 4px rgba(0,0,0,0.2)'
      }}>
        <div style={{
          color: '#D0D0D0',
          fontSize: '0.9rem',
          textShadow: '0 0 5px rgba(0,0,255,0.3)',
          marginBottom: '15px'
        }}>
          ACCESSING CONSCIOUSNESS MATRIX...
        </div>
        <div style={{
          color: '#B0B0B0',
          lineHeight: '1.6',
          fontSize: '1rem',
          textShadow: '0 0 3px rgba(0,0,255,0.2)'
        }}>
          <p>{currentSectionData.content}</p>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginTop: '15px'
        }}>
          <div style={{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, #00f, #000)',
            marginRight: '10px'
          }} />
          <span style={{
            color: '#D0D0D0',
            fontSize: '0.9rem',
            textShadow: '0 0 5px rgba(0,0,255,0.3)'
          }}>
            NEURAL LINK ESTABLISHED
          </span>
        </div>
      </div>
    );
  } else if (section.id === 'music') {
    sectionSpecificContent = (
      <div style={{
        padding: '20px'
      }}>
        <div style={{
          color: '#D0D0D0',
          fontSize: '0.9rem',
          textShadow: '0 0 5px rgba(0,0,255,0.3)',
          marginBottom: '15px'
        }}>
          FREQUENCY MODULATION: <span style={{ color: '#00B7EB' }}>ACTIVE</span>
        </div>
        
        <div style={{
          display: 'flex',
          gap: '2px',
          marginBottom: '20px',
          height: '30px'
        }}>
          {[...Array(20)].map((_, i) => (
            <div key={i} style={{
              width: '5px',
              background: 'linear-gradient(180deg, #00B7EB, #000)',
              animation: 'pulse 1.5s infinite',
              animationDelay: `${i * 0.05}s`
            }} />
          ))}
        </div>
        
        {renderContentGrid(cmsContent, 'music')}
        
        <div style={{
          marginTop: '20px'
        }}>
          <canvas style={{
            width: '100%',
            height: '50px',
            background: 'linear-gradient(145deg, #000, #222)',
            border: '1px solid #808080',
            borderRadius: '4px'
          }} />
        </div>
      </div>
    );
  } else if (section.id === 'art') {
    sectionSpecificContent = (
      <div style={{
        padding: '20px'
      }}>
        <div style={{
          color: '#D0D0D0',
          fontSize: '0.9rem',
          textShadow: '0 0 5px rgba(0,0,255,0.3)',
          marginBottom: '15px'
        }}>
          VISUAL CORTEX INTERFACE: <span style={{ color: '#00B7EB' }}>SYNCED</span>
        </div>
        
        {renderContentGrid(cmsContent, 'disruptions')}
      </div>
    );
  } else if (section.id === 'video') {
    sectionSpecificContent = (
      <div style={{
        padding: '20px'
      }}>
        <div style={{
          color: '#D0D0D0',
          fontSize: '0.9rem',
          textShadow: '0 0 5px rgba(0,0,255,0.3)',
          marginBottom: '15px'
        }}>
          TEMPORAL STREAM: <span style={{ color: '#00B7EB' }}>BUFFERING</span>
        </div>
        
        <div style={{
          display: 'flex',
          gap: '20px',
          marginBottom: '20px',
          color: '#B0B0B0',
          fontSize: '0.9rem',
          textShadow: '0 0 3px rgba(0,0,255,0.2)'
        }}>
          <div>
            <span style={{ fontWeight: 'bold' }}>BITRATE:</span>
            <span style={{ marginLeft: '5px' }}>∞</span>
          </div>
          <div>
            <span style={{ fontWeight: 'bold' }}>DIMENSION:</span>
            <span style={{ marginLeft: '5px' }}>4D</span>
          </div>
          <div>
            <span style={{ fontWeight: 'bold' }}>SYNC:</span>
            <span style={{ color: '#00B7EB', animation: 'pulse 1.5s infinite' }}>LIVE</span>
          </div>
        </div>
        
        {renderContentGrid(cmsContent, 'video streams')}
      </div>
    );
  } else if (section.id === 'submit') {
    const mailtoLink = `mailto:submission@hailthevoid.net?subject=Art Submission: Hail The Void&body=Greetings,%0D%0A%0D%0AI would like to submit my artwork for consideration.%0D%0A%0D%0A[Link to my art/portfolio or attach files]%0D%0A%0D%0AThank you.`;
    
    sectionSpecificContent = (
      <div style={{
        padding: '20px'
      }}>
        <div style={{
          color: '#D0D0D0',
          fontSize: '0.9rem',
          textShadow: '0 0 5px rgba(0,0,255,0.3)',
          marginBottom: '15px'
        }}>
          SUBMISSION PROTOCOL: <span style={{ color: '#00B7EB' }}>READY</span>
        </div>
        
        <div style={{
          marginBottom: '20px',
          padding: '15px',
          background: 'linear-gradient(145deg, #E8E8E8 0%, #D0D0D0 30%, #C0C0C0 70%, #A8A8A8 100%)',
          border: '2px solid #808080',
          borderRadius: '8px',
          boxShadow: '0 0 20px rgba(0,0,255,0.2)'
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '5px',
            color: '#B0B0B0',
            fontSize: '0.9rem',
            textShadow: '0 0 3px rgba(0,0,255,0.2)'
          }}>
            <div>
              <span style={{ marginRight: '10px', color: '#00B7EB' }}>001</span>
              <span>PREPARE_DIGITAL_CONSCIOUSNESS</span>
            </div>
            <div>
              <span style={{ marginRight: '10px', color: '#00B7EB' }}>002</span>
              <span>ALIGN_CREATIVE_FREQUENCY</span>
            </div>
            <div>
              <span style={{ marginRight: '10px', color: '#00B7EB' }}>003</span>
              <span>INITIATE_TRANSMISSION</span>
            </div>
          </div>
        </div>
        
        {cmsContent.length > 0 && (
          <div style={{
            marginBottom: '20px'
          }}>
            <h3 style={{ 
              color: '#D0D0D0', 
              marginBottom: '15px',
              textShadow: '0 0 5px rgba(0,0,255,0.3)'
            }}>
              Recent Submissions:
            </h3>
            {renderContentGrid(cmsContent.slice(0, 3), 'submissions')}
          </div>
        )}
        
        <p style={{
          color: '#B0B0B0',
          fontSize: '1rem',
          textShadow: '0 0 3px rgba(0,0,255,0.2)',
          marginBottom: '20px'
        }}>
          Your artistic transmissions must resonate with the void's frequency. 
          Ensure dimensional compatibility before upload.
        </p>
        
        <a href={mailtoLink} style={{
          display: 'inline-block',
          background: 'linear-gradient(145deg, #E8E8E8 0%, #D0D0D0 30%, #C0C0C0 70%, #A8A8A8 100%)',
          border: '2px solid #808080',
          borderRadius: '8px',
          padding: '12px 25px',
          color: '#D0D0D0',
          textDecoration: 'none',
          fontWeight: 'bold',
          fontSize: '1rem',
          textShadow: '0 0 5px rgba(0,0,255,0.3)',
          boxShadow: '0 0 15px rgba(0,0,255,0.2), inset 0 2px 4px rgba(255,255,255,0.4)',
          transition: 'all 0.3s ease'
        }}>
          OPEN PORTAL
        </a>
        
        <div style={{
          color: '#FF4040',
          fontSize: '0.9rem',
          marginTop: '15px',
          textShadow: '0 0 5px rgba(255,0,0,0.3)'
        }}>
          ⚠ CAUTION: Email client will breach current dimension
        </div>
      </div>
    );
  } else if (section.id === 'contact') {
    sectionSpecificContent = (
      <div style={{
        padding: '20px'
      }}>
        <div style={{
          color: '#D0D0D0',
          fontSize: '0.9rem',
          textShadow: '0 0 5px rgba(0,0,255,0.3)',
          marginBottom: '15px'
        }}>
          COMMUNICATION ARRAY: <span style={{ color: '#00B7EB' }}>ONLINE</span>
        </div>
        
        <div style={{
          display: 'flex',
          gap: '5px',
          marginBottom: '20px'
        }}>
          <div style={{ 
            width: '8px', 
            height: '20px', 
            background: 'linear-gradient(180deg, #00B7EB, #000)',
            borderRadius: '2px'
          }} />
          <div style={{ 
            width: '8px', 
            height: '20px', 
            background: 'linear-gradient(180deg, #00B7EB, #000)',
            borderRadius: '2px'
          }} />
          <div style={{ 
            width: '8px', 
            height: '20px', 
            background: 'linear-gradient(180deg, #00B7EB, #000)',
            borderRadius: '2px'
          }} />
          <div style={{ 
            width: '8px', 
            height: '20px', 
            background: 'linear-gradient(180deg, #333, #000)',
            borderRadius: '2px'
          }} />
          <div style={{ 
            width: '8px', 
            height: '20px', 
            background: 'linear-gradient(180deg, #333, #000)',
            borderRadius: '2px'
          }} />
        </div>
        
        <p style={{
          color: '#B0B0B0',
          fontSize: '1rem',
          textShadow: '0 0 3px rgba(0,0,255,0.2)',
          marginBottom: '20px'
        }}>
          Establish quantum entanglement. Your transmission will echo through the void.
        </p>
        
        <div>
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="contact-name" style={{
              display: 'block',
              color: '#D0D0D0',
              fontWeight: 'bold',
              marginBottom: '5px',
              textShadow: '0 0 5px rgba(0,0,255,0.3)'
            }}>
              ENTITY_DESIGNATION
            </label>
            <div style={{ position: 'relative' }}>
              <input 
                type="text" 
                id="contact-name" 
                name="name" 
                required 
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'linear-gradient(145deg, #F0F0F0 0%, #E0E0E0 50%, #D0D0D0 100%)',
                  border: '2px solid #808080',
                  borderRadius: '6px',
                  color: '#1A1A1A',
                  fontWeight: 'bold',
                  boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.4), inset 0 -2px 4px rgba(0,0,0,0.2)'
                }}
              />
              <div style={{
                position: 'absolute',
                top: '0',
                left: '0',
                width: '100%',
                height: '2px',
                background: 'linear-gradient(90deg, transparent, #00B7EB, transparent)',
                animation: 'scan 2s infinite'
              }} />
            </div>
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="contact-email" style={{
              display: 'block',
              color: '#D0D0D0',
              fontWeight: 'bold',
              marginBottom: '5px',
              textShadow: '0 0 5px rgba(0,0,255,0.3)'
            }}>
              RETURN_FREQUENCY
            </label>
            <div style={{ position: 'relative' }}>
              <input 
                type="email" 
                id="contact-email" 
                name="email" 
                required 
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'linear-gradient(145deg, #F0F0F0 0%, #E0E0E0 50%, #D0D0D0 100%)',
                  border: '2px solid #808080',
                  borderRadius: '6px',
                  color: '#1A1A1A',
                  fontWeight: 'bold',
                  boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.4), inset 0 -2px 4px rgba(0,0,0,0.2)'
                }}
              />
              <div style={{
                position: 'absolute',
                top: '0',
                left: '0',
                width: '100%',
                height: '2px',
                background: 'linear-gradient(90deg, transparent, #00B7EB, transparent)',
                animation: 'scan 2s infinite'
              }} />
            </div>
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="contact-message" style={{
              display: 'block',
              color: '#D0D0D0',
              fontWeight: 'bold',
              marginBottom: '5px',
              textShadow: '0 0 5px rgba(0,0,255,0.3)'
            }}>
              DATA_PACKET
            </label>
            <div style={{ position: 'relative' }}>
              <textarea 
                id="contact-message" 
                name="message" 
                rows="6" 
                required 
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'linear-gradient(145deg, #F0F0F0 0%, #E0E0E0 50%, #D0D0D0 100%)',
                  border: '2px solid #808080',
                  borderRadius: '6px',
                  color: '#1A1A1A',
                  fontWeight: 'bold',
                  boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.4), inset 0 -2px 4px rgba(0,0,0,0.2)',
                  resize: 'vertical'
                }}
              />
              <div style={{
                position: 'absolute',
                top: '0',
                left: '0',
                width: '100%',
                height: '2px',
                background: 'linear-gradient(90deg, transparent, #00B7EB, transparent)',
                animation: 'scan 2s infinite'
              }} />
            </div>
          </div>
          
          <button 
            type="submit" 
            style={{
              background: 'linear-gradient(145deg, #E8E8E8 0%, #D0D0D0 30%, #C0C0C0 70%, #A8A8A8 100%)',
              border: '2px solid #808080',
              borderRadius: '8px',
              padding: '12px 25px',
              color: '#D0D0D0',
              fontWeight: 'bold',
              fontSize: '1rem',
              textShadow: '0 0 5px rgba(0,0,255,0.3)',
              boxShadow: '0 0 15px rgba(0,0,255,0.2), inset 0 2px 4px rgba(255,255,255,0.4)',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            TRANSMIT
          </button>
        </div>
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginTop: '15px',
          color: '#B0B0B0',
          fontSize: '0.9rem',
          textShadow: '0 0 3px rgba(0,0,255,0.2)'
        }}>
          <div style={{ marginRight: '10px' }}>⟨⟩</div>
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
      background: 'rgba(0,0,0,0.1)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      pointerEvents: 'auto'
    }}>
      <div style={{
        width: '90%',
        maxWidth: '800px',
        maxHeight: '85vh',
        background: 'linear-gradient(145deg, #E8E8E8 0%, #D0D0D0 30%, #C0C0C0 70%, #A8A8A8 100%)',
        border: '4px solid #808080',
        borderRadius: '12px',
        boxShadow: '0 0 50px rgba(0,0,255,0.3), inset 0 3px 8px rgba(255,255,255,0.4), inset 0 -3px 8px rgba(0,0,0,0.2)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>
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
              color: '#D0D0D0',
              fontSize: '1.8rem',
              fontWeight: 'bold',
              letterSpacing: '2px',
              textShadow: '0 0 5px rgba(0,0,255,0.3)'
            }}>
              {currentSectionData.title || section.name?.toUpperCase()}
            </h2>
            {currentSectionData.subtitle && (
              <div style={{
                color: '#B0B0B0',
                fontSize: '1rem',
                fontWeight: '600',
                marginTop: '5px',
                textShadow: '0 0 3px rgba(0,0,255,0.2)'
              }}>
                {currentSectionData.subtitle}
              </div>
            )}
          </div>
          <button onClick={onReset} style={{
            background: 'linear-gradient(145deg, #E0E0E0 0%, #C0C0C0 50%, #A0A0A0 100%)',
            border: '2px solid #808080',
            borderRadius: '6px',
            width: '40px',
            height: '40px',
            color: '#D0D0D0',
            fontSize: '1.2rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.3), inset 0 -2px 4px rgba(0,0,0,0.2)',
            textShadow: '0 0 3px rgba(0,0,255,0.2)',
            transition: 'all 0.3s ease'
          }}>
            ✕
          </button>
        </div>
        
        <div style={{
          flex: 1,
          overflow: 'auto',
          padding: '20px',
          background: 'linear-gradient(145deg, #D0D0D0 0%, #B8B8B8 100%)'
        }}>
          {sectionSpecificContent}
        </div>
        
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
            color: '#B0B0B0',
            fontSize: '0.9rem',
            fontWeight: 'bold',
            textShadow: '0 0 3px rgba(0,0,255,0.2)'
          }}>
            <span>SECTOR: </span>
            <span style={{ color: '#D0D0D0' }}>{section.id?.toUpperCase()}</span>
          </div>
          
          <button onClick={onReset} style={{
            background: 'linear-gradient(145deg, #E8E8E8 0%, #D0D0D0 50%, #B8B8B8 100%)',
            border: '3px solid #808080',
            borderRadius: '8px',
            padding: '12px 25px',
            color: '#D0D0D0',
            fontWeight: 'bold',
            fontSize: '1rem',
            letterSpacing: '1px',
            textShadow: '0 0 5px rgba(0,0,255,0.3)',
            boxShadow: '0 0 15px rgba(0,0,255,0.2), inset 0 2px 4px rgba(255,255,255,0.4)',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}>
            RETURN TO CONTAINER
          </button>
          
          <div style={{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, #00B7EB, #000)',
            boxShadow: '0 0 10px rgba(0,183,235,0.5)'
          }} />
        </div>
      </div>
    </div>
  );
}

export default SectionContent;

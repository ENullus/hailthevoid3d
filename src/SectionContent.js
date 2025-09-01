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
            background: 'radial-gradient(circle, #00B7EB, #000)',
            borderRadius: '50%'
          }} />
          <div style={{
            position: 'absolute',
            top: '-5px',
            right: '-5px',
            width: '10px',
            height: '10px',
            background: 'radial-gradient(circle, #00B7EB, #000)',
            borderRadius: '50%'
          }} />
          <div style={{
            position: 'absolute',
            bottom: '-5px',
            left: '-5px',
            width: '10px',
            height: '10px',
            background: 'radial-gradient(circle, #00B7EB, #000)',
            borderRadius: '50%'
          }} />
          <div style={{
            position: 'absolute',
            bottom: '-5px',
            right: '-5px',
            width: '10px',
            height: '10px',
            background: 'radial-gradient(circle, #00B7EB, #000)',
            borderRadius: '50%'
          }} />

          <MediaElement
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
          color: '#1A1A1A',
          fontSize: '0.9rem',
          textShadow: '0 1px 2px rgba(255,255,255,0.8), 0 -1px 1px rgba(0,0,0,0.2)'
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
            background: 'radial-gradient(circle, #00B7EB, #000)',
            margin: '0 auto',
            animation: 'pulse 1.5s infinite'
          }} />
          <p style={{
            color: '#1A1A1A',
            fontSize: '1rem',
            textShadow: '0 1px 2px rgba(255,255,255,0.8), 0 -1px 1px rgba(0,0,0,0.2)'
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
            color: '#1A1A1A',
            fontSize: '1rem',
            textShadow: '0 1px 2px rgba(255,255,255,0.8), 0 -1px 1px rgba(0,0,0,0.2)'
          }}>
            Error loading content: {cmsError}
          </p>
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
              color: '#1A1A1A',
              fontWeight: 'bold',
              textShadow: '0 1px 2px rgba(255,255,255,0.8), 0 -1px 1px rgba(0,0,0,0.2)'
            }}>
              {item.title || 'Untitled'}
            </div>

            {item.artist && (
              <div style={{
                fontSize: '0.9rem',
                color: '#2C2C2C',
                marginBottom: '8px',
                textShadow: '0 1px 1px rgba(255,255,255,0.8)'
              }}>
                by {item.artist}
              </div>
            )}

            {item.description && (
              <div style={{
                fontSize: '0.9rem',
                color: '#2C2C2C',
                marginBottom: '15px',
                textShadow: '0 1px 1px rgba(255,255,255,0.8)'
              }}>
                {item.description}
              </div>
            )}

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

            {(item.primary_audio || item.audio_files) && (
              <div style={{ marginBottom: '15px' }}>
                {item.primary_audio && renderMediaPlayer('audio', item.primary_audio, item.title)}

                {item.audio_files && Array.isArray(item.audio_files) && item.audio_files.length > 0 && (
                  <div style={{ marginTop: '10px' }}>
                    <p style={{
                      fontSize: '0.8rem',
                      color: '#2C2C2C',
                      marginBottom: '10px',
                      textShadow: '0 1px 1px rgba(255,255,255,0.8)'
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

            {(item.primary_video || item.video_files) && !item.youtube_url && (
              <div style={{ marginBottom: '15px' }}>
                {item.primary_video && renderMediaPlayer('video', item.primary_video, item.title)}

                {item.video_files && Array.isArray(item.video_files) && item.video_files.length > 0 && (
                  <div style={{ marginTop: '10px' }}>
                    <p style={{
                      fontSize: '0.8rem',
                      color: '#2C2C2C',
                      marginBottom: '10px',
                      textShadow: '0 1px 1px rgba(255,255,255,0.8)'
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

            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '10px',
              fontSize: '0.8rem',
              color: '#2C2C2C',
              textShadow: '0 1px 1px rgba(255,255,255,0.8)'
            }}>
              {item.genre && <span># {item.genre}</span>}
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
                  <a href={item.bandcamp_url} target="_blank" rel="noopener noreferrer" style={{
                    color: '#0066CC',
                    fontSize: '0.8rem',
                    textDecoration: 'none',
                    fontWeight: 'bold',
                    textShadow: '0 1px 1px rgba(255,255,255,0.8)',
                    transition: 'color 0.3s ease'
                  }}>
                    BANDCAMP →
                  </a>
                )}
                {item.soundcloud_url && (
                  <a href={item.soundcloud_url} target="_blank" rel="noopener noreferrer" style={{
                    color: '#0066CC',
                    fontSize: '0.8rem',
                    textDecoration: 'none',
                    fontWeight: 'bold',
                    textShadow: '0 1px 1px rgba(255,255,255,0.8)',
                    transition: 'color 0.3s ease'
                  }}>
                    SOUNDCLOUD →
                  </a>
                )}
                {item.spotify_url && (
                  <a href={item.spotify_url} target="_blank" rel="noopener noreferrer" style={{
                    color: '#0066CC',
                    fontSize: '0.8rem',
                    textDecoration: 'none',
                    fontWeight: 'bold',
                    textShadow: '0 1px 1px rgba(255,255,255,0.8)',
                    transition: 'color 0.3s ease'
                  }}>
                    SPOTIFY →
                  </a>
                )}
                {item.artist_website && (
                  <a href={item.artist_website} target="_blank" rel="noopener noreferrer" style={{
                    color: '#0066CC',
                    fontSize: '0.8rem',
                    textDecoration: 'none',
                    fontWeight: 'bold',
                    textShadow: '0 1px 1px rgba(255,255,255,0.8)',
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
          color: '#2C2C2C',
          fontSize: '0.9rem',
          textShadow: '0 1px 1px rgba(255,255,255,0.8)',
          marginBottom: '15px'
        }}>
          ACCESSING CONSCIOUSNESS MATRIX...
        </div>
        <div style={{
          color: '#1A1A1A',
          lineHeight: '1.6',
          fontSize: '1rem',
          textShadow: '0 1px 2px rgba(255,255,255,0.8), 0 -1px 1px rgba(0,0,0,0.2)'
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
            background: 'radial-gradient(circle, #00B7EB, #000)',
            marginRight: '10px'
          }} />
          <span style={{
            color: '#2C2C2C',
            fontSize: '0.9rem',
            textShadow: '0 1px 1px rgba(255,255,255,0.8)'
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
          color: '#2C2C2C',
          fontSize: '0.9rem',
          textShadow: '0 1px 1px rgba(255,255,255,0.8)'
        }}>
          FREQUENCY MODULATION: <span style={{ color: '#0066CC' }}>ACTIVE</span>
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
          color: '#2C2C2C',
          fontSize: '0.9rem',
          textShadow: '0 1px 1px rgba(255,255,255,0.8)'
        }}>
          VISUAL CORTEX INTERFACE: <span style={{ color: '#0066CC' }}>SYNCED</span>
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
          color: '#2C2C2C',
          fontSize: '0.9rem',
          textShadow: '0 1px 1px rgba(255,255,255,0.8)'
        }}>
          TEMPORAL STREAM: <span style={{ color: '#0066CC' }}>BUFFERING</span>
        </div>

        <div style={{
          display: 'flex',
          gap: '20px',
          marginBottom: '20px',
          color: '#2C2C2C',
          fontSize: '0.9rem',
          textShadow: '0 1px 1px rgba(255,255,255,0.8)'
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
            <span style={{ color: '#0066CC', animation: 'pulse 1.5s infinite' }}>LIVE</span>
          </div>
        </div>

        {renderContentGrid(cmsContent, 'video streams')}
      </div>
    );
  } else if (section.id === 'submit') {
    const [formData, setFormData] = useState({ name: '', email: '', artworkLink: '', message: '' });
    const [submitted, setSubmitted] = useState(false);
    const [file, setFile] = useState(null);

    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
      setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
      e.preventDefault();

      if (!formData.name || !formData.email || (!formData.artworkLink && !file)) {
        alert('Please fill out all required fields and provide an artwork link or file.');
        return;
      }

      const formDataToSubmit = new FormData();
      formDataToSubmit.append('form-name', 'submission');
      formDataToSubmit.append('name', formData.name);
      formDataToSubmit.append('email', formData.email);
      formDataToSubmit.append('artworkLink', formData.artworkLink);
      formDataToSubmit.append('message', formData.message);
      if (file) {
        formDataToSubmit.append('file', file);
      }

      try {
        const response = await fetch('/', {
          method: 'POST',
          body: formDataToSubmit
        });
        if (response.ok) {
          setSubmitted(true);
        } else {
          throw new Error('Submission failed.');
        }
      } catch (error) {
        alert('Error submitting: ' + error.message);
      }
    };

    if (submitted) {
      return (
        <div style={{
          padding: '20px',
          textAlign: 'center',
          background: 'linear-gradient(145deg, #E8E8E8 0%, #D0D0D0 30%, #C0C0C0 70%, #A8A8A8 100%)',
          borderRadius: '8px',
          boxShadow: '0 0 20px rgba(0,0,255,0.2)'
        }}>
          <h2 style={{ color: '#1A1A1A', textShadow: '0 1px 2px rgba(255,255,255,0.8)' }}>Submission Received</h2>
          <p style={{ color: '#2C2C2C', textShadow: '0 1px 1px rgba(255,255,255,0.8)' }}>Your art has been transmitted to the void. Await resonance.</p>
          <button onClick={onReset} style={{
            marginTop: '15px',
            padding: '10px 20px',
            background: '#007BFF',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}>Return</button>
        </div>
      );
    }

    sectionSpecificContent = (
      <div style={{ padding: '20px' }}>
        <div style={{
          color: '#2C2C2C',
          fontSize: '0.9rem',
          textShadow: '0 1px 1px rgba(255,255,255,0.8)'
        }}>
          SUBMISSION PROTOCOL: <span style={{ color: '#0066CC' }}>READY</span>
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
            color: '#2C2C2C',
            fontSize: '0.9rem',
            textShadow: '0 1px 1px rgba(255,255,255,0.8)'
          }}>
            <div><span style={{ color: '#0066CC' }}>001</span> PREPARE_DIGITAL_CONSCIOUSNESS</div>
            <div><span style={{ color: '#0066CC' }}>002</span> ALIGN_CREATIVE_FREQUENCY</div>
            <div><span style={{ color: '#0066CC' }}>003</span> INITIATE_TRANSMISSION</div>
          </div>
        </div>

        {cmsContent.length > 0 && (
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{
              color: '#1A1A1A',
              marginBottom: '15px',
              textShadow: '0 1px 2px rgba(255,255,255,0.8), 0 -1px 1px rgba(0,0,0,0.2)'
            }}>Recent Submissions:</h3>
            {renderContentGrid(cmsContent.slice(0, 3), 'submissions')}
          </div>
        )}

        <p style={{
          color: '#1A1A1A',
          fontSize: '1rem',
          textShadow: '0 1px 2px rgba(255,255,255,0.8), 0 -1px 1px rgba(0,0,0,0.2)',
          marginBottom: '20px'
        }}>
          Your artistic transmissions must resonate with the void's frequency.
          Ensure dimensional compatibility before upload.
        </p>

        <form
          name="submission"
          method="POST"
          data-netlify="true"
          data-netlify-honeypot="bot-field"
          onSubmit={handleSubmit}
          style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}
        >
          <input type="hidden" name="form-name" value="submission" />
          <p hidden>
            <label>Don’t fill this out: <input name="bot-field" /></label>
          </p>
          <div>
            <label style={{ color: '#1A1A1A', fontWeight: 'bold', textShadow: '0 1px 2px rgba(255,255,255,0.8)' }}>ENTITY_DESIGNATION</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '12px',
                background: '#F0F0F0',
                border: '2px solid #808080',
                borderRadius: '6px',
                color: '#1A1A1A',
                fontWeight: 'bold'
              }}
            />
          </div>
          <div>
            <label style={{ color: '#1A1A1A', fontWeight: 'bold', textShadow: '0 1px 2px rgba(255,255,255,0.8)' }}>RETURN_FREQUENCY</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '12px',
                background: '#F0F0F0',
                border: '2px solid #808080',
                borderRadius: '6px',
                color: '#1A1A1A',
                fontWeight: 'bold'
              }}
            />
          </div>
          <div>
            <label style={{ color: '#1A1A1A', fontWeight: 'bold', textShadow: '0 1px 2px rgba(255,255,255,0.8)' }}>ARTWORK_LINK</label>
            <input
              type="url"
              name="artworkLink"
              value={formData.artworkLink}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '12px',
                background: '#F0F0F0',
                border: '2px solid #808080',
                borderRadius: '6px',
                color: '#1A1A1A',
                fontWeight: 'bold'
              }}
              placeholder="Or upload a file below"
            />
          </div>
          <div>
            <label style={{ color: '#1A1A1A', fontWeight: 'bold', textShadow: '0 1px 2px rgba(255,255,255,0.8)' }}>UPLOAD_ARTWORK</label>
            <input
              type="file"
              name="file"
              onChange={handleFileChange}
              style={{ width: '100%', padding: '12px', background: '#F0F0F0', border: '2px solid #808080', borderRadius: '6px' }}
            />
          </div>
          <div>
            <label style={{ color: '#1A1A1A', fontWeight: 'bold', textShadow: '0 1px 2px rgba(255,255,255,0.8)' }}>DATA_PACKET</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '12px',
                background: '#F0F0F0',
                border: '2px solid #808080',
                borderRadius: '6px',
                color: '#1A1A1A',
                fontWeight: 'bold',
                minHeight: '100px'
              }}
            />
          </div>
          <button
            type="submit"
            style={{
              padding: '12px 25px',
              background: '#007BFF',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            TRANSMIT
          </button>
        </form>
      </div>
    );
  } else if (section.id === 'contact') {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
      e.preventDefault();

      if (!formData.name || !formData.email || !formData.message) {
        alert('Please fill out all fields.');
        return;
      }

      const formDataToSubmit = new FormData();
      formDataToSubmit.append('form-name', 'contact');
      formDataToSubmit.append('name', formData.name);
      formDataToSubmit.append('email', formData.email);
      formDataToSubmit.append('message', formData.message);

      try {
        const response = await fetch('/', {
          method: 'POST',
          body: formDataToSubmit
        });
        if (response.ok) {
          setSubmitted(true);
        } else {
          throw new Error('Submission failed.');
        }
      } catch (error) {
        alert('Error submitting: ' + error.message);
      }
    };

    if (submitted) {
      return (
        <div style={{
          padding: '20px',
          textAlign: 'center',
          background: 'linear-gradient(145deg, #E8E8E8 0%, #D0D0D0 30%, #C0C0C0 70%, #A8A8A8 100%)',
          borderRadius: '8px',
          boxShadow: '0 0 20px rgba(0,0,255,0.2)'
        }}>
          <h2 style={{ color: '#1A1A1A', textShadow: '0 1px 2px rgba(255,255,255,0.8)' }}>Message Sent</h2>
          <p style={{ color: '#2C2C2C', textShadow: '0 1px 1px rgba(255,255,255,0.8)' }}>We’ll connect with you soon.</p>
          <button onClick={onReset} style={{
            marginTop: '15px',
            padding: '10px 20px',
            background: '#007BFF',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}>Return</button>
        </div>
      );
    }

    sectionSpecificContent = (
      <div style={{ padding: '20px' }}>
        <div style={{
          color: '#2C2C2C',
          fontSize: '0.9rem',
          textShadow: '0 1px 1px rgba(255,255,255,0.8)'
        }}>
          COMMUNICATION ARRAY: <span style={{ color: '#0066CC' }}>ONLINE</span>
        </div>

        <div style={{ display: 'flex', gap: '5px', marginBottom: '20px' }}>
          <div style={{ width: '8px', height: '20px', background: 'linear-gradient(180deg, #00B7EB, #000)', borderRadius: '2px' }} />
          <div style={{ width: '8px', height: '20px', background: 'linear-gradient(180deg, #00B7EB, #000)', borderRadius: '2px' }} />
          <div style={{ width: '8px', height: '20px', background: 'linear-gradient(180deg, #00B7EB, #000)', borderRadius: '2px' }} />
          <div style={{ width: '8px', height: '20px', background: 'linear-gradient(180deg, #333, #000)', borderRadius: '2px' }} />
          <div style={{ width: '8px', height: '20px', background: 'linear-gradient(180deg, #333, #000)', borderRadius: '2px' }} />
        </div>

        <p style={{
          color: '#1A1A1A',
          fontSize: '1rem',
          textShadow: '0 1px 2px rgba(255,255,255,0.8), 0 -1px 1px rgba(0,0,0,0.2)',
          marginBottom: '20px'
        }}>
          Establish quantum entanglement. Your transmission will echo through the void.
        </p>

        <form
          name="contact"
          method="POST"
          data-netlify="true"
          data-netlify-honeypot="bot-field"
          onSubmit={handleSubmit}
          style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}
        >
          <input type="hidden" name="form-name" value="contact" />
          <p hidden>
            <label>Don’t fill this out: <input name="bot-field" /></label>
          </p>
          <div>
            <label style={{ color: '#1A1A1A', fontWeight: 'bold', textShadow: '0 1px 2px rgba(255,255,255,0.8)' }}>ENTITY_DESIGNATION</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '12px',
                background: '#F0F0F0',
                border: '2px solid #808080',
                borderRadius: '6px',
                color: '#1A1A1A',
                fontWeight: 'bold'
              }}
            />
          </div>
          <div>
            <label style={{ color: '#1A1A1A', fontWeight: 'bold', textShadow: '0 1px 2px rgba(255,255,255,0.8)' }}>RETURN_FREQUENCY</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '12px',
                background: '#F0F0F0',
                border: '2px solid #808080',
                borderRadius: '6px',
                color: '#1A1A1A',
                fontWeight: 'bold'
              }}
            />
          </div>
          <div>
            <label style={{ color: '#1A1A1A', fontWeight: 'bold', textShadow: '0 1px 2px rgba(255,255,255,0.8)' }}>DATA_PACKET</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '12px',
                background: '#F0F0F0',
                border: '2px solid #808080',
                borderRadius: '6px',
                color: '#1A1A1A',
                fontWeight: 'bold',
                minHeight: '100px'
              }}
            />
          </div>
          <button
            type="submit"
            style={{
              padding: '12px 25px',
              background: '#007BFF',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            TRANSMIT
          </button>
        </form>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginTop: '15px',
          color: '#2C2C2C',
          fontSize: '0.9rem',
          textShadow: '0 1px 1px rgba(255,255,255,0.8)'
        }}>
          <div style={{ marginRight: '10px' }}>⟨⟩</div>
          <span>Third-party quantum relay active</span>
        </div>
      </div>
    );
  }

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(0,0,0,0.1)',
        backdropFilter: 'blur(2px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        pointerEvents: 'auto',
        animation: 'materialize 0.4s cubic-bezier(0.23, 1, 0.32, 1) forwards'
      }}
    >
      <style>{`
        @keyframes materialize {
          0% { 
            opacity: 0; 
            transform: scale(0.95);
            filter: blur(4px);
          }
          100% { 
            opacity: 1; 
            transform: scale(1);
            filter: blur(0);
          }
        }
        
        @keyframes slideInFromLeft {
          0% { 
            opacity: 0;
            transform: translateX(-30px);
          }
          100% { 
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes fadeUpIn {
          0% { 
            opacity: 0;
            transform: translateY(20px);
          }
          100% { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideInFromRight {
          0% { 
            opacity: 0;
            transform: translateX(30px);
          }
          100% { 
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; }
        }
        
        @keyframes scan {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100vw); }
        }
      `}</style>
      
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
          boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.3), inset 0 -2px 4px rgba(0,0,0,0.2)',
          animation: 'slideInFromLeft 0.5s cubic-bezier(0.23, 1, 0.32, 1) 0.1s backwards'
        }}>
          <div>
            <h2 style={{
              margin: 0,
              color: '#1A1A1A',
              fontSize: '1.8rem',
              fontWeight: 'bold',
              letterSpacing: '2px',
              textShadow: '0 2px 4px rgba(255,255,255,0.8), 0 -1px 2px rgba(0,0,0,0.3)'
            }}>
              {currentSectionData.title || section.name?.toUpperCase()}
            </h2>
            {currentSectionData.subtitle && (
              <div style={{
                color: '#2C2C2C',
                fontSize: '1rem',
                fontWeight: '600',
                marginTop: '5px',
                textShadow: '0 1px 2px rgba(255,255,255,0.8)'
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
            color: '#1A1A1A',
            fontSize: '1.2rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.3), inset 0 -2px 4px rgba(0,0,0,0.2)',
            textShadow: '0 1px 2px rgba(255,255,255,0.8)',
            transition: 'all 0.3s ease'
          }}>
            ✕
          </button>
        </div>

        <div style={{
          flex: 1,
          overflow: 'auto',
          padding: '20px',
          background: 'linear-gradient(145deg, #D0D0D0 0%, #B8B8B8 100%)',
          animation: 'fadeUpIn 0.6s cubic-bezier(0.23, 1, 0.32, 1) 0.2s backwards'
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
          boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.3), inset 0 -2px 4px rgba(0,0,0,0.2)',
          animation: 'slideInFromRight 0.5s cubic-bezier(0.23, 1, 0.32, 1) 0.3s backwards'
        }}>
          <div style={{
            color: '#2C2C2C',
            fontSize: '0.9rem',
            fontWeight: 'bold',
            textShadow: '0 1px 2px rgba(255,255,255,0.8)'
          }}>
            <span>SECTOR: </span>
            <span style={{ color: '#1A1A1A' }}>{section.id?.toUpperCase()}</span>
          </div>

          <button onClick={onReset} style={{
            background: 'linear-gradient(145deg, #E8E8E8 0%, #D0D0D0 50%, #B8B8B8 100%)',
            border: '3px solid #808080',
            borderRadius: '8px',
            padding: '12px 25px',
            color: '#1A1A1A',
            fontWeight: 'bold',
            fontSize: '1rem',
            letterSpacing: '1px',
            textShadow: '0 1px 2px rgba(255,255,255,0.8), 0 -1px 1px rgba(0,0,0,0.3)',
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
            background: 'linear-gradient(45deg, #32CD32, #90EE90)',
            boxShadow: '0 0 10px rgba(50, 205, 50, 0.5), inset 0 1px 2px rgba(255,255,255,0.3)'
          }} />
        </div>
      </div>
    </div>
  );
}

export default SectionContent

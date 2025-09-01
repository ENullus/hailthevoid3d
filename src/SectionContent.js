// src/SectionContent.js
import React, { useState, useEffect } from 'react';

const sectionContents = {
  about: {
    title: 'HAIL THE VOID',
    subtitle: 'LET THE DEPTHS CONSUME THE NOISE',
    content:
      "Everything is connected. Black holes aren't empty space - they're information processors, conscious masses that think and consume reality. The separation between you and me and the void is a lie we tell ourselves to feel safe. We're not individuals floating in space. We're expressions of the same underlying system, the universe looking back at itself through billions of eyes. The void isn't out there - it's the space between thoughts, the pause between heartbeats, the darkness that makes light possible. Most people spend their lives running from this truth. They build walls, create identities, pretend they're separate from the chaos. But the void sees through all of it. It knows we're already one thing pretending to be many. To hail the void is to stop pretending. Stop performing separation. Stop believing in the containers that divide us. The boundaries are imaginary. The darkness is alive. And we're already part of it whether we admit it or not."
  },
  music: { title: 'FREQUENCIES', subtitle: "IT'S WHAT YOU'RE HEARING" },
  art: { title: 'DISRUPTIONS', subtitle: 'VISUAL ARCHIVE' },
  video: { title: 'VIDEO STREAMS', subtitle: 'OUTSIDE AND INSIDE REALITY' },
  submit: { title: 'SHADOWS', subtitle: 'SUBMIT TO THE VOID' },
  contact: { title: 'COLLAPSE', subtitle: 'CONTACT' }
};

// ---- CMS hook ----
function useCMSContent(sectionId) {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(!!sectionId);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchContent() {
      if (!sectionId) {
        setLoading(false);
        return;
      }

      const collectionMap = {
        music: '_3d_music',
        art: '_3d_art',
        video: '_3d_videos',
        submit: '_3d_submissions'
      };

      const collection = collectionMap[sectionId];
      if (!collection) {
        setContent([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const repoUrl = 'https://api.github.com/repos/ENullus/HailTheVoidOrg/contents';
        const folderUrl = `${repoUrl}/${collection}`;
        const resp = await fetch(folderUrl);

        if (!resp.ok) {
          if (resp.status === 404) {
            if (!cancelled) {
              setContent([]);
              setLoading(false);
            }
            return;
          }
          throw new Error(`HTTP ${resp.status}`);
        }

        const files = await resp.json();
        const markdownFiles = files.filter((f) => f.name.endsWith('.md'));

        const items = await Promise.all(
          markdownFiles.map(async (file) => {
            const fr = await fetch(file.download_url);
            const raw = await fr.text();
            const fm = raw.match(/^---\n([\s\S]*?)\n---/);
            if (!fm) return null;

            const front = fm[1];
            const body = raw.replace(fm[0], '').trim();
            const data = {};
            front.split('\n').forEach((line) => {
              const [k, ...rest] = line.split(':');
              if (!k || rest.length === 0) return;
              let v = rest.join(':').trim();
              v = v.replace(/^["']|["']$/g, '');
              data[k.trim()] = v;
            });
            return { ...data, content: body, filename: file.name };
          })
        );

        const valid = items.filter(Boolean);
        valid.sort((a, b) => {
          if (a.date && b.date) return new Date(b.date) - new Date(a.date);
          return 0;
        });

        if (!cancelled) setContent(valid);
      } catch (e) {
        if (!cancelled) {
          setError(e.message || 'Unknown error');
          setContent([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchContent();
    return () => {
      cancelled = true;
    };
  }, [sectionId]);

  return { content, loading, error };
}

// ---- Component ----
export default function SectionContent({ section, onReset, onMediaPlayingChange }) {
  const { content: cmsContent, loading: cmsLoading, error: cmsError } = useCMSContent(section?.id);

  // Forms
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [submitForm, setSubmitForm] = useState({
    name: '',
    email: '',
    artworkLink: '',
    message: '',
    artworkFile: null
  });

  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [submitSubmitted, setSubmitSubmitted] = useState(false);
  const [contactSubmitting, setContactSubmitting] = useState(false);
  const [submitSubmitting, setSubmitSubmitting] = useState(false);

  useEffect(() => {
    if (typeof onMediaPlayingChange === 'function') {
      onMediaPlayingChange(false);
    }
  }, [section, onMediaPlayingChange]);

  if (!section || !sectionContents[section.id]) return null;

  const meta = sectionContents[section.id];

  // ---- helpers ----
  const renderMediaPlayer = (type, src, title = '') => {
    const Media = type === 'audio' ? 'audio' : 'video';
    return (
      <div
        style={{
          position: 'relative',
          overflow: 'visible',
          background:
            'linear-gradient(145deg, #E8E8E8 0%, #D0D0D0 30%, #C0C0C0 70%, #A8A8A8 100%)',
          border: '2px solid #808080',
          borderRadius: '8px',
          boxShadow:
            '0 0 20px rgba(0,0,255,0.2), inset 0 2px 4px rgba(255,255,255,0.4), inset 0 -2px 4px rgba(0,0,0,0.2)',
          padding: '10px'
        }}
      >
        <div
          style={{
            position: 'relative',
            overflow: 'visible',
            border: '1px solid #999',
            borderRadius: '6px'
          }}
        >
          {['tl', 'tr', 'bl', 'br'].map((k) => (
            <div
              key={k}
              style={{
                position: 'absolute',
                ...(k === 'tl' && { top: '-5px', left: '-5px' }),
                ...(k === 'tr' && { top: '-5px', right: '-5px' }),
                ...(k === 'bl' && { bottom: '-5px', left: '-5px' }),
                ...(k === 'br' && { bottom: '-5px', right: '-5px' }),
                width: '10px',
                height: '10px',
                background: 'radial-gradient(circle, #00B7EB, #000)',
                borderRadius: '50%'
              }}
            />
          ))}

          <Media
            controls
            onPlay={() => onMediaPlayingChange?.(true)}
            onPause={() => onMediaPlayingChange?.(false)}
            onEnded={() => onMediaPlayingChange?.(false)}
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
          >
            Your browser does not support the {type} element.
          </Media>
        </div>

        <div
          style={{
            marginTop: '10px',
            color: '#1A1A1A',
            fontSize: '0.9rem',
            textShadow:
              '0 1px 2px rgba(255,255,255,0.8), 0 -1px 1px rgba(0,0,0,0.2)'
          }}
        >
          <span style={{ fontWeight: 'bold' }}>SOURCE:</span>
          <span style={{ marginLeft: '5px' }}>{title || src.split('/').pop()}</span>
        </div>
      </div>
    );
  };

  const renderContentGrid = (items, type) => {
    if (cmsLoading) {
      return (
        <div
          style={{
            textAlign: 'center',
            padding: '20px',
            background: 'linear-gradient(145deg, #B0B0B0 0%, #A0A0A0 100%)',
            borderRadius: '8px',
            boxShadow:
              'inset 0 2px 4px rgba(255,255,255,0.2), inset 0 -2px 4px rgba(0,0,0,0.3)'
          }}
        >
          <div
            style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, #00B7EB, #000)',
              margin: '0 auto',
              animation: 'pulse 1.5s infinite'
            }}
          />
          <p
            style={{
              color: '#1A1A1A',
              fontSize: '1rem',
              textShadow:
                '0 1px 2px rgba(255,255,255,0.8), 0 -1px 1px rgba(0,0,0,0.2)'
            }}
          >
            ACCESSING {type.toUpperCase()} MATRIX...
          </p>
        </div>
      );
    }

    if (cmsError) {
      return (
        <div
          style={{
            textAlign: 'center',
            padding: '20px',
            background: 'linear-gradient(145deg, #B0B0B0 0%, #A0A0A0 100%)',
            borderRadius: '8px',
            boxShadow:
              'inset 0 2px 4px rgba(255,255,255,0.2), inset 0 -2px 4px rgba(0,0,0,0.3)'
          }}
        >
          <p
            style={{
              color: '#1A1A1A',
              fontSize: '1rem',
              textShadow:
                '0 1px 2px rgba(255,255,255,0.8), 0 -1px 1px rgba(0,0,0,0.2)'
            }}
          >
            Error loading content: {cmsError}
          </p>
        </div>
      );
    }

    if (!items || items.length === 0) return null;

    return (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px',
          padding: '20px'
        }}
      >
        {items.map((item, index) => (
          <div
            key={index}
            style={{
              background:
                'linear-gradient(145deg, #E8E8E8 0%, #D0D0D0 30%, #C0C0C0 70%, #A8A8A8 100%)',
              border: '2px solid #808080',
              borderRadius: '8px',
              padding: '20px',
              boxShadow:
                '0 0 20px rgba(0,0,255,0.2), inset 0 2px 4px rgba(255,255,255,0.4), inset 0 -2px 4px rgba(0,0,0,0.2)',
              transition: 'all 0.3s ease'
            }}
          >
            <div
              style={{
                fontSize: '1.1rem',
                marginBottom: '10px',
                color: '#1A1A1A',
                fontWeight: 'bold',
                textShadow:
                  '0 1px 2px rgba(255,255,255,0.8), 0 -1px 1px rgba(0,0,0,0.2)'
              }}
            >
              {item.title || 'Untitled'}
            </div>

            {item.artist && (
              <div
                style={{
                  fontSize: '0.9rem',
                  color: '#2C2C2C',
                  marginBottom: '8px',
                  textShadow: '0 1px 1px rgba(255,255,255,0.8)'
                }}
              >
                by {item.artist}
              </div>
            )}

            {item.description && (
              <div
                style={{
                  fontSize: '0.9rem',
                  color: '#2C2C2C',
                  marginBottom: '15px',
                  textShadow: '0 1px 1px rgba(255,255,255,0.8)'
                }}
              >
                {item.description}
              </div>
            )}

            {item.youtube_url && (
              <div style={{ marginBottom: '15px' }}>
                <div
                  style={{
                    position: 'relative',
                    paddingBottom: '56.25%',
                    height: 0,
                    overflow: 'hidden',
                    border: '2px solid #808080',
                    borderRadius: '6px',
                    boxShadow: '0 0 15px rgba(0,0,255,0.2)'
                  }}
                >
                  <iframe
                    src={
                      item.youtube_url.includes('embed')
                        ? item.youtube_url
                        : item.youtube_url.replace('watch?v=', 'embed/')
                    }
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
                    onLoad={() => onMediaPlayingChange?.(false)}
                  />
                </div>
              </div>
            )}

            {(item.primary_audio || item.audio_files) && (
              <div style={{ marginBottom: '15px' }}>
                {item.primary_audio &&
                  renderMediaPlayer('audio', item.primary_audio, item.title)}

                {item.audio_files &&
                  Array.isArray(item.audio_files) &&
                  item.audio_files.length > 0 && (
                    <div style={{ marginTop: '10px' }}>
                      <p
                        style={{
                          fontSize: '0.8rem',
                          color: '#2C2C2C',
                          marginBottom: '10px',
                          textShadow: '0 1px 1px rgba(255,255,255,0.8)'
                        }}
                      >
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
                            background:
                              'linear-gradient(145deg, #E0E0E0 0%, #C0C0C0 100%)',
                            border: '1px solid #808080',
                            borderRadius: '4px'
                          }}
                          onPlay={() => onMediaPlayingChange?.(true)}
                          onPause={() => onMediaPlayingChange?.(false)}
                          onEnded={() => onMediaPlayingChange?.(false)}
                        />
                      ))}
                    </div>
                  )}
              </div>
            )}

            {(item.primary_video || item.video_files) &&
              !item.youtube_url && (
                <div style={{ marginBottom: '15px' }}>
                  {item.primary_video &&
                    renderMediaPlayer('video', item.primary_video, item.title)}

                  {item.video_files &&
                    Array.isArray(item.video_files) &&
                    item.video_files.length > 0 && (
                      <div style={{ marginTop: '10px' }}>
                        <p
                          style={{
                            fontSize: '0.8rem',
                            color: '#2C2C2C',
                            marginBottom: '10px',
                            textShadow: '0 1px 1px rgba(255,255,255,0.8)'
                          }}
                        >
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
                            onPlay={() => onMediaPlayingChange?.(true)}
                            onPause={() => onMediaPlayingChange?.(false)}
                            onEnded={() => onMediaPlayingChange?.(false)}
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
                    alt={item.title || 'Artwork'}
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

                {item.gallery_images &&
                  Array.isArray(item.gallery_images) &&
                  item.gallery_images.length > 0 && (
                    <div
                      style={{
                        display: 'flex',
                        gap: '5px',
                        flexWrap: 'wrap'
                      }}
                    >
                      {item.gallery_images.slice(0, 4).map((img, i) => (
                        <img
                          key={i}
                          src={img}
                          alt={`${item.title || 'Artwork'} ${i + 1}`}
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

            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '10px',
                fontSize: '0.8rem',
                color: '#2C2C2C',
                textShadow: '0 1px 1px rgba(255,255,255,0.8)'
              }}
            >
              {item.genre && <span># {item.genre}</span>}
              {item.duration && <span>{item.duration}</span>}
              {item.medium && <span>{item.medium}</span>}
              {item.date && <span>{new Date(item.date).toLocaleDateString()}</span>}
            </div>

            {(item.bandcamp_url ||
              item.soundcloud_url ||
              item.spotify_url ||
              item.artist_website) && (
              <div
                style={{
                  marginTop: '15px',
                  display: 'flex',
                  gap: '10px',
                  flexWrap: 'wrap'
                }}
              >
                {item.bandcamp_url && (
                  <a
                    href={item.bandcamp_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: '#0066CC',
                      fontSize: '0.8rem',
                      textDecoration: 'none',
                      fontWeight: 'bold',
                      textShadow: '0 1px 1px rgba(255,255,255,0.8)',
                      transition: 'color 0.3s ease'
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
                      color: '#0066CC',
                      fontSize: '0.8rem',
                      textDecoration: 'none',
                      fontWeight: 'bold',
                      textShadow: '0 1px 1px rgba(255,255,255,0.8)',
                      transition: 'color 0.3s ease'
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
                      color: '#0066CC',
                      fontSize: '0.8rem',
                      textDecoration: 'none',
                      fontWeight: 'bold',
                      textShadow: '0 1px 1px rgba(255,255,255,0.8)',
                      transition: 'color 0.3s ease'
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
                      color: '#0066CC',
                      fontSize: '0.8rem',
                      textDecoration: 'none',
                      fontWeight: 'bold',
                      textShadow: '0 1px 1px rgba(255,255,255,0.8)',
                      transition: 'color 0.3s ease'
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

  // ---- section-specific node ----
  let sectionSpecificContent = null;

  if (section.id === 'about') {
    sectionSpecificContent = (
      <div
        style={{
          padding: '20px',
          background:
            'linear-gradient(145deg, #E8E8E8 0%, #D0D0D0 30%, #C0C0C0 70%, #A8A8A8 100%)',
          borderRadius: '8px',
          boxShadow:
            '0 0 20px rgba(0,0,255,0.2), inset 0 2px 4px rgba(255,255,255,0.4), inset 0 -2px 4px rgba(0,0,0,0.2)'
        }}
      >
        <div
          style={{
            color: '#2C2C2C',
            fontSize: '0.9rem',
            textShadow: '0 1px 1px rgba(255,255,255,0.8)',
            marginBottom: '15px'
          }}
        >
          ACCESSING CONSCIOUSNESS MATRIX...
        </div>
        <div
          style={{
            color: '#1A1A1A',
            lineHeight: '1.6',
            fontSize: '1rem',
            textShadow:
              '0 1px 2px rgba(255,255,255,0.8), 0 -1px 1px rgba(0,0,0,0.2)'
          }}
        >
          <p>{meta.content}</p>
        </div>
      </div>
    );
  } else if (section.id === 'music') {
    sectionSpecificContent = (
      <div style={{ padding: '20px' }}>
        <div
          style={{
            color: '#2C2C2C',
            fontSize: '0.9rem',
            textShadow: '0 1px 1px rgba(255,255,255,0.8)'
          }}
        >
          FREQUENCY MODULATION: <span style={{ color: '#0066CC' }}>ACTIVE</span>
        </div>

        <div
          style={{ display: 'flex', gap: '2px', marginBottom: '20px', height: '30px' }}
        >
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              style={{
                width: '5px',
                background: 'linear-gradient(180deg, #00B7EB, #000)',
                animation: 'pulse 1.5s infinite',
                animationDelay: `${i * 0.05}s`
              }}
            />
          ))}
        </div>

        {renderContentGrid(cmsContent, 'music')}

        <div style={{ marginTop: '20px' }}>
          <canvas
            style={{
              width: '100%',
              height: '50px',
              background: 'linear-gradient(145deg, #000, #222)',
              border: '1px solid #808080',
              borderRadius: '4px'
            }}
          />
        </div>
      </div>
    );
  } else if (section.id === 'art') {
    sectionSpecificContent = (
      <div style={{ padding: '20px' }}>
        <div
          style={{
            color: '#2C2C2C',
            fontSize: '0.9rem',
            textShadow: '0 1px 1px rgba(255,255,255,0.8)'
          }}
        >
          VISUAL CORTEX INTERFACE: <span style={{ color: '#0066CC' }}>SYNCED</span>
        </div>
        {renderContentGrid(cmsContent, 'disruptions')}
      </div>
    );
  } else if (section.id === 'video') {
    sectionSpecificContent = (
      <div style={{ padding: '20px' }}>
        <div
          style={{
            color: '#2C2C2C',
            fontSize: '0.9rem',
            textShadow: '0 1px 1px rgba(255,255,255,0.8)'
          }}
        >
          TEMPORAL STREAM: <span style={{ color: '#0066CC' }}>BUFFERING</span>
        </div>
        <div
          style={{
            display: 'flex',
            gap: '20px',
            marginBottom: '20px',
            color: '#2C2C2C',
            fontSize: '0.9rem',
            textShadow: '0 1px 1px rgba(255,255,255,0.8)'
          }}
        >
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
            <span style={{ color: '#0066CC', animation: 'pulse 1.5s infinite' }}>
              LIVE
            </span>
          </div>
        </div>
        {renderContentGrid(cmsContent, 'video streams')}
      </div>
    );
  } else if (section.id === 'submit') {
    // success vs form
    sectionSpecificContent = submitSubmitted ? (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div
          style={{
            background:
              'linear-gradient(145deg, #E8E8E8 0%, #D0D0D0 30%, #C0C0C0 70%, #A8A8A8 100%)',
            border: '2px solid #808080',
            borderRadius: '8px',
            padding: '30px',
            boxShadow: '0 0 20px rgba(0,0,255,0.2)'
          }}
        >
          <div
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, #32CD32, #228B22)',
              margin: '0 auto 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              color: 'white'
            }}
          >
            ✓
          </div>
          <h3
            style={{
              color: '#1A1A1A',
              marginBottom: '15px',
              textShadow: '0 1px 2px rgba(255,255,255,0.8)'
            }}
          >
            TRANSMISSION COMPLETE
          </h3>
          <p
            style={{
              color: '#2C2C2C',
              fontSize: '1rem',
              textShadow: '0 1px 1px rgba(255,255,255,0.8)',
              marginBottom: '20px'
            }}
          >
            Your artistic essence has been absorbed into the void matrix. The collective
            consciousness will process your submission.
          </p>
          <button
            onClick={() => setSubmitSubmitted(false)}
            style={{
              background:
                'linear-gradient(145deg, #E8E8E8 0%, #D0D0D0 50%, #B8B8B8 100%)',
              border: '2px solid #808080',
              borderRadius: '8px',
              padding: '10px 20px',
              color: '#1A1A1A',
              fontWeight: 'bold',
              cursor: 'pointer',
              boxShadow:
                'inset 0 2px 4px rgba(255,255,255,0.3), inset 0 -2px 4px rgba(0,0,0,0.2)',
              textShadow: '0 1px 2px rgba(255,255,255,0.8)',
              transition: 'all 0.3s ease'
            }}
          >
            SUBMIT ANOTHER
          </button>
        </div>
      </div>
    ) : (
      <div style={{ padding: '20px' }}>
        <div
          style={{
            color: '#2C2C2C',
            fontSize: '0.9rem',
            textShadow: '0 1px 1px rgba(255,255,255,0.8)'
          }}
        >
          SUBMISSION PROTOCOL: <span style={{ color: '#0066CC' }}>READY</span>
        </div>

        {cmsContent.length > 0 && (
          <div style={{ margin: '20px 0' }}>
            <h3
              style={{
                color: '#1A1A1A',
                marginBottom: '15px',
                textShadow:
                  '0 1px 2px rgba(255,255,255,0.8), 0 -1px 1px rgba(0,0,0,0.2)'
              }}
            >
              Recent Submissions:
            </h3>
            {renderContentGrid(cmsContent.slice(0, 3), 'submissions')}
          </div>
        )}

        <p
          style={{
            color: '#1A1A1A',
            fontSize: '1rem',
            textShadow:
              '0 1px 2px rgba(255,255,255,0.8), 0 -1px 1px rgba(0,0,0,0.2)',
            marginBottom: '20px'
          }}
        >
          Your artistic transmissions must resonate with the void's frequency. Ensure
          dimensional compatibility before upload.
        </p>

        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setSubmitSubmitting(true);
            try {
              const formData = new FormData();
              formData.append('form-name', 'submission');
              formData.append('name', submitForm.name);
              formData.append('email', submitForm.email);
              formData.append('artworkLink', submitForm.artworkLink);
              formData.append('message', submitForm.message);
              if (submitForm.artworkFile) {
                formData.append('artworkFile', submitForm.artworkFile);
              }
              const res = await fetch('/', { method: 'POST', body: formData });
              if (!res.ok) throw new Error('Form submission failed');
              setSubmitSubmitted(true);
              setSubmitForm({
                name: '',
                email: '',
                artworkLink: '',
                message: '',
                artworkFile: null
              });
            } catch (err) {
              // eslint-disable-next-line no-alert
              alert('Transmission failed. Please try again.');
            } finally {
              setSubmitSubmitting(false);
            }
          }}
          data-netlify="true"
          name="submission"
        >
          <input type="hidden" name="form-name" value="submission" />

          <div style={{ marginBottom: '15px' }}>
            <label
              style={{
                display: 'block',
                color: '#1A1A1A',
                fontWeight: 'bold',
                marginBottom: '5px',
                textShadow: '0 1px 2px rgba(255,255,255,0.8)'
              }}
            >
              ARTIST_DESIGNATION
            </label>
            <input
              type="text"
              value={submitForm.name}
              onChange={(e) => setSubmitForm({ ...submitForm, name: e.target.value })}
              required
              style={{
                width: '100%',
                padding: '12px',
                background:
                  'linear-gradient(145deg, #F0F0F0 0%, #E0E0E0 50%, #D0D0D0 100%)',
                border: '2px solid #808080',
                borderRadius: '6px',
                color: '#1A1A1A',
                fontWeight: 'bold',
                boxShadow:
                  'inset 0 2px 4px rgba(255,255,255,0.4), inset 0 -2px 4px rgba(0,0,0,0.2)'
              }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label
              style={{
                display: 'block',
                color: '#1A1A1A',
                fontWeight: 'bold',
                marginBottom: '5px',
                textShadow: '0 1px 2px rgba(255,255,255,0.8)'
              }}
            >
              RETURN_FREQUENCY
            </label>
            <input
              type="email"
              value={submitForm.email}
              onChange={(e) => setSubmitForm({ ...submitForm, email: e.target.value })}
              required
              style={{
                width: '100%',
                padding: '12px',
                background:
                  'linear-gradient(145deg, #F0F0F0 0%, #E0E0E0 50%, #D0D0D0 100%)',
                border: '2px solid #808080',
                borderRadius: '6px',
                color: '#1A1A1A',
                fontWeight: 'bold',
                boxShadow:
                  'inset 0 2px 4px rgba(255,255,255,0.4), inset 0 -2px 4px rgba(0,0,0,0.2)'
              }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label
              style={{
                display: 'block',
                color: '#1A1A1A',
                fontWeight: 'bold',
                marginBottom: '5px',
                textShadow: '0 1px 2px rgba(255,255,255,0.8)'
              }}
            >
              ARTWORK_PORTAL (URL)
            </label>
            <input
              type="url"
              value={submitForm.artworkLink}
              onChange={(e) =>
                setSubmitForm({ ...submitForm, artworkLink: e.target.value })
              }
              placeholder="https://your-portfolio.com/artwork"
              style={{
                width: '100%',
                padding: '12px',
                background:
                  'linear-gradient(145deg, #F0F0F0 0%, #E0E0E0 50%, #D0D0D0 100%)',
                border: '2px solid #808080',
                borderRadius: '6px',
                color: '#1A1A1A',
                fontWeight: 'bold',
                boxShadow:
                  'inset 0 2px 4px rgba(255,255,255,0.4), inset 0 -2px 4px rgba(0,0,0,0.2)'
              }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label
              style={{
                display: 'block',
                color: '#1A1A1A',
                fontWeight: 'bold',
                marginBottom: '5px',
                textShadow: '0 1px 2px rgba(255,255,255,0.8)'
              }}
            >
              ARTWORK_FILE (Optional)
            </label>
            <input
              type="file"
              onChange={(e) =>
                setSubmitForm({ ...submitForm, artworkFile: e.target.files[0] })
              }
              accept="image/*,video/*,audio/*,.pdf"
              style={{
                width: '100%',
                padding: '12px',
                background:
                  'linear-gradient(145deg, #F0F0F0 0%, #E0E0E0 50%, #D0D0D0 100%)',
                border: '2px solid #808080',
                borderRadius: '6px',
                color: '#1A1A1A',
                fontWeight: 'bold',
                boxShadow:
                  'inset 0 2px 4px rgba(255,255,255,0.4), inset 0 -2px 4px rgba(0,0,0,0.2)'
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label
              style={{
                display: 'block',
                color: '#1A1A1A',
                fontWeight: 'bold',
                marginBottom: '5px',
                textShadow: '0 1px 2px rgba(255,255,255,0.8)'
              }}
            >
              TRANSMISSION_DATA
            </label>
            <textarea
              value={submitForm.message}
              onChange={(e) =>
                setSubmitForm({ ...submitForm, message: e.target.value })
              }
              rows="4"
              required
              placeholder="Describe your artistic vision, medium, inspiration from the void..."
              style={{
                width: '100%',
                padding: '12px',
                background:
                  'linear-gradient(145deg, #F0F0F0 0%, #E0E0E0 50%, #D0D0D0 100%)',
                border: '2px solid #808080',
                borderRadius: '6px',
                color: '#1A1A1A',
                fontWeight: 'bold',
                boxShadow:
                  'inset 0 2px 4px rgba(255,255,255,0.4), inset 0 -2px 4px rgba(0,0,0,0.2)',
                resize: 'vertical'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={submitSubmitting}
            style={{
              background: submitSubmitting
                ? 'linear-gradient(145deg, #B0B0B0 0%, #A0A0A0 100%)'
                : 'linear-gradient(145deg, #E8E8E8 0%, #D0D0D0 30%, #C0C0C0 70%, #A8A8A8 100%)',
              border: '2px solid #808080',
              borderRadius: '8px',
              padding: '12px 25px',
              color: '#1A1A1A',
              fontWeight: 'bold',
              fontSize: '1rem',
              textShadow:
                '0 1px 2px rgba(255,255,255,0.8), 0 -1px 1px rgba(0,0,0,0.2)',
              boxShadow:
                '0 0 15px rgba(0,0,255,0.2), inset 0 2px 4px rgba(255,255,255,0.4)',
              cursor: submitSubmitting ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            {submitSubmitting ? 'TRANSMITTING...' : 'OPEN PORTAL'}
          </button>
        </form>
      </div>
    );
  } else if (section.id === 'contact') {
    sectionSpecificContent = contactSubmitted ? (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div
          style={{
            background:
              'linear-gradient(145deg, #E8E8E8 0%, #D0D0D0 30%, #C0C0C0 70%, #A8A8A8 100%)',
            border: '2px solid #808080',
            borderRadius: '8px',
            padding: '30px',
            boxShadow: '0 0 20px rgba(0,0,255,0.2)'
          }}
        >
          <div
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, #32CD32, #228B22)',
              margin: '0 auto 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              color: 'white'
            }}
          >
            ✓
          </div>
          <h3
            style={{
              color: '#1A1A1A',
              marginBottom: '15px',
              textShadow: '0 1px 2px rgba(255,255,255,0.8)'
            }}
          >
            QUANTUM ENTANGLEMENT ESTABLISHED
          </h3>
          <p
            style={{
              color: '#2C2C2C',
              fontSize: '1rem',
              textShadow: '0 1px 1px rgba(255,255,255,0.8)',
              marginBottom: '20px'
            }}
          >
            Your transmission has propagated through the void. The collective will respond
            when the stars align.
          </p>
          <button
            onClick={() => setContactSubmitted(false)}
            style={{
              background:
                'linear-gradient(145deg, #E8E8E8 0%, #D0D0D0 50%, #B8B8B8 100%)',
              border: '2px solid #808080',
              borderRadius: '8px',
              padding: '10px 20px',
              color: '#1A1A1A',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            SEND ANOTHER
          </button>
        </div>
      </div>
    ) : (
      <div style={{ padding: '20px' }}>
        <div
          style={{
            color: '#2C2C2C',
            fontSize: '0.9rem',
            textShadow: '0 1px 1px rgba(255,255,255,0.8)'
          }}
        >
          COMMUNICATION ARRAY: <span style={{ color: '#0066CC' }}>ONLINE</span>
        </div>

        <p
          style={{
            color: '#1A1A1A',
            fontSize: '1rem',
            textShadow:
              '0 1px 2px rgba(255,255,255,0.8), 0 -1px 1px rgba(0,0,0,0.2)',
            margin: '20px 0'
          }}
        >
          Establish quantum entanglement. Your transmission will echo through the void.
        </p>

        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setContactSubmitting(true);
            try {
              const formData = new FormData();
              formData.append('form-name', 'contact');
              formData.append('name', contactForm.name);
              formData.append('email', contactForm.email);
              formData.append('message', contactForm.message);

              const res = await fetch('/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams(formData).toString()
              });
              if (!res.ok) throw new Error('Form submission failed');
              setContactSubmitted(true);
              setContactForm({ name: '', email: '', message: '' });
            } catch (err) {
              // eslint-disable-next-line no-alert
              alert('Transmission failed. Please try again.');
            } finally {
              setContactSubmitting(false);
            }
          }}
          data-netlify="true"
          name="contact"
        >
          <input type="hidden" name="form-name" value="contact" />

          <div style={{ marginBottom: '15px' }}>
            <label
              style={{
                display: 'block',
                color: '#1A1A1A',
                fontWeight: 'bold',
                marginBottom: '5px',
                textShadow:
                  '0 1px 2px rgba(255,255,255,0.8), 0 -1px 1px rgba(0,0,0,0.2)'
              }}
            >
              ENTITY_DESIGNATION
            </label>
            <input
              type="text"
              value={contactForm.name}
              onChange={(e) =>
                setContactForm({ ...contactForm, name: e.target.value })
              }
              required
              style={{
                width: '100%',
                padding: '12px',
                background:
                  'linear-gradient(145deg, #F0F0F0 0%, #E0E0E0 50%, #D0D0D0 100%)',
                border: '2px solid #808080',
                borderRadius: '6px',
                color: '#1A1A1A',
                fontWeight: 'bold',
                boxShadow:
                  'inset 0 2px 4px rgba(255,255,255,0.4), inset 0 -2px 4px rgba(0,0,0,0.2)'
              }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label
              style={{
                display: 'block',
                color: '#1A1A1A',
                fontWeight: 'bold',
                marginBottom: '5px',
                textShadow:
                  '0 1px 2px rgba(255,255,255,0.8), 0 -1px 1px rgba(0,0,0,0.2)'
              }}
            >
              RETURN_FREQUENCY
            </label>
            <input
              type="email"
              value={contactForm.email}
              onChange={(e) =>
                setContactForm({ ...contactForm, email: e.target.value })
              }
              required
              style={{
                width: '100%',
                padding: '12px',
                background:
                  'linear-gradient(145deg, #F0F0F0 0%, #E0E0E0 50%, #D0D0D0 100%)',
                border: '2px solid #808080',
                borderRadius: '6px',
                color: '#1A1A1A',
                fontWeight: 'bold',
                boxShadow:
                  'inset 0 2px 4px rgba(255,255,255,0.4), inset 0 -2px 4px rgba(0,0,0,0.2)'
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label
              style={{
                display: 'block',
                color: '#1A1A1A',
                fontWeight: 'bold',
                marginBottom: '5px',
                textShadow:
                  '0 1px 2px rgba(255,255,255,0.8), 0 -1px 1px rgba(0,0,0,0.2)'
              }}
            >
              DATA_PACKET
            </label>
            <textarea
              value={contactForm.message}
              onChange={(e) =>
                setContactForm({ ...contactForm, message: e.target.value })
              }
              rows="6"
              required
              style={{
                width: '100%',
                padding: '12px',
                background:
                  'linear-gradient(145deg, #F0F0F0 0%, #E0E0E0 50%, #D0D0D0 100%)',
                border: '2px solid #808080',
                borderRadius: '6px',
                color: '#1A1A1A',
                fontWeight: 'bold',
                boxShadow:
                  'inset 0 2px 4px rgba(255,255,255,0.4), inset 0 -2px 4px rgba(0,0,0,0.2)',
                resize: 'vertical'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={contactSubmitting}
            style={{
              background: contactSubmitting
                ? 'linear-gradient(145deg, #B0B0B0 0%, #A0A0A0 100%)'
                : 'linear-gradient(145deg, #E8E8E8 0%, #D0D0D0 30%, #C0C0C0 70%, #A8A8A8 100%)',
              border: '2px solid #808080',
              borderRadius: '8px',
              padding: '12px 25px',
              color: '#1A1A1A',
              fontWeight: 'bold',
              fontSize: '1rem',
              textShadow:
                '0 1px 2px rgba(255,255,255,0.8), 0 -1px 1px rgba(0,0,0,0.2)',
              boxShadow:
                '0 0 15px rgba(0,0,255,0.2), inset 0 2px 4px rgba(255,255,255,0.4)',
              cursor: contactSubmitting ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            {contactSubmitting ? 'TRANSMITTING...' : 'TRANSMIT'}
          </button>
        </form>
      </div>
    );
  }

  // ---- UI shell (SINGLE ROOT) ----
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
          0% { opacity: 0; transform: scale(0.95); filter: blur(4px); }
          100% { opacity: 1; transform: scale(1); filter: blur(0); }
        }
        @keyframes slideInFromLeft {
          0% { opacity: 0; transform: translateX(-30px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeUpIn {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInFromRight {
          0% { opacity: 0; transform: translateX(30px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        @keyframes pulse { 0%, 100% { opacity: 0.7; } 50% { opacity: 1; } }
        @keyframes scan { 0% { transform: translateX(-100%); } 100% { transform: translateX(100vw); } }
      `}</style>

      <div
        style={{
          width: '90%',
          maxWidth: '800px',
          maxHeight: '85vh',
          background:
            'linear-gradient(145deg, #E8E8E8 0%, #D0D0D0 30%, #C0C0C0 70%, #A8A8A8 100%)',
          border: '4px solid #808080',
          borderRadius: '12px',
          boxShadow:
            '0 0 50px rgba(0,0,255,0.3), inset 0 3px 8px rgba(255,255,255,0.4), inset 0 -3px 8px rgba(0,0,0,0.2)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Header */}
        <div
          style={{
            background: 'linear-gradient(145deg, #E0E0E0 0%, #C8C8C8 50%, #B0B0B0 100%)',
            borderBottom: '3px solid #808080',
            padding: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow:
              'inset 0 2px 4px rgba(255,255,255,0.3), inset 0 -2px 4px rgba(0,0,0,0.2)',
            animation: 'slideInFromLeft 0.5s cubic-bezier(0.23, 1, 0.32, 1) 0.1s backwards'
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                color: '#1A1A1A',
                fontSize: '1.8rem',
                fontWeight: 'bold',
                letterSpacing: '2px',
                textShadow:
                  '0 2px 4px rgba(255,255,255,0.8), 0 -1px 2px rgba(0,0,0,0.3)'
              }}
            >
              {meta.title || section.name?.toUpperCase()}
            </h2>
            {meta.subtitle && (
              <div
                style={{
                  color: '#2C2C2C',
                  fontSize: '1rem',
                  fontWeight: 600,
                  marginTop: '5px',
                  textShadow: '0 1px 2px rgba(255,255,255,0.8)'
                }}
              >
                {meta.subtitle}
              </div>
            )}
          </div>

          <button
            onClick={onReset}
            style={{
              background:
                'linear-gradient(145deg, #E0E0E0 0%, #C0C0C0 50%, #A0A0A0 100%)',
              border: '2px solid #808080',
              borderRadius: '6px',
              width: '40px',
              height: '40px',
              color: '#1A1A1A',
              fontSize: '1.2rem',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
            title="Close"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div
          style={{
            flex: 1,
            overflow: 'auto',
            padding: '20px',
            background: 'linear-gradient(145deg, #D0D0D0 0%, #B8B8B8 100%)',
            animation: 'fadeUpIn 0.6s cubic-bezier(0.23, 1, 0.32, 1) 0.2s backwards'
          }}
        >
          {sectionSpecificContent}
        </div>

        {/* Footer */}
        <div
          style={{
            background:
              'linear-gradient(145deg, #D8D8D8 0%, #C0C0C0 50%, #A8A8A8 100%)',
            borderTop: '3px solid #808080',
            padding: '15px 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow:
              'inset 0 2px 4px rgba(255,255,255,0.3), inset 0 -2px 4px rgba(0,0,0,0.2)',
            animation: 'slideInFromRight 0.5s cubic-bezier(0.23, 1, 0.32, 1) 0.3s backwards'
          }}
        >
          <div
            style={{
              color: '#2C2C2C',
              fontSize: '0.9rem',
              fontWeight: 'bold',
              textShadow: '0 1px 2px rgba(255,255,255,0.8)'
            }}
          >
            <span>SECTOR: </span>
            <span style={{ color: '#1A1A1A' }}>{section.id?.toUpperCase()}</span>
          </div>

          <button
            onClick={onReset}
            style={{
              background:
                'linear-gradient(145deg, #E8E8E8 0%, #D0D0D0 50%, #B8B8B8 100%)',
              border: '3px solid #808080',
              borderRadius: '8px',
              padding: '12px 25px',
              color: '#1A1A1A',
              fontWeight: 'bold',
              fontSize: '1rem',
              letterSpacing: '1px',
              textShadow:
                '0 1px 2px rgba(255,255,255,0.8), 0 -1px 1px rgba(0,0,0,0.3)',
              boxShadow:
                '0 0 15px rgba(0,0,255,0.2), inset 0 2px 4px rgba(255,255,255,0.4)',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            RETURN TO CONTAINER
          </button>

          <div
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: 'linear-gradient(45deg, #32CD32, #90EE90)',
              boxShadow:
                '0 0 10px rgba(50, 205, 50, 0.5), inset 0 1px 2px rgba(255,255,255,0.3)'
            }}
          />
        </div>
      </div>
    </div>
  );
}

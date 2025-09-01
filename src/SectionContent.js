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
          <span style={{ marginLeft: '5px

import React, { useState, useEffect } from "react";

const sectionContents = {
  about: {
    title: "HAIL THE VOID",
    subtitle: "LET THE DEPTHS CONSUME THE NOISE",
    content:
      "Everything is connected. Black holes aren't empty space - they're information processors, conscious masses that think and consume reality. The separation between you and me and the void is a lie we tell ourselves to feel safe. We're not individuals floating in space. We're expressions of the same underlying system, the universe looking back at itself through billions of eyes. The void isn't out there - it's the space between thoughts, the pause between heartbeats, the darkness that makes light possible. Most people spend their lives running from this truth. They build walls, create identities, pretend they're separate from the chaos. But the void sees through all of it. It knows we're already one thing pretending to be many. To hail the void is to stop pretending. Stop performing separation. Stop believing in the containers that divide us. The boundaries are imaginary. The darkness is alive. And we're already part of it whether we admit it or not."
  },
  music: { title: "FREQUENCIES", subtitle: "IT'S WHAT YOU'RE HEARING" },
  art: { title: "DISRUPTIONS", subtitle: "VISUAL ARCHIVE" },
  video: { title: "VIDEO STREAMS", subtitle: "OUTSIDE AND INSIDE REALITY" },
  submit: { title: "SHADOWS", subtitle: "SUBMIT TO THE VOID" },
  contact: { title: "COLLAPSE", subtitle: "CONTACT" }
};

// -------- CMS Hook (GitHub folder fetch) ----------
function useCMSContent(sectionId) {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(!!sectionId);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!sectionId) {
      setLoading(false);
      return;
    }

    const collectionMap = {
      music: "_3d_music",
      art: "_3d_art",
      video: "_3d_videos",
      submit: "_3d_submissions"
    };

    const collection = collectionMap[sectionId];
    if (!collection) {
      setContent([]);
      setLoading(false);
      return;
    }

    const fetchContent = async () => {
      try {
        setLoading(true);
        const repoUrl =
          "https://api.github.com/repos/ENullus/HailTheVoidOrg/contents";
        const folderUrl = `${repoUrl}/${collection}`;
        const res = await fetch(folderUrl);
        if (!res.ok) {
          if (res.status === 404) {
            setContent([]);
            setLoading(false);
            return;
          }
          throw new Error(`HTTP ${res.status}`);
        }
        const files = await res.json();
        const markdownFiles = files.filter((f) => f.name.endsWith(".md"));

        const parsed = await Promise.all(
          markdownFiles.map(async (f) => {
            const fr = await fetch(f.download_url);
            const txt = await fr.text();
            const fm = txt.match(/^---\n([\s\S]*?)\n---/);
            if (!fm) return null;
            const data = {};
            fm[1].split("\n").forEach((line) => {
              const [k, ...rest] = line.split(":");
              if (!k || rest.length === 0) return;
              let v = rest.join(":").trim();
              v = v.replace(/^["']|["']$/g, "");
              data[k.trim()] = v;
            });
            return { ...data, content: txt.replace(fm[0], "").trim(), filename: f.name };
          })
        );

        const valid = parsed.filter(Boolean);
        valid.sort((a, b) => {
          if (a.date && b.date) return new Date(b.date) - new Date(a.date);
          return 0;
        });
        setContent(valid);
      } catch (err) {
        console.error("CMS fetch error:", err);
        setError(err.message || "Failed to load");
        setContent([]);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [sectionId]);

  return { content, loading, error };
}

// ------------- Component -----------------
function SectionContent({ section, onReset, onMediaPlayingChange }) {
  const { content: cmsContent, loading: cmsLoading, error: cmsError } =
    useCMSContent(section?.id);

  // Forms state
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactSubmitting, setContactSubmitting] = useState(false);

  const [submitForm, setSubmitForm] = useState({
    name: "",
    email: "",
    artworkLink: "",
    message: "",
    artworkFile: null
  });
  const [submitSubmitted, setSubmitSubmitted] = useState(false);
  const [submitSubmitting, setSubmitSubmitting] = useState(false);

  useEffect(() => {
    // pause binaural bed when any section opens; Scene listens to this
    if (typeof onMediaPlayingChange === "function") onMediaPlayingChange(false);
  }, [section, onMediaPlayingChange]);

  if (!section || !sectionContents[section.id]) return null;

  // ---------- utilities ----------
  const renderMediaPlayer = (type, src, title = "") => {
    const Tag = type === "audio" ? "audio" : "video";
    return (
      <div
        style={{
          position: "relative",
          background:
            "linear-gradient(145deg, #E8E8E8 0%, #D0D0D0 30%, #C0C0C0 70%, #A8A8A8 100%)",
          border: "2px solid #808080",
          borderRadius: 8,
          padding: 10,
          boxShadow:
            "0 0 20px rgba(0,0,255,0.2), inset 0 2px 4px rgba(255,255,255,0.4), inset 0 -2px 4px rgba(0,0,0,0.2)"
        }}
      >
        <Tag
          controls
          src={src}
          style={{
            width: "100%",
            maxHeight: type === "video" ? 360 : "auto",
            background: "#000",
            borderRadius: 6
          }}
          onPlay={() => onMediaPlayingChange?.(true)}
          onPause={() => onMediaPlayingChange?.(false)}
          onEnded={() => onMediaPlayingChange?.(false)}
        />
        <div style={{ marginTop: 8, color: "#1A1A1A", fontSize: "0.9rem" }}>
          <b>SOURCE:</b> <span style={{ marginLeft: 6 }}>{title || src}</span>
        </div>
      </div>
    );
  };

  const renderContentGrid = (items, label) => {
    if (cmsLoading)
      return (
        <div
          style={{
            textAlign: "center",
            padding: 20,
            background: "linear-gradient(145deg, #B0B0B0 0%, #A0A0A0 100%)",
            borderRadius: 8
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              background: "radial-gradient(circle, #00B7EB, #000)",
              margin: "0 auto 10px",
              animation: "pulse 1.5s infinite"
            }}
          />
          <div>ACCESSING {label.toUpperCase()} MATRIX...</div>
        </div>
      );

    if (cmsError)
      return (
        <div
          style={{
            textAlign: "center",
            padding: 20,
            background: "linear-gradient(145deg, #B0B0B0 0%, #A0A0A0 100%)",
            borderRadius: 8
          }}
        >
          <div>Error loading content: {cmsError}</div>
        </div>
      );

    if (!items || items.length === 0) return null;

    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: 20,
          padding: 20
        }}
      >
        {items.map((it, i) => (
          <div
            key={i}
            style={{
              background:
                "linear-gradient(145deg, #E8E8E8 0%, #D0D0D0 30%, #C0C0C0 70%, #A8A8A8 100%)",
              border: "2px solid #808080",
              borderRadius: 8,
              padding: 16
            }}
          >
            <div
              style={{ fontWeight: "bold", color: "#1A1A1A", marginBottom: 8 }}
            >
              {it.title || "Untitled"}
            </div>

            {it.artist && (
              <div style={{ color: "#2C2C2C", marginBottom: 8 }}>
                by {it.artist}
              </div>
            )}

            {it.description && (
              <div style={{ color: "#2C2C2C", marginBottom: 12 }}>
                {it.description}
              </div>
            )}

            {it.youtube_url && (
              <div style={{ marginBottom: 12 }}>
                <div
                  style={{
                    position: "relative",
                    paddingBottom: "56.25%",
                    height: 0,
                    overflow: "hidden",
                    border: "2px solid #808080",
                    borderRadius: 6
                  }}
                >
                  <iframe
                    title={it.title || "video"}
                    src={
                      it.youtube_url.includes("embed")
                        ? it.youtube_url
                        : it.youtube_url.replace("watch?v=", "embed/")
                    }
                    style={{
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                      border: "none"
                    }}
                    allowFullScreen
                    onLoad={() => onMediaPlayingChange?.(false)}
                  />
                </div>
              </div>
            )}

            {it.primary_audio && (
              <div style={{ marginBottom: 12 }}>
                {renderMediaPlayer("audio", it.primary_audio, it.title)}
              </div>
            )}

            {it.primary_video && !it.youtube_url && (
              <div style={{ marginBottom: 12 }}>
                {renderMediaPlayer("video", it.primary_video, it.title)}
              </div>
            )}

            {it.primary_image && (
              <img
                src={it.primary_image}
                alt={it.title || "image"}
                style={{
                  width: "100%",
                  maxHeight: 300,
                  objectFit: "cover",
                  borderRadius: 6,
                  border: "2px solid #808080",
                  marginBottom: 10
                }}
              />
            )}

            <div
              style={{
                display: "flex",
                gap: 10,
                flexWrap: "wrap",
                color: "#2C2C2C",
                fontSize: "0.85rem"
              }}
            >
              {it.genre && <span># {it.genre}</span>}
              {it.duration && <span>{it.duration}</span>}
              {it.medium && <span>{it.medium}</span>}
              {it.date && (
                <span>{new Date(it.date).toLocaleDateString()}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  // ---------- handlers ----------
  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setContactSubmitting(true);
    try {
      const formEl = e.currentTarget;
      const fd = new FormData(formEl); // multipart/form-data; Netlify friendly
      const res = await fetch("/", { method: "POST", body: fd });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`HTTP ${res.status}: ${txt.slice(0, 200)}`);
      }
      setContactSubmitted(true);
      setContactForm({ name: "", email: "", message: "" });
    } catch (err) {
      console.error("Contact form error:", err);
      alert("Transmission failed. Please try again.");
    } finally {
      setContactSubmitting(false);
    }
  };

  const handleSubmitSubmit = async (e) => {
    e.preventDefault();
    setSubmitSubmitting(true);
    try {
      const formEl = e.currentTarget;
      const fd = new FormData(formEl); // includes file if present
      const res = await fetch("/", { method: "POST", body: fd });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`HTTP ${res.status}: ${txt.slice(0, 200)}`);
      }
      setSubmitSubmitted(true);
      setSubmitForm({
        name: "",
        email: "",
        artworkLink: "",
        message: "",
        artworkFile: null
      });
    } catch (err) {
      console.error("Submission form error:", err);
      alert("Transmission failed. Please try again.");
    } finally {
      setSubmitSubmitting(false);
    }
  };

  // ---------- section-specific content ----------
  const sdata = sectionContents[section.id];

  let sectionSpecificContent = null;

  if (section.id === "about") {
    sectionSpecificContent = (
      <div
        style={{
          padding: 20,
          background:
            "linear-gradient(145deg, #E8E8E8 0%, #D0D0D0 30%, #C0C0C0 70%, #A8A8A8 100%)",
          borderRadius: 8
        }}
      >
        <div style={{ color: "#2C2C2C", marginBottom: 12 }}>
          ACCESSING CONSCIOUSNESS MATRIX...
        </div>
        <div style={{ color: "#1A1A1A", lineHeight: 1.6 }}>
          <p>{sdata.content}</p>
        </div>
      </div>
    );
  } else if (section.id === "music") {
    sectionSpecificContent = (
      <div style={{ padding: 20 }}>
        <div style={{ color: "#2C2C2C", marginBottom: 12 }}>
          FREQUENCY MODULATION: <span style={{ color: "#0066CC" }}>ACTIVE</span>
        </div>
        {renderContentGrid(cmsContent, "music")}
      </div>
    );
  } else if (section.id === "art") {
    sectionSpecificContent = (
      <div style={{ padding: 20 }}>
        <div style={{ color: "#2C2C2C", marginBottom: 12 }}>
          VISUAL CORTEX INTERFACE:{" "}
          <span style={{ color: "#0066CC" }}>SYNCED</span>
        </div>
        {renderContentGrid(cmsContent, "disruptions")}
      </div>
    );
  } else if (section.id === "video") {
    sectionSpecificContent = (
      <div style={{ padding: 20 }}>
        <div style={{ color: "#2C2C2C", marginBottom: 12 }}>
          TEMPORAL STREAM: <span style={{ color: "#0066CC" }}>BUFFERING</span>
        </div>
        {renderContentGrid(cmsContent, "video streams")}
      </div>
    );
  } else if (section.id === "submit") {
    sectionSpecificContent = submitSubmitted ? (
      <div style={{ padding: 20, textAlign: "center" }}>
        <div
          style={{
            background:
              "linear-gradient(145deg, #E8E8E8 0%, #D0D0D0 30%, #C0C0C0 70%, #A8A8A8 100%)",
            border: "2px solid #808080",
            borderRadius: 8,
            padding: 28
          }}
        >
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: "50%",
              margin: "0 auto 16px",
              background: "radial-gradient(circle, #32CD32, #228B22)",
              color: "#fff",
              display: "grid",
              placeItems: "center",
              fontSize: 24
            }}
          >
            ✓
          </div>
          <h3 style={{ marginBottom: 10, color: "#1A1A1A" }}>
            TRANSMISSION COMPLETE
          </h3>
          <p style={{ color: "#2C2C2C", marginBottom: 16 }}>
            Your artistic essence has been absorbed into the void matrix.
          </p>
          <button
            onClick={() => setSubmitSubmitted(false)}
            style={{
              border: "2px solid #808080",
              borderRadius: 8,
              padding: "10px 16px",
              fontWeight: "bold",
              cursor: "pointer"
            }}
          >
            SUBMIT ANOTHER
          </button>
        </div>
      </div>
    ) : (
      <div style={{ padding: 20 }}>
        <div style={{ color: "#2C2C2C", marginBottom: 12 }}>
          SUBMISSION PROTOCOL: <span style={{ color: "#0066CC" }}>READY</span>
        </div>

        {cmsContent.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <h3 style={{ color: "#1A1A1A" }}>Recent Submissions</h3>
            {renderContentGrid(cmsContent.slice(0, 3), "submissions")}
          </div>
        )}

        <form
          name="submission"
          method="POST"
          data-netlify="true"
          data-netlify-honeypot="bot-field"
          onSubmit={handleSubmitSubmit}
        >
          <input type="hidden" name="form-name" value="submission" />
          <input
            type="text"
            name="bot-field"
            style={{ display: "none" }}
            tabIndex={-1}
            autoComplete="off"
            readOnly
          />

          <div style={{ marginBottom: 12 }}>
            <label>ARTIST_DESIGNATION</label>
            <input
              name="name"
              type="text"
              value={submitForm.name}
              onChange={(e) =>
                setSubmitForm({ ...submitForm, name: e.target.value })
              }
              required
              placeholder="Your name / alias"
              style={{ width: "100%", padding: 12 }}
            />
          </div>

          <div style={{ marginBottom: 12 }}>
            <label>RETURN_FREQUENCY</label>
            <input
              name="email"
              type="email"
              value={submitForm.email}
              onChange={(e) =>
                setSubmitForm({ ...submitForm, email: e.target.value })
              }
              required
              placeholder="you@domain.com"
              style={{ width: "100%", padding: 12 }}
            />
          </div>

          <div style={{ marginBottom: 12 }}>
            <label>ARTWORK_PORTAL (URL)</label>
            <input
              name="artworkLink"
              type="url"
              value={submitForm.artworkLink}
              onChange={(e) =>
                setSubmitForm({ ...submitForm, artworkLink: e.target.value })
              }
              placeholder="https://your-portfolio.com/artwork"
              style={{ width: "100%", padding: 12 }}
            />
          </div>

          <div style={{ marginBottom: 12 }}>
            <label>ARTWORK_FILE (Optional)</label>
            <input
              name="artworkFile"
              type="file"
              onChange={(e) =>
                setSubmitForm({
                  ...submitForm,
                  artworkFile: e.target.files?.[0] || null
                })
              }
              accept="image/*,video/*,audio/*,.pdf"
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label>TRANSMISSION_DATA</label>
            <textarea
              name="message"
              rows={5}
              value={submitForm.message}
              onChange={(e) =>
                setSubmitForm({ ...submitForm, message: e.target.value })
              }
              required
              placeholder="Describe your piece, links ok…"
              style={{ width: "100%", padding: 12 }}
            />
          </div>

          <button type="submit" disabled={submitSubmitting}>
            {submitSubmitting ? "TRANSMITTING..." : "OPEN PORTAL"}
          </button>
        </form>
      </div>
    );
  } else if (section.id === "contact") {
    sectionSpecificContent = contactSubmitted ? (
      <div style={{ padding: 20, textAlign: "center" }}>
        <div
          style={{
            background:
              "linear-gradient(145deg, #E8E8E8 0%, #D0D0D0 30%, #C0C0C0 70%, #A8A8A8 100%)",
            border: "2px solid #808080",
            borderRadius: 8,
            padding: 28
          }}
        >
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: "50%",
              margin: "0 auto 16px",
              background: "radial-gradient(circle, #32CD32, #228B22)",
              color: "#fff",
              display: "grid",
              placeItems: "center",
              fontSize: 24
            }}
          >
            ✓
          </div>
          <h3 style={{ marginBottom: 10, color: "#1A1A1A" }}>
            QUANTUM ENTANGLEMENT ESTABLISHED
          </h3>
          <p style={{ color: "#2C2C2C", marginBottom: 16 }}>
            Your transmission has propagated through the void.
          </p>
          <button
            onClick={() => setContactSubmitted(false)}
            style={{
              border: "2px solid #808080",
              borderRadius: 8,
              padding: "10px 16px",
              fontWeight: "bold",
              cursor: "pointer"
            }}
          >
            SEND ANOTHER
          </button>
        </div>
      </div>
    ) : (
      <div style={{ padding: 20 }}>
        <div style={{ color: "#2C2C2C", marginBottom: 10 }}>
          COMMUNICATION ARRAY: <span style={{ color: "#0066CC" }}>ONLINE</span>
        </div>
        <p style={{ color: "#1A1A1A", marginBottom: 16 }}>
          Establish quantum entanglement. Your transmission will echo through
          the void. <br />
          <small>
            <b>How to fill:</b> ENTITY_DESIGNATION = your name/alias,
            RETURN_FREQUENCY = your email, DATA_PACKET = your message.
          </small>
        </p>

        <form
          name="contact"
          method="POST"
          data-netlify="true"
          data-netlify-honeypot="bot-field"
          onSubmit={handleContactSubmit}
        >
          <input type="hidden" name="form-name" value="contact" />
          <input
            type="text"
            name="bot-field"
            style={{ display: "none" }}
            tabIndex={-1}
            autoComplete="off"
            readOnly
          />

          <div style={{ marginBottom: 12 }}>
            <label>ENTITY_DESIGNATION</label>
            <input
              name="name"
              type="text"
              value={contactForm.name}
              onChange={(e) =>
                setContactForm({ ...contactForm, name: e.target.value })
              }
              required
              placeholder="Your name / alias"
              style={{ width: "100%", padding: 12 }}
              autoComplete="name"
            />
          </div>

          <div style={{ marginBottom: 12 }}>
            <label>RETURN_FREQUENCY</label>
            <input
              name="email"
              type="email"
              value={contactForm.email}
              onChange={(e) =>
                setContactForm({ ...contactForm, email: e.target.value })
              }
              required
              placeholder="you@domain.com"
              style={{ width: "100%", padding: 12 }}
              inputMode="email"
              autoComplete="email"
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label>DATA_PACKET</label>
            <textarea
              name="message"
              rows={6}
              value={contactForm.message}
              onChange={(e) =>
                setContactForm({ ...contactForm, message: e.target.value })
              }
              required
              placeholder="Your message (links OK)"
              style={{ width: "100%", padding: 12 }}
            />
          </div>

          <button type="submit" disabled={contactSubmitting}>
            {contactSubmitting ? "TRANSMITTING..." : "TRANSMIT"}
          </button>
        </form>
      </div>
    );
  }

  // ------------- Render (single root) -------------
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.1)",
        backdropFilter: "blur(2px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        pointerEvents: "auto",
        animation: "materialize 0.4s ease forwards"
      }}
    >
      <style>{`
        @keyframes materialize { from {opacity:0; transform:scale(.98)} to {opacity:1; transform:scale(1)} }
        @keyframes pulse { 0%,100%{opacity:.7} 50%{opacity:1} }
      `}</style>

      <div
        style={{
          width: "90%",
          maxWidth: 820,
          maxHeight: "88vh",
          background:
            "linear-gradient(145deg, #E8E8E8 0%, #D0D0D0 30%, #C0C0C0 70%, #A8A8A8 100%)",
          border: "4px solid #808080",
          borderRadius: 12,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 0 40px rgba(0,0,255,0.25)"
        }}
      >
        {/* Header */}
        <div
          style={{
            background:
              "linear-gradient(145deg, #E0E0E0 0%, #C8C8C8 50%, #B0B0B0 100%)",
            borderBottom: "3px solid #808080",
            padding: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                color: "#1A1A1A",
                letterSpacing: 2,
                fontSize: "1.6rem"
              }}
            >
              {sdata.title || section.name?.toUpperCase()}
            </h2>
            {sdata.subtitle && (
              <div style={{ color: "#2C2C2C" }}>{sdata.subtitle}</div>
            )}
          </div>

          <button
            onClick={onReset}
            title="RETURN TO CONTAINER"
            style={{
              border: "2px solid #808080",
              borderRadius: 8,
              padding: "10px 16px",
              fontWeight: "bold",
              cursor: "pointer"
            }}
          >
            RETURN TO CONTAINER
          </button>
        </div>

        {/* Body */}
        <div
          style={{
            flex: 1,
            overflow: "auto",
            padding: 20,
            background: "linear-gradient(145deg, #D0D0D0, #B8B8B8)"
          }}
        >
          {sectionSpecificContent}
        </div>

        {/* Footer */}
        <div
          style={{
            background:
              "linear-gradient(145deg, #D8D8D8 0%, #C0C0C0 50%, #A8A8A8 100%)",
            borderTop: "3px solid #808080",
            padding: "12px 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}
        >
          <div style={{ color: "#2C2C2C" }}>
            <b>SECTOR:</b> <span>{section.id?.toUpperCase()}</span>
          </div>
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              background: "linear-gradient(45deg, #32CD32, #90EE90)"
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default SectionContent;

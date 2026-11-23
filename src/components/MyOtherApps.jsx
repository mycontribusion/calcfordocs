// components/MyOtherApps.jsx
import React, { useState } from "react";

const APPS = [
  {
    name: "HOsNote",
    tagline: "Patient Tracker",
    url: "https://hosnote.vercel.app/",
    icon: "https://hosnote.vercel.app/icon-192.png",
  },
  {
    name: "Hausa Clerking",
    tagline: "Clinical Hausa",
    url: "https://hausaclerking.vercel.app/",
    icon: "https://hausaclerking.vercel.app/logo192.png",
  },
  {
    name: "Likita-Ba-Boka-Ba",
    tagline: "Health Education",
    url: "https://likita-ba-boka-ba.vercel.app/",
    icon: "https://likita-ba-boka-ba.vercel.app/favicon.ico",
  },
];

const ShareIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="18" cy="18" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="6" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
    <line x1="15.42" y1="6.51" x2="8.59" y2="10.49" />
  </svg>
);

export default function MyOtherApps() {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = window.location.href;
    const title = 'CalcForDocs';
    const text = 'Check out CalcForDocs - Clinical decision support tools';

    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
        return;
      } catch (err) {
        // Fall through to clipboard fallback
      }
    }

    // Fallback: copy to clipboard
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(url);
      } else {
        // Non-secure context (e.g. Android via IP): use execCommand fallback
        const textarea = document.createElement('textarea');
        textarea.value = url;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to share:', err);
      // Last resort: show URL in prompt for manual copy
      window.prompt('Copy this link:', url);
    }
  };

  return (
    <div className="other-apps-bar">
      <button
        className="share-btn-head"
        onClick={handleShare}
        title="Share CalcForDocs"
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '4px 8px',
          borderRadius: '6px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '0.9rem',
          fontWeight: '500',
          marginRight: '12px',
          whiteSpace: 'nowrap',
        }}
      >
        <ShareIcon />
        <span>{copied ? 'Link copied' : 'Share'}</span>
      </button>
      <span className="other-apps-label">Apps:</span>
      <div className="other-apps-list">
        {APPS.map((app) => (
          <a
            key={app.url}
            href={app.url}
            target="_blank"
            rel="noopener noreferrer"
            className="other-app-chip"
            title={app.tagline}
          >
            <img
              src={app.icon}
              alt={`${app.name} logo`}
              className="other-app-icon"
              onError={(e) => { e.target.style.display = "none"; }}
            />
            <span className="other-app-name">{app.name}</span>
          </a>
        ))}
      </div>
    </div>
  );
}

// components/MyOtherApps.jsx
import React from "react";

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
    name: "Likita Ba Boka Ba",
    tagline: "Health Education",
    url: "https://likita-ba-boka-ba.vercel.app/",
    icon: "https://likita-ba-boka-ba.vercel.app/favicon.ico",
  },
];

export default function MyOtherApps() {
  return (
    <div className="other-apps-bar">
      <span className="other-apps-label">My other apps:</span>
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

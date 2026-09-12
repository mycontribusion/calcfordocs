// components/MyOtherApps.jsx
import React from "react";

const APPS = [
  {
    name: "HOsNote",
    tagline: "Patient Tracker",
    url: "https://hosnote.vercel.app/",
    icon: (
      <svg className="other-app-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="24" height="24" rx="6" fill="#0284C7" />
        <path d="M8 7h8M8 11h8M8 15h5" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    name: "Hausa Clerking",
    tagline: "Clinical Hausa",
    url: "https://hausaclerking.vercel.app/",
    icon: (
      <svg className="other-app-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="24" height="24" rx="6" fill="#0D9488" />
        <path d="M7 8h10M7 12h7m-7 4h5" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
        <circle cx="16" cy="15" r="2" fill="#38BDF8" />
      </svg>
    ),
  },
  {
    name: "Likita Ba Boka Ba",
    tagline: "Health Education",
    url: "https://likita-ba-boka-ba.vercel.app/",
    icon: (
      <svg className="other-app-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="24" height="24" rx="6" fill="#16A34A" />
        <path d="M12 7v10M7 12h10" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    ),
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
            {app.icon}
            <span className="other-app-name">{app.name}</span>
          </a>
        ))}
      </div>
    </div>
  );
}

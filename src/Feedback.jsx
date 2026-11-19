import "./components/Dropdowns.css";

const LinkedInIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
    <path fill="#0A66C2" d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const EmailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 193" width="24" height="18" fill="currentColor" aria-hidden="true">
    <path fill="#4285F4" d="M58.182 192.05V93.14L27.507 65.077 0 49.504v125.091c0 9.658 7.825 17.455 17.455 17.455h40.727z"/>
    <path fill="#34A853" d="M197.818 192.05h40.727c9.659 0 17.455-7.826 17.455-17.455V49.505l-31.156 17.837-27.026 25.798v98.91z"/>
    <path fill="#EA4335" d="m58.182 93.14-4.174-38.647 4.174-36.989L128 69.868l69.818-52.364 4.669 34.992-4.669 40.644L128 145.504z"/>
    <path fill="#FBBC04" d="M197.818 17.504V93.14L256 49.504V26.231c0-21.585-24.64-33.89-41.89-20.945l-16.292 12.218z"/>
    <path fill="#C5221F" d="m0 49.504 26.759 20.07L58.182 93.14V17.504L41.89 5.286C24.61-7.66 0 4.646 0 26.23v23.273z"/>
  </svg>
);

const WhatsAppIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
    <path fill="#25D366" d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1.824z"/>
    <path fill="#25D366" d="M12 0C5.373 0 0 5.373 0 12c0 2.125.553 4.198 1.604 6.026L.057 23.68l5.804-1.522A11.94 11.94 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.77 9.77 0 0 1-4.985-1.365l-.358-.213-3.702.971.988-3.608-.233-.371A9.775 9.775 0 0 1 2.182 12C2.182 6.586 6.586 2.182 12 2.182S21.818 6.586 21.818 12 17.414 21.818 12 21.818z"/>
  </svg>
);

export default function FeedbackDropdown() {
  const handleSubmit = () => {
    const mailtoLink = `mailto:ahmadmusamuhd@gmail.com?subject=${encodeURIComponent(
      "CalcForDocs Feedback"
    )}&body=${encodeURIComponent("")}`;
    window.location.href = mailtoLink;
  };

  const handleWhatsApp = () => {
    const text = `CalcForDocs Feedback%0A%0A`;
    window.open(`https://wa.me/2347030061764?text=${text}`, "_blank");
  };

  return (
    <div className="dropdown-container">
      <div style={{ marginTop: 24, textAlign: 'left' }}>
        <h3 style={{ margin: '0 0 6px 0', fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
          Ahmad Musa Muhammad, MD
        </h3>
        <p style={{ margin: '0 0 10px 0', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          About the creator
        </p>
        <p style={{ margin: 0, fontSize: '0.85rem', lineHeight: 1.5, color: 'var(--text-secondary)',  }}>
          He studied Medicine and Surgery at Bayero University Kano (BUK) and completed his housemanship at the Federal Teaching Hospital, Birnin Kebbi.
        </p>
        <p style={{ margin: '8px 0 0 0', fontSize: '0.85rem', lineHeight: 1.5, color: 'var(--text-secondary)',  }}>
          He is the founder of <strong>BlueReyd HealthTech Solutions</strong>, developer of CalcForDocs, HOsNote, HausaClerking, and Likita Ba Boka Ba.
        </p>
        <p style={{ margin: '8px 0 0 0', fontSize: '0.85rem', lineHeight: 1.5, color: 'var(--text-secondary)',  }}>
          CalcForDocs focuses on practical medical calculators and clinical tools using parameters readily accessible, even in resource-limited settings.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '8px' }}>
        <button type="button" className="dropdown-btn" onClick={handleSubmit} style={{ flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'white', border: '1px solid rgba(0,0,0,0.1)' }}>
          <EmailIcon />
        </button>
        <button
          type="button"
          className="dropdown-btn"
          onClick={handleWhatsApp}
          style={{ flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'white', border: '1px solid rgba(0,0,0,0.1)' }}
        >
          <WhatsAppIcon />
        </button>
        <a
          href="https://www.linkedin.com/in/ahmad-m-musa-b93587156/"
          target="_blank"
          rel="noopener noreferrer"
          className="dropdown-btn"
          style={{
            flex: 1,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'white',
            border: '1px solid rgba(0,0,0,0.1)',
            textDecoration: 'none',
            borderRadius: '8px',
            boxSizing: 'border-box'
          }}
        >
          <LinkedInIcon />
        </a>
      </div>
    </div>
  );
}
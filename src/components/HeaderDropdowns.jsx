import { useState, useEffect, useRef } from "react";
import InstallGuide from "./InstallGuide";
import Feedback from "../Feedback";
import HardResetGuide from "./HardResetGuide";
import usePWAInstall from "../hooks/usePWAInstall";

export default function HeaderDropdowns() {
  const { canInstall, promptInstall, isIOS, isAndroid, isDesktop } = usePWAInstall();
  const [activeDropdown, setActiveDropdown] = useState(null); // "install", "feedback", "update" or null
  const dropdownRef = useRef();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = (name) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  return (
    <div style={{ display: "flex", gap: "12px", position: "relative" }} ref={dropdownRef}>
      {/* Install Button */}
      <div style={{ position: "relative" }}>
        <button onClick={() => toggleDropdown("install")}>Install App</button>
        {activeDropdown === "install" && (
          <div className="dropdown">
            <InstallGuide
              canInstall={canInstall}
              isIOS={isIOS}
              isAndroid={isAndroid}
              isDesktop={isDesktop}
              onInstall={promptInstall}
            />
            <button
              className="dropdown-close"
              onClick={() => setActiveDropdown(null)}
            >
              ✖ Close
            </button>
          </div>
        )}
      </div>

      {/* Feedback Button */}
      <div style={{ position: "relative" }}>
        <button onClick={() => toggleDropdown("feedback")}>Contact / Feedback</button>
        {activeDropdown === "feedback" && (
          <div className="dropdown">
            <Feedback />
            <button
              className="dropdown-close"
              onClick={() => setActiveDropdown(null)}
            >
              ✖ Close
            </button>
          </div>
        )}
      </div>

      {/* Update Button */}
      <div style={{ position: "relative" }}>
        <button onClick={() => toggleDropdown("update")}>System Update</button>
        {activeDropdown === "update" && (
          <div className="dropdown">
            <HardResetGuide />
            <button
              className="dropdown-close"
              onClick={() => setActiveDropdown(null)}
            >
              ✖ Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
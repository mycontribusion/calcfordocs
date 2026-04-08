import React, { useEffect, useState, useRef } from 'react';

export default function CopyResultWrapper({ children }) {
    const containerRef = useRef(null);
    const [hasResult, setHasResult] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (!containerRef.current) return;

        const checkResult = () => {
            const resultEls = containerRef.current.querySelectorAll('.calc-result, .calc-result-container');
            // Only show copy if we have an element and its display is not none/hidden
            const isVisible = Array.from(resultEls).some(el => el.innerText.trim().length > 0);
            setHasResult(isVisible);
        };

        // Initial check (in case result shows up immediately)
        // Small timeout ensures children have rendered in DOM
        setTimeout(checkResult, 0);

        // Watch for DOM changes (when calculator outputs result)
        const observer = new MutationObserver(checkResult);
        observer.observe(containerRef.current, { childList: true, subtree: true, characterData: true });

        return () => observer.disconnect();
    }, []);

    const handleCopy = () => {
        if (!containerRef.current) return;
        // Only select .calc-result to avoid duplicate texts from wrappers
        const resultEls = containerRef.current.querySelectorAll('.calc-result');

        if (resultEls.length > 0) {
            const hiddenNodes = [];
            const isNoteMatch = (text) => /formula|classification|reference|note:|disclaimer/i.test(text);

            // Hide unwanted elements to exclude them from innerText
            resultEls.forEach(resultEl => {
                // 1. Hide known utility classes often used for notes
                const subElements = resultEl.querySelectorAll('.text-sm, .text-gray-600, .calc-result-sub, ul, small, .disclaimer, .calc-formula-box');
                subElements.forEach(el => {
                    if (el.style.display !== 'none') {
                        hiddenNodes.push({ el, origDisplay: el.style.display });
                        el.style.display = 'none';
                    }
                });

                // 2. Hide any direct children that contain heuristic words
                Array.from(resultEl.children).forEach(child => {
                    const text = child.textContent;
                    if (child.style.display !== 'none' && isNoteMatch(text)) {
                        hiddenNodes.push({ el: child, origDisplay: child.style.display });
                        child.style.display = 'none';
                    }
                });
            });

            // Extract main result text
            const textToCopy = Array.from(resultEls)
                .map(el => el.innerText.trim())
                .filter(text => text.length > 0)
                .join('\n\n');

            // Restore hidden nodes
            hiddenNodes.forEach(({ el, origDisplay }) => {
                el.style.display = origDisplay;
            });

            if (textToCopy) {
                navigator.clipboard.writeText(textToCopy).then(() => {
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                }).catch(err => {
                    console.error("Failed to copy text: ", err);
                });
            }
        }
    };

    return (
        <div ref={containerRef} className="copy-wrapper">
            {children}
            {hasResult && (
                <div className="copy-btn-container">
                    <button
                        className={`copy-result-btn ${copied ? 'copied' : ''}`}
                        onClick={handleCopy}
                        title="Copy Result to Clipboard"
                    >
                        {copied ? (
                            <><span className="copy-icon">✓</span> Copied!</>
                        ) : (
                            <><span className="copy-icon">📋</span> Copy Result</>
                        )}
                    </button>
                </div>
            )}
        </div>
    );
}

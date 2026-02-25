import React from 'react';
import './CalculatorShared.css';

const SyncSuggestion = ({ field, suggestion, onSync }) => {
    if (!suggestion) return null;

    return (
        <div
            className="sync-suggestion"
            onClick={() => onSync(field)}
            title="Tap to use value from your session"
        >
            <span className="sync-suggestion-icon">📎</span>
            Use: {suggestion}
        </div>
    );
};

export default SyncSuggestion;

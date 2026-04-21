import React from 'react';
import './CalculatorShared.css';

const ComingSoon = ({ name }) => {
    return (
        <div className="calc-container" style={{ padding: '24px 16px', textAlign: 'center' }}>
            <h3 className="calc-title">{name}</h3>
            <div className="calc-result" style={{ margin: '16px 0', padding: '24px', borderRadius: '12px', borderStyle: 'dashed', backgroundColor: 'rgba(0, 123, 255, 0.03)' }}>
                <div style={{ fontSize: '2rem', marginBottom: '12px' }}>🚀</div>
                <h4 style={{ margin: '0 0 8px 0', color: 'var(--primary-color, #015c9c)' }}>Coming Soon</h4>
                <p style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: '1.5', margin: 0 }}>
                    We are currently building this tool to ensure it meets our clinical safety standards.
                    Stay tuned for updates!
                </p>
            </div>
        </div>
    );
};

export default ComingSoon;

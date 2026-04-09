import React from 'react';

/**
 * Catches ChunkLoadErrors (which happen when a new version is deployed 
 * and the browser tries to fetch an old javascript chunk that was deleted from the server)
 * and forces a seamless reload to fetch the new index.html and fresh chunks.
 */
export default class ChunkErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // If it's a chunk load error or dynamic import failure
        const isChunkLoadError = error?.name === 'ChunkLoadError' ||
            (error?.message && error.message.includes('Loading chunk'));

        if (isChunkLoadError) {
            // Set a session storage flag so we don't infinitely reload
            const hasReloaded = sessionStorage.getItem('chunk_reload_attempted');
            if (!hasReloaded) {
                sessionStorage.setItem('chunk_reload_attempted', 'true');
                window.location.reload(true);
            }
        }
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{ padding: '20px', textAlign: 'center', color: '#64748b' }}>
                    <h4>Updating Calculator...</h4>
                    <p>Please wait a moment while we fetch the latest version.</p>
                    <button
                        onClick={() => window.location.reload(true)}
                        style={{ padding: '8px 16px', background: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', marginTop: '10px' }}
                    >
                        Refresh manually
                    </button>
                </div>
            );
        }
        return this.props.children;
    }
}

import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';

const FavoritesContext = createContext();

const FAVORITES_STORAGE_KEY = 'calcfordocs_favorites';

export const useFavorites = () => useContext(FavoritesContext);

export const FavoritesProvider = ({ children }) => {
    const [favorites, setFavorites] = useState(() => {
        // Load from localStorage on initial render
        try {
            const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch (e) {
            console.error('Failed to load favorites from localStorage:', e);
            return [];
        }
    });

    // Persist to localStorage whenever favorites change
    useEffect(() => {
        try {
            localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
        } catch (e) {
            console.error('Failed to save favorites to localStorage:', e);
        }
    }, [favorites]);

    const addFavorite = useCallback((id) => {
        setFavorites(prev => {
            if (prev.includes(id)) return prev;
            return [...prev, id];
        });
    }, []);

    const removeFavorite = useCallback((id) => {
        setFavorites(prev => prev.filter(favId => favId !== id));
    }, []);

    const isFavorite = useCallback((id) => {
        return favorites.includes(id);
    }, [favorites]);

    const toggleFavorite = useCallback((id) => {
        setFavorites(prev => {
            if (prev.includes(id)) {
                return prev.filter(favId => favId !== id);
            }
            return [...prev, id];
        });
    }, []);

    const value = React.useMemo(() => ({
        favorites,
        addFavorite,
        removeFavorite,
        isFavorite,
        toggleFavorite
    }), [favorites, addFavorite, removeFavorite, isFavorite, toggleFavorite]);

    return (
        <FavoritesContext.Provider value={value}>
            {children}
        </FavoritesContext.Provider>
    );
};
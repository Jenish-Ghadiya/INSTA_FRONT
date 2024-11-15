import React, { useEffect, useState } from 'react';
import { FiSun, FiMoon } from 'react-icons/fi';
import './ThemeToggle.scss';

const ThemeToggle = () => {
    const [theme, setTheme] = useState(() => {
        // Check local storage first
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) return savedTheme;
        
        // If no saved theme, check system preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    });

    useEffect(() => {
        // Listen for system theme changes
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = (e) => {
            const newTheme = e.matches ? 'dark' : 'light';
            setTheme(newTheme);
        };

        mediaQuery.addEventListener('change', handleChange);
        
        // Update document theme
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);

        return () => mediaQuery.removeEventListener('change', handleChange);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    return (
        <button 
            className="theme-toggle" 
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
        >
            {theme === 'light' ? <FiMoon /> : <FiSun />}
        </button>
    );
};

export default ThemeToggle; 
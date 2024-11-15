import React, { useEffect } from 'react'
import './App.scss'
import { RouterProvider } from 'react-router-dom'
import router from './routes'
import './styles/index.scss';
import { Toaster } from 'react-hot-toast';
import ThemeToggle from './common/theme/ThemeToggle';

function App() {
  useEffect(() => {
    // Update meta theme-color based on current theme
    const updateMetaThemeColor = () => {
      const theme = document.documentElement.getAttribute('data-theme');
      const color = theme === 'dark' ? '#1a1a1a' : '#ffffff';
      document.querySelector('meta[name="theme-color"]').setAttribute('content', color);
    };

    // Initial update
    updateMetaThemeColor();

    // Listen for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'data-theme') {
          updateMetaThemeColor();
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    });

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <RouterProvider router={router} />
      <ThemeToggle />
      <Toaster 
        toastOptions={{
          style: {
            background: 'var(--card-background)',
            color: 'var(--text-primary)',
          },
        }}
      />
    </>
  )
}

export default App

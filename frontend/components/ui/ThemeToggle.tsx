'use client';

import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

const STORAGE_KEY = 'rutasingluten-theme';
const THEME_EVENT = 'rutasingluten-theme-change';

function getPreferredTheme(): Theme {
  if (typeof window === 'undefined') {
    return 'light';
  }

  const storedTheme = window.localStorage.getItem(STORAGE_KEY);

  if (storedTheme === 'light' || storedTheme === 'dark') {
    return storedTheme;
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    const nextTheme = getPreferredTheme();
    applyTheme(nextTheme);
    const syncTimer = window.setTimeout(() => {
      setTheme(nextTheme);
    }, 0);

    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      const storedTheme = window.localStorage.getItem(STORAGE_KEY);

      if (storedTheme === 'light' || storedTheme === 'dark') {
        return;
      }

      const responsiveTheme = media.matches ? 'dark' : 'light';
      setTheme(responsiveTheme);
      applyTheme(responsiveTheme);
    };

    const handleThemeSync = (event: Event) => {
      const customEvent = event as CustomEvent<Theme>;

      if (customEvent.detail === 'light' || customEvent.detail === 'dark') {
        setTheme(customEvent.detail);
        applyTheme(customEvent.detail);
      }
    };

    media.addEventListener('change', handleChange);
    window.addEventListener(THEME_EVENT, handleThemeSync as EventListener);

    return () => {
      window.clearTimeout(syncTimer);
      media.removeEventListener('change', handleChange);
      window.removeEventListener(THEME_EVENT, handleThemeSync as EventListener);
    };
  }, []);

  function toggleTheme() {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    window.localStorage.setItem(STORAGE_KEY, nextTheme);
    applyTheme(nextTheme);
    setTheme(nextTheme);

    window.setTimeout(() => {
      window.dispatchEvent(new CustomEvent<Theme>(THEME_EVENT, { detail: nextTheme }));
    }, 0);
  }

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={theme === 'light' ? 'Activar modo oscuro' : 'Activar modo claro'}
      aria-pressed={theme === 'dark'}
      title={theme === 'light' ? 'Activar modo oscuro' : 'Activar modo claro'}
    >
      <span className="theme-toggle__thumb" aria-hidden="true">
        {theme === 'light' ? (
          <svg viewBox="0 0 24 24" focusable="false">
            <circle cx="12" cy="12" r="4.2" />
            <path d="M12 1.8v3.1M12 19.1v3.1M22.2 12h-3.1M4.9 12H1.8M19.2 4.8l-2.2 2.2M7 17l-2.2 2.2M19.2 19.2L17 17M7 7L4.8 4.8" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" focusable="false">
            <path d="M18.5 14.6A8 8 0 0 1 9.4 5.5a8.9 8.9 0 1 0 9.1 9.1z" />
          </svg>
        )}
      </span>
    </button>
  );
}

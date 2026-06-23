'use client';

import { useEffect, useRef, useState } from 'react';
import { ThemeToggle } from './ThemeToggle';
import { UserAccountMenu } from './UserAccountMenu';

export function MobileAccountMenu() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent | TouchEvent) {
      if (!containerRef.current) {
        return;
      }

      const target = event.target;

      if (target instanceof Node && !containerRef.current.contains(target)) {
        setOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  return (
    <div className={`mobile-account ${open ? 'is-open' : ''}`} ref={containerRef}>
      <button
        type="button"
        className="mobile-account__trigger"
        aria-label="Abrir menu de usuario"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
          <path d="M12 12.2a4.1 4.1 0 1 0-4.1-4.1 4.1 4.1 0 0 0 4.1 4.1Z" />
          <path d="M4.8 19.4a7.7 7.7 0 0 1 14.4 0" />
          <circle cx="12" cy="12" r="9" />
        </svg>
      </button>

      {open ? (
        <div className="mobile-account__panel">
          <div className="mobile-account__theme">
            <span>Tema</span>
            <ThemeToggle />
          </div>
          <UserAccountMenu mobile />
        </div>
      ) : null}
    </div>
  );
}

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie } from 'lucide-react';

const KEY = 'ember_cookie_consent';

export function CookieBanner() {
  const [visible, setVisible] = useState(() => !localStorage.getItem(KEY));

  const accept = () => {
    localStorage.setItem(KEY, 'accepted');
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem(KEY, 'declined');
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 380, damping: 32 }}
          style={{
            position: 'fixed', bottom: '24px', left: '50%', transform: 'translateX(-50%)',
            zIndex: 9998, width: 'calc(100% - 48px)', maxWidth: '640px',
            background: '#111', border: '1px solid rgba(255,255,255,0.10)',
            borderRadius: '16px', padding: '20px 24px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
            display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap',
          }}
        >
          <Cookie size={20} style={{ color: 'var(--maroon)', flexShrink: 0 }} />
          <p style={{ color: '#A0A0A0', fontSize: '14px', lineHeight: '1.6', flex: 1, minWidth: '200px' }}>
            Ember uses cookies to keep you signed in and improve your experience.
            See our{' '}
            <a href="/privacy" style={{ color: 'var(--beige)', textDecoration: 'none' }}>Privacy Policy</a>.
          </p>
          <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
            <button
              onClick={decline}
              style={{
                background: 'transparent', color: '#666',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px', padding: '9px 16px',
                cursor: 'pointer', fontSize: '13px', fontFamily: 'inherit',
                transition: 'color 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = '#A0A0A0')}
              onMouseLeave={e => (e.currentTarget.style.color = '#666')}
            >Decline</button>
            <button
              onClick={accept}
              style={{
                background: 'var(--maroon)', color: '#fff',
                border: 'none', borderRadius: '8px', padding: '9px 20px',
                cursor: 'pointer', fontSize: '13px', fontFamily: 'inherit',
                fontWeight: 600, transition: 'background 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--maroon-light)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'var(--maroon)')}
            >Accept</button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

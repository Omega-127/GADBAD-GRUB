import React from 'react';

export function Loader({ message = 'Revving Engines & Calibrating GPS...', size = 'md' }) {
  const spinnerSize = size === 'sm' ? 24 : size === 'lg' ? 64 : 42;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 16px',
        gap: '16px',
      }}
    >
      <div
        style={{
          position: 'relative',
          width: spinnerSize,
          height: spinnerSize,
        }}
      >
        {/* Outer glowing ring */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            border: '3px solid rgba(0, 240, 255, 0.15)',
            borderTopColor: 'var(--neon-cyan)',
            borderRightColor: 'var(--neon-crimson)',
            animation: 'spin 0.9s cubic-bezier(0.5, 0, 0.5, 1) infinite',
            boxShadow: '0 0 15px rgba(0, 240, 255, 0.3)',
          }}
        />
        {/* Inner speedometer needle icon */}
        <div
          style={{
            position: 'absolute',
            inset: 6,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: size === 'sm' ? '12px' : '20px',
          }}
        >
          🏎️
        </div>
      </div>

      {message && (
        <span
          style={{
            fontFamily: 'var(--font-racing)',
            fontSize: size === 'sm' ? '0.85rem' : '1rem',
            color: 'var(--text-secondary)',
            letterSpacing: '1px',
            textTransform: 'uppercase',
            textAlign: 'center',
          }}
        >
          {message}
        </span>
      )}

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default Loader;

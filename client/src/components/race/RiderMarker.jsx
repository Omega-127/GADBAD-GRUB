import React from 'react';

export function RiderMarker({ racer, isPrimary = false, nitroActive = false }) {
  const color = racer.color || '#00F0FF';

  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        transform: 'translate(-50%, -50%)',
        transition: 'all 0.5s cubic-bezier(0.25, 1, 0.5, 1)',
        zIndex: isPrimary ? 10 : 5,
      }}
    >
      {/* Racer Rank / Speed Bubble */}
      <div
        style={{
          background: 'rgba(10, 14, 23, 0.92)',
          border: `1px solid ${color}`,
          borderRadius: 'var(--radius-full)',
          padding: '2px 8px',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          boxShadow: `0 0 10px ${color}`,
          whiteSpace: 'nowrap',
          marginBottom: '4px',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-telemetry)',
            fontSize: '0.68rem',
            fontWeight: 800,
            color: '#FFFFFF',
          }}
        >
          #{racer.rank || 1}
        </span>
        <span
          style={{
            fontFamily: 'var(--font-racing)',
            fontSize: '0.72rem',
            fontWeight: 700,
            color,
          }}
        >
          {racer.name}
        </span>
        <span
          style={{
            fontFamily: 'var(--font-telemetry)',
            fontSize: '0.65rem',
            color: 'var(--neon-gold)',
          }}
        >
          {racer.speed || 55} km/h
        </span>
      </div>

      {/* Vehicle / Rider Avatar Circle */}
      <div
        style={{
          position: 'relative',
          width: isPrimary ? '44px' : '36px',
          height: isPrimary ? '44px' : '36px',
          borderRadius: '50%',
          background: 'rgba(15, 23, 42, 0.95)',
          border: `2px solid ${color}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: isPrimary ? '20px' : '16px',
          boxShadow: isPrimary
            ? `0 0 16px ${color}, 0 0 25px ${color}`
            : `0 0 8px ${color}`,
        }}
      >
        {racer.avatar || '🏍️'}

        {/* Nitro Flame Effect */}
        {(nitroActive || racer.speed > 60) && (
          <div
            style={{
              position: 'absolute',
              bottom: '-8px',
              left: '50%',
              transform: 'translateX(-50%)',
              fontSize: '14px',
              animation: 'nitroFlame 0.3s infinite alternate',
            }}
          >
            🔥
          </div>
        )}
      </div>

      {/* Position Pin Pointer */}
      <div
        style={{
          width: 0,
          height: 0,
          borderLeft: '5px solid transparent',
          borderRight: '5px solid transparent',
          borderTop: `6px solid ${color}`,
          marginTop: '-1px',
        }}
      />
    </div>
  );
}

export default RiderMarker;

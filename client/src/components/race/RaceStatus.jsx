import React from 'react';
import { Flag, Wifi, WifiOff, MapPin, Gauge } from 'lucide-react';

export function RaceStatus({ race, connected = false }) {
  if (!race) return null;

  const isRacing = race.status === 'racing';
  const isFinished = race.status === 'finished' || race.progress >= 100;

  return (
    <div
      className="glass-card"
      style={{
        padding: '20px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        borderLeft: `4px solid ${isFinished ? 'var(--neon-green)' : 'var(--neon-cyan)'}`,
      }}
    >
      {/* Primary Racer Info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: isFinished ? 'rgba(0, 230, 118, 0.15)' : 'rgba(0, 240, 255, 0.15)',
            border: `1px solid ${isFinished ? 'var(--neon-green)' : 'var(--neon-cyan)'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
          }}
        >
          {isFinished ? '🏆' : '🏎️'}
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h3 style={{ fontSize: '1.2rem', color: '#FFFFFF' }}>{race.racerName || 'Pizza Panther'}</h3>
            <span
              style={{
                fontFamily: 'var(--font-telemetry)',
                fontSize: '0.72rem',
                fontWeight: 700,
                color: isFinished ? 'var(--neon-green)' : 'var(--neon-cyan)',
                background: isFinished ? 'rgba(0, 230, 118, 0.1)' : 'rgba(0, 240, 255, 0.1)',
                padding: '2px 8px',
                borderRadius: 'var(--radius-full)',
                border: `1px solid ${isFinished ? 'var(--neon-green)' : 'var(--neon-cyan)'}`,
              }}
            >
              {isFinished ? 'DELIVERED & VICTORY' : 'ACTIVE IN RACE'}
            </span>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Order ID: <span style={{ fontFamily: 'var(--font-telemetry)', color: '#fff' }}>{race.orderId || 'ORD-9821'}</span>
          </p>
        </div>
      </div>

      {/* Telemetry Status Pills */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {/* Connection status */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(255, 255, 255, 0.04)',
            padding: '6px 12px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.75rem',
            fontFamily: 'var(--font-telemetry)',
            color: connected ? 'var(--neon-green)' : 'var(--neon-gold)',
          }}
        >
          {connected ? <Wifi size={14} /> : <WifiOff size={14} />}
          <span>{connected ? 'SOCKET LINKED' : 'SIMULATOR ACTIVE'}</span>
        </div>

        {/* Distance Left */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(255, 255, 255, 0.04)',
            padding: '6px 12px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.75rem',
            fontFamily: 'var(--font-telemetry)',
            color: 'var(--neon-cyan)',
          }}
        >
          <MapPin size={14} />
          <span>{isFinished ? '0.0 KM (ARRIVED)' : `${((100 - (race.progress || 0)) * 0.032).toFixed(1)} KM REMAINING`}</span>
        </div>
      </div>
    </div>
  );
}

export default RaceStatus;

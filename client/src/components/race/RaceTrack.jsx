import React from 'react';
import { Flag, CheckCircle, Flame, Navigation } from 'lucide-react';
import RiderMarker from './RiderMarker';

export function RaceTrack({ racers = [], primaryRacerId, nitroActive = false }) {
  const checkpoints = [
    { percent: 0, label: 'Kitchen Gate', icon: '🏪' },
    { percent: 25, label: 'Avenue Curve', icon: '🚩' },
    { percent: 55, label: 'Express Flyover', icon: '⚡' },
    { percent: 80, label: 'Final Sprint', icon: '🔥' },
    { percent: 100, label: 'Finish Gate', icon: '🏁' },
  ];

  return (
    <div
      className="glass-card"
      style={{
        padding: '24px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        position: 'relative',
        background: 'rgba(11, 16, 28, 0.95)',
        border: '1px solid rgba(0, 240, 255, 0.2)',
      }}
    >
      {/* Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="live-pulse-dot" />
          <h3 style={{ fontSize: '1.1rem', color: '#FFFFFF', letterSpacing: '1px' }}>
            VIRTUAL ASPHALT CIRCUIT • 2D LIVE TRACK
          </h3>
        </div>
        <div
          style={{
            fontFamily: 'var(--font-telemetry)',
            fontSize: '0.8rem',
            color: 'var(--neon-gold)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <Navigation size={14} /> 3.2 KM CIRCUIT
        </div>
      </div>

      {/* Checkpoint Indicators Bar */}
      <div
        style={{
          position: 'relative',
          display: 'flex',
          justifyContent: 'space-between',
          margin: '0 24px',
          paddingBottom: '8px',
          borderBottom: '1px dashed rgba(255, 255, 255, 0.1)',
        }}
      >
        {checkpoints.map((cp) => (
          <div
            key={cp.percent}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              zIndex: 2,
            }}
          >
            <span style={{ fontSize: '18px' }}>{cp.icon}</span>
            <span
              style={{
                fontFamily: 'var(--font-racing)',
                fontSize: '0.72rem',
                color: 'var(--text-secondary)',
                fontWeight: 600,
                textTransform: 'uppercase',
              }}
            >
              {cp.label}
            </span>
            <span
              style={{
                fontFamily: 'var(--font-telemetry)',
                fontSize: '0.65rem',
                color: 'var(--neon-cyan)',
              }}
            >
              {cp.percent}%
            </span>
          </div>
        ))}
      </div>

      {/* Lanes for each competing racer */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {racers.map((racer) => {
          const isPrimary = racer.id === primaryRacerId;
          const progress = Math.min(100, Math.max(0, racer.progress || 0));

          return (
            <div
              key={racer.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                background: isPrimary ? 'rgba(0, 240, 255, 0.05)' : 'rgba(255, 255, 255, 0.02)',
                border: isPrimary ? '1px solid rgba(0, 240, 255, 0.3)' : '1px solid rgba(255, 255, 255, 0.05)',
                padding: '12px',
                borderRadius: 'var(--radius-sm)',
                position: 'relative',
              }}
            >
              {/* Lane Info */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '0.82rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span
                    style={{
                      fontFamily: 'var(--font-telemetry)',
                      fontWeight: 800,
                      color: racer.color,
                    }}
                  >
                    #{racer.rank || 1}
                  </span>
                  <span style={{ fontWeight: 700, color: '#fff' }}>
                    {racer.name} {isPrimary && <span style={{ color: 'var(--neon-gold)' }}>(Your Delivery)</span>}
                  </span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                    {racer.vehicle}
                  </span>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    fontFamily: 'var(--font-telemetry)',
                  }}
                >
                  <span style={{ color: 'var(--neon-cyan)', fontSize: '0.8rem' }}>
                    {racer.speed || 55} KM/H
                  </span>
                  <span style={{ color: 'var(--neon-gold)', fontWeight: 700 }}>
                    {progress.toFixed(0)}%
                  </span>
                </div>
              </div>

              {/* Asphalt Lane Track */}
              <div
                style={{
                  position: 'relative',
                  height: '24px',
                  background: '#070A10',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  overflow: 'visible',
                  margin: '8px 12px 4px 12px',
                }}
              >
                {/* Lane Track Center Dashes */}
                <div
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: 0,
                    right: 0,
                    height: '2px',
                    background: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.2) 0px, rgba(255,255,255,0.2) 8px, transparent 8px, transparent 16px)',
                    transform: 'translateY(-50%)',
                  }}
                />

                {/* Progress Fill Neon Gradient */}
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    bottom: 0,
                    width: `${progress}%`,
                    background: `linear-gradient(90deg, transparent 0%, ${racer.color} 100%)`,
                    borderRadius: '12px',
                    boxShadow: `0 0 12px ${racer.color}`,
                    transition: 'width 0.6s ease',
                  }}
                />

                {/* Finish Line Checkered Strip */}
                <div
                  className="checker-flag-bar"
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: 0,
                    bottom: 0,
                    width: '12px',
                    borderRadius: '0 12px 12px 0',
                  }}
                />

                {/* Moving Rider Marker on the Lane */}
                <div
                  style={{
                    position: 'absolute',
                    left: `${progress}%`,
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 10,
                    transition: 'left 0.6s ease',
                  }}
                >
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: '#0F172A',
                      border: `2px solid ${racer.color}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '16px',
                      boxShadow: `0 0 10px ${racer.color}`,
                      transform: isPrimary ? 'scale(1.15)' : 'scale(1)',
                    }}
                    title={`${racer.name} (${progress}%)`}
                  >
                    {racer.avatar}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default RaceTrack;

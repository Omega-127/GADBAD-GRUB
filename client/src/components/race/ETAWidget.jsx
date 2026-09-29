import React from 'react';
import { Clock, Gauge, Zap, CheckCircle2 } from 'lucide-react';
import { formatSecondsToMMSS, formatEtaHuman } from '../../utils/formatTime';

export function ETAWidget({ etaSeconds = 240, progress = 50, speed = 58, isFinished = false }) {
  const percentage = Math.min(100, Math.max(0, progress));

  return (
    <div
      className="glass-card"
      style={{
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        border: '1px solid rgba(0, 240, 255, 0.25)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Clock size={18} color="var(--neon-cyan)" />
          <h4
            style={{
              fontFamily: 'var(--font-racing)',
              fontSize: '0.95rem',
              color: '#FFFFFF',
              letterSpacing: '1px',
              textTransform: 'uppercase',
            }}
          >
            RACE ETA & TELEMETRY
          </h4>
        </div>

        <span
          style={{
            fontFamily: 'var(--font-telemetry)',
            fontSize: '0.72rem',
            color: isFinished ? 'var(--neon-green)' : 'var(--neon-gold)',
            background: isFinished ? 'rgba(0, 230, 118, 0.1)' : 'rgba(255, 184, 0, 0.1)',
            padding: '2px 8px',
            borderRadius: '4px',
            border: `1px solid ${isFinished ? 'rgba(0, 230, 118, 0.4)' : 'rgba(255, 184, 0, 0.4)'}`,
          }}
        >
          {isFinished ? '🏁 FINISHED' : '⚡ SPRINTING'}
        </span>
      </div>

      {/* Main Countdown Display */}
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          background: 'rgba(0, 0, 0, 0.3)',
          padding: '16px',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
        }}
      >
        <div>
          <div
            style={{
              fontFamily: 'var(--font-telemetry)',
              fontSize: '2.5rem',
              fontWeight: 900,
              color: isFinished ? 'var(--neon-green)' : 'var(--neon-cyan)',
              lineHeight: 1,
              letterSpacing: '2px',
              textShadow: isFinished
                ? '0 0 15px rgba(0, 230, 118, 0.5)'
                : '0 0 15px rgba(0, 240, 255, 0.5)',
            }}
          >
            {isFinished ? '00:00' : formatSecondsToMMSS(etaSeconds)}
          </div>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            {isFinished ? 'Delivered fresh and on time!' : `Estimated arrival in ${formatEtaHuman(etaSeconds)}`}
          </span>
        </div>

        {/* Speedometer readout */}
        <div style={{ textAlign: 'right' }}>
          <div
            style={{
              fontFamily: 'var(--font-telemetry)',
              fontSize: '1.8rem',
              fontWeight: 800,
              color: 'var(--neon-gold)',
              lineHeight: 1,
            }}
          >
            {isFinished ? '0' : speed}{' '}
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>KM/H</span>
          </div>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-racing)' }}>
            TELEMETRY SPEED
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '0.78rem',
            color: 'var(--text-secondary)',
            marginBottom: '6px',
            fontFamily: 'var(--font-racing)',
          }}
        >
          <span>ROUTE PROGRESS</span>
          <span style={{ color: 'var(--neon-cyan)', fontWeight: 700 }}>
            {percentage.toFixed(0)}%
          </span>
        </div>
        <div
          style={{
            height: '8px',
            background: 'rgba(255, 255, 255, 0.08)',
            borderRadius: '4px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${percentage}%`,
              background: 'var(--grad-primary)',
              boxShadow: '0 0 10px var(--neon-cyan)',
              transition: 'width 0.4s ease',
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default ETAWidget;

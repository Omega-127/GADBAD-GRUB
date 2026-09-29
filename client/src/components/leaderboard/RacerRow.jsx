import React from 'react';
import { formatEtaHuman } from '../../utils/formatTime';

export function RacerRow({ racer, isCurrentUser = false }) {
  const rankColors = {
    1: 'var(--neon-gold)',
    2: '#E2E8F0',
    3: '#CD7F32',
  };

  const rankColor = rankColors[racer.rank] || 'var(--text-secondary)';

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '50px 2fr 1.5fr 1fr 1fr',
        alignItems: 'center',
        padding: '14px 16px',
        background: isCurrentUser
          ? 'rgba(0, 240, 255, 0.08)'
          : racer.rank === 1
          ? 'rgba(255, 184, 0, 0.05)'
          : 'rgba(255, 255, 255, 0.02)',
        borderRadius: 'var(--radius-sm)',
        border: isCurrentUser
          ? '1px solid var(--neon-cyan)'
          : racer.rank === 1
          ? '1px solid rgba(255, 184, 0, 0.3)'
          : '1px solid var(--bg-card-border)',
        gap: '12px',
        fontSize: '0.9rem',
      }}
    >
      {/* Rank # */}
      <div
        style={{
          fontFamily: 'var(--font-telemetry)',
          fontWeight: 900,
          fontSize: '1.2rem',
          color: rankColor,
        }}
      >
        #{racer.rank}
      </div>

      {/* Racer & Vehicle Info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
        <span style={{ fontSize: '24px' }}>{racer.avatar}</span>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontWeight: 700, color: '#FFFFFF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {racer.racerName || racer.name} {isCurrentUser && <span style={{ color: 'var(--neon-cyan)' }}>(You)</span>}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {racer.vehicle || 'Virtual Hyper Rig'}
          </div>
        </div>
      </div>

      {/* Progress / ETA */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '4px' }}>
          <span style={{ color: 'var(--text-secondary)' }}>{formatEtaHuman(racer.etaSeconds)} ETA</span>
          <span style={{ color: 'var(--neon-cyan)', fontFamily: 'var(--font-telemetry)' }}>{racer.progress || 60}%</span>
        </div>
        <div style={{ height: '6px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '3px', overflow: 'hidden' }}>
          <div
            style={{
              height: '100%',
              width: `${racer.progress || 60}%`,
              background: racer.color || 'var(--grad-primary)',
            }}
          />
        </div>
      </div>

      {/* Win Rate */}
      <div style={{ fontFamily: 'var(--font-telemetry)', color: 'var(--neon-green)', fontWeight: 700 }}>
        {racer.winRate || '74%'}
      </div>

      {/* Wins Count */}
      <div style={{ fontFamily: 'var(--font-telemetry)', color: 'var(--neon-gold)', fontWeight: 700 }}>
        {racer.wins || 24} WINS
      </div>
    </div>
  );
}

export default RacerRow;

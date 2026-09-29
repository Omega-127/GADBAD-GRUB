import React from 'react';
import { Link } from 'react-router-dom';
import { Trophy, ChevronRight } from 'lucide-react';
import { DEMO_RACERS } from '../../utils/constants';

export function CompetitionPanel({ racers = DEMO_RACERS }) {
  return (
    <div
      className="glass-card"
      style={{
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Trophy size={16} color="var(--neon-gold)" />
          <h4
            style={{
              fontFamily: 'var(--font-racing)',
              fontSize: '0.95rem',
              color: '#FFFFFF',
              letterSpacing: '1px',
              textTransform: 'uppercase',
            }}
          >
            RACER SPEED GRID
          </h4>
        </div>
        <Link
          to="/leaderboard"
          style={{
            textDecoration: 'none',
            fontSize: '0.78rem',
            color: 'var(--neon-cyan)',
            display: 'flex',
            alignItems: 'center',
            fontFamily: 'var(--font-racing)',
            fontWeight: 700,
          }}
        >
          FULL STANDINGS <ChevronRight size={14} />
        </Link>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {racers.slice(0, 4).map((racer, idx) => (
          <div
            key={racer.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 12px',
              background: 'rgba(255, 255, 255, 0.02)',
              borderRadius: 'var(--radius-sm)',
              borderLeft: `3px solid ${racer.color}`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span
                style={{
                  fontFamily: 'var(--font-telemetry)',
                  fontWeight: 900,
                  fontSize: '0.9rem',
                  color: idx === 0 ? 'var(--neon-gold)' : idx === 1 ? '#CBD5E1' : idx === 2 ? '#CD7F32' : 'var(--text-muted)',
                  width: '18px',
                }}
              >
                #{idx + 1}
              </span>
              <span style={{ fontSize: '18px' }}>{racer.avatar}</span>
              <div>
                <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.88rem' }}>
                  {racer.name}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  {racer.vehicle}
                </div>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div
                style={{
                  fontFamily: 'var(--font-telemetry)',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  color: 'var(--neon-cyan)',
                }}
              >
                {racer.baseSpeed || 55} KM/H
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--neon-gold)' }}>
                {racer.odds} ODDS
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CompetitionPanel;

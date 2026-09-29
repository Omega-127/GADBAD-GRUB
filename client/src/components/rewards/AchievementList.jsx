import React from 'react';
import { Award, Zap, Clock, CheckCircle } from 'lucide-react';
import { formatTimeAgo } from '../../utils/formatTime';

export function AchievementList({ history = [] }) {
  return (
    <div
      className="glass-card"
      style={{
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Award size={18} color="var(--neon-cyan)" />
        <h3
          style={{
            fontFamily: 'var(--font-racing)',
            fontSize: '1.05rem',
            color: '#FFFFFF',
            letterSpacing: '1px',
            textTransform: 'uppercase',
          }}
        >
          VICTORY POINTS & ACHIEVEMENTS LOG
        </h3>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {history.length === 0 ? (
          <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
            No reward transactions recorded yet. Complete races and make predictions to earn points!
          </div>
        ) : (
          history.map((item) => (
            <div
              key={item._id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                background: 'rgba(255, 255, 255, 0.02)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--bg-card-border)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    background: 'rgba(0, 230, 118, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--neon-green)',
                  }}
                >
                  <CheckCircle size={18} />
                </div>
                <div>
                  <h4 style={{ fontSize: '0.9rem', color: '#fff' }}>{item.title}</h4>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      color: 'var(--text-muted)',
                      fontFamily: 'var(--font-telemetry)',
                    }}
                  >
                    {formatTimeAgo(item.createdAt)}
                  </span>
                </div>
              </div>

              <div
                style={{
                  fontFamily: 'var(--font-telemetry)',
                  fontWeight: 800,
                  fontSize: '1rem',
                  color: 'var(--neon-green)',
                }}
              >
                +{item.points} PTS
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default AchievementList;

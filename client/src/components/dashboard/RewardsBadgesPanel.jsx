import React from 'react';
import { Link } from 'react-router-dom';
import { Award, ChevronRight, Lock } from 'lucide-react';
import { ALL_BADGES } from '../../utils/constants';
import { useAuth } from '../../context/AuthContext';

export function RewardsBadgesPanel() {
  const { user } = useAuth();
  const userBadges = user.badges || [];

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
          <Award size={16} color="var(--neon-gold)" />
          <h4
            style={{
              fontFamily: 'var(--font-racing)',
              fontSize: '0.95rem',
              color: '#FFFFFF',
              letterSpacing: '1px',
              textTransform: 'uppercase',
            }}
          >
            TROPHY & BADGE SHOWCASE
          </h4>
        </div>
        <Link
          to="/rewards"
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
          ALL BADGES <ChevronRight size={14} />
        </Link>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: '10px',
        }}
      >
        {ALL_BADGES.slice(0, 4).map((badge) => {
          const isUnlocked = userBadges.includes(badge.code);

          return (
            <div
              key={badge.code}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                padding: '12px 8px',
                borderRadius: 'var(--radius-sm)',
                background: isUnlocked ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.4)',
                border: isUnlocked
                  ? `1px solid ${badge.color || 'var(--neon-gold)'}`
                  : '1px solid rgba(255, 255, 255, 0.05)',
                opacity: isUnlocked ? 1 : 0.45,
                gap: '6px',
                position: 'relative',
              }}
            >
              {!isUnlocked && (
                <Lock
                  size={12}
                  style={{ position: 'absolute', top: '8px', right: '8px', color: 'var(--text-muted)' }}
                />
              )}

              <span style={{ fontSize: '24px' }}>{badge.icon}</span>
              <span
                style={{
                  fontFamily: 'var(--font-racing)',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  color: isUnlocked ? '#FFFFFF' : 'var(--text-muted)',
                }}
              >
                {badge.title}
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-telemetry)',
                  fontSize: '0.65rem',
                  color: isUnlocked ? 'var(--neon-gold)' : 'var(--text-muted)',
                }}
              >
                +{badge.xpValue} XP
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default RewardsBadgesPanel;

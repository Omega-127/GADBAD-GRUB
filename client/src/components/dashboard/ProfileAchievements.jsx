import React from 'react';
import { Award, Zap, Target, TrendingUp } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { formatPoints } from '../../utils/formatCurrency';

export function ProfileAchievements() {
  const { user } = useAuth();
  const xpNeeded = user.level * 500;
  const currentLevelXp = user.xp % 500;
  const progressPercent = Math.min(100, Math.round((currentLevelXp / 500) * 100));

  return (
    <div
      className="glass-card"
      style={{
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.05) 0%, rgba(10, 14, 23, 0.95) 100%)',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              background: 'rgba(0, 240, 255, 0.15)',
              border: '2px solid var(--neon-cyan)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '22px',
              boxShadow: '0 0 15px rgba(0, 240, 255, 0.3)',
            }}
          >
            {user.avatar || '🏎️'}
          </div>
          <div>
            <h4 style={{ fontSize: '1.05rem', color: '#FFFFFF' }}>{user.displayName}</h4>
            <span
              style={{
                fontFamily: 'var(--font-racing)',
                fontSize: '0.75rem',
                color: 'var(--neon-gold)',
                letterSpacing: '0.5px',
              }}
            >
              LEVEL {user.level} SPEED GOURMET
            </span>
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <span
            style={{
              fontFamily: 'var(--font-telemetry)',
              fontSize: '1.1rem',
              fontWeight: 800,
              color: 'var(--neon-gold)',
            }}
          >
            {formatPoints(user.points)}
          </span>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>VICTORY BALANCE</div>
        </div>
      </div>

      {/* XP Level Progress Bar */}
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
          <span>XP PROGRESSION</span>
          <span style={{ color: 'var(--neon-cyan)', fontFamily: 'var(--font-telemetry)' }}>
            {currentLevelXp} / 500 XP
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
              width: `${progressPercent}%`,
              background: 'var(--grad-primary)',
              boxShadow: '0 0 8px var(--neon-cyan)',
              transition: 'width 0.4s ease',
            }}
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '10px',
          paddingTop: '6px',
        }}
      >
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            padding: '10px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <Target size={18} color="var(--neon-cyan)" />
          <div>
            <div style={{ fontFamily: 'var(--font-telemetry)', fontSize: '0.9rem', color: '#fff', fontWeight: 700 }}>
              {user.winRate || '68%'}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>PREDICTION HIT RATE</div>
          </div>
        </div>

        <div
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            padding: '10px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <TrendingUp size={18} color="var(--neon-green)" />
          <div>
            <div style={{ fontFamily: 'var(--font-telemetry)', fontSize: '0.9rem', color: '#fff', fontWeight: 700 }}>
              {user.totalRaces || 28}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>TOTAL SPEED RACES</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileAchievements;

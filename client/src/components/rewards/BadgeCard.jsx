import React from 'react';
import { Lock, CheckCircle2 } from 'lucide-react';

export function BadgeCard({ badge, isUnlocked = false }) {
  const color = badge.color || 'var(--neon-gold)';

  return (
    <div
      className="glass-card"
      style={{
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: '12px',
        border: isUnlocked ? `1px solid ${color}` : '1px solid rgba(255, 255, 255, 0.05)',
        background: isUnlocked
          ? `linear-gradient(180deg, rgba(255, 255, 255, 0.03) 0%, rgba(10, 14, 23, 0.95) 100%)`
          : 'rgba(0, 0, 0, 0.4)',
        boxShadow: isUnlocked ? `0 0 20px rgba(0, 240, 255, 0.15)` : 'none',
        opacity: isUnlocked ? 1 : 0.5,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Locked Badge Overlay */}
      {!isUnlocked && (
        <div
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            background: 'rgba(255, 255, 255, 0.08)',
            padding: '4px',
            borderRadius: '50%',
            color: 'var(--text-muted)',
          }}
        >
          <Lock size={14} />
        </div>
      )}

      {/* Badge Icon Emblem */}
      <div
        style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: isUnlocked ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.5)',
          border: `2px solid ${isUnlocked ? color : 'rgba(255, 255, 255, 0.1)'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '32px',
          boxShadow: isUnlocked ? `0 0 15px ${color}` : 'none',
        }}
      >
        {badge.icon}
      </div>

      <div>
        <h4 style={{ fontSize: '1rem', color: isUnlocked ? '#FFFFFF' : 'var(--text-muted)', marginBottom: '4px' }}>
          {badge.title}
        </h4>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
          {badge.description}
        </p>
      </div>

      <div
        style={{
          marginTop: 'auto',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontFamily: 'var(--font-telemetry)',
          fontSize: '0.78rem',
          color: isUnlocked ? 'var(--neon-gold)' : 'var(--text-muted)',
          background: 'rgba(255, 255, 255, 0.03)',
          padding: '4px 12px',
          borderRadius: 'var(--radius-full)',
        }}
      >
        {isUnlocked ? <CheckCircle2 size={14} color="var(--neon-green)" /> : null}
        <span>+{badge.xpValue} SPEED XP</span>
      </div>
    </div>
  );
}

export default BadgeCard;

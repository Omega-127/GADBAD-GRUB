import React from 'react';
import { Mic, Volume2 } from 'lucide-react';

export function RaceCommentary({ latestMessage, racerLeader, speed }) {
  const defaultComment = latestMessage?.message || 
    `${racerLeader?.name || 'Pizza Panther'} is dominating the apex turn at ${speed || 58} km/h! The delivery container is sealed and the food is sizzling hot!`;

  return (
    <div
      className="glass-card"
      style={{
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        background: 'linear-gradient(90deg, rgba(121, 40, 202, 0.12) 0%, rgba(0, 240, 255, 0.08) 100%)',
        border: '1px solid rgba(121, 40, 202, 0.35)',
      }}
    >
      {/* Mic Avatar */}
      <div
        style={{
          width: '42px',
          height: '42px',
          borderRadius: '50%',
          background: 'var(--grad-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          boxShadow: '0 0 12px rgba(0, 240, 255, 0.4)',
          flexShrink: 0,
        }}
      >
        <Mic size={20} />
      </div>

      {/* Commentary text */}
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
          <span
            style={{
              fontFamily: 'var(--font-racing)',
              fontSize: '0.75rem',
              fontWeight: 800,
              color: 'var(--neon-cyan)',
              letterSpacing: '1px',
              textTransform: 'uppercase',
            }}
          >
            🎙️ AI RACE COMMENTATOR
          </span>
          <span className="live-pulse-dot" />
        </div>
        <p
          style={{
            fontSize: '0.88rem',
            color: '#FFFFFF',
            lineHeight: 1.4,
            fontStyle: 'italic',
          }}
        >
          “{defaultComment}”
        </p>
      </div>
    </div>
  );
}

export default RaceCommentary;

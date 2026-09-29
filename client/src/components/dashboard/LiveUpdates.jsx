import React from 'react';
import { Radio, Zap, Flame, Clock, CheckCircle } from 'lucide-react';
import { formatTimeAgo } from '../../utils/formatTime';

export function LiveUpdates({ updates = [] }) {
  const defaultUpdates = [
    {
      id: 'u1',
      title: 'Nitro Pepperoni in Final Sprint',
      desc: 'Pizza Panther clocked 64 km/h entering Avenue West. ETA down to 3 minutes!',
      time: new Date(Date.now() - 45000).toISOString(),
      type: 'speed',
    },
    {
      id: 'u2',
      title: 'Order ORD-8472 Picked Up',
      desc: 'Biryani Bullet has left the restaurant kitchen with twin thermal bags sealed.',
      time: new Date(Date.now() - 120000).toISOString(),
      type: 'pickup',
    },
    {
      id: 'u3',
      title: 'Double XP Flash Round Started',
      desc: 'Predict race winners in the next 15 minutes to unlock the Track Oracle Badge!',
      time: new Date(Date.now() - 300000).toISOString(),
      type: 'bonus',
    },
  ];

  const items = updates.length > 0 ? updates : defaultUpdates;

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
          <Radio size={16} color="var(--neon-cyan)" />
          <h4
            style={{
              fontFamily: 'var(--font-racing)',
              fontSize: '0.95rem',
              color: '#FFFFFF',
              letterSpacing: '1px',
              textTransform: 'uppercase',
            }}
          >
            CIRCUIT LIVE UPDATES
          </h4>
        </div>
        <span className="live-pulse-dot" />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {items.map((item) => (
          <div
            key={item.id}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              padding: '12px',
              background: 'rgba(255, 255, 255, 0.02)',
              borderRadius: 'var(--radius-sm)',
              borderLeft: '3px solid var(--neon-gold)',
            }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'rgba(255, 184, 0, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              {item.type === 'speed' ? (
                <Zap size={16} color="var(--neon-crimson)" />
              ) : item.type === 'pickup' ? (
                <Flame size={16} color="var(--neon-gold)" />
              ) : (
                <CheckCircle size={16} color="var(--neon-cyan)" />
              )}
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h5 style={{ fontSize: '0.9rem', color: '#fff', fontWeight: 600 }}>{item.title}</h5>
                <span
                  style={{
                    fontSize: '0.7rem',
                    color: 'var(--text-muted)',
                    fontFamily: 'var(--font-telemetry)',
                  }}
                >
                  {formatTimeAgo(item.time)}
                </span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px', lineHeight: 1.4 }}>
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LiveUpdates;

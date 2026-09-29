import React from 'react';
import { Radio, Zap, Flag, CheckCircle, Flame, AlertCircle } from 'lucide-react';
import { formatTimeAgo } from '../../utils/formatTime';

export function RaceEventFeed({ events = [] }) {
  const getEventIcon = (type = '') => {
    switch (type) {
      case 'NITRO_BURST':
      case 'NITRO_BOOST':
        return <Zap size={15} color="var(--neon-crimson)" />;
      case 'START':
        return <Flag size={15} color="var(--neon-green)" />;
      case 'FINISH':
        return <CheckCircle size={15} color="var(--neon-gold)" />;
      case 'TRAFFIC':
        return <AlertCircle size={15} color="#FF9900" />;
      default:
        return <Flame size={15} color="var(--neon-cyan)" />;
    }
  };

  return (
    <div
      className="glass-card"
      style={{
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        maxHeight: '360px',
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
            LIVE PIT-LANE BROADCAST FEED
          </h4>
        </div>
        <span
          style={{
            fontFamily: 'var(--font-telemetry)',
            fontSize: '0.72rem',
            color: 'var(--text-muted)',
          }}
        >
          {events.length} EVENTS RECORDED
        </span>
      </div>

      {/* Events List */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          overflowY: 'auto',
          paddingRight: '6px',
        }}
      >
        {events.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Awaiting green light telemetry broadcast...
          </div>
        ) : (
          events.map((evt) => (
            <div
              key={evt._id || evt.createdAt}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
                padding: '10px 12px',
                background: 'rgba(255, 255, 255, 0.02)',
                borderRadius: '8px',
                borderLeft: '2px solid var(--neon-cyan)',
                fontSize: '0.85rem',
              }}
            >
              <div style={{ marginTop: '2px', flexShrink: 0 }}>
                {getEventIcon(evt.type)}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ color: 'var(--text-primary)', lineHeight: 1.4 }}>
                  {evt.message}
                </p>
                <span
                  style={{
                    fontSize: '0.7rem',
                    color: 'var(--text-muted)',
                    fontFamily: 'var(--font-telemetry)',
                  }}
                >
                  {formatTimeAgo(evt.createdAt)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default RaceEventFeed;

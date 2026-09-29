import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Trophy, ArrowRight } from 'lucide-react';
import Button from '../common/Button';
import { DEMO_RACERS } from '../../utils/constants';

export function NextOrdersPredictions() {
  const navigate = useNavigate();

  const activeRaces = [
    {
      id: 'race_01',
      orderId: 'ORD-7294',
      item: 'Nitro Pepperoni Pizza (x1)',
      restaurant: 'Hyper Sonic Pizza',
      favoriteRacer: DEMO_RACERS[0],
      odds: '2.4x',
      progress: 62,
      eta: '3m 40s',
    },
    {
      id: 'race_02',
      orderId: 'ORD-8910',
      item: 'Grand Prix Dum Biryani (x2)',
      restaurant: 'Nitro Biryani Express',
      favoriteRacer: DEMO_RACERS[1],
      odds: '1.9x',
      progress: 35,
      eta: '8m 10s',
    },
  ];

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
          <Sparkles size={16} color="var(--neon-gold)" />
          <h4
            style={{
              fontFamily: 'var(--font-racing)',
              fontSize: '0.95rem',
              color: '#FFFFFF',
              letterSpacing: '1px',
              textTransform: 'uppercase',
            }}
          >
            ACTIVE GP PREDICTIONS
          </h4>
        </div>
        <span
          style={{
            fontSize: '0.75rem',
            color: 'var(--neon-cyan)',
            fontFamily: 'var(--font-telemetry)',
          }}
        >
          EARN 300+ PTS
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {activeRaces.map((item) => (
          <div
            key={item.id}
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              padding: '14px',
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid var(--bg-card-border)',
              borderRadius: 'var(--radius-sm)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '26px' }}>{item.favoriteRacer.avatar}</span>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontWeight: 700, color: '#fff', fontSize: '0.92rem' }}>
                    {item.item}
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-telemetry)',
                      fontSize: '0.68rem',
                      color: 'var(--neon-gold)',
                      background: 'rgba(255, 184, 0, 0.1)',
                      padding: '1px 6px',
                      borderRadius: '4px',
                    }}
                  >
                    {item.odds} ODDS
                  </span>
                </div>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  {item.restaurant} • ETA {item.eta}
                </span>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/race?id=${item.id}&orderId=${item.orderId}`)}
              icon={ArrowRight}
            >
              PREDICT & WATCH
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default NextOrdersPredictions;

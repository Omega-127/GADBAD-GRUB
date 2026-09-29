import React, { useState } from 'react';
import RacerRow from './RacerRow';
import { Trophy, Users, Award, Shield } from 'lucide-react';
import { formatPoints } from '../../utils/formatCurrency';

export function LeaderboardTable({ racers = [], topUsers = [] }) {
  const [activeTab, setActiveTab] = useState('racers'); // 'racers' | 'users'

  return (
    <div
      className="glass-card"
      style={{
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
      }}
    >
      {/* Tab Switcher */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setActiveTab('racers')}
            style={{
              background: activeTab === 'racers' ? 'var(--grad-primary)' : 'rgba(255, 255, 255, 0.04)',
              color: '#fff',
              border: activeTab === 'racers' ? 'none' : '1px solid var(--bg-card-border)',
              borderRadius: 'var(--radius-sm)',
              padding: '8px 18px',
              fontFamily: 'var(--font-racing)',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <Trophy size={16} /> RACER DRIVER STANDINGS
          </button>

          <button
            onClick={() => setActiveTab('users')}
            style={{
              background: activeTab === 'users' ? 'var(--grad-gold)' : 'rgba(255, 255, 255, 0.04)',
              color: activeTab === 'users' ? '#000' : 'var(--text-secondary)',
              border: activeTab === 'users' ? 'none' : '1px solid var(--bg-card-border)',
              borderRadius: 'var(--radius-sm)',
              padding: '8px 18px',
              fontFamily: 'var(--font-racing)',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <Users size={16} /> PREDICTION ORACLES (USERS)
          </button>
        </div>

        <div style={{ fontSize: '0.78rem', color: 'var(--neon-cyan)', fontFamily: 'var(--font-telemetry)' }}>
          SORT: ASCENDING ETA & SPRINT WINS
        </div>
      </div>

      {/* Content depending on Tab */}
      {activeTab === 'racers' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', overflowX: 'auto' }}>
          {/* Table Header */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '50px 2fr 1.5fr 1fr 1fr',
              padding: '8px 16px',
              fontSize: '0.75rem',
              fontFamily: 'var(--font-racing)',
              fontWeight: 700,
              color: 'var(--text-muted)',
              letterSpacing: '1px',
              textTransform: 'uppercase',
            }}
          >
            <div>RANK</div>
            <div>RACER & VEHICLE</div>
            <div>ETA TELEMETRY</div>
            <div>WIN RATE</div>
            <div>VICTORIES</div>
          </div>

          {/* Table Rows */}
          {racers.map((racer) => (
            <RacerRow key={racer.racerId || racer.id} racer={racer} />
          ))}
        </div>
      ) : (
        /* Top User Predictors */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {topUsers.map((user) => (
            <div
              key={user.rank}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 18px',
                background: user.rank === 1 ? 'rgba(255, 184, 0, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                border: user.rank === 1 ? '1px solid rgba(255, 184, 0, 0.4)' : '1px solid var(--bg-card-border)',
                borderRadius: 'var(--radius-sm)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <span
                  style={{
                    fontFamily: 'var(--font-telemetry)',
                    fontSize: '1.2rem',
                    fontWeight: 900,
                    color: user.rank === 1 ? 'var(--neon-gold)' : '#fff',
                    width: '30px',
                  }}
                >
                  #{user.rank}
                </span>
                <div>
                  <h4 style={{ fontSize: '0.95rem', color: '#fff' }}>{user.name}</h4>
                  <span style={{ fontSize: '0.75rem', color: 'var(--neon-cyan)', fontFamily: 'var(--font-racing)' }}>
                    {user.badge}
                  </span>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: 'var(--font-telemetry)', fontWeight: 800, color: 'var(--neon-gold)' }}>
                  {formatPoints(user.points)}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  {user.accuracy} PREDICTION ACCURACY
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default LeaderboardTable;

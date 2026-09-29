import React, { useState, useEffect } from 'react';
import { Trophy, Award, Flame, RefreshCw } from 'lucide-react';
import LeaderboardTable from '../components/leaderboard/LeaderboardTable';
import Loader from '../components/common/Loader';
import ErrorMessage from '../components/common/ErrorMessage';
import leaderboardApi from '../services/leaderboardApi';

export function LeaderboardPage() {
  const [data, setData] = useState({ racers: [], topUsers: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStandings = async () => {
    try {
      setLoading(true);
      const res = await leaderboardApi.getLeaderboard();
      setData(res);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStandings();
  }, []);

  if (loading) return <Loader message="Compiling Driver Telemetry & Standings..." size="lg" />;
  if (error) return <ErrorMessage message={error} onRetry={fetchStandings} />;

  const topThree = data.racers.slice(0, 3);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="live-pulse-dot" />
            <span
              style={{
                fontFamily: 'var(--font-racing)',
                fontSize: '0.8rem',
                color: 'var(--neon-cyan)',
                letterSpacing: '1.5px',
                textTransform: 'uppercase',
              }}
            >
              GLOBAL CHAMPIONSHIP RANKINGS
            </span>
          </div>
          <h1 style={{ fontSize: '2rem', color: '#FFFFFF', marginTop: '4px' }}>
            RACER & PREDICTOR LEADERBOARD
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Rankings calculated using fastest delivery ETA and verified prediction accuracy.
          </p>
        </div>

        <button
          onClick={fetchStandings}
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid var(--bg-card-border)',
            borderRadius: 'var(--radius-sm)',
            padding: '8px 16px',
            color: 'var(--neon-cyan)',
            fontFamily: 'var(--font-racing)',
            fontWeight: 700,
            fontSize: '0.85rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <RefreshCw size={14} /> REFRESH STANDINGS
        </button>
      </div>

      {/* Podium Highlights for Top 3 Racers */}
      {topThree.length >= 3 && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '16px',
          }}
        >
          {/* #2 Silver */}
          <div
            className="glass-card"
            style={{
              padding: '20px',
              textAlign: 'center',
              border: '1px solid #CBD5E1',
              background: 'linear-gradient(180deg, rgba(203, 213, 225, 0.08) 0%, rgba(10, 14, 23, 0.9) 100%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <div style={{ fontSize: '20px', color: '#CBD5E1', fontWeight: 900, fontFamily: 'var(--font-telemetry)' }}>
              🥈 2ND PLACE
            </div>
            <span style={{ fontSize: '36px' }}>{topThree[1].avatar}</span>
            <h3 style={{ fontSize: '1.1rem', color: '#fff' }}>{topThree[1].racerName}</h3>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{topThree[1].vehicle}</span>
            <div style={{ fontFamily: 'var(--font-telemetry)', color: 'var(--neon-cyan)', fontWeight: 700 }}>
              {topThree[1].wins} Wins • {topThree[1].winRate}
            </div>
          </div>

          {/* #1 Gold */}
          <div
            className="glass-card"
            style={{
              padding: '24px',
              textAlign: 'center',
              border: '2px solid var(--neon-gold)',
              background: 'linear-gradient(180deg, rgba(255, 184, 0, 0.12) 0%, rgba(10, 14, 23, 0.95) 100%)',
              boxShadow: '0 0 25px rgba(255, 184, 0, 0.25)',
              transform: 'scale(1.03)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <div style={{ fontSize: '24px', color: 'var(--neon-gold)', fontWeight: 900, fontFamily: 'var(--font-telemetry)' }}>
              👑 GRAND CHAMPION
            </div>
            <span style={{ fontSize: '44px' }}>{topThree[0].avatar}</span>
            <h3 style={{ fontSize: '1.25rem', color: '#fff' }}>{topThree[0].racerName}</h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--neon-gold)' }}>{topThree[0].vehicle}</span>
            <div style={{ fontFamily: 'var(--font-telemetry)', color: 'var(--neon-gold)', fontWeight: 800, fontSize: '1.05rem' }}>
              {topThree[0].wins} Wins • {topThree[0].winRate}
            </div>
          </div>

          {/* #3 Bronze */}
          <div
            className="glass-card"
            style={{
              padding: '20px',
              textAlign: 'center',
              border: '1px solid #CD7F32',
              background: 'linear-gradient(180deg, rgba(205, 127, 50, 0.08) 0%, rgba(10, 14, 23, 0.9) 100%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <div style={{ fontSize: '20px', color: '#CD7F32', fontWeight: 900, fontFamily: 'var(--font-telemetry)' }}>
              🥉 3RD PLACE
            </div>
            <span style={{ fontSize: '36px' }}>{topThree[2].avatar}</span>
            <h3 style={{ fontSize: '1.1rem', color: '#fff' }}>{topThree[2].racerName}</h3>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{topThree[2].vehicle}</span>
            <div style={{ fontFamily: 'var(--font-telemetry)', color: 'var(--neon-cyan)', fontWeight: 700 }}>
              {topThree[2].wins} Wins • {topThree[2].winRate}
            </div>
          </div>
        </div>
      )}

      {/* Main Leaderboard Table */}
      <LeaderboardTable racers={data.racers} topUsers={data.topUsers} />
    </div>
  );
}

export default LeaderboardPage;

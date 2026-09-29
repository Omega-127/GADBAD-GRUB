import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flag, Play } from 'lucide-react';
import Button from '../common/Button';
import raceApi from '../../services/raceApi';

export function RaceWatchHub({ activeRace }) {
  const navigate = useNavigate();
  const [launching, setLaunching] = useState(false);

  const enterRaceHub = async () => {
    try {
      setLaunching(true);
      const race = activeRace?._id
        ? activeRace
        : await raceApi.ensureLiveRace();
      navigate(`/race?id=${race._id}${race.orderId ? `&orderId=${race.orderId}` : ''}`);
    } catch (err) {
      console.error('Failed to launch live race', err);
      // Still open the race page — useRace will recover / fall back
      navigate('/race');
    } finally {
      setLaunching(false);
    }
  };

  return (
    <div
      className="glass-card"
      style={{
        position: 'relative',
        padding: '32px 28px',
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(10, 14, 23, 0.98) 100%)',
        border: '1px solid rgba(0, 240, 255, 0.3)',
        boxShadow: '0 10px 30px rgba(0, 240, 255, 0.15)',
        overflow: 'hidden',
      }}
    >
      {/* Decorative Speed Background Elements */}
      <div
        style={{
          position: 'absolute',
          top: '-40px',
          right: '-40px',
          width: '240px',
          height: '240px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0, 240, 255, 0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Subhead Tag */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span className="live-pulse-dot" />
          <span
            style={{
              fontFamily: 'var(--font-racing)',
              fontSize: '0.85rem',
              fontWeight: 800,
              color: 'var(--neon-cyan)',
              letterSpacing: '2px',
              textTransform: 'uppercase',
            }}
          >
            LIVE ARENA BROADCAST
          </span>
          <span
            style={{
              background: 'rgba(255, 51, 102, 0.2)',
              color: 'var(--neon-crimson)',
              border: '1px solid rgba(255, 51, 102, 0.4)',
              fontSize: '0.68rem',
              fontWeight: 800,
              padding: '2px 8px',
              borderRadius: '4px',
              fontFamily: 'var(--font-telemetry)',
            }}
          >
            ACTIVE GP
          </span>
        </div>

        {/* Hero Title */}
        <div style={{ maxWidth: '680px' }}>
          <h1
            style={{
              fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)',
              color: '#FFFFFF',
              lineHeight: 1.15,
              marginBottom: '10px',
            }}
          >
            WATCH FOOD SPRINT AT <span style={{ color: 'var(--neon-cyan)' }}>SUPERSONIC</span> SPEEDS
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.6 }}>
            Every meal ordered launches a high-stakes virtual street race. Track telemetry checkpoints, predict winners to multiply XP, and claim victory before your food arrives!
          </p>
        </div>

        {/* Stats Strip */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '20px',
            padding: '16px 0',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <div>
            <div style={{ fontFamily: 'var(--font-telemetry)', fontSize: '1.4rem', fontWeight: 800, color: 'var(--neon-gold)' }}>
              4 RACERS
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ON TRACK GRID</div>
          </div>

          <div style={{ width: '1px', background: 'rgba(255, 255, 255, 0.1)' }} />

          <div>
            <div style={{ fontFamily: 'var(--font-telemetry)', fontSize: '1.4rem', fontWeight: 800, color: 'var(--neon-cyan)' }}>
              58 KM/H
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>VIRTUAL VELOCITY</div>
          </div>

          <div style={{ width: '1px', background: 'rgba(255, 255, 255, 0.1)' }} />

          <div>
            <div style={{ fontFamily: 'var(--font-telemetry)', fontSize: '1.4rem', fontWeight: 800, color: 'var(--neon-green)' }}>
              15-20 MIN
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>AVG DELIVERY RECORD</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
          <Button
            variant="nitro"
            size="lg"
            onClick={enterRaceHub}
            loading={launching}
            icon={Play}
          >
            ENTER RACE WATCH HUB
          </Button>

          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate('/order')}
            icon={Flag}
          >
            ORDER & LAUNCH NEW RACE
          </Button>
        </div>
      </div>
    </div>
  );
}

export default RaceWatchHub;

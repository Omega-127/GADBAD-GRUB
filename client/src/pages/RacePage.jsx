import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Trophy, Flag, Zap, ArrowLeft, RefreshCw, ShoppingBag } from 'lucide-react';
import useRace from '../hooks/useRace';
import RaceMap from '../components/race/RaceMap';
import RaceTrack from '../components/race/RaceTrack';
import RaceStatus from '../components/race/RaceStatus';
import ETAWidget from '../components/race/ETAWidget';
import RaceEventFeed from '../components/race/RaceEventFeed';
import PredictionCard from '../components/race/PredictionCard';
import RaceCommentary from '../components/race/RaceCommentary';
import OrderStatusTimeline from '../components/orders/OrderStatusTimeline';
import Loader from '../components/common/Loader';
import ErrorMessage from '../components/common/ErrorMessage';
import Button from '../components/common/Button';

export function RacePage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const raceId = searchParams.get('id') || 'race_live_demo_01';
  const orderId = searchParams.get('orderId') || 'ord_demo_speed_99';

  const {
    race,
    events,
    leaderboard,
    loading,
    error,
    userPrediction,
    submitPrediction,
    nitroActive,
    triggerNitroBoost,
    isFinished,
    winner,
    connected,
  } = useRace(raceId);

  const [trackView, setTrackView] = useState('map'); // 'map' | 'lanes'

  if (loading) {
    return <Loader message="Connecting To Live Race Telemetry..." size="lg" />;
  }

  if (error && !race) {
    return <ErrorMessage message={error} onRetry={() => window.location.reload()} />;
  }

  const primaryRacer = (race?.racers || []).find((r) => r.id === race?.racerId) || race?.racers?.[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Race Header Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
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
              LIVE SPEEDWAY GP ARENA
            </span>
          </div>
          <h1 style={{ fontSize: '2rem', color: '#FFFFFF', marginTop: '4px' }}>
            RACE WATCH HUB
          </h1>
        </div>

        {/* View Switcher Tabs: 2D Track Map vs Lane Progress */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button
            onClick={() => setTrackView('map')}
            style={{
              background: trackView === 'map' ? 'var(--grad-primary)' : 'rgba(255, 255, 255, 0.05)',
              color: '#fff',
              border: trackView === 'map' ? 'none' : '1px solid var(--bg-card-border)',
              borderRadius: 'var(--radius-sm)',
              padding: '8px 16px',
              fontFamily: 'var(--font-racing)',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
            }}
          >
            2D RADAR CIRCUIT
          </button>
          <button
            onClick={() => setTrackView('lanes')}
            style={{
              background: trackView === 'lanes' ? 'var(--grad-primary)' : 'rgba(255, 255, 255, 0.05)',
              color: '#fff',
              border: trackView === 'lanes' ? 'none' : '1px solid var(--bg-card-border)',
              borderRadius: 'var(--radius-sm)',
              padding: '8px 16px',
              fontFamily: 'var(--font-racing)',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
            }}
          >
            MULTI-LANE SPRINT
          </button>
        </div>
      </div>

      {/* Race Status Ribbon */}
      <RaceStatus race={race} connected={connected} />

      {/* Victory Celebration Alert Banner */}
      {isFinished && (
        <div
          className="glass-card"
          style={{
            padding: '24px',
            background: 'linear-gradient(135deg, rgba(0, 230, 118, 0.15) 0%, rgba(255, 184, 0, 0.1) 100%)',
            border: '2px solid var(--neon-green)',
            boxShadow: '0 0 30px rgba(0, 230, 118, 0.3)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ fontSize: '42px' }}>🏁</div>
            <div>
              <div
                style={{
                  fontFamily: 'var(--font-racing)',
                  fontSize: '0.85rem',
                  fontWeight: 800,
                  color: 'var(--neon-green)',
                  letterSpacing: '1px',
                }}
              >
                CHECKERED FLAG • DELIVERY COMPLETE
              </div>
              <h2 style={{ fontSize: '1.6rem', color: '#fff' }}>
                Winner: {winner?.name || primaryRacer?.name}!
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Your piping hot food has arrived at the finish line. Rewards & XP have been credited!
              </p>
            </div>
          </div>

          <Button
            variant="nitro"
            size="md"
            onClick={() => navigate('/order')}
            icon={ShoppingBag}
          >
            ORDER ANOTHER RACE
          </Button>
        </div>
      )}

      {/* Main Track Display (Map or Lanes) */}
      {trackView === 'map' ? (
        <RaceMap
          racers={race?.racers || []}
          primaryRacerId={race?.racerId}
          nitroActive={nitroActive}
          onTriggerNitro={triggerNitroBoost}
          isFinished={isFinished}
        />
      ) : (
        <RaceTrack
          racers={race?.racers || []}
          primaryRacerId={race?.racerId}
          nitroActive={nitroActive}
        />
      )}

      {/* AI Commentator Banner */}
      <RaceCommentary
        latestMessage={events[0]}
        racerLeader={leaderboard[0] || primaryRacer}
        speed={primaryRacer?.speed}
      />

      {/* Telemetry & Controls 2-Column Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '20px',
        }}
      >
        {/* Left Column: ETA & Order Timeline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <ETAWidget
            etaSeconds={race?.etaSeconds}
            progress={race?.progress}
            speed={primaryRacer?.speed}
            isFinished={isFinished}
          />
          <OrderStatusTimeline
            currentStatus={isFinished ? 'delivered' : 'out_for_delivery'}
          />
        </div>

        {/* Right Column: Prediction Challenge & Live Broadcast Event Feed */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <PredictionCard
            racers={race?.racers || []}
            userPrediction={userPrediction}
            onSubmitPrediction={submitPrediction}
            isFinished={isFinished}
            winner={winner}
          />
          <RaceEventFeed events={events} />
        </div>
      </div>
    </div>
  );
}

export default RacePage;

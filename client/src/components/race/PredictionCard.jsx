import React, { useState } from 'react';
import { Trophy, Sparkles, CheckCircle2, Zap } from 'lucide-react';
import Button from '../common/Button';
import { DEMO_RACERS } from '../../utils/constants';

export function PredictionCard({
  racers = DEMO_RACERS,
  userPrediction,
  onSubmitPrediction,
  isFinished = false,
  winner,
}) {
  const [selectedRacerId, setSelectedRacerId] = useState(
    userPrediction?.predictedRacerId || racers[0]?.id
  );
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (userPrediction || isFinished) return;
    setSubmitting(true);
    try {
      await onSubmitPrediction(selectedRacerId);
    } finally {
      setSubmitting(false);
    }
  };

  const predictedRacer = racers.find(
    (r) => r.id === (userPrediction?.predictedRacerId || selectedRacerId)
  );

  const isWon = isFinished && winner && userPrediction && userPrediction.predictedRacerId === winner.id;

  return (
    <div
      className="glass-card"
      style={{
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        border: '1px solid rgba(255, 184, 0, 0.3)',
        background: 'linear-gradient(135deg, rgba(255, 184, 0, 0.05) 0%, rgba(10, 14, 23, 0.9) 100%)',
      }}
    >
      {/* Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Trophy size={18} color="var(--neon-gold)" />
          <h4
            style={{
              fontFamily: 'var(--font-racing)',
              fontSize: '1rem',
              color: 'var(--neon-gold)',
              letterSpacing: '1px',
              textTransform: 'uppercase',
            }}
          >
            AI-ASSISTED WINNER PREDICTION
          </h4>
        </div>
        <span
          style={{
            fontFamily: 'var(--font-telemetry)',
            fontSize: '0.72rem',
            color: 'var(--neon-gold)',
            background: 'rgba(255, 184, 0, 0.1)',
            padding: '2px 8px',
            borderRadius: '4px',
            border: '1px solid rgba(255, 184, 0, 0.3)',
          }}
        >
          WIN +300 PTS & BADGE
        </span>
      </div>

      <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
        Lock in your prediction before the race ends! Rank predictions use simulated ETA telemetry calculations.
      </p>

      {/* When prediction already made */}
      {userPrediction ? (
        <div
          style={{
            background: isFinished
              ? isWon
                ? 'rgba(0, 230, 118, 0.15)'
                : 'rgba(255, 51, 102, 0.15)'
              : 'rgba(0, 240, 255, 0.08)',
            border: `1px solid ${
              isFinished
                ? isWon
                  ? 'var(--neon-green)'
                  : 'var(--neon-crimson)'
                : 'var(--neon-cyan)'
            }`,
            padding: '16px',
            borderRadius: 'var(--radius-sm)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '28px' }}>{predictedRacer?.avatar || '🏎️'}</span>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontWeight: 700, color: '#fff' }}>{predictedRacer?.name}</span>
                <span
                  style={{
                    fontSize: '0.7rem',
                    fontFamily: 'var(--font-telemetry)',
                    color: 'var(--neon-gold)',
                  }}
                >
                  ({predictedRacer?.odds || '2.0x'})
                </span>
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {isFinished
                  ? isWon
                    ? '🎉 CORRECT PREDICTION! +300 PTS EARNED!'
                    : `Finished #${predictedRacer?.rank || 2} • Winner: ${winner?.name}`
                  : 'Prediction Locked • Awaiting Finish Line'}
              </span>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            {isFinished ? (
              <span
                style={{
                  fontFamily: 'var(--font-telemetry)',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  color: isWon ? 'var(--neon-green)' : 'var(--neon-crimson)',
                }}
              >
                {isWon ? '+300 PTS' : '+50 XP'}
              </span>
            ) : (
              <span className="live-pulse-dot" />
            )}
          </div>
        </div>
      ) : (
        /* Racer Selection Buttons */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
              gap: '8px',
            }}
          >
            {racers.map((racer) => {
              const isSelected = selectedRacerId === racer.id;
              return (
                <button
                  key={racer.id}
                  onClick={() => setSelectedRacerId(racer.id)}
                  disabled={isFinished}
                  style={{
                    background: isSelected ? 'rgba(0, 240, 255, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                    border: isSelected ? '2px solid var(--neon-cyan)' : '1px solid var(--bg-card-border)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '10px 8px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px',
                    cursor: isFinished ? 'not-allowed' : 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <span style={{ fontSize: '20px' }}>{racer.avatar}</span>
                  <span
                    style={{
                      fontFamily: 'var(--font-racing)',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      color: isSelected ? '#FFFFFF' : 'var(--text-secondary)',
                      textAlign: 'center',
                    }}
                  >
                    {racer.name}
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-telemetry)',
                      fontSize: '0.7rem',
                      color: 'var(--neon-gold)',
                    }}
                  >
                    ODDS: {racer.odds}
                  </span>
                </button>
              );
            })}
          </div>

          <Button
            variant="gold"
            size="md"
            onClick={handleSubmit}
            loading={submitting}
            disabled={isFinished}
            icon={Sparkles}
            style={{ width: '100%', marginTop: '4px' }}
          >
            CONFIRM WINNER PREDICTION
          </Button>
        </div>
      )}
    </div>
  );
}

export default PredictionCard;

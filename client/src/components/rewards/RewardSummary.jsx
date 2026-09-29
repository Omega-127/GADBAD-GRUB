import React, { useState } from 'react';
import { Award, Zap, Gift, Check, Sparkles } from 'lucide-react';
import Button from '../common/Button';
import { formatPoints } from '../../utils/formatCurrency';

export function RewardSummary({ user, onRedeem }) {
  const [redeemed, setRedeemed] = useState({});

  const vouchers = [
    { id: 'v1', title: '$5 Off Next Race Order', cost: 500, desc: 'Applies to any meal above $15' },
    { id: 'v2', title: 'Free Nitro Drink Upgrade', cost: 300, desc: 'Add high-octane shake or soda' },
    { id: 'v3', title: 'VIP Supercharger Priority', cost: 800, desc: 'Zero delivery fee on next 3 races' },
  ];

  const handleRedeem = (voucher) => {
    if (user.points < voucher.cost || redeemed[voucher.id]) return;
    setRedeemed((prev) => ({ ...prev, [voucher.id]: true }));
    if (onRedeem) onRedeem(voucher);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Banner Stats */}
      <div
        className="glass-card"
        style={{
          padding: '28px',
          background: 'linear-gradient(135deg, rgba(255, 184, 0, 0.1) 0%, rgba(121, 40, 202, 0.08) 100%)',
          border: '1px solid rgba(255, 184, 0, 0.3)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '20px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: 'rgba(255, 184, 0, 0.2)',
              border: '2px solid var(--neon-gold)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '32px',
              boxShadow: '0 0 20px rgba(255, 184, 0, 0.4)',
            }}
          >
            👑
          </div>
          <div>
            <span
              style={{
                fontFamily: 'var(--font-racing)',
                fontSize: '0.85rem',
                color: 'var(--neon-gold)',
                letterSpacing: '1px',
                textTransform: 'uppercase',
              }}
            >
              SPEED RACER REWARDS VAULT
            </span>
            <h2 style={{ fontSize: '1.8rem', color: '#FFFFFF', lineHeight: 1.1 }}>
              {formatPoints(user.points)}
            </h2>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              Current Level: <strong style={{ color: '#fff' }}>Level {user.level} Master</strong> ({user.xp} Total XP)
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              background: 'rgba(0, 0, 0, 0.4)',
              padding: '12px 18px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              textAlign: 'center',
            }}
          >
            <div style={{ fontFamily: 'var(--font-telemetry)', color: 'var(--neon-green)', fontSize: '1.2rem', fontWeight: 800 }}>
              {user.badges?.length || 4} / 5
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>BADGES UNLOCKED</div>
          </div>
        </div>
      </div>

      {/* Vouchers Redeem Section */}
      <div>
        <h3 style={{ fontSize: '1.1rem', color: '#fff', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Gift size={18} color="var(--neon-cyan)" /> REDEEM VICTORY POINTS FOR FUEL VOUCHERS
        </h3>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '14px',
          }}
        >
          {vouchers.map((v) => {
            const canAfford = user.points >= v.cost;
            const isClaimed = redeemed[v.id];

            return (
              <div
                key={v.id}
                className="glass-card"
                style={{
                  padding: '18px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '12px',
                  border: isClaimed ? '1px solid var(--neon-green)' : '1px solid var(--bg-card-border)',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ fontSize: '0.95rem', color: '#fff' }}>{v.title}</h4>
                    <span
                      style={{
                        fontFamily: 'var(--font-telemetry)',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        color: 'var(--neon-gold)',
                      }}
                    >
                      {v.cost} PTS
                    </span>
                  </div>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    {v.desc}
                  </p>
                </div>

                <Button
                  variant={isClaimed ? 'ghost' : canAfford ? 'primary' : 'outline'}
                  size="sm"
                  disabled={!canAfford || isClaimed}
                  onClick={() => handleRedeem(v)}
                  style={{ width: '100%' }}
                >
                  {isClaimed ? 'VOUCHER APPLIED' : canAfford ? 'CLAIM DISCOUNT' : 'NEED MORE POINTS'}
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default RewardSummary;

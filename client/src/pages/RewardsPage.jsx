import React, { useState, useEffect } from 'react';
import { Award, Gift, Sparkles, Shield } from 'lucide-react';
import RewardSummary from '../components/rewards/RewardSummary';
import BadgeCard from '../components/rewards/BadgeCard';
import AchievementList from '../components/rewards/AchievementList';
import Loader from '../components/common/Loader';
import ErrorMessage from '../components/common/ErrorMessage';
import rewardsApi from '../services/rewardsApi';
import { useAuth } from '../context/AuthContext';
import { ALL_BADGES } from '../utils/constants';

export function RewardsPage() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadRewards() {
      try {
        setLoading(true);
        const res = await rewardsApi.getUserRewards(user._id);
        setData(res);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadRewards();
  }, [user._id]);

  if (loading) return <Loader message="Unlocking Trophy Vault & Badges..." size="lg" />;
  if (error) return <ErrorMessage message={error} onRetry={() => window.location.reload()} />;

  const userBadges = user.badges || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Page Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="live-pulse-dot" />
          <span
            style={{
              fontFamily: 'var(--font-racing)',
              fontSize: '0.8rem',
              color: 'var(--neon-gold)',
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
            }}
          >
            DRIVER ACCOLADES & REWARDS
          </span>
        </div>
        <h1 style={{ fontSize: '2rem', color: '#FFFFFF', marginTop: '4px' }}>
          TROPHY VAULT & FUEL PERKS
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Earn Victory Points with every race order and winner prediction. Redeem points for discount vouchers and unlock prestigious speed badges!
        </p>
      </div>

      {/* Rewards Balance & Redeemable Fuel Vouchers */}
      <RewardSummary user={user} />

      {/* Badges Grid */}
      <div>
        <h3
          style={{
            fontFamily: 'var(--font-racing)',
            fontSize: '1.15rem',
            color: '#FFFFFF',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <Award size={20} color="var(--neon-gold)" /> OFFICIAL RACING BADGES ({userBadges.length}/{ALL_BADGES.length})
        </h3>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
          }}
        >
          {ALL_BADGES.map((badge) => (
            <BadgeCard
              key={badge.code}
              badge={badge}
              isUnlocked={userBadges.includes(badge.code)}
            />
          ))}
        </div>
      </div>

      {/* Historical Achievements Activity Log */}
      <AchievementList history={data?.history || []} />
    </div>
  );
}

export default RewardsPage;

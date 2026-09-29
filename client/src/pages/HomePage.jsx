import React from 'react';
import RaceWatchHub from '../components/dashboard/RaceWatchHub';
import LiveUpdates from '../components/dashboard/LiveUpdates';
import NextOrdersPredictions from '../components/dashboard/NextOrdersPredictions';
import CompetitionPanel from '../components/dashboard/CompetitionPanel';
import ProfileAchievements from '../components/dashboard/ProfileAchievements';
import RewardsBadgesPanel from '../components/dashboard/RewardsBadgesPanel';

export function HomePage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Hero: Race Watch Hub */}
      <RaceWatchHub />

      {/* 2-Column Responsive Dashboard Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '20px',
        }}
      >
        {/* Left Column: Live Circuit Updates & Predictions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <NextOrdersPredictions />
          <LiveUpdates />
        </div>

        {/* Right Column: Racer Grid, Driver Achievements, & Badges */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <CompetitionPanel />
          <ProfileAchievements />
          <RewardsBadgesPanel />
        </div>
      </div>
    </div>
  );
}

export default HomePage;

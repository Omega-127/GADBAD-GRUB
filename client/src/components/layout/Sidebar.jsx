import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Flame, 
  UtensilsCrossed, 
  Flag, 
  Trophy, 
  Award, 
  User, 
  Radio, 
  Zap,
  Compass
} from 'lucide-react';

export function Sidebar() {
  const navItems = [
    { to: '/', label: 'Race Watch Hub', icon: Compass },
    { to: '/order', label: 'Order Pit Stop', icon: UtensilsCrossed },
    { to: '/race', label: 'Live Race Track', icon: Flag, badge: 'LIVE' },
    { to: '/leaderboard', label: 'Racer Standings', icon: Trophy },
    { to: '/rewards', label: 'Rewards & Badges', icon: Award },
    { to: '/profile', label: 'Driver License', icon: User },
  ];

  return (
    <aside
      className="sidebar-desktop"
      style={{
        width: 'var(--sidebar-width)',
        background: 'rgba(12, 17, 29, 0.95)',
        backdropFilter: 'blur(16px)',
        borderRight: '1px solid var(--bg-card-border)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '24px 16px',
        flexShrink: 0,
      }}
    >
      <div>
        {/* Navigation Category Label */}
        <div
          style={{
            fontFamily: 'var(--font-racing)',
            fontSize: '0.75rem',
            fontWeight: 700,
            color: 'var(--text-muted)',
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
            marginBottom: '16px',
            paddingLeft: '12px',
          }}
        >
          RACING COCKPIT
        </div>

        {/* Navigation Links */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                style={({ isActive }) => ({
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-sm)',
                  fontFamily: 'var(--font-racing)',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  letterSpacing: '0.4px',
                  transition: 'all 0.2s ease',
                  color: isActive ? '#FFFFFF' : 'var(--text-secondary)',
                  background: isActive
                    ? 'linear-gradient(90deg, rgba(0, 240, 255, 0.15) 0%, rgba(121, 40, 202, 0.08) 100%)'
                    : 'transparent',
                  borderLeft: isActive ? '3px solid var(--neon-cyan)' : '3px solid transparent',
                  boxShadow: isActive ? '0 0 15px rgba(0, 240, 255, 0.15)' : 'none',
                })}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Icon size={18} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    style={{
                      background: 'rgba(255, 51, 102, 0.2)',
                      color: 'var(--neon-crimson)',
                      border: '1px solid rgba(255, 51, 102, 0.5)',
                      fontSize: '0.65rem',
                      fontWeight: 800,
                      padding: '2px 6px',
                      borderRadius: '4px',
                      fontFamily: 'var(--font-telemetry)',
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Pit Stop Promotion Box */}
      <div
        className="glass-card"
        style={{
          padding: '16px',
          background: 'linear-gradient(135deg, rgba(255, 51, 102, 0.1) 0%, rgba(255, 184, 0, 0.05) 100%)',
          border: '1px solid rgba(255, 51, 102, 0.25)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <Zap size={16} color="var(--neon-gold)" />
          <span
            style={{
              fontFamily: 'var(--font-racing)',
              fontSize: '0.85rem',
              fontWeight: 700,
              color: 'var(--neon-gold)',
            }}
          >
            SPEED BOOST ACTIVE
          </span>
        </div>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.4, marginBottom: '10px' }}>
          Predict race winners to earn double XP and unlock exclusive food discount vouchers!
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span className="live-pulse-dot" />
          <span style={{ fontSize: '0.7rem', color: 'var(--neon-cyan)', fontFamily: 'var(--font-telemetry)' }}>
            DEMO ENGINE 2.0 READY
          </span>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .sidebar-desktop {
            display: none !important;
          }
        }
      `}</style>
    </aside>
  );
}

export default Sidebar;

import React from 'react';
import { NavLink } from 'react-router-dom';
import { Compass, UtensilsCrossed, Flag, Trophy, Award, User } from 'lucide-react';

export function BottomNavigation() {
  const items = [
    { to: '/', label: 'Watch', icon: Compass },
    { to: '/order', label: 'Order', icon: UtensilsCrossed },
    { to: '/race', label: 'Race', icon: Flag, highlight: true },
    { to: '/leaderboard', label: 'Rank', icon: Trophy },
    { to: '/rewards', label: 'Rewards', icon: Award },
    { to: '/profile', label: 'Driver', icon: User },
  ];

  return (
    <nav
      className="bottom-nav-mobile"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: 'var(--bottom-nav-height)',
        background: 'rgba(10, 14, 23, 0.94)',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid var(--bg-card-border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        zIndex: 40,
        padding: '0 8px',
      }}
    >
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            style={({ isActive }) => ({
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textDecoration: 'none',
              gap: '3px',
              flex: 1,
              padding: '6px 0',
              color: isActive ? (item.highlight ? 'var(--neon-crimson)' : 'var(--neon-cyan)') : 'var(--text-muted)',
              transition: 'all 0.15s ease',
            })}
          >
            {({ isActive }) => (
              <>
                <div
                  style={{
                    position: 'relative',
                    transform: isActive ? 'scale(1.1)' : 'scale(1)',
                    transition: 'transform 0.15s ease',
                  }}
                >
                  <Icon size={20} />
                  {item.highlight && (
                    <span
                      style={{
                        position: 'absolute',
                        top: -2,
                        right: -4,
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background: 'var(--neon-crimson)',
                        boxShadow: '0 0 6px var(--neon-crimson)',
                      }}
                    />
                  )}
                </div>
                <span
                  style={{
                    fontSize: '0.68rem',
                    fontFamily: 'var(--font-racing)',
                    fontWeight: isActive ? 700 : 500,
                    letterSpacing: '0.3px',
                  }}
                >
                  {item.label}
                </span>
              </>
            )}
          </NavLink>
        );
      })}

      <style>{`
        @media (min-width: 901px) {
          .bottom-nav-mobile {
            display: none !important;
          }
        }
      `}</style>
    </nav>
  );
}

export default BottomNavigation;

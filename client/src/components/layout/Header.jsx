import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Zap, Trophy, Flame } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import DemoModeBadge from '../common/DemoModeBadge';
import { formatPoints } from '../../utils/formatCurrency';

export function Header() {
  const { totalQuantity, openCart } = useCart();
  const { user } = useAuth();
  const location = useLocation();

  return (
    <header
      style={{
        height: 'var(--header-height)',
        background: 'rgba(10, 14, 23, 0.85)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--bg-card-border)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
      }}
    >
      {/* Brand Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <Link
          to="/"
          style={{
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #00F0FF 0%, #7928CA 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '22px',
              boxShadow: '0 0 15px rgba(0, 240, 255, 0.4)',
            }}
          >
            🏎️
          </div>
          <div>
            <div
              style={{
                fontFamily: 'var(--font-telemetry)',
                fontWeight: 900,
                fontSize: '1.25rem',
                letterSpacing: '1px',
                color: '#FFFFFF',
                lineHeight: 1.1,
              }}
            >
              GADBAD <span style={{ color: 'var(--neon-gold)' }}>GRUB</span>
            </div>
            <div
              style={{
                fontFamily: 'var(--font-racing)',
                fontSize: '0.72rem',
                letterSpacing: '2px',
                color: 'var(--neon-cyan)',
                textTransform: 'uppercase',
              }}
            >
              Speed Racing Food
            </div>
          </div>
        </Link>

        {/* Demo Mode Badge */}
        <div className="header-badge-desktop" style={{ marginLeft: '12px' }}>
          <DemoModeBadge source="simulated" />
        </div>
      </div>

      {/* Header Actions: User XP, Points, Cart */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* User Telemetry Snippet */}
        <Link
          to="/profile"
          style={{
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '6px 14px',
            borderRadius: 'var(--radius-full)',
            transition: 'all 0.2s ease',
          }}
        >
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'rgba(255, 184, 0, 0.15)',
              border: '1px solid rgba(255, 184, 0, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px',
            }}
          >
            {user.avatar || '🏎️'}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span
              style={{
                fontFamily: 'var(--font-telemetry)',
                fontSize: '0.8rem',
                fontWeight: 700,
                color: 'var(--neon-gold)',
                lineHeight: 1.2,
              }}
            >
              {formatPoints(user.points)}
            </span>
            <span
              style={{
                fontFamily: 'var(--font-racing)',
                fontSize: '0.72rem',
                color: 'var(--text-secondary)',
                letterSpacing: '0.5px',
              }}
            >
              LVL {user.level} RACER
            </span>
          </div>
        </Link>

        {/* Quick Cart Button with counter */}
        <button
          onClick={openCart}
          style={{
            position: 'relative',
            background: 'var(--grad-primary)',
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            padding: '9px 14px',
            color: '#fff',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontFamily: 'var(--font-racing)',
            fontWeight: 700,
            letterSpacing: '0.5px',
            boxShadow: '0 4px 15px rgba(0, 240, 255, 0.3)',
            transition: 'transform 0.15s ease',
          }}
        >
          <ShoppingBag size={18} />
          <span className="cart-text-desktop">CART</span>
          {totalQuantity > 0 && (
            <span
              style={{
                position: 'absolute',
                top: -6,
                right: -6,
                background: 'var(--neon-crimson)',
                color: '#fff',
                fontSize: '0.72rem',
                fontWeight: 900,
                borderRadius: '50%',
                width: '20px',
                height: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 8px var(--neon-crimson)',
              }}
            >
              {totalQuantity}
            </span>
          )}
        </button>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .header-badge-desktop, .cart-text-desktop {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
}

export default Header;

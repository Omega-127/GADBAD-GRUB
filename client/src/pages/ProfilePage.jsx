import React, { useState, useEffect } from 'react';
import { User, Shield, Trophy, Flame, RotateCcw, CheckCircle, Package } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import orderApi from '../services/orderApi';
import { formatPoints, formatCurrency } from '../utils/formatCurrency';
import { formatTimeAgo } from '../utils/formatTime';
import Button from '../components/common/Button';

export function ProfilePage() {
  const { user, setUser, isDemoMode, toggleDemoMode } = useAuth();
  const [orders, setOrders] = useState([]);
  const [nameInput, setNameInput] = useState(user.displayName);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    async function loadOrders() {
      try {
        const list = await orderApi.getUserOrders(user._id);
        setOrders(list);
      } catch (err) {
        console.error('Failed to load user orders', err);
      }
    }
    loadOrders();
  }, [user._id]);

  const handleSaveProfile = () => {
    setUser((prev) => ({ ...prev, displayName: nameInput }));
    setIsEditing(false);
  };

  const handleResetData = () => {
    if (window.confirm('Reset all demo race stats, points, and orders to defaults?')) {
      localStorage.clear();
      sessionStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Page Title */}
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
            DRIVER COCKPIT IDENTITY
          </span>
        </div>
        <h1 style={{ fontSize: '2rem', color: '#FFFFFF', marginTop: '4px' }}>
          RACER PROFILE & TELEMETRY
        </h1>
      </div>

      {/* Driver License Card */}
      <div
        className="glass-card"
        style={{
          padding: '28px',
          background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.08) 0%, rgba(10, 14, 23, 0.95) 100%)',
          border: '2px solid var(--neon-cyan)',
          boxShadow: '0 0 30px rgba(0, 240, 255, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            {/* Avatar */}
            <div
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                background: 'rgba(0, 240, 255, 0.15)',
                border: '3px solid var(--neon-cyan)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '36px',
                boxShadow: '0 0 20px rgba(0, 240, 255, 0.3)',
              }}
            >
              {user.avatar || '🏎️'}
            </div>

            <div>
              {isEditing ? (
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    style={{
                      padding: '6px 12px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid var(--neon-cyan)',
                      borderRadius: '4px',
                      color: '#fff',
                      fontSize: '1.1rem',
                      fontFamily: 'var(--font-racing)',
                    }}
                  />
                  <Button variant="primary" size="sm" onClick={handleSaveProfile}>
                    Save
                  </Button>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <h2 style={{ fontSize: '1.6rem', color: '#fff' }}>{user.displayName}</h2>
                  <button
                    onClick={() => setIsEditing(true)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--neon-cyan)',
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                      fontFamily: 'var(--font-racing)',
                      textDecoration: 'underline',
                    }}
                  >
                    Edit
                  </button>
                </div>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                <span
                  style={{
                    fontFamily: 'var(--font-racing)',
                    fontSize: '0.85rem',
                    color: 'var(--neon-gold)',
                    fontWeight: 700,
                  }}
                >
                  LEVEL {user.level} SPEED GOURMET
                </span>
                <span style={{ color: 'var(--text-muted)' }}>•</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Driver ID: {user._id}
                </span>
              </div>
            </div>
          </div>

          {/* Points Pill */}
          <div
            style={{
              background: 'rgba(0, 0, 0, 0.4)',
              border: '1px solid rgba(255, 184, 0, 0.4)',
              padding: '12px 20px',
              borderRadius: 'var(--radius-sm)',
              textAlign: 'right',
            }}
          >
            <div style={{ fontFamily: 'var(--font-telemetry)', fontSize: '1.5rem', fontWeight: 900, color: 'var(--neon-gold)' }}>
              {formatPoints(user.points)}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>AVAILABLE VICTORY POINTS</div>
          </div>
        </div>

        {/* Telemetry Stats Strip */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '12px',
            paddingTop: '16px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '12px', borderRadius: '8px' }}>
            <div style={{ fontFamily: 'var(--font-telemetry)', color: 'var(--neon-cyan)', fontSize: '1.2rem', fontWeight: 800 }}>
              {user.xp}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>TOTAL XP EARNED</div>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '12px', borderRadius: '8px' }}>
            <div style={{ fontFamily: 'var(--font-telemetry)', color: 'var(--neon-green)', fontSize: '1.2rem', fontWeight: 800 }}>
              {user.winRate || '68%'}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>PREDICTION ACCURACY</div>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '12px', borderRadius: '8px' }}>
            <div style={{ fontFamily: 'var(--font-telemetry)', color: 'var(--neon-gold)', fontSize: '1.2rem', fontWeight: 800 }}>
              {user.badges?.length || 4}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>TROPHIES WON</div>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '12px', borderRadius: '8px' }}>
            <div style={{ fontFamily: 'var(--font-telemetry)', color: '#FFFFFF', fontSize: '1.2rem', fontWeight: 800 }}>
              {orders.length}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>ORDERS RACED</div>
          </div>
        </div>
      </div>

      {/* Driver Controls & Session Management */}
      <div
        className="glass-card"
        style={{
          padding: '20px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
        }}
      >
        <div>
          <h4 style={{ fontSize: '1rem', color: '#fff', marginBottom: '4px' }}>SIMULATION & DEMO CONTROLS</h4>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Toggle between simulated telemetry and backend API provider mode.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <Button
            variant={isDemoMode ? 'gold' : 'outline'}
            size="sm"
            onClick={toggleDemoMode}
          >
            {isDemoMode ? 'SIMULATED DEMO: ON' : 'BACKEND API: ON'}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleResetData}
            icon={RotateCcw}
          >
            RESET DEMO DATA
          </Button>
        </div>
      </div>

      {/* Recent Orders History */}
      <div
        className="glass-card"
        style={{
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Package size={18} color="var(--neon-cyan)" />
          <h3 style={{ fontSize: '1.1rem', color: '#fff' }}>RECENT RACE ORDERS HISTORY</h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {orders.length === 0 ? (
            <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
              No previous orders found. Place an order to start your race history!
            </div>
          ) : (
            orders.map((ord) => (
              <div
                key={ord._id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 16px',
                  background: 'rgba(255, 255, 255, 0.02)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--bg-card-border)',
                  flexWrap: 'wrap',
                  gap: '12px',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontWeight: 700, color: '#fff' }}>
                      {ord.restaurantName || 'Hyper Sonic Pizza'}
                    </span>
                    <span
                      style={{
                        fontSize: '0.7rem',
                        background: 'rgba(0, 230, 118, 0.1)',
                        color: 'var(--neon-green)',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontFamily: 'var(--font-telemetry)',
                      }}
                    >
                      {ord.status?.toUpperCase() || 'DELIVERED'}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    Order {ord._id} • {formatTimeAgo(ord.createdAt)}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: 'var(--font-telemetry)', fontWeight: 800, color: 'var(--neon-gold)' }}>
                    {formatCurrency(ord.total || 18.98)}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--neon-cyan)' }}>
                    +100 RACE XP
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;

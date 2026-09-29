import React, { useState } from 'react';
import { Radio, Info, X } from 'lucide-react';

export function DemoModeBadge({ source = 'simulated', detailed = false }) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div
        onClick={() => setShowModal(true)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(255, 184, 0, 0.12)',
          border: '1px solid rgba(255, 184, 0, 0.4)',
          borderRadius: 'var(--radius-full)',
          padding: '4px 12px',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
        }}
        title="Click to view simulated tracking information"
      >
        <span
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: '#FFB800',
            boxShadow: '0 0 8px #FFB800',
            animation: 'pulseNeon 1.5s infinite',
          }}
        />
        <span
          style={{
            fontFamily: 'var(--font-telemetry)',
            fontSize: '0.75rem',
            fontWeight: 700,
            color: '#FFB800',
            letterSpacing: '0.8px',
            textTransform: 'uppercase',
          }}
        >
          {source === 'simulated' ? 'SIMULATED DEMO TRACKING' : 'LIVE PROVIDER LINK'}
        </span>
        <Info size={12} color="#FFB800" />
      </div>

      {showModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(5, 8, 15, 0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '16px',
          }}
          onClick={() => setShowModal(false)}
        >
          <div
            className="glass-card"
            style={{
              maxWidth: '480px',
              width: '100%',
              padding: '24px',
              border: '1px solid rgba(255, 184, 0, 0.3)',
              boxShadow: '0 0 30px rgba(255, 184, 0, 0.2)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Radio color="#FFB800" size={20} />
                <h3 style={{ color: '#FFB800', fontSize: '1.2rem' }}>SIMULATION TRANSPARENCY</h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '14px' }}>
              Virtual speed racing is an entertaining gamification layer on top of standard food delivery.
            </p>

            <ul style={{ color: 'var(--text-primary)', fontSize: '0.88rem', lineHeight: '1.7', paddingLeft: '20px', marginBottom: '16px' }}>
              <li>Rider positions and events are generated deterministically by the demo simulator.</li>
              <li>Estimated arrival times (ETA) are virtual estimates based on order progress, not real-world road speeds.</li>
              <li>Gadbad Grub promotes road safety: Delivery riders adhere to speed regulations and never race on real roads.</li>
            </ul>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  background: 'var(--grad-gold)',
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  padding: '8px 18px',
                  color: '#000',
                  fontWeight: 700,
                  fontFamily: 'var(--font-racing)',
                  cursor: 'pointer',
                }}
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default DemoModeBadge;

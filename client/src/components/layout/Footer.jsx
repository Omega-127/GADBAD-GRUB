import React from 'react';
import { ShieldCheck, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer
      style={{
        borderTop: '1px solid var(--bg-card-border)',
        background: 'rgba(7, 10, 18, 0.95)',
        padding: '32px 24px 80px 24px',
        color: 'var(--text-secondary)',
        fontSize: '0.85rem',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          <div>
            <div
              style={{
                fontFamily: 'var(--font-telemetry)',
                fontWeight: 900,
                fontSize: '1.1rem',
                color: '#FFFFFF',
                marginBottom: '4px',
              }}
            >
              🏎️ GADBAD <span style={{ color: 'var(--neon-gold)' }}>GRUB</span>
            </div>
            <p style={{ fontStyle: 'italic', color: 'var(--neon-cyan)', fontSize: '0.9rem' }}>
              “Every Order Is a Race. Every Bite Is a Victory!”
            </p>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(0, 230, 118, 0.08)',
              border: '1px solid rgba(0, 230, 118, 0.25)',
              padding: '8px 14px',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--neon-green)',
              fontSize: '0.8rem',
            }}
          >
            <ShieldCheck size={16} />
            <span>Virtual Racing Layer • Strict Road Safety Standards Enforced</span>
          </div>
        </div>

        <hr style={{ borderColor: 'rgba(255, 255, 255, 0.06)' }} />

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '12px',
            fontSize: '0.78rem',
            color: 'var(--text-muted)',
          }}
        >
          <div>
            © {new Date().getFullYear()} Gadbad Grub Inc. All rights reserved. Virtual racing algorithms for hackathon demonstration.
          </div>
          <div>
            Designed with <Heart size={12} color="var(--neon-crimson)" style={{ display: 'inline', verticalAlign: 'middle' }} /> for speed food lovers worldwide.
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

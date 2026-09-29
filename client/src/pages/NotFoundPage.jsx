import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, AlertOctagon } from 'lucide-react';
import Button from '../components/common/Button';

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        gap: '20px',
        padding: '32px 16px',
      }}
    >
      <div
        style={{
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          background: 'rgba(255, 51, 102, 0.15)',
          border: '2px solid var(--neon-crimson)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--neon-crimson)',
          boxShadow: '0 0 20px rgba(255, 51, 102, 0.3)',
        }}
      >
        <AlertOctagon size={36} />
      </div>

      <div>
        <div
          style={{
            fontFamily: 'var(--font-telemetry)',
            fontSize: '4rem',
            fontWeight: 900,
            color: 'var(--neon-crimson)',
            lineHeight: 1,
          }}
        >
          404
        </div>
        <h2 style={{ fontSize: '1.6rem', color: '#fff', marginTop: '8px' }}>
          OFF-TRACK DETOUR DETECTED!
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '400px', margin: '8px auto' }}>
          Your racer has veered off the asphalt course into uncharted terrain. Let's steer you back to the pit lane!
        </p>
      </div>

      <Button
        variant="primary"
        size="lg"
        onClick={() => navigate('/')}
        icon={Compass}
      >
        RETURN TO RACE WATCH HUB
      </Button>
    </div>
  );
}

export default NotFoundPage;

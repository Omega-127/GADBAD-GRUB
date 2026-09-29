import React from 'react';
import { Zap, Navigation, Compass, ShieldAlert } from 'lucide-react';
import RiderMarker from './RiderMarker';

export function RaceMap({
  racers = [],
  primaryRacerId,
  nitroActive = false,
  onTriggerNitro,
  isFinished = false,
}) {
  // SVG curved circuit path coordinates
  // Path starts at (60, 260) -> Curves through (200, 80) -> (450, 70) -> (680, 200) -> (500, 320) -> (720, 320)
  const pathD = "M 80 260 C 140 120, 260 80, 420 80 C 580 80, 680 180, 660 260 C 640 330, 480 340, 440 250 C 400 160, 250 180, 220 280 C 200 350, 320 380, 520 380 C 640 380, 720 340, 780 260";

  // Approximate coordinate interpolation along circuit for each progress percent
  const getCoordinates = (progress = 0) => {
    const t = Math.min(100, Math.max(0, progress)) / 100;
    // Multi-segment polynomial / spline approximation for smooth SVG track
    let x, y;
    if (t < 0.25) {
      const u = t / 0.25;
      x = 80 + (420 - 80) * u;
      y = 260 - Math.sin(u * Math.PI) * 180;
    } else if (t < 0.5) {
      const u = (t - 0.25) / 0.25;
      x = 420 + (660 - 420) * u;
      y = 80 + (260 - 80) * Math.sin(u * (Math.PI / 2));
    } else if (t < 0.75) {
      const u = (t - 0.5) / 0.25;
      x = 660 - (660 - 320) * u;
      y = 260 + (380 - 260) * Math.sin(u * (Math.PI / 2));
    } else {
      const u = (t - 0.75) / 0.25;
      x = 320 + (780 - 320) * u;
      y = 380 - (380 - 260) * u;
    }
    return { x, y };
  };

  return (
    <div
      className="glass-card"
      style={{
        position: 'relative',
        height: '420px',
        overflow: 'hidden',
        background: 'radial-gradient(ellipse at center, #0F172A 0%, #070A11 100%)',
        border: '1px solid rgba(0, 240, 255, 0.3)',
        boxShadow: '0 0 30px rgba(0, 240, 255, 0.15)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Top Map HUD Controls */}
      <div
        style={{
          position: 'absolute',
          top: '16px',
          left: '16px',
          right: '16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 20,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(10, 14, 23, 0.85)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '6px 14px',
            borderRadius: 'var(--radius-full)',
          }}
        >
          <span className="live-pulse-dot" />
          <span
            style={{
              fontFamily: 'var(--font-telemetry)',
              fontSize: '0.8rem',
              color: '#FFFFFF',
              fontWeight: 700,
            }}
          >
            GRID RADAR TELEMETRY
          </span>
        </div>

        {/* Interactive Nitro Boost Button */}
        <button
          onClick={onTriggerNitro}
          disabled={nitroActive || isFinished}
          style={{
            background: nitroActive ? 'var(--neon-green)' : 'var(--grad-nitro)',
            border: 'none',
            borderRadius: 'var(--radius-full)',
            padding: '8px 18px',
            color: '#fff',
            fontFamily: 'var(--font-racing)',
            fontWeight: 800,
            fontSize: '0.85rem',
            letterSpacing: '0.8px',
            cursor: nitroActive || isFinished ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: nitroActive
              ? '0 0 25px rgba(0, 230, 118, 0.8)'
              : '0 0 20px rgba(255, 51, 102, 0.6)',
            animation: nitroActive ? 'pulseNeon 0.5s infinite' : 'none',
            transition: 'all 0.2s ease',
          }}
        >
          <Zap size={16} />
          {nitroActive ? 'NITRO ENGAGED!' : 'PRESS FOR NITRO BOOST (+15 KM/H)'}
        </button>
      </div>

      {/* SVG Canvas Map */}
      <svg
        viewBox="0 0 850 440"
        style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}
      >
        <defs>
          <linearGradient id="trackGlow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00F0FF" />
            <stop offset="50%" stopColor="#9D4EDD" />
            <stop offset="100%" stopColor="#FF3366" />
          </linearGradient>

          {/* Radar Sweep Pattern */}
          <radialGradient id="radarSweep" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(0, 240, 255, 0.15)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>

        {/* Ambient Grid Lines */}
        <circle cx="425" cy="220" r="160" fill="url(#radarSweep)" opacity="0.4" />
        <circle cx="425" cy="220" r="120" stroke="rgba(0, 240, 255, 0.08)" strokeDasharray="4 4" fill="none" />
        <circle cx="425" cy="220" r="220" stroke="rgba(0, 240, 255, 0.08)" strokeDasharray="6 6" fill="none" />

        {/* Circuit Track Outer Glow */}
        <path
          d={pathD}
          fill="none"
          stroke="url(#trackGlow)"
          strokeWidth="24"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.25"
        />

        {/* Main Asphalt Road */}
        <path
          d={pathD}
          fill="none"
          stroke="#1A2234"
          strokeWidth="16"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Road Center Dashed Line */}
        <path
          d={pathD}
          fill="none"
          stroke="rgba(255, 255, 255, 0.4)"
          strokeWidth="2"
          strokeDasharray="8 8"
          strokeLinecap="round"
        />

        {/* Start Gate */}
        <g transform="translate(60, 235)">
          <rect width="40" height="30" rx="6" fill="#0F172A" stroke="#00F0FF" strokeWidth="2" />
          <text x="20" y="20" textAnchor="middle" fill="#00F0FF" fontSize="16">🏪</text>
        </g>

        {/* Finish Gate Checkered */}
        <g transform="translate(760, 235)">
          <rect width="40" height="30" rx="6" fill="#0F172A" stroke="#FFD000" strokeWidth="2" />
          <text x="20" y="20" textAnchor="middle" fill="#FFD000" fontSize="16">🏁</text>
        </g>
      </svg>

      {/* Moving Racer Tokens over the Map */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        {racers.map((racer) => {
          const { x, y } = getCoordinates(racer.progress);
          const percentX = (x / 850) * 100;
          const percentY = (y / 440) * 100;
          const isPrimary = racer.id === primaryRacerId;

          return (
            <div
              key={racer.id}
              style={{
                position: 'absolute',
                left: `${percentX}%`,
                top: `${percentY}%`,
                transition: 'all 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)',
                pointerEvents: 'auto',
              }}
            >
              <RiderMarker
                racer={racer}
                isPrimary={isPrimary}
                nitroActive={nitroActive && isPrimary}
              />
            </div>
          );
        })}
      </div>

      {/* Bottom Map Info Footer */}
      <div
        style={{
          position: 'absolute',
          bottom: '12px',
          left: '16px',
          right: '16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pointerEvents: 'none',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-racing)',
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
          }}
        >
          📍 Virtual telemetry coordinates calibrated for hackathon demo
        </span>
        <span
          style={{
            fontFamily: 'var(--font-telemetry)',
            fontSize: '0.75rem',
            color: 'var(--neon-cyan)',
          }}
        >
          SECTOR 4/4 • TRACK CLEAR
        </span>
      </div>
    </div>
  );
}

export default RaceMap;

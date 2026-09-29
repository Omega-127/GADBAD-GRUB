import React from 'react';
import { CheckCircle2, Clock, Flame, Bike, Trophy } from 'lucide-react';

export function OrderStatusTimeline({ currentStatus = 'out_for_delivery' }) {
  const steps = [
    { key: 'placed', label: 'Order Placed', icon: Clock, desc: 'Sent to restaurant kitchen' },
    { key: 'preparing', label: 'Kitchen Pit Stop', icon: Flame, desc: 'Fresh ingredients sizzled' },
    { key: 'picked_up', label: 'Rider Launch', icon: Bike, desc: 'Engines revved at pickup' },
    { key: 'out_for_delivery', label: 'Speed Race Live', icon: Trophy, desc: 'Rider sprinting to destination' },
    { key: 'delivered', label: 'Victory Bite', icon: CheckCircle2, desc: 'Delivered & rewards settled' },
  ];

  const statusOrder = ['placed', 'preparing', 'picked_up', 'out_for_delivery', 'delivered'];
  const currentIndex = statusOrder.indexOf(currentStatus);

  return (
    <div className="glass-card" style={{ padding: '20px' }}>
      <h4
        style={{
          fontFamily: 'var(--font-racing)',
          fontSize: '1rem',
          color: 'var(--neon-cyan)',
          letterSpacing: '1px',
          textTransform: 'uppercase',
          marginBottom: '16px',
        }}
      >
        🏁 ORDER SPEEDWAY TELEMETRY
      </h4>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', position: 'relative' }}>
        {steps.map((step, idx) => {
          const isDone = idx < currentIndex || currentStatus === 'delivered';
          const isCurrent = idx === currentIndex && currentStatus !== 'delivered';
          const Icon = step.icon;

          return (
            <div
              key={step.key}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '14px',
                position: 'relative',
              }}
            >
              {/* Connecting Line between steps */}
              {idx < steps.length - 1 && (
                <div
                  style={{
                    position: 'absolute',
                    top: '28px',
                    left: '15px',
                    width: '2px',
                    height: 'calc(100% - 10px)',
                    background: isDone ? 'var(--neon-cyan)' : 'rgba(255, 255, 255, 0.1)',
                    boxShadow: isDone ? '0 0 6px var(--neon-cyan)' : 'none',
                    zIndex: 0,
                  }}
                />
              )}

              {/* Status Circle */}
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: isCurrent
                    ? 'var(--grad-nitro)'
                    : isDone
                    ? 'rgba(0, 240, 255, 0.2)'
                    : 'rgba(255, 255, 255, 0.05)',
                  border: isCurrent
                    ? '2px solid #FF3366'
                    : isDone
                    ? '2px solid var(--neon-cyan)'
                    : '1px solid rgba(255, 255, 255, 0.1)',
                  boxShadow: isCurrent ? '0 0 12px #FF3366' : isDone ? '0 0 8px var(--neon-cyan)' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: isCurrent ? '#FFFFFF' : isDone ? 'var(--neon-cyan)' : 'var(--text-muted)',
                  zIndex: 1,
                  flexShrink: 0,
                }}
              >
                <Icon size={16} />
              </div>

              {/* Step Info */}
              <div style={{ flex: 1, paddingTop: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span
                    style={{
                      fontFamily: 'var(--font-racing)',
                      fontWeight: 700,
                      fontSize: '0.92rem',
                      color: isCurrent ? 'var(--neon-gold)' : isDone ? '#FFFFFF' : 'var(--text-muted)',
                    }}
                  >
                    {step.label}
                  </span>
                  {isCurrent && (
                    <span
                      style={{
                        background: 'rgba(255, 51, 102, 0.2)',
                        color: 'var(--neon-crimson)',
                        fontSize: '0.65rem',
                        fontWeight: 800,
                        padding: '2px 6px',
                        borderRadius: '4px',
                        fontFamily: 'var(--font-telemetry)',
                      }}
                    >
                      CURRENT STAGE
                    </span>
                  )}
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  {step.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default OrderStatusTimeline;

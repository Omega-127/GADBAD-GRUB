import React from 'react';
import { Plus, Minus, Trash2 } from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency';

export function CartItem({ item, onUpdateQuantity, onRemove }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px',
        background: 'rgba(255, 255, 255, 0.03)',
        borderRadius: 'var(--radius-sm)',
        border: '1px solid var(--bg-card-border)',
        gap: '12px',
      }}
    >
      {/* Thumbnail */}
      {item.imageUrl && (
        <img
          src={item.imageUrl}
          alt={item.name}
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '8px',
            objectFit: 'cover',
            flexShrink: 0,
          }}
        />
      )}

      {/* Item Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <h4
          style={{
            fontSize: '0.9rem',
            color: '#FFFFFF',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            fontFamily: 'var(--font-main)',
            fontWeight: 600,
          }}
        >
          {item.name}
        </h4>
        <span
          style={{
            fontSize: '0.8rem',
            color: 'var(--neon-gold)',
            fontFamily: 'var(--font-telemetry)',
          }}
        >
          {formatCurrency(item.price)} each
        </span>
      </div>

      {/* Quantity Controls */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(0, 0, 0, 0.4)',
          padding: '4px 8px',
          borderRadius: '6px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <button
          onClick={() => onUpdateQuantity(item._id, item.quantity - 1)}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Minus size={14} />
        </button>
        <span
          style={{
            fontFamily: 'var(--font-telemetry)',
            fontWeight: 700,
            fontSize: '0.85rem',
            minWidth: '18px',
            textAlign: 'center',
          }}
        >
          {item.quantity}
        </span>
        <button
          onClick={() => onUpdateQuantity(item._id, item.quantity + 1)}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--neon-cyan)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Plus size={14} />
        </button>
      </div>

      {/* Total & Remove */}
      <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
        <span
          style={{
            fontFamily: 'var(--font-telemetry)',
            fontWeight: 700,
            fontSize: '0.9rem',
            color: '#FFFFFF',
          }}
        >
          {formatCurrency(item.price * item.quantity)}
        </span>
        <button
          onClick={() => onRemove(item._id)}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '2px',
          }}
          title="Remove item"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}

export default CartItem;

import React, { useState } from 'react';
import { Plus, Check, Flame } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../utils/formatCurrency';

export function FoodItemCard({ item, restaurant }) {
  const { addItem, items } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  const cartQuantity = items.find((i) => i._id === item._id)?.quantity || 0;

  const handleAdd = () => {
    addItem(item, restaurant);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 900);
  };

  return (
    <div
      className="glass-card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '16px',
        gap: '12px',
        position: 'relative',
      }}
    >
      {/* Food Photo */}
      <div style={{ position: 'relative', height: '150px', borderRadius: '10px', overflow: 'hidden' }}>
        <img
          src={item.imageUrl}
          alt={item.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        {item.badge && (
          <span
            style={{
              position: 'absolute',
              top: '8px',
              left: '8px',
              background: 'rgba(255, 51, 102, 0.9)',
              color: '#fff',
              fontSize: '0.68rem',
              fontWeight: 800,
              padding: '3px 8px',
              borderRadius: '4px',
              fontFamily: 'var(--font-racing)',
              letterSpacing: '0.5px',
            }}
          >
            {item.badge}
          </span>
        )}
      </div>

      {/* Details */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
        <h4 style={{ fontSize: '1rem', color: '#FFFFFF', lineHeight: 1.2 }}>{item.name}</h4>
        <p
          style={{
            fontSize: '0.8rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.4,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {item.description}
        </p>
      </div>

      {/* Price & Add Button */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: '8px',
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-telemetry)',
            fontWeight: 800,
            fontSize: '1.1rem',
            color: 'var(--neon-gold)',
          }}
        >
          {formatCurrency(item.price)}
        </span>

        <button
          onClick={handleAdd}
          style={{
            background: justAdded ? 'var(--neon-green)' : 'var(--grad-primary)',
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            padding: '7px 14px',
            color: '#fff',
            fontFamily: 'var(--font-racing)',
            fontWeight: 700,
            fontSize: '0.85rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.2s ease',
            boxShadow: justAdded
              ? '0 0 15px rgba(0, 230, 118, 0.5)'
              : '0 2px 10px rgba(0, 240, 255, 0.25)',
          }}
        >
          {justAdded ? (
            <>
              <Check size={16} /> ADDED
            </>
          ) : (
            <>
              <Plus size={16} /> {cartQuantity > 0 ? `ADD MORE (${cartQuantity})` : 'ADD TO PIT'}
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default FoodItemCard;

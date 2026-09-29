import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, ShoppingBag, ArrowRight, Zap, Trash2 } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import CartItem from './CartItem';
import Button from '../common/Button';
import orderApi from '../../services/orderApi';
import raceApi from '../../services/raceApi';
import { formatCurrency } from '../../utils/formatCurrency';

export function CartDrawer() {
  const {
    isCartOpen,
    closeCart,
    items,
    restaurant,
    updateQuantity,
    removeItem,
    clearCart,
    subtotal,
    deliveryFee,
    tax,
    total,
  } = useCart();

  const { user } = useAuth();
  const navigate = useNavigate();
  const [ordering, setOrdering] = useState(false);
  const [error, setError] = useState(null);

  if (!isCartOpen) return null;

  const handleCheckout = async () => {
    if (items.length === 0) return;
    try {
      setOrdering(true);
      setError(null);

      // 1. Create order
      const order = await orderApi.createOrder({
        userId: user._id,
        restaurantId: restaurant?._id || 'rest_01',
        items: items.map((i) => ({
          menuItemId: i._id,
          name: i.name,
          price: i.price,
          quantity: i.quantity,
        })),
      });

      // 2. Automatically spawn race for this order
      const race = await raceApi.createRace({
        orderId: order._id,
        racerId: 'racer_1',
        racerName: 'Pizza Panther',
      });

      // 3. Clear cart and navigate to live race view!
      clearCart();
      closeCart();
      navigate(`/race?id=${race._id}&orderId=${order._id}`);
    } catch (err) {
      setError(err.message || 'Checkout failed');
    } finally {
      setOrdering(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        display: 'flex',
        justifyContent: 'flex-end',
        background: 'rgba(5, 8, 15, 0.75)',
        backdropFilter: 'blur(6px)',
      }}
      onClick={closeCart}
    >
      <div
        className="glass-card"
        style={{
          width: '100%',
          maxWidth: '440px',
          height: '100%',
          borderRadius: 0,
          background: 'rgba(12, 17, 28, 0.98)',
          borderLeft: '1px solid var(--neon-cyan)',
          boxShadow: '-10px 0 35px rgba(0, 240, 255, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px',
            borderBottom: '1px solid var(--bg-card-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(255, 255, 255, 0.02)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'var(--grad-nitro)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ShoppingBag size={20} color="#fff" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', color: '#fff' }}>ORDER PIT STOP</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--neon-cyan)', fontFamily: 'var(--font-racing)' }}>
                {restaurant ? restaurant.name : 'Your Fuel Cart'}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {items.length > 0 && (
              <button
                onClick={clearCart}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.75rem',
                }}
                title="Clear Cart"
              >
                <Trash2 size={14} /> Clear
              </button>
            )}
            <button
              onClick={closeCart}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                padding: '4px',
              }}
            >
              <X size={22} />
            </button>
          </div>
        </div>

        {/* Content / Items List */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          {items.length === 0 ? (
            <div
              style={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '16px',
                color: 'var(--text-muted)',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '48px' }}>🏎️💨</div>
              <h4 style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Your Cart Is Empty!</h4>
              <p style={{ fontSize: '0.85rem', maxWidth: '240px' }}>
                Pick from our high-octane restaurants to launch your food delivery speed race.
              </p>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  closeCart();
                  navigate('/order');
                }}
              >
                Browse Menu
              </Button>
            </div>
          ) : (
            items.map((item) => (
              <CartItem
                key={item._id}
                item={item}
                onUpdateQuantity={updateQuantity}
                onRemove={removeItem}
              />
            ))
          )}
        </div>

        {/* Order Summary & Checkout Footer */}
        {items.length > 0 && (
          <div
            style={{
              padding: '20px',
              borderTop: '1px solid var(--bg-card-border)',
              background: 'rgba(10, 14, 23, 0.95)',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
            }}
          >
            {error && (
              <div
                style={{
                  color: 'var(--neon-crimson)',
                  fontSize: '0.8rem',
                  padding: '6px 10px',
                  background: 'rgba(255, 51, 102, 0.1)',
                  borderRadius: '4px',
                }}
              >
                {error}
              </div>
            )}

            {/* Calculations */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.88rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Speed Delivery Fee</span>
                <span>{formatCurrency(deliveryFee)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Tax & Service</span>
                <span>{formatCurrency(tax)}</span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontWeight: 800,
                  fontSize: '1.15rem',
                  color: '#FFFFFF',
                  paddingTop: '8px',
                  borderTop: '1px dashed rgba(255, 255, 255, 0.1)',
                  fontFamily: 'var(--font-telemetry)',
                }}
              >
                <span>TOTAL</span>
                <span style={{ color: 'var(--neon-gold)' }}>{formatCurrency(total)}</span>
              </div>
            </div>

            {/* Gamification Hint */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(0, 240, 255, 0.08)',
                padding: '8px 12px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid rgba(0, 240, 255, 0.2)',
                fontSize: '0.78rem',
                color: 'var(--neon-cyan)',
              }}
            >
              <Zap size={14} />
              <span>Ordering awards +100 XP and starts the virtual speed race!</span>
            </div>

            {/* Checkout Action */}
            <Button
              variant="nitro"
              size="lg"
              onClick={handleCheckout}
              loading={ordering}
              icon={ArrowRight}
              style={{ width: '100%' }}
            >
              START THE RACE & ORDER FOOD
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default CartDrawer;

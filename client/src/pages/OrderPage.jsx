import React, { useState, useEffect } from 'react';
import { UtensilsCrossed, Flame, ShoppingBag, ArrowLeft } from 'lucide-react';
import RestaurantCard from '../components/orders/RestaurantCard';
import MenuGrid from '../components/orders/MenuGrid';
import Loader from '../components/common/Loader';
import ErrorMessage from '../components/common/ErrorMessage';
import orderApi from '../services/orderApi';
import { useCart } from '../context/CartContext';

export function OrderPage() {
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menuLoading, setMenuLoading] = useState(false);
  const [error, setError] = useState(null);

  const { openCart, totalQuantity } = useCart();

  useEffect(() => {
    async function loadRestaurants() {
      try {
        setLoading(true);
        const data = await orderApi.getRestaurants();
        setRestaurants(data);
        if (data.length > 0) {
          setSelectedRestaurant(data[0]);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadRestaurants();
  }, []);

  useEffect(() => {
    if (!selectedRestaurant) return;

    async function loadMenu() {
      try {
        setMenuLoading(true);
        const menu = await orderApi.getRestaurantMenu(selectedRestaurant._id);
        setMenuItems(menu);
      } catch (err) {
        console.error('Failed to load menu', err);
      } finally {
        setMenuLoading(false);
      }
    }
    loadMenu();
  }, [selectedRestaurant]);

  if (loading) return <Loader message="Scouting Pit Stops & Kitchen Menus..." size="lg" />;
  if (error) return <ErrorMessage message={error} onRetry={() => window.location.reload()} />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
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
              HIGH-OCTANE REFUELING
            </span>
          </div>
          <h1 style={{ fontSize: '2rem', color: '#FFFFFF', marginTop: '4px' }}>
            ORDER PIT STOP
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Select a gourmet kitchen to launch your speed race. Placing any order immediately ignites the live tracking circuit!
          </p>
        </div>

        {/* View Cart Button */}
        {totalQuantity > 0 && (
          <button
            onClick={openCart}
            style={{
              background: 'var(--grad-nitro)',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              padding: '10px 20px',
              color: '#fff',
              fontFamily: 'var(--font-racing)',
              fontWeight: 800,
              fontSize: '0.95rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 15px rgba(255, 51, 102, 0.4)',
            }}
          >
            <ShoppingBag size={18} />
            VIEW CART ({totalQuantity} ITEMS)
          </button>
        )}
      </div>

      {/* Restaurant Selection Grid */}
      <div>
        <h3
          style={{
            fontFamily: 'var(--font-racing)',
            fontSize: '1.1rem',
            color: '#FFFFFF',
            marginBottom: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <UtensilsCrossed size={18} color="var(--neon-gold)" /> SELECT RESTAURANT CIRCUIT
        </h3>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '16px',
          }}
        >
          {restaurants.map((rest) => (
            <RestaurantCard
              key={rest._id}
              restaurant={rest}
              isSelected={selectedRestaurant?._id === rest._id}
              onSelect={setSelectedRestaurant}
            />
          ))}
        </div>
      </div>

      {/* Active Restaurant Menu Section */}
      {selectedRestaurant && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '12px' }}>
          <div
            className="glass-card"
            style={{
              padding: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderLeft: '4px solid var(--neon-cyan)',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <div>
              <span
                style={{
                  fontFamily: 'var(--font-racing)',
                  fontSize: '0.78rem',
                  color: 'var(--neon-cyan)',
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                }}
              >
                SELECTED KITCHEN MENU
              </span>
              <h2 style={{ fontSize: '1.4rem', color: '#fff' }}>{selectedRestaurant.name}</h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                {selectedRestaurant.cuisine} • Delivery ETA: {selectedRestaurant.deliveryTime}
              </p>
            </div>

            <div
              style={{
                fontFamily: 'var(--font-telemetry)',
                fontSize: '0.85rem',
                color: 'var(--neon-gold)',
                background: 'rgba(255, 184, 0, 0.1)',
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                border: '1px solid rgba(255, 184, 0, 0.3)',
              }}
            >
              RACE DISTANCE: 3.2 KM
            </div>
          </div>

          {/* Food Menu Items */}
          {menuLoading ? (
            <Loader message="Loading sizzling food items..." />
          ) : (
            <MenuGrid items={menuItems} restaurant={selectedRestaurant} />
          )}
        </div>
      )}
    </div>
  );
}

export default OrderPage;

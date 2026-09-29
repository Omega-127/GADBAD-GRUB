import React from 'react';
import { Star, Clock, Bike, Flame } from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency';

export function RestaurantCard({ restaurant, isSelected, onSelect }) {
  return (
    <div
      onClick={() => onSelect(restaurant)}
      className="glass-card glass-card-interactive"
      style={{
        cursor: 'pointer',
        border: isSelected ? '2px solid var(--neon-cyan)' : '1px solid var(--bg-card-border)',
        boxShadow: isSelected ? '0 0 20px rgba(0, 240, 255, 0.3)' : 'var(--shadow-md)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Banner Image */}
      <div style={{ position: 'relative', height: '140px', overflow: 'hidden' }}>
        <img
          src={restaurant.imageUrl}
          alt={restaurant.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.4s ease',
          }}
          className="restaurant-banner-img"
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, transparent 40%, rgba(10, 14, 23, 0.95) 100%)',
          }}
        />

        {/* Speed Badge */}
        {restaurant.bannerBadge && (
          <div
            style={{
              position: 'absolute',
              top: '10px',
              left: '10px',
              background: 'rgba(10, 14, 23, 0.85)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 184, 0, 0.4)',
              borderRadius: 'var(--radius-full)',
              padding: '3px 10px',
              fontSize: '0.72rem',
              fontWeight: 800,
              color: 'var(--neon-gold)',
              fontFamily: 'var(--font-racing)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            {restaurant.bannerBadge}
          </div>
        )}

        {/* Rating Pill */}
        <div
          style={{
            position: 'absolute',
            bottom: '10px',
            right: '10px',
            background: 'rgba(10, 14, 23, 0.85)',
            border: '1px solid rgba(0, 240, 255, 0.3)',
            borderRadius: 'var(--radius-full)',
            padding: '3px 8px',
            fontSize: '0.75rem',
            fontWeight: 700,
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <Star size={12} fill="#FFB800" color="#FFB800" />
          <span>{restaurant.rating}</span>
        </div>
      </div>

      {/* Body Info */}
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <h3
          style={{
            fontSize: '1.1rem',
            color: '#FFFFFF',
            lineHeight: 1.2,
          }}
        >
          {restaurant.name}
        </h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          {restaurant.cuisine}
        </p>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '8px',
            borderTop: '1px solid rgba(255, 255, 255, 0.05)',
            fontSize: '0.78rem',
            color: 'var(--text-muted)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Clock size={14} color="var(--neon-cyan)" />
            <span style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-racing)' }}>
              {restaurant.deliveryTime}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Bike size={14} color="var(--neon-gold)" />
            <span>
              {restaurant.deliveryFee === 0 ? 'FREE RACE' : `${formatCurrency(restaurant.deliveryFee)} fee`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RestaurantCard;

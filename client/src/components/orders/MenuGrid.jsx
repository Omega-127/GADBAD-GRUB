import React, { useState, useMemo } from 'react';
import FoodItemCard from './FoodItemCard';
import { Search } from 'lucide-react';

export function MenuGrid({ items = [], restaurant }) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = useMemo(() => {
    const set = new Set(['All']);
    items.forEach((i) => {
      if (i.category) set.add(i.category);
    });
    return Array.from(set);
  }, [items]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchCat = selectedCategory === 'All' || item.category === selectedCategory;
      const matchSearch =
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.description?.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [items, selectedCategory, search]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Category Pills & Search Bar */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '12px',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Categories */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                background:
                  selectedCategory === cat ? 'var(--neon-cyan)' : 'rgba(255, 255, 255, 0.05)',
                color: selectedCategory === cat ? '#0A0E17' : 'var(--text-secondary)',
                border:
                  selectedCategory === cat
                    ? '1px solid var(--neon-cyan)'
                    : '1px solid var(--bg-card-border)',
                borderRadius: 'var(--radius-full)',
                padding: '6px 14px',
                fontFamily: 'var(--font-racing)',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div
          style={{
            position: 'relative',
            minWidth: '220px',
          }}
        >
          <Search
            size={16}
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)',
            }}
          />
          <input
            type="text"
            placeholder="Search menu items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px 8px 36px',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid var(--bg-card-border)',
              borderRadius: 'var(--radius-sm)',
              color: '#FFFFFF',
              fontSize: '0.85rem',
              outline: 'none',
              fontFamily: 'var(--font-main)',
            }}
          />
        </div>
      </div>

      {/* Grid */}
      {filteredItems.length === 0 ? (
        <div
          className="glass-card"
          style={{ padding: '36px', textAlign: 'center', color: 'var(--text-muted)' }}
        >
          <p>No food items match your filter criteria.</p>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: '16px',
          }}
        >
          {filteredItems.map((item) => (
            <FoodItemCard key={item._id} item={item} restaurant={restaurant} />
          ))}
        </div>
      )}
    </div>
  );
}

export default MenuGrid;

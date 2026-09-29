import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem('gadbad_cart_items');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [restaurant, setRestaurant] = useState(() => {
    try {
      const saved = localStorage.getItem('gadbad_cart_restaurant');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('gadbad_cart_items', JSON.stringify(items));
    localStorage.setItem('gadbad_cart_restaurant', JSON.stringify(restaurant));
  }, [items, restaurant]);

  const addItem = (item, restInfo) => {
    // If adding from another restaurant, reset cart with new restaurant
    if (restaurant && restInfo && restaurant._id !== restInfo._id) {
      if (!window.confirm(`Start a new race order from ${restInfo.name}? Your previous items will be cleared.`)) {
        return;
      }
      setRestaurant(restInfo);
      setItems([{ ...item, quantity: 1 }]);
      setIsCartOpen(true);
      return;
    }

    if (restInfo && !restaurant) {
      setRestaurant(restInfo);
    }

    setItems((prev) => {
      const existing = prev.find((i) => i._id === item._id);
      if (existing) {
        return prev.map((i) =>
          i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });

    setIsCartOpen(true);
  };

  const removeItem = (itemId) => {
    setItems((prev) => {
      const filtered = prev.filter((i) => i._id !== itemId);
      if (filtered.length === 0) {
        setRestaurant(null);
      }
      return filtered;
    });
  };

  const updateQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i._id === itemId ? { ...i, quantity } : i))
    );
  };

  const clearCart = () => {
    setItems([]);
    setRestaurant(null);
  };

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [items]);

  const deliveryFee = items.length > 0 ? (restaurant?.deliveryFee || 2.99) : 0;
  const tax = items.length > 0 ? subtotal * 0.08 : 0;
  const total = items.length > 0 ? subtotal + deliveryFee + tax : 0;
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

  const value = {
    items,
    restaurant,
    isCartOpen,
    openCart: () => setIsCartOpen(true),
    closeCart: () => setIsCartOpen(false),
    toggleCart: () => setIsCartOpen((prev) => !prev),
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    subtotal,
    deliveryFee,
    tax,
    total,
    totalQuantity,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

export default CartContext;

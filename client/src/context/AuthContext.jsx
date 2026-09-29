import React, { createContext, useContext, useState, useEffect } from 'react';
import { DEFAULT_USER } from '../utils/constants';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('gadbad_user');
      return saved ? JSON.parse(saved) : DEFAULT_USER;
    } catch {
      return DEFAULT_USER;
    }
  });

  const [isDemoMode, setIsDemoMode] = useState(() => {
    return localStorage.getItem('gadbad_demo_mode') !== 'false';
  });

  useEffect(() => {
    localStorage.setItem('gadbad_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('gadbad_demo_mode', isDemoMode.toString());
  }, [isDemoMode]);

  const addPoints = (amount, reason = '') => {
    setUser((prev) => ({
      ...prev,
      points: prev.points + amount,
      xp: prev.xp + amount * 2,
      level: Math.floor((prev.xp + amount * 2) / 500) + 1,
    }));
  };

  const unlockBadge = (badgeCode) => {
    setUser((prev) => {
      if (prev.badges.includes(badgeCode)) return prev;
      return {
        ...prev,
        badges: [...prev.badges, badgeCode],
      };
    });
  };

  const toggleDemoMode = () => {
    setIsDemoMode((prev) => !prev);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isDemoMode,
        toggleDemoMode,
        addPoints,
        unlockBadge,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;

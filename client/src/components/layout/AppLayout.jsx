import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import BottomNavigation from './BottomNavigation';
import Footer from './Footer';
import CartDrawer from '../orders/CartDrawer';

export function AppLayout() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg-dark)' }}>
      {/* Sticky Top Header */}
      <Header />

      {/* Main Cockpit Layout: Sidebar + Page Outlet */}
      <div style={{ display: 'flex', flex: 1, minHeight: 'calc(100vh - var(--header-height))' }}>
        <Sidebar />

        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <div className="page-wrapper">
            <Outlet />
          </div>
          <Footer />
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNavigation />

      {/* Cart Slide-Over Drawer */}
      <CartDrawer />
    </div>
  );
}

export default AppLayout;

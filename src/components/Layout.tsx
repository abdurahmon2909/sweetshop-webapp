import React, { useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import './Layout.css';

declare global {
  interface Window {
    Telegram: any;
  }
}

export const Layout: React.FC = () => {
  const location = useLocation();
  const { cart, fetchCart } = useCartStore();

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (tg) {
      tg.ready();
      tg.expand();
      tg.enableClosingConfirmation();

      const user = tg.initDataUnsafe?.user;
      if (user?.id) {
        fetchCart(user.id);
      }
    }
  }, [fetchCart]);

  const totalItems = cart?.total_qty || 0;

  return (
    <div className="app">
      <header className="header">
        <Link to="/" className="logo">🍰 SweetShop</Link>
        <Link to="/cart" className="cart-icon">
          🛒 {totalItems > 0 && <span className="badge">{totalItems}</span>}
        </Link>
      </header>

      <main className="main">
        <Outlet />
      </main>

      <nav className="bottom-nav">
        <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
          📋 Menu
        </Link>
        <Link to="/cart" className={location.pathname === '/cart' ? 'active' : ''}>
          🛒 Savat ({totalItems})
        </Link>
      </nav>
    </div>
  );
};
export default Layout;
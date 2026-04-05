import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';

declare global {
  interface Window {
    Telegram: any;
  }
}

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { cart, updateItem, removeItem, clearCart } = useCartStore();
  const tg = window.Telegram?.WebApp;

  const handleUpdateQty = async (itemId: number, newQty: number) => {
    const user = tg?.initDataUnsafe?.user;
    if (user?.id && cart) {
      if (newQty <= 0) {
        await removeItem(itemId, user.id);
      } else {
        await updateItem(itemId, user.id, newQty);
      }
    }
  };

  const handleClearCart = async () => {
    const user = tg?.initDataUnsafe?.user;
    if (user?.id) {
      tg?.showPopup({
        title: 'Savatni tozalash',
        message: 'Hamma mahsulotlar o\'chiriladi. Davom etasizmi?',
        buttons: [
          { type: 'cancel', text: 'Bekor qilish' },
          { type: 'default', text: 'Tozalash' },
        ],
        callback: async (buttonId: string) => {
          if (buttonId === 'default') {
            await clearCart(user.id);
          }
        },
      });
    }
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (!cart || cart.items.length === 0) {
    return (
      <div className="empty-cart">
        <div className="empty-cart-icon">🛒</div>
        <h2>Savat bo'sh</h2>
        <p>Mahsulotlarni qo'shing va buyurtma bering</p>
        <button className="go-to-menu-btn" onClick={() => navigate('/')}>
          Menu ga o'tish
        </button>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1>Savat</h1>

      <div className="cart-items">
        {cart.items.map(item => (
          <div key={item.id} className="cart-item">
            <div className="cart-item-info">
              <div className="cart-item-name">{item.name}</div>
              <div className="cart-item-price">{item.price.toLocaleString()} so'm</div>
            </div>

            <div className="cart-item-actions">
              <button
                className="qty-btn"
                onClick={() => handleUpdateQty(item.id, item.qty - 1)}
              >
                -
              </button>
              <span className="qty">{item.qty}</span>
              <button
                className="qty-btn"
                onClick={() => handleUpdateQty(item.id, item.qty + 1)}
              >
                +
              </button>
              <button
                className="remove-btn"
                onClick={() => handleUpdateQty(item.id, 0)}
              >
                🗑️
              </button>
            </div>

            <div className="cart-item-total">
              {(item.price * item.qty).toLocaleString()} so'm
            </div>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <div className="summary-row">
          <span>Jami:</span>
          <span className="total-amount">{cart.total_amount.toLocaleString()} so'm</span>
        </div>

        <div className="cart-actions">
          <button className="clear-cart-btn" onClick={handleClearCart}>
            Savatni tozalash
          </button>
          <button className="checkout-btn" onClick={handleCheckout}>
            Buyurtma berish →
          </button>
        </div>
      </div>
    </div>
  );
};
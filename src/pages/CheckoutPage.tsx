import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { checkoutApi } from '../api/checkout';
import './CheckoutPage.css';

declare global {
  interface Window {
    Telegram: any;
  }
}

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { cart } = useCartStore();
  const tg = window.Telegram?.WebApp;

  const [formData, setFormData] = useState({
    customer_name: '',
    customer_phone: '',
    delivery_type: 'pickup',
    delivery_address: '',
    comment: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const user = tg?.initDataUnsafe?.user;

    if (!user?.id || !cart) {
      alert('Xatolik yuz berdi');
      setLoading(false);
      return;
    }

    try {
      const response = await checkoutApi.createCheckout({
        telegram_id: user.id,
        ...formData,
        payment_method: 'telegram',
      });

      tg?.sendData(JSON.stringify({
        type: 'checkout_success',
        order_id: response.order_id,
        payload: response.payload,
      }));

      navigate('/success', { state: { order: response } });
    } catch (error) {
      alert('Buyurtma berishda xatolik');
    } finally {
      setLoading(false);
    }
  };

  const totalAmount = cart?.total_amount || 0;

  return (
    <div className="checkout-page">
      <h1>Buyurtma ma'lumotlari</h1>

      <div className="order-summary">
        <h3>Buyurtma summasi: {totalAmount.toLocaleString()} so'm</h3>
      </div>

      <form onSubmit={handleSubmit} className="checkout-form">
        <div className="form-group">
          <label>Ismingiz *</label>
          <input
            type="text"
            required
            value={formData.customer_name}
            onChange={e => setFormData({ ...formData, customer_name: e.target.value })}
            placeholder="Ismingizni kiriting"
          />
        </div>

        <div className="form-group">
          <label>Telefon raqam *</label>
          <input
            type="tel"
            required
            value={formData.customer_phone}
            onChange={e => setFormData({ ...formData, customer_phone: e.target.value })}
            placeholder="+998 XX XXX XX XX"
          />
        </div>

        <div className="form-group">
          <label>Yetkazib berish turi</label>
          <select
            value={formData.delivery_type}
            onChange={e => setFormData({ ...formData, delivery_type: e.target.value })}
          >
            <option value="pickup">Olib ketish</option>
            <option value="delivery">Yetkazib berish</option>
          </select>
        </div>

        {formData.delivery_type === 'delivery' && (
          <div className="form-group">
            <label>Manzil</label>
            <textarea
              value={formData.delivery_address || ''}
              onChange={e => setFormData({ ...formData, delivery_address: e.target.value })}
              placeholder="To'liq manzilingizni kiriting"
              rows={3}
            />
          </div>
        )}

        <div className="form-group">
          <label>Izoh (ixtiyoriy)</label>
          <textarea
            value={formData.comment || ''}
            onChange={e => setFormData({ ...formData, comment: e.target.value })}
            placeholder="Masalan: qo'shimcha shirinlik, piyozsiz va h.k."
            rows={2}
          />
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Yuborilmoqda...' : `💰 ${totalAmount.toLocaleString()} so'm to'lash`}
        </button>
      </form>
    </div>
  );
};
export default CheckoutPage;
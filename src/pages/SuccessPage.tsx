import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './SuccessPage.css';

declare global {
  interface Window {
    Telegram: any;
  }
}

export const SuccessPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { order } = location.state || {};

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (tg) {
      tg.MainButton.setText('Bosh sahifaga qaytish');
      tg.MainButton.show();
      tg.MainButton.onClick(() => {
        tg.MainButton.hide();
        navigate('/');
      });
    }

    return () => {
      tg?.MainButton.hide();
    };
  }, [navigate]);

  if (!order) {
    navigate('/');
    return null;
  }

  return (
    <div className="success-page">
      <div className="success-icon">✅</div>
      <h1>Buyurtma qabul qilindi!</h1>
      <p>Buyurtma raqami: <strong>{order.public_order_id}</strong></p>
      <p>To'lov summasi: <strong>{order.total_amount.toLocaleString()} so'm</strong></p>
      <p className="success-message">
        Tez orada operatorlarimiz siz bilan bog'lanadi.
      </p>
    </div>
  );
};
export default SuccessPage;
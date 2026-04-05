import React, { useState, useEffect } from 'react';
import { catalogApi } from '../api/catalog';
import { Category, Product } from '../types';
import { useCartStore } from '../store/cartStore';
import './CatalogPage.css';

declare global {
  interface Window {
    Telegram: any;
  }
}

export const CatalogPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCartStore();

  useEffect(() => {
    loadData();
  }, [selectedCategory]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [categoriesData, productsData] = await Promise.all([
        catalogApi.getCategories(),
        catalogApi.getProducts(selectedCategory || undefined),
      ]);
      setCategories(categoriesData.filter(c => c.is_active));
      setProducts(productsData.filter(p => p.is_active));
    } catch (error) {
      console.error('Error loading catalog:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (product: Product) => {
    const tg = window.Telegram?.WebApp;
    const user = tg?.initDataUnsafe?.user;

    if (user?.id) {
      await addItem(user.id, product.id, 1);
      tg?.HapticFeedback.impactOccurred('light');
      tg?.showPopup({
        title: '✅ Qo\'shildi',
        message: `${product.name} savatga qo'shildi`,
        buttons: [{ type: 'ok' }],
      });
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="catalog-page">
      <div className="categories">
        <button
          className={`category-chip ${selectedCategory === null ? 'active' : ''}`}
          onClick={() => setSelectedCategory(null)}
        >
          🍽️ Hammasi
        </button>
        {categories.map(cat => (
          <button
            key={cat.id}
            className={`category-chip ${selectedCategory === cat.id ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat.id)}
          >
            {cat.emoji} {cat.name}
          </button>
        ))}
      </div>

      <div className="products-grid">
        {products.map(product => (
          <div key={product.id} className="product-card">
            {product.badge && (
              <span className="product-badge">{product.badge}</span>
            )}
            {product.image_url ? (
              <img src={product.image_url} alt={product.name} className="product-image" />
            ) : (
              <div className="product-image-placeholder">🍰</div>
            )}
            <div className="product-info">
              <h3 className="product-name">{product.name}</h3>
              {product.weight && (
                <span className="product-weight">{product.weight}</span>
              )}
              <p className="product-description">{product.description}</p>
              <div className="product-footer">
                <span className="product-price">{product.price.toLocaleString()} so'm</span>
                <button
                  className="add-to-cart-btn"
                  onClick={() => handleAddToCart(product)}
                >
                  + Savatga
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CatalogPage;
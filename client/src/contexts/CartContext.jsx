import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export const resolveImageUrl = (img) => {
  if (!img) return '';
  if (img.startsWith('http://') || img.startsWith('https://') || img.startsWith('//')) return img;
  const baseUrl = import.meta.env.VITE_API_URL || 'https://api.apexpepco.com/api';
  const cleanBase = baseUrl.replace(/\/api\/?$/, '').replace(/\/$/, '');
  if (img.startsWith('/uploads/')) return `${cleanBase}${img}`;
  if (img.startsWith('/')) return img;
  return `${cleanBase}/uploads/${img}`;
};

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem('cart')) || []; } catch { return []; }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addItem = (product, variant, quantity = 1) => {
    const key = `${product._id || product.id || product.slug}-${variant?.name || 'default'}`;
    const imagePath = product.imageUrl || product.image || '';

    setItems(prev => {
      const existing = prev.find(i => i.key === key);
      if (existing) {
        return prev.map(i => i.key === key ? { ...i, quantity: i.quantity + quantity } : i);
      }
      return [...prev, {
        key,
        productId: product._id || product.id,
        productName: product.name,
        productSlug: product.slug,
        productImage: imagePath,
        variant: variant || null,
        price: variant?.price || product.basePrice || 0,
        quantity,
      }];
    });

    setIsCartOpen(true);
  };

  const removeItem = (key) => setItems(prev => prev.filter(i => i.key !== key));

  const updateQuantity = (key, quantity) => {
    if (quantity <= 0) return removeItem(key);
    setItems(prev => prev.map(i => i.key === key ? { ...i, quantity } : i));
  };

  const clearCart = () => setItems([]);

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalItems = itemCount;

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      subtotal,
      itemCount,
      totalItems,
      isCartOpen,
      setIsCartOpen,
      resolveImageUrl
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
export default CartContext;

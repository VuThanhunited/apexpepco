import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem('cart')) || []; } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addItem = (product, variant, quantity = 1) => {
    const key = `${product._id}-${variant?.name || 'default'}`;
    setItems(prev => {
      const existing = prev.find(i => i.key === key);
      if (existing) {
        return prev.map(i => i.key === key ? { ...i, quantity: i.quantity + quantity } : i);
      }
      return [...prev, {
        key,
        productId: product._id,
        productName: product.name,
        productSlug: product.slug,
        productImage: product.image,
        variant: variant || null,
        price: variant?.price || product.basePrice,
        quantity,
      }];
    });
  };

  const removeItem = (key) => setItems(prev => prev.filter(i => i.key !== key));

  const updateQuantity = (key, quantity) => {
    if (quantity <= 0) return removeItem(key);
    setItems(prev => prev.map(i => i.key === key ? { ...i, quantity } : i));
  };

  const clearCart = () => setItems([]);

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, subtotal, itemCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
export default CartContext;

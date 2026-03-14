import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const localData = localStorage.getItem('dilraj_cart');
    return localData ? JSON.parse(localData) : [];
  });

  useEffect(() => {
    localStorage.setItem('dilraj_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, qty = 1) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.product === product._id);
      if (existing) {
        return prev.map(item => {
          if (item.product === product._id) {
            const newQty = item.quantity + qty;
            return { ...item, quantity: newQty, total: newQty * item.price };
          }
          return item;
        });
      }
      return [...prev, {
          product: product._id,
          productName: product.productName,
          price: product.price,
          image: product.image,
          quantity: qty,
          total: product.price * qty
      }];
    });
  };

  const removeFromCart = (id) => {
    setCartItems(prev => prev.filter(item => item.product !== id));
  };

  const updateQuantity = (id, delta) => {
    setCartItems(prev => prev.map(item => {
      if (item.product === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty, total: newQty * item.price };
      }
      return item;
    }));
  };

  const clearCart = () => setCartItems([]);

  const subTotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, subTotal }}>
      {children}
    </CartContext.Provider>
  );
};

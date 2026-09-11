/* eslint-disable react-refresh/only-export-components -- Provider + hook share one module */
import { createContext, useContext, useMemo, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product) => {
    setCartItems((prev) => {
      const existing = prev.find(
        (item) =>
          item.id === product.id &&
          (item.size || "") === (product.size || "") &&
          (item.color || "") === (product.color || "")
      );

      if (existing) {
        return prev.map((item) =>
          item.id === product.id &&
          (item.size || "") === (product.size || "") &&
          (item.color || "") === (product.color || "")
            ? { ...item, quantity: item.quantity + (product.quantity || 1) }
            : item
        );
      }

      return [...prev, { ...product, quantity: product.quantity || 1 }];
    });
  };

  const removeFromCart = (id, size = "", color = "") => {
    setCartItems((prev) =>
      prev.filter(
        (item) =>
          !(
            item.id === id &&
            (item.size || "") === size &&
            (item.color || "") === color
          )
      )
    );
  };

  const updateQuantity = (id, quantity, size = "", color = "") => {
    if (quantity <= 0) {
      removeFromCart(id, size, color);
      return;
    }

    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id &&
        (item.size || "") === size &&
        (item.color || "") === color
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems]
  );

  const cartSubtotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cartItems]
  );

  const value = {
    cartItems,
    cartCount,
    cartSubtotal,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  return useContext(CartContext);
}
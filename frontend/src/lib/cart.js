import React, { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext(null);

const STORAGE_KEY = "ll_cart_v1";

const loadInitial = () => {
  try {
    const raw = typeof window !== "undefined" ? window.localStorage.getItem(STORAGE_KEY) : null;
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

// Compose unique cart-line id from product id + variant name (if any)
const lineId = (productId, variantName) =>
  variantName ? `${productId}::${variantName}` : productId;

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(loadInitial);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      // ignore
    }
  }, [items]);

  const addItem = (product, qty = 1, variant = null) => {
    // variant: { name, price, stock } | null
    const price = variant ? variant.price : product.price;
    const variantName = variant ? variant.name : null;
    const id = lineId(product.id, variantName);
    setItems((prev) => {
      const idx = prev.findIndex((p) => p.id === id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], qty: next[idx].qty + qty };
        return next;
      }
      return [
        ...prev,
        {
          id,
          product_id: product.id,
          name: product.name,
          variant_name: variantName,
          variant_label: product.variant_label || null,
          price,
          image_url: product.image_url,
          qty,
        },
      ];
    });
  };

  const updateQty = (id, qty) => {
    setItems((prev) =>
      prev
        .map((p) => (p.id === id ? { ...p, qty: Math.max(0, qty) } : p))
        .filter((p) => p.qty > 0)
    );
  };

  const removeItem = (id) => {
    setItems((prev) => prev.filter((p) => p.id !== id));
  };

  const clearCart = () => setItems([]);

  const subtotal = items.reduce((s, p) => s + p.price * p.qty, 0);
  const count = items.reduce((s, p) => s + p.qty, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, updateQty, removeItem, clearCart, subtotal, count }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};

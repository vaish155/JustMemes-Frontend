'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { CartItem, Product, Size } from '@/types';

const CART_KEY = 'jm_cart_v1';

interface CartContextValue {
  items: CartItem[];
  count: number;
  subtotal: number;
  isEmpty: boolean;
  add: (product: Product, size: Size, qty: number) => void;
  setQty: (productId: string, size: Size, qty: number) => void;
  changeSize: (productId: string, fromSize: Size, toSize: Size) => void;
  remove: (productId: string, size: Size) => void;
  clear: () => void;
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(CART_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setItems(parsed);
      }
    } catch {
      // ignore JSON error
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(CART_KEY, JSON.stringify(items));
    }
  }, [items, isLoaded]);

  const count = items.reduce((n, i) => n + i.qty, 0);
  const subtotal = items.reduce((n, i) => n + i.price * i.qty, 0);
  const isEmpty = items.length === 0;

  const find = (productId: string, size: Size) =>
    items.find((i) => i.productId === productId && i.size === size);

  const add = useCallback((product: Product, size: Size, qty: number) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === product.id && i.size === size);
      if (existing) {
        return prev.map((i) =>
          i.productId === product.id && i.size === size
            ? { ...i, qty: Math.min(i.qty + qty, 99) }
            : i
        );
      } else {
        return [
          ...prev,
          {
            productId: product.id,
            name: product.name,
            price: product.price,
            comparePrice: product.comparePrice,
            image: product.imageUrl,
            stock: product.stock,
            size,
            qty,
          },
        ];
      }
    });
  }, []);

  const remove = useCallback((productId: string, size: Size) => {
    setItems((prev) => prev.filter((i) => !(i.productId === productId && i.size === size)));
  }, []);

  const setQty = useCallback(
    (productId: string, size: Size, qty: number) => {
      if (qty <= 0) {
        remove(productId, size);
        return;
      }
      setItems((prev) =>
        prev.map((i) =>
          i.productId === productId && i.size === size
            ? { ...i, qty: Math.min(qty, 99) }
            : i
        )
      );
    },
    [remove]
  );

  const changeSize = useCallback((productId: string, fromSize: Size, toSize: Size) => {
    setItems((prev) => {
      const item = prev.find((i) => i.productId === productId && i.size === fromSize);
      if (!item) return prev;
      const existing = prev.find((i) => i.productId === productId && i.size === toSize);
      if (existing) {
        return prev
          .filter((i) => !(i.productId === productId && i.size === fromSize))
          .map((i) =>
            i.productId === productId && i.size === toSize
              ? { ...i, qty: Math.min(i.qty + item.qty, 99) }
              : i
          );
      } else {
        return prev.map((i) =>
          i.productId === productId && i.size === fromSize ? { ...i, size: toSize } : i
        );
      }
    });
  }, []);

  const clear = useCallback(() => {
    setItems([]);
  }, []);

  const openDrawer = useCallback(() => setIsDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setIsDrawerOpen(false), []);
  const toggleDrawer = useCallback(() => setIsDrawerOpen((prev) => !prev), []);

  return (
    <CartContext.Provider
      value={{
        items,
        count,
        subtotal,
        isEmpty,
        add,
        setQty,
        changeSize,
        remove,
        clear,
        isDrawerOpen,
        openDrawer,
        closeDrawer,
        toggleDrawer,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};

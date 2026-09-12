'use client';

import { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext(null);

const CART_KEY = 'board_store_cart';

function cartReducer(state, action) {
  switch (action.type) {
    case 'INIT':
      return { ...state, items: action.items };
    case 'ADD_ITEM': {
      const existing = state.items.find(i => i.id === action.item.id);
      if (existing) {
        return {
          ...state,
          items: state.items.map(i =>
            i.id === action.item.id
              ? { ...i, quantity: i.quantity + (action.item.quantity || 1) }
              : i
          )
        };
      }
      return {
        ...state,
        items: [...state.items, { ...action.item, quantity: action.item.quantity || 1 }]
      };
    }
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(i => i.id !== action.id)
      };
    case 'UPDATE_QUANTITY':
      if (action.quantity <= 0) {
        return { ...state, items: state.items.filter(i => i.id !== action.id) };
      }
      return {
        ...state,
        items: state.items.map(i =>
          i.id === action.id ? { ...i, quantity: action.quantity } : i
        )
      };
    case 'CLEAR':
      return { ...state, items: [] };
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  // Load from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(CART_KEY);
      if (saved) {
        dispatch({ type: 'INIT', items: JSON.parse(saved) });
      }
    } catch {
      // ignore
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(state.items));
    } catch {
      // ignore
    }
  }, [state.items]);

  const addItem = (item) => dispatch({ type: 'ADD_ITEM', item });
  const removeItem = (id) => dispatch({ type: 'REMOVE_ITEM', id });
  const updateQuantity = (id, quantity) => dispatch({ type: 'UPDATE_QUANTITY', id, quantity });
  const clearCart = () => dispatch({ type: 'CLEAR' });

  const itemCount = state.items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{
      items: state.items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      itemCount,
      subtotal
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}

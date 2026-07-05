import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface CartItem {
  id: string; // ID sản phẩm trong Database
  slug: string;
  name: string;
  price: number;
  quantity: number;
  badge?: string;
  image?: string;
}

interface CartState {
  items: CartItem[];
  discount: number;
  appliedCoupon: string | null;
  addItem: (item: CartItem) => void;
  removeItem: (slug: string) => void;
  updateQuantity: (slug: string, quantity: number) => void;
  applyCoupon: (code: string, subtotal: number) => boolean;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      discount: 0,
      appliedCoupon: null,

      addItem: (newItem) => {
        const currentItems = get().items;
        const existingIndex = currentItems.findIndex((item) => item.slug === newItem.slug);
        
        if (existingIndex > -1) {
          const updatedItems = [...currentItems];
          updatedItems[existingIndex].quantity += newItem.quantity;
          set({ items: updatedItems });
        } else {
          set({ items: [...currentItems, newItem] });
        }
      },

      removeItem: (slug) => {
        set({ items: get().items.filter((item) => item.slug !== slug) });
      },

      updateQuantity: (slug, quantity) => {
        const updatedItems = get().items.map((item) => {
          if (item.slug === slug) {
            return { ...item, quantity: Math.max(1, quantity) };
          }
          return item;
        });
        set({ items: updatedItems });
      },

      applyCoupon: (code, subtotal) => {
        const cleanCode = code.trim().toUpperCase();
        if (cleanCode === 'WELCOME10') {
          const calculatedDiscount = Math.round(subtotal * 0.1);
          set({
            appliedCoupon: 'WELCOME10 (Giảm 10%)',
            discount: calculatedDiscount,
          });
          return true;
        }
        return false;
      },

      clearCart: () => {
        set({ items: [], discount: 0, appliedCoupon: null });
      },
    }),
    {
      name: 'youniverse-cart-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

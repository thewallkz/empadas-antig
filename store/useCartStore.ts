import { create } from 'zustand'

export type CartItem = {
  productId: string;
  name: string;
  price: number;
  imageUrl: string | null;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  addItem: (product: { id: string; name: string; price: number; imageUrl: string | null }) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  isOpen: false,
  setIsOpen: (isOpen: boolean) => set({ isOpen }),
  
  addItem: (product) => {
    set((state) => {
      const existingProduct = state.items.find((item) => item.productId === product.id);
      
      if (existingProduct) {
         // Increment quantity
         return {
           items: state.items.map((item) =>
             item.productId === product.id
               ? { ...item, quantity: item.quantity + 1 }
               : item
           ),
           isOpen: true // open cart when adding
         };
      }
      
      // Add new item
      return { 
        items: [...state.items, { ...product, productId: product.id, quantity: 1 }],
        isOpen: true
      };
    });
  },
  
  removeItem: (productId) => {
    set((state) => ({
      items: state.items.filter((item) => item.productId !== productId)
    }));
  },
  
  updateQuantity: (productId, quantity) => {
     set((state) => ({
       items: state.items.map((item) => 
         item.productId === productId ? { ...item, quantity: Math.max(1, quantity) } : item
       )
     }));
  },
  
  clearCart: () => {
    set({ items: [], isOpen: false });
  },
  
  getCartTotal: () => {
    const { items } = get();
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  },

  getCartCount: () => {
    const { items } = get();
    return items.reduce((count, item) => count + item.quantity, 0);
  }
}));

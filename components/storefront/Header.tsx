"use client";

import { useCartStore } from "@/store/useCartStore";
import { ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function Header() {
  const { setIsOpen, getCartCount } = useCartStore();
  const totalItems = getCartCount();

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-neutral-200">
      <div className="max-w-6xl mx-auto px-4 lg:px-8 h-20 flex items-center justify-between">
        <h1 className="text-2xl font-black tracking-tight">
          Cantina<span className="text-emerald-500">On</span>
        </h1>
        <button 
          onClick={() => setIsOpen(true)}
          className="relative p-3 bg-neutral-100 hover:bg-neutral-200 rounded-full transition-colors"
        >
          <ShoppingBag size={22} className="text-neutral-700" />
          <AnimatePresence>
            {totalItems > 0 && (
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-xs font-bold text-white border-2 border-white"
              >
                {totalItems}
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </header>
  );
}

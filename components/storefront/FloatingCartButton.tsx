"use client";

import { useCartStore } from "@/store/useCartStore";
import { formatCurrency } from "@/lib/formatters";
import { motion, AnimatePresence } from "framer-motion";

export function FloatingCartButton() {
  const { setIsOpen, getCartTotal, getCartCount } = useCartStore();

  return (
    <AnimatePresence>
      {getCartCount() > 0 && (
        <motion.div 
          initial={{ y: 150 }}
          animate={{ y: 0 }}
          exit={{ y: 150 }}
          className="fixed bottom-0 left-0 right-0 p-4 md:hidden z-30"
        >
          <button 
            onClick={() => setIsOpen(true)}
            className="w-full bg-emerald-500 text-white rounded-full p-4 flex items-center justify-between shadow-xl shadow-emerald-500/30 overflow-hidden relative"
          >
            <div className="absolute inset-0 bg-white/10 w-1/2 translate-x-[-150%] animate-[shimmer_2s_infinite]"></div>
            <div className="flex items-center gap-3">
              <div className="bg-emerald-600/50 rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                {getCartCount()}
              </div>
              <span className="font-bold">Ver Pedido</span>
            </div>
            <span className="font-black text-lg">{formatCurrency(getCartTotal())}</span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

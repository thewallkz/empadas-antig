"use client";

import { useCartStore } from "@/store/useCartStore";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { formatCurrency } from "@/lib/formatters";

export function CartDrawer() {
  const { items, isOpen, setIsOpen, removeItem, updateQuantity, getCartTotal, getCartCount } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-neutral-900/40 backdrop-blur-sm z-40"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-neutral-100">
              <div className="flex items-center gap-3">
                <ShoppingBag className="text-emerald-500" />
                <h2 className="text-xl font-bold text-neutral-900">Seu Pedido</h2>
                <span className="bg-emerald-100 text-emerald-700 text-sm font-bold px-2 py-0.5 rounded-full">
                  {getCartCount()}
                </span>
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                className="p-2 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-20 h-20 bg-neutral-50 rounded-full flex items-center justify-center mb-4">
                    <ShoppingBag className="text-neutral-300 w-10 h-10" />
                  </div>
                  <h3 className="text-lg font-bold text-neutral-900 mb-1">Seu carrinho está vazio</h3>
                  <p className="text-neutral-500 text-sm">Que tal adicionar alguns salgados deliciosos?</p>
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="mt-6 font-semibold text-emerald-500 hover:text-emerald-600 transition-colors"
                  >
                    Continuar comprando
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {items.map((item) => (
                    <motion.div layout key={item.productId} className="flex gap-4">
                      {item.imageUrl ? (
                         <img src={item.imageUrl} alt={item.name} className="w-20 h-20 object-cover rounded-2xl border border-neutral-100 shadow-sm" />
                       ) : (
                         <div className="w-20 h-20 bg-neutral-100 rounded-2xl flex items-center justify-center border border-neutral-200">
                            <ShoppingBag className="text-neutral-300" />
                         </div>
                       )}
                       <div className="flex-1 flex flex-col justify-between">
                         <div className="flex justify-between items-start">
                           <h4 className="font-bold text-neutral-900 leading-tight">{item.name}</h4>
                           <button onClick={() => removeItem(item.productId)} className="text-neutral-400 hover:text-red-500 transition-colors">
                             <X size={16} />
                           </button>
                         </div>
                         <div className="flex justify-between items-center mt-2">
                           <p className="font-bold text-emerald-600">{formatCurrency(item.price)}</p>
                           
                           <div className="flex items-center bg-neutral-50 rounded-full border border-neutral-200">
                              <button 
                                onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                className="w-8 h-8 flex items-center justify-center text-neutral-500 hover:text-neutral-900 transition-colors"
                              >
                                <Minus size={14} />
                              </button>
                              <span className="w-6 text-center text-sm font-bold">{item.quantity}</span>
                              <button 
                                onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                className="w-8 h-8 flex items-center justify-center text-neutral-500 hover:text-neutral-900 transition-colors"
                              >
                                <Plus size={14} />
                              </button>
                           </div>
                         </div>
                       </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 border-t border-neutral-100 bg-neutral-50/50">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-neutral-500 font-medium">Total do pedido</span>
                  <span className="text-2xl font-black text-neutral-900">
                    {formatCurrency(getCartTotal())}
                  </span>
                </div>
                <Link 
                  href="/checkout"
                  onClick={() => setIsOpen(false)}
                  className="w-full flex justify-center py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-bold shadow-lg shadow-emerald-500/25 transition-all"
                >
                  Finalizar Pedido
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

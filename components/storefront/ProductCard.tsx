"use client";

import { motion } from "framer-motion";
import { Plus, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { formatCurrency } from "@/lib/formatters";

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string | null;
  available: boolean;
};

export function ProductCard({ product, index }: { product: Product; index: number }) {
  const { addItem } = useCartStore();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-3xl p-4 hover:shadow-xl hover:shadow-neutral-200/50 transition-all duration-300 border border-neutral-100 flex flex-col group"
    >
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-neutral-50 mb-4">
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
             <ShoppingBag className="w-12 h-12 text-neutral-300" />
          </div>
        )}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 font-bold text-sm rounded-full shadow-sm text-neutral-900">
          {formatCurrency(product.price)}
        </div>
      </div>
      <div className="flex-1 flex flex-col justify-between">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-neutral-900 leading-tight mb-2">{product.name}</h3>
          <p className="text-neutral-500 text-sm line-clamp-2 leading-relaxed">{product.description}</p>
        </div>
        <button 
          onClick={() => addItem(product)}
          className="w-full py-3.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-colors active:scale-[0.98]"
        >
          <Plus size={18} strokeWidth={3} /> Adicionar
        </button>
      </div>
    </motion.div>
  );
}

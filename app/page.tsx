"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Plus, Sparkles } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { CartDrawer } from "@/components/CartDrawer";

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string | null;
  available: boolean;
};

export default function Storefront() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addItem, setIsOpen, getCartCount, getCartTotal } = useCartStore();

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products");
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const totalItems = getCartCount();

  return (
    <div className="min-h-screen bg-neutral-50 pb-24 text-neutral-900">
      {/* Header */}
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

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 lg:px-8 py-12 md:py-20 text-center animate-in fade-in slide-in-from-bottom-6 duration-700">
        <div className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 font-bold text-sm mb-6">
          <Sparkles size={16} /> Salgados fresquinhos
        </div>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-6">
          Peça online,<br /> retire sem filas.
        </h2>
        <p className="text-neutral-500 text-lg md:text-xl max-w-2xl mx-auto">
          Escolha os seus salgados favoritos e prepare-se para a melhor experiência.
        </p>
      </section>

      {/* Product List */}
      <main className="max-w-6xl mx-auto px-4 lg:px-8">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
             {[1,2,3].map(i => (
                <div key={i} className="animate-pulse bg-white rounded-3xl p-4 h-[350px] shadow-sm border border-neutral-100" />
             ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-neutral-100">
             <ShoppingBag className="mx-auto h-16 w-16 text-neutral-300 mb-4" />
             <h3 className="text-xl font-bold text-neutral-800">Nenhum produto disponível</h3>
             <p className="text-neutral-500 mt-2">Nossa vitrine está vazia no momento.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {products.map((product, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                key={product.id} 
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
                    R$ {product.price.toFixed(2).replace(".", ",")}
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
            ))}
          </div>
        )}
      </main>

      {/* Floating Checkout Button Mobile */}
      <AnimatePresence>
        {totalItems > 0 && (
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
                  {totalItems}
                </div>
                <span className="font-bold">Ver Pedido</span>
              </div>
              <span className="font-black text-lg">R$ {getCartTotal().toFixed(2).replace(".", ",")}</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer com Acesso Restrito */}
      <footer className="mt-20 border-t border-neutral-200 bg-white py-8">
         <div className="max-w-6xl mx-auto px-4 lg:px-8 flex flex-col md:flex-row justify-between items-center text-neutral-500 text-sm">
            <p>© {new Date().getFullYear()} CantinaOn. Todos os direitos reservados.</p>
            <div className="mt-4 md:mt-0 flex items-center">
               <Link href="/admin" className="hover:text-emerald-600 transition-colors font-medium">
                  Acesso Restrito
               </Link>
            </div>
         </div>
      </footer>

      <CartDrawer />
    </div>
  );
}

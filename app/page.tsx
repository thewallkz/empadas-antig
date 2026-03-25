"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCartStore } from "@/store/useCartStore";
import { formatCurrency } from "@/lib/formatters";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/storefront/Header";
import { Hero } from "@/components/storefront/Hero";
import { ProductCard } from "@/components/storefront/ProductCard";
import { EmptyState } from "@/components/storefront/EmptyState";
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
  const { setIsOpen, getCartTotal, getCartCount } = useCartStore();

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

  return (
    <div className="min-h-screen bg-neutral-50 pb-24 text-neutral-900">
      <Header />
      <Hero />

      {/* Product List */}
      <main className="max-w-6xl mx-auto px-4 lg:px-8">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
             {[1,2,3].map(i => (
                <div key={i} className="animate-pulse bg-white rounded-3xl p-4 h-[350px] shadow-sm border border-neutral-100" />
             ))}
          </div>
        ) : products.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {products.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        )}
      </main>

      {/* Floating Checkout Button Mobile */}
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

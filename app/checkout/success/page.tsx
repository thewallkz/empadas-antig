"use client";

import Link from "next/link";
import { CheckCircle2, ChevronRight, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white rounded-3xl p-8 md:p-12 max-w-lg w-full text-center shadow-xl border border-neutral-100"
      >
        <div className="w-24 h-24 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 size={48} strokeWidth={2.5} />
        </div>
        
        <h1 className="text-3xl font-black text-neutral-900 mb-3 tracking-tight">Pedido Recebido!</h1>
        <p className="text-neutral-500 text-lg mb-8">
          Tudo certo com o seu pedido. A nossa equipe já foi notificada e vamos preparar os seus salgados com muito carinho.
        </p>
        
        <div className="flex flex-col gap-4">
          <Link 
            href="/"
            className="w-full justify-center flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-emerald-500/25 transition-all text-lg"
          >
            <ShoppingBag size={20} /> Continuar na Loja
          </Link>
          <Link 
            href="/admin/orders"
            className="w-full justify-center flex items-center gap-1 py-3 text-neutral-400 hover:text-neutral-600 font-semibold transition-colors mt-2"
          >
            Acessar Painel (Admin) <ChevronRight size={16} />
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

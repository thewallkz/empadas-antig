"use client";

import { useState } from "react";
import { useCartStore } from "@/store/useCartStore";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, CreditCard, Store, AlertCircle } from "lucide-react";
import Link from "next/link";
import { formatCurrency } from "@/lib/formatters";
import { motion, AnimatePresence } from "framer-motion";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getCartTotal, clearCart } = useCartStore();
  
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"PAGAR_AGORA" | "PAGAR_NA_RETIRADA" | null>(null);

  if (items.length === 0 && !showConfirm) {
    return (
      <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold text-neutral-900 mb-4">Seu carrinho está vazio</h2>
        <Link href="/" className="bg-emerald-500 text-white px-6 py-3 rounded-full font-bold">
          Voltar para a loja
        </Link>
      </div>
    );
  }

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    if (!paymentMethod) return alert("Selecione uma forma de pagamento");
    setShowConfirm(true);
  };

  const submitOrder = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName: name,
          clientContact: contact,
          paymentMethod,
          items: items.map(item => ({ productId: item.productId, quantity: item.quantity })),
        }),
      });

      if (res.ok) {
        clearCart();
        router.push("/checkout/success");
      } else {
        alert("Erro ao processar pedido. Tente novamente.");
        setShowConfirm(false);
      }
    } catch (err) {
      console.error(err);
      alert("Erro ao conectar com servidor.");
      setShowConfirm(false);
    } finally {
      setLoading(false);
    }
  };

  const total = getCartTotal();

  return (
    <div className="min-h-screen bg-neutral-50 pb-20 pt-8 animate-in fade-in duration-500 text-neutral-900">
      <div className="max-w-3xl mx-auto px-4">
        
        <div className="flex items-center gap-4 mb-8">
          <Link href="/" className="p-2 bg-white rounded-full border border-neutral-200 hover:bg-neutral-50 transition-colors shadow-sm text-neutral-500">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-3xl font-black tracking-tight text-neutral-900">Finalizar Pedido</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="md:col-span-2 space-y-6">
            <form id="checkout-form" onSubmit={handleNext} className="bg-white p-6 md:p-8 rounded-3xl border border-neutral-100 shadow-sm space-y-6">
              <div>
                <h2 className="text-xl font-bold mb-4">Seus Dados</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-neutral-700 mb-1">Nome Completo <span className="text-red-500">*</span></label>
                    <input 
                      required
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all placeholder:text-neutral-400 font-medium"
                      placeholder="Como devemos te chamar?"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-neutral-700 mb-1 flex items-center gap-2">
                       WhatsApp / Contato 
                       <span className="text-xs font-normal text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded-full">Opcional</span>
                    </label>
                    <input 
                      value={contact}
                      onChange={e => setContact(e.target.value)}
                      className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all placeholder:text-neutral-400 font-medium"
                      placeholder="(DD) 99999-9999"
                    />
                    <p className="text-xs text-neutral-500 mt-2 flex items-center gap-1">
                      <AlertCircle size={12}/> Nos ajuda a te avisar se houver imprevistos.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-neutral-100">
                 <h2 className="text-xl font-bold mb-4">Pagamento</h2>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("PAGAR_AGORA")}
                      className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all ${paymentMethod === 'PAGAR_AGORA' ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-neutral-200 bg-white hover:border-emerald-200 text-neutral-500 hover:bg-neutral-50'}`}
                    >
                      <CreditCard className={`mb-3 ${paymentMethod === 'PAGAR_AGORA' ? 'text-emerald-500' : 'text-neutral-400'}`} size={32} />
                      <span className="font-bold">Pagar Agora</span>
                      <span className="text-xs opacity-70 mt-1">PIX ou Cartão Online</span>
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("PAGAR_NA_RETIRADA")}
                      className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all ${paymentMethod === 'PAGAR_NA_RETIRADA' ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-neutral-200 bg-white hover:border-emerald-200 text-neutral-500 hover:bg-neutral-50'}`}
                    >
                      <Store className={`mb-3 ${paymentMethod === 'PAGAR_NA_RETIRADA' ? 'text-emerald-500' : 'text-neutral-400'}`} size={32} />
                      <span className="font-bold">Pagar na Retirada</span>
                      <span className="text-xs opacity-70 mt-1">Dinheiro ou Máquina</span>
                    </button>
                 </div>
              </div>
            </form>
          </div>

          {/* Sidebar Summary */}
          <div className="md:col-span-1">
             <div className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm sticky top-24">
               <h2 className="text-lg font-bold mb-4">Resumo do Pedido</h2>
               <div className="space-y-3 mb-6">
                 {items.map(item => (
                   <div key={item.productId} className="flex justify-between text-sm">
                     <span className="text-neutral-600 truncate pr-4">{item.quantity}x {item.name}</span>
                     <span className="font-bold text-neutral-900">{formatCurrency(item.price * item.quantity)}</span>
                   </div>
                 ))}
               </div>
               <div className="pt-4 border-t border-neutral-100 flex justify-between items-center mb-6">
                 <span className="font-bold text-neutral-500">Total</span>
                 <span className="text-2xl font-black text-emerald-600">{formatCurrency(total)}</span>
               </div>
               
               <button 
                  type="submit"
                  form="checkout-form"
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-emerald-500/25 transition-all text-lg"
               >
                 Revisar Pedido
               </button>
             </div>
          </div>
        </div>

      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-sm"
          >
             <motion.div 
               initial={{ scale: 0.95, opacity: 0, y: 20 }}
               animate={{ scale: 1, opacity: 1, y: 0 }}
               exit={{ scale: 0.95, opacity: 0, y: 20 }}
               className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl"
             >
               <div className="w-16 h-16 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                 <CheckCircle2 size={32} />
               </div>
               <h2 className="text-2xl font-black text-center mb-2">Quase lá, {name.split(" ")[0]}!</h2>
               <p className="text-center text-neutral-500 mb-6">Confirme se está tudo certo com seu pedido.</p>
               
               <div className="bg-neutral-50 rounded-2xl p-4 mb-6 text-sm">
                  <div className="flex justify-between mb-2">
                    <span className="text-neutral-500">Total a pagar:</span>
                    <span className="font-bold text-neutral-900 text-lg">{formatCurrency(total)}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-neutral-500">Pagamento:</span>
                    <span className="font-bold text-neutral-900">{paymentMethod === "PAGAR_AGORA" ? "Online Agora" : "Na Retirada"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Itens:</span>
                    <span className="font-bold text-neutral-900">{items.reduce((acc, curr) => acc + curr.quantity, 0)} unidade(s)</span>
                  </div>
               </div>

               <div className="flex gap-3">
                 <button 
                   onClick={() => setShowConfirm(false)}
                   disabled={loading}
                   className="flex-1 py-3 text-neutral-500 font-bold hover:bg-neutral-100 rounded-xl transition-colors"
                 >
                   Voltar
                 </button>
                 <button 
                   onClick={submitOrder}
                   disabled={loading}
                   className="flex-1 py-3 bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/25 transition-all flex justify-center items-center"
                 >
                   {loading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : "Confirmar e Enviar"}
                 </button>
               </div>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

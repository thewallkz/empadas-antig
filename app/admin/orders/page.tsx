"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Clock, XCircle, ShoppingBag, Eye } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

type OrderItem = {
  id: string;
  quantity: number;
  product: { name: string; imageUrl: string | null };
};

type Order = {
  id: string;
  clientName: string;
  clientContact: string | null;
  status: "ABERTO" | "CONFIRMADO" | "CANCELADO";
  paymentMethod: string;
  totalAmount: number;
  createdAt: string;
  items: OrderItem[];
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/admin/orders");
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // In a real app we would use SSE/Polling here for MVP
    const interval = setInterval(fetchOrders, 10000); 
    return () => clearInterval(interval);
  }, []);

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/orders/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus as any } : o));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const abertos = orders.filter(o => o.status === "ABERTO").length;
  const confirmados = orders.filter(o => o.status === "CONFIRMADO").length;

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900 mb-2">Dashboard de Pedidos</h1>
        <p className="text-neutral-500">Acompanhe e gerencie os pedidos recebidos em tempo real.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
         <div className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-neutral-500 font-medium mb-1">Pedidos em Aberto</p>
              <h3 className="text-4xl font-black text-amber-500">{abertos}</h3>
            </div>
            <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center text-amber-500">
              <Clock size={28} />
            </div>
         </div>
         <div className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-neutral-500 font-medium mb-1">Confirmados Hoje</p>
              <h3 className="text-4xl font-black text-emerald-500">{confirmados}</h3>
            </div>
            <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500">
              <CheckCircle2 size={28} />
            </div>
         </div>
         <div className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-neutral-500 font-medium mb-1">Total Recebido</p>
              <h3 className="text-3xl font-black text-neutral-900">
                R$ {orders.filter(o => o.status === "CONFIRMADO").reduce((acc, o) => acc + o.totalAmount, 0).toFixed(2).replace(".", ",")}
              </h3>
            </div>
            <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-500">
              <ShoppingBag size={28} />
            </div>
         </div>
      </div>

      {/* Orders List */}
      <h2 className="text-xl font-bold mb-4 text-neutral-900">Histórico de Pedidos</h2>
      
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-neutral-100 shadow-sm flex flex-col items-center">
           <ShoppingBag className="text-neutral-300 w-16 h-16 mb-4" />
           <h3 className="text-xl font-bold text-neutral-800">Nenhum pedido recebido</h3>
           <p className="text-neutral-500 mt-2">Os pedidos dos clientes aparecerão aqui automaticamente.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map(order => (
            <div key={order.id} className={`bg-white rounded-3xl p-6 border-2 transition-all shadow-sm ${order.status === 'ABERTO' ? 'border-amber-200' : 'border-neutral-100'}`}>
               <div className="flex justify-between items-start mb-4">
                 <div>
                   <h3 className="font-bold text-lg text-neutral-900">{order.clientName}</h3>
                   <span className="text-xs text-neutral-400">
                     {format(new Date(order.createdAt), "dd 'de' MMM, HH:mm", { locale: ptBR })}
                   </span>
                 </div>
                 {order.status === 'ABERTO' ? (
                   <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-700 text-xs font-bold px-2.5 py-1 rounded-full">
                     <Clock size={12} /> Aberto
                   </span>
                 ) : order.status === 'CONFIRMADO' ? (
                   <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full">
                     <CheckCircle2 size={12} /> Confirmado
                   </span>
                 ) : (
                   <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 text-xs font-bold px-2.5 py-1 rounded-full">
                     <XCircle size={12} /> Cancelado
                   </span>
                 )}
               </div>

               <div className="mb-4">
                 <p className="text-sm font-medium text-neutral-800 mb-2">Itens do Pedido:</p>
                 <div className="space-y-2 bg-neutral-50 p-3 rounded-xl border border-neutral-100">
                   {order.items.map(item => (
                     <div key={item.id} className="flex justify-between text-sm">
                       <span className="text-neutral-600 truncate mr-2">{item.quantity}x {item.product.name}</span>
                     </div>
                   ))}
                 </div>
               </div>

               <div className="flex flex-col gap-1 mb-6 text-sm">
                 <div className="flex justify-between">
                   <span className="text-neutral-500">Método:</span>
                   <span className="font-medium text-neutral-900 tracking-tight">{order.paymentMethod === 'PAGAR_AGORA' ? 'PIX / Online' : 'Na Retirada'}</span>
                 </div>
                 {order.clientContact && order.status === 'ABERTO' && (
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Contato:</span>
                      <span className="font-bold text-emerald-600">{order.clientContact}</span>
                    </div>
                 )}
                 <div className="flex justify-between mt-2 pt-2 border-t border-neutral-100">
                   <span className="font-bold text-neutral-500">Total Pago:</span>
                   <span className="font-black text-lg text-emerald-600">R$ {order.totalAmount.toFixed(2).replace(".", ",")}</span>
                 </div>
               </div>

               {order.status === 'ABERTO' && (
                 <div className="flex gap-2">
                   <button 
                     onClick={() => updateStatus(order.id, 'CONFIRMADO')}
                     className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2.5 rounded-xl shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
                   >
                     <CheckCircle2 size={18} /> Confirmar
                   </button>
                   <button 
                     onClick={() => updateStatus(order.id, 'CANCELADO')}
                     className="bg-neutral-100 hover:bg-red-50 text-neutral-500 hover:text-red-500 p-2.5 px-3 rounded-xl transition-colors"
                     title="Cancelar pedido"
                   >
                     <XCircle size={18} />
                   </button>
                 </div>
               )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

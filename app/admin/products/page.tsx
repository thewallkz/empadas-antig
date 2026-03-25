"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Edit2, Trash2, Check, X, Package } from "lucide-react";

type Product = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  available: boolean;
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/products");
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const toggleAvailability = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ available: !currentStatus }),
      });
      if (res.ok) {
        setProducts(products.map(p => p.id === id ? { ...p, available: !currentStatus } : p));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este salgado?")) return;
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      if (res.ok) fetchProducts();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900">Gerenciar Salgados</h1>
          <p className="text-neutral-500 mt-1">Adicione, edite ou remova produtos do seu cardápio.</p>
        </div>
        <Link 
          href="/admin/products/new" 
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-full font-semibold shadow-sm transition-all shadow-emerald-500/20 hover:shadow-emerald-500/40"
        >
          <Plus size={18} strokeWidth={2.5} />
          <span>Novo Salgado</span>
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-neutral-100 shadow-sm">
          <div className="bg-neutral-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="text-neutral-400" size={32} />
          </div>
          <h3 className="text-xl font-bold text-neutral-900 mb-2">Nenhum salgado cadastrado</h3>
          <p className="text-neutral-500 mb-6 max-w-sm mx-auto">Você ainda não tem produtos no seu cardápio. Adicione o primeiro salgado para começar a vender.</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl overflow-hidden border border-neutral-100 shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-100 text-neutral-500 text-sm uppercase tracking-wider">
                <th className="p-4 font-semibold">Produto</th>
                <th className="p-4 font-semibold">Preço</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-neutral-50/50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-4">
                      {product.imageUrl ? (
                        <img src={product.imageUrl} alt={product.name} className="w-12 h-12 rounded-xl object-cover border border-neutral-100 shadow-sm" />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-neutral-100 flex items-center justify-center border border-neutral-200">
                          <Package size={20} className="text-neutral-400" />
                        </div>
                      )}
                      <div>
                        <p className="font-bold text-neutral-900">{product.name}</p>
                        <p className="text-sm text-neutral-500 max-w-[200px] truncate">{product.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 font-medium text-neutral-700">
                    R$ {product.price.toFixed(2).replace(".", ",")}
                  </td>
                  <td className="p-4">
                    <button 
                      onClick={() => toggleAvailability(product.id, product.available)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                        product.available 
                        ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200" 
                        : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                      }`}
                    >
                      {product.available ? <Check size={14} strokeWidth={3}/> : <X size={14} strokeWidth={3}/>}
                      {product.available ? "Disponível" : "Esgotado"}
                    </button>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                       {/* Edit button mocked for now or navigate to edit route */}
                      <button onClick={() => deleteProduct(product.id)} className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

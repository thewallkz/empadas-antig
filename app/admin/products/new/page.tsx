"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Image as ImageIcon } from "lucide-react";
import Link from "next/link";

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const res = await fetch("/api/admin/products", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        router.push("/admin/products");
      } else {
        alert("Erro ao salvar produto");
      }
    } catch (err) {
      console.error(err);
      alert("Erro ao comunicar com servidor");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="max-w-3xl mx-auto animate-in fade-in zoom-in-95 duration-500">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/products" className="p-2 bg-white rounded-full border border-neutral-200 hover:bg-neutral-50 transition-colors shadow-sm text-neutral-500">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-3xl font-black tracking-tight text-neutral-900">Novo Salgado</h1>
          <p className="text-neutral-500 mt-1">Cadastre um novo produto para o seu cardápio.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 border border-neutral-100 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-neutral-700 mb-2">Nome do Salgado</label>
              <input 
                name="name" 
                required 
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all placeholder:text-neutral-400 font-medium"
                placeholder="Ex: Empada de Frango"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-neutral-700 mb-2">Descrição (Opcional)</label>
              <textarea 
                name="description" 
                rows={3}
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all placeholder:text-neutral-400 resize-none font-medium"
                placeholder="Ex: Deliciosa empada recheada com..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-neutral-700 mb-2">Preço (R$)</label>
                <input 
                  name="price" 
                  type="number" 
                  step="0.01" 
                  min="0"
                  required 
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all placeholder:text-neutral-400 font-medium"
                  placeholder="0.00"
                />
              </div>
              <div className="flex items-center pt-8">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" name="available" value="true" defaultChecked className="w-5 h-5 text-emerald-500 rounded border-neutral-300 focus:ring-emerald-500" />
                  <span className="font-bold text-neutral-700">Disponível</span>
                </label>
              </div>
            </div>
          </div>

          <div>
             <label className="block text-sm font-bold text-neutral-700 mb-2">Imagem do Produto</label>
             <div className="mt-1 relative group w-full aspect-square md:aspect-auto md:h-full bg-neutral-50 border-2 border-dashed border-neutral-300 hover:border-emerald-500 rounded-2xl flex flex-col items-center justify-center transition-colors cursor-pointer overflow-hidden max-h-[300px]">
                {preview ? (
                  <img src={preview} alt="Preview" className="w-full h-full object-cover group-hover:opacity-75 transition-opacity" />
                ) : (
                  <div className="text-center p-6 pointer-events-none">
                    <ImageIcon className="mx-auto h-12 w-12 text-neutral-400 mb-4" />
                    <p className="text-sm font-medium text-neutral-600">Clique para selecionar</p>
                    <p className="text-xs text-neutral-400 mt-2">JPEG, PNG, WebP (Máx 2MB)</p>
                  </div>
                )}
                <input 
                  type="file" 
                  name="image" 
                  accept="image/jpeg, image/png, image/webp"
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
             </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-neutral-100 flex justify-end">
          <button 
            type="submit" 
            disabled={loading}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-300 text-white px-8 py-3.5 rounded-full font-bold shadow-sm transition-all shadow-emerald-500/20 hover:shadow-emerald-500/40 w-full md:w-auto justify-center"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <Save size={20} strokeWidth={2.5} />
            )}
            <span>{loading ? "Salvando..." : "Salvar Salgado"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

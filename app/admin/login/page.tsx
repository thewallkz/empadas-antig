"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Lock, Mail, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setError("Credenciais inválidas. Verifique seu e-mail e senha.");
      } else {
        router.push("/admin/orders");
      }
    } catch {
      setError("Ocorreu um erro ao tentar fazer login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-500">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-neutral-900 rounded-full flex items-center justify-center mx-auto mb-4">
             <Lock className="text-white" size={28} />
          </div>
          <h1 className="text-2xl font-black text-neutral-900 tracking-tight">Painel Administrativo</h1>
          <p className="text-neutral-500 mt-2 text-sm">Entre com suas credenciais para gerenciar a loja.</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm font-bold p-4 rounded-xl mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
           <div>
             <label className="block text-sm font-bold text-neutral-700 mb-2">E-mail</label>
             <div className="relative">
               <Mail className="absolute left-4 top-3.5 text-neutral-400" size={20} />
               <input 
                 type="email"
                 required
                 value={email}
                 onChange={e => setEmail(e.target.value)}
                 className="w-full pl-12 pr-4 py-3.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all placeholder:text-neutral-400 font-medium"
                 placeholder="admin@cantina.com"
               />
             </div>
           </div>

           <div>
             <label className="block text-sm font-bold text-neutral-700 mb-2">Senha</label>
             <div className="relative">
               <Lock className="absolute left-4 top-3.5 text-neutral-400" size={20} />
               <input 
                 type="password"
                 required
                 value={password}
                 onChange={e => setPassword(e.target.value)}
                 className="w-full pl-12 pr-4 py-3.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all placeholder:text-neutral-400 font-medium"
                 placeholder="••••••••"
               />
             </div>
           </div>

           <button 
             type="submit" 
             disabled={loading}
             className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-300 text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-emerald-500/25 transition-all mt-4"
           >
             {loading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : (
               <>Entrar no Painel <ArrowRight size={18} /></>
             )}
           </button>
        </form>
      </div>
    </div>
  );
}

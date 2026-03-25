import { Sparkles } from "lucide-react";

export function Hero() {
  return (
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
  );
}

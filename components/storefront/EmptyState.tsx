import { ShoppingBag } from "lucide-react";

export function EmptyState() {
  return (
    <div className="text-center py-20 bg-white rounded-3xl border border-neutral-100">
       <ShoppingBag className="mx-auto h-16 w-16 text-neutral-300 mb-4" />
       <h3 className="text-xl font-bold text-neutral-800">Nenhum produto disponível</h3>
       <p className="text-neutral-500 mt-2">Nossa vitrine está vazia no momento.</p>
    </div>
  );
}

"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ProductForm } from "@/components/admin/ProductForm";

export default function NewProductPage() {
  return (
    <div className="max-w-3xl mx-auto animate-in fade-in zoom-in-95 duration-500">
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/products"
          className="p-2 bg-white rounded-full border border-neutral-200 hover:bg-neutral-50 transition-colors shadow-sm text-neutral-500"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-3xl font-black tracking-tight text-neutral-900">
            Novo Salgado
          </h1>
          <p className="text-neutral-500 mt-1">
            Cadastre um novo produto para o seu cardapio.
          </p>
        </div>
      </div>

      <ProductForm
        method="POST"
        submitLabel="Salvar Salgado"
        submitUrl="/api/admin/products"
      />
    </div>
  );
}

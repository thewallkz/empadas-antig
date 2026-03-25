import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/ProductForm";
import prisma from "@/lib/prisma";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) {
    notFound();
  }

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
            Editar Salgado
          </h1>
          <p className="text-neutral-500 mt-1">
            Atualize nome, preco, disponibilidade e imagem do produto.
          </p>
        </div>
      </div>

      <ProductForm
        method="PATCH"
        submitLabel="Salvar Alteracoes"
        submitUrl={`/api/admin/products/${product.id}`}
        initialValues={{
          available: product.available,
          description: product.description,
          imageUrl: product.imageUrl,
          name: product.name,
          price: product.price,
        }}
      />
    </div>
  );
}

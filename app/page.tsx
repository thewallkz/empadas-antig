import { Header } from "@/components/storefront/Header";
import { Hero } from "@/components/storefront/Hero";
import { ProductCard } from "@/components/storefront/ProductCard";
import { EmptyState } from "@/components/storefront/EmptyState";
import { CartDrawer } from "@/components/CartDrawer";
import { FloatingCartButton } from "@/components/storefront/FloatingCartButton";
import prisma from "@/lib/prisma";
import Link from "next/link";

// Force dynamic rendering so Prisma queries run at request time,
// not during the Vercel build step where DATABASE_URL may not be set.
export const dynamic = "force-dynamic";

export default async function Storefront() {
  const products = await prisma.product.findMany({
    where: { available: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-neutral-50 pb-24 text-neutral-900">
      <Header />
      <Hero />

      <main className="max-w-6xl mx-auto px-4 lg:px-8">
        {products.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {products.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        )}
      </main>

      <FloatingCartButton />

      <footer className="mt-20 border-t border-neutral-200 bg-white py-8">
        <div className="max-w-6xl mx-auto px-4 lg:px-8 flex flex-col md:flex-row justify-between items-center text-neutral-500 text-sm">
          <p>
            Copyright {new Date().getFullYear()} CantinaOn. Todos os direitos
            reservados.
          </p>
          <div className="mt-4 md:mt-0 flex items-center">
            <Link
              href="/admin"
              className="hover:text-emerald-600 transition-colors font-medium"
            >
              Acesso Restrito
            </Link>
          </div>
        </div>
      </footer>

      <CartDrawer />
    </div>
  );
}

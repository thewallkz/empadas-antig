import Link from 'next/link'
import { LayoutDashboard, Package, ShoppingCart } from 'lucide-react'
import { LogoutButton } from '@/components/LogoutButton'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-neutral-50 text-neutral-900">
      <aside className="w-64 bg-white border-r border-neutral-200 hidden md:block">
        <div className="p-6">
          <h1 className="text-2xl font-black tracking-tight text-neutral-900">
            Cantina<span className="text-emerald-500">On</span>
          </h1>
        </div>
        <nav className="px-4 space-y-2 mt-4">
          <Link href="/admin/orders" className="flex items-center gap-3 px-4 py-3 text-neutral-600 rounded-xl hover:bg-neutral-100 transition-colors">
            <LayoutDashboard size={20} />
            <span className="font-semibold">Pedidos</span>
          </Link>
          <Link href="/admin/products" className="flex items-center gap-3 px-4 py-3 bg-neutral-900 text-white shadow-md rounded-xl transition-all">
            <Package size={20} />
            <span className="font-semibold">Salgados</span>
          </Link>
          
          <div className="pt-4 mt-4 border-t border-neutral-100">
            <LogoutButton />
          </div>
        </nav>
        
        <div className="absolute bottom-8 left-0 w-64 px-8">
          <Link href="/" className="flex items-center gap-3 px-4 py-3 text-neutral-400 hover:text-neutral-600 rounded-xl transition-colors">
            <ShoppingCart size={20} />
            <span className="font-medium text-sm">Ver Loja Publica</span>
          </Link>
        </div>
      </aside>
      
      <main className="flex-1 overflow-y-auto w-full p-4 md:p-8">
        {children}
      </main>
    </div>
  )
}

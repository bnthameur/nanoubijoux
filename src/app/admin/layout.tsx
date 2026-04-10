'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  FolderTree,
  Truck,
  Code,
  Shield,
  Settings,
  Ticket,
  FileText,
  BarChart3,
  Menu,
  X,
  LogOut,
  ChevronRight,
  Store,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Lazy-load the password modal — only needed when user clicks "Change password"
const PasswordModal = dynamic(() => import('@/components/admin/password-modal'), {
  ssr: false,
});

interface AdminUser {
  id: string;
  username: string;
  displayName: string;
  role: string;
  permissions: string[];
}

const navItems = [
  { href: '/admin', icon: LayoutDashboard, label: 'Tableau de bord' },
  { href: '/admin/commandes', icon: ShoppingCart, label: 'Commandes' },
  { href: '/admin/produits', icon: Package, label: 'Produits' },
  { href: '/admin/categories', icon: FolderTree, label: 'Catégories' },
  { href: '/admin/delivery', icon: Truck, label: 'Livraison' },
  { href: '/admin/pixels', icon: Code, label: 'Pixels' },
  { href: '/admin/reports', icon: BarChart3, label: 'Rapports' },
  { href: '/admin/users', icon: Shield, label: 'Utilisateurs', permission: 'users:manage' },
  { href: '/admin/settings', icon: Settings, label: 'Paramètres', permission: 'settings:manage' },
  { href: '/admin/coupons', icon: Ticket, label: 'Coupons' },
  { href: '/admin/blog', icon: FileText, label: 'Blog' },
];

const mobileNav = [
  { href: '/admin', icon: LayoutDashboard, label: 'Accueil' },
  { href: '/admin/commandes', icon: ShoppingCart, label: 'Commandes' },
  { href: '/admin/produits', icon: Package, label: 'Produits' },
  { href: '/admin/reports', icon: BarChart3, label: 'Rapports' },
  { href: '/admin/settings', icon: Settings, label: 'Plus' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  // Prevent redundant auth fetches — only fetch once per session
  const authChecked = useRef(false);
  const isLoginPage = pathname === '/admin/login';

  const checkAuth = useCallback(() => {
    if (isLoginPage || authChecked.current) return;
    authChecked.current = true;
    fetch('/api/admin/auth')
      .then(r => (r.ok ? r.json() : null))
      .then(data => {
        if (data?.user) setAdminUser(data.user);
        else {
          authChecked.current = false;
          router.push('/admin/login');
        }
      })
      .catch(() => {
        authChecked.current = false;
        router.push('/admin/login');
      });
  }, [router, isLoginPage]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isLoginPage) return <>{children}</>;

  const handleLogout = async () => {
    authChecked.current = false;
    await fetch('/api/admin/auth', { method: 'DELETE' });
    router.push('/admin/login');
  };

  const canSee = (link: (typeof navItems)[0]) => {
    if (!link.permission) return true;
    if (!adminUser) return false;
    if (adminUser.role === 'admin') return true;
    return adminUser.permissions.includes(link.permission);
  };

  const visibleLinks = navItems.filter(canSee);

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  };

  const currentPageLabel = visibleLinks.find(l => isActive(l.href))?.label || 'Admin';

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex h-screen w-72 flex-col border-r border-white/5 bg-[#0f172a] text-white transition-transform duration-300 lg:sticky lg:top-0 lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Brand */}
        <div className="border-b border-white/5 p-6">
          <div className="flex items-center justify-between">
            <div>
              <div
                className="text-2xl font-black tracking-tight"
                style={{
                  background: 'linear-gradient(135deg, #B8860B 0%, #DAA520 50%, #FFD700 100%)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  color: 'transparent',
                }}
              >
                Nano Bijoux
              </div>
              <div className="mt-1 text-[10px] font-bold uppercase tracking-widest text-amber-400/70">
                Console d&apos;administration
              </div>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {visibleLinks.map(item => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                prefetch={true}
                className={cn(
                  'group flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition-all duration-200',
                  active
                    ? 'bg-amber-600 font-bold text-white shadow-lg shadow-amber-900/20'
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                )}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon size={20} className="shrink-0 transition-transform group-hover:scale-110" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-white/5 p-4">
          <Link
            href="/fr"
            className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-500 transition-colors hover:bg-slate-800/50 hover:text-white"
          >
            <Store size={16} />
            <span>Retour au site</span>
            <ChevronRight size={14} className="ml-auto" />
          </Link>
          <div className="mt-3 flex items-center justify-between px-3">
            <div className="text-xs text-slate-500 truncate">
              {adminUser?.displayName || adminUser?.username || '...'}
            </div>
            <button
              onClick={handleLogout}
              className="text-slate-500 transition-colors hover:text-red-400"
              title="Déconnexion"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-gray-200 bg-white px-4 py-3 shadow-sm lg:px-8">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-1.5 text-gray-600 hover:bg-gray-100 lg:hidden"
          >
            <Menu size={20} />
          </button>
          <h1 className="font-semibold text-lg text-gray-800">{currentPageLabel}</h1>
          <div className="flex-1" />
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowPasswordModal(true)}
              className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700 transition-colors hover:bg-amber-200"
            >
              {adminUser?.displayName || 'Admin'}
            </button>
            <button
              onClick={handleLogout}
              className="rounded-lg px-2 py-1 text-xs font-bold text-red-500 transition-colors hover:bg-red-50"
            >
              Déconnexion
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-4 pb-20 lg:p-8 lg:pb-8">{children}</main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-200 bg-white lg:hidden">
        <div className="flex items-center justify-around py-1.5">
          {mobileNav.map(item => {
            const Icon = item.icon;
            const active =
              item.href === '/admin/settings'
                ? ['/admin/settings', '/admin/pixels', '/admin/reports', '/admin/users', '/admin/coupons', '/admin/blog'].some(
                    r => pathname === r || pathname.startsWith(r + '/')
                  )
                : isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                prefetch={true}
                className={cn(
                  'flex min-w-[56px] flex-col items-center gap-0.5 rounded-xl px-2 py-1.5 transition-colors',
                  active ? 'text-amber-600' : 'text-gray-400'
                )}
              >
                <Icon size={20} />
                <span className="text-[9px] font-bold leading-none">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Password change modal — lazy loaded */}
      {showPasswordModal && (
        <PasswordModal onClose={() => setShowPasswordModal(false)} />
      )}
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  FolderTree,
  Truck,
  Code,
  Users,
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
  { href: '/admin/clients', icon: Users, label: 'Clients' },
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
  { href: '/admin/clients', icon: Users, label: 'Clients' },
  { href: '/admin/settings', icon: Settings, label: 'Plus' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwSaving, setPwSaving] = useState(false);
  const [pwMsg, setPwMsg] = useState<{ text: string; ok: boolean } | null>(null);

  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (isLoginPage) return;
    fetch('/api/admin/auth')
      .then(r => (r.ok ? r.json() : null))
      .then(data => {
        if (data?.user) setAdminUser(data.user);
        else router.push('/admin/login');
      })
      .catch(() => router.push('/admin/login'));
  }, [router, isLoginPage]);

  if (isLoginPage) return <>{children}</>;

  const handleLogout = async () => {
    await fetch('/api/admin/auth', { method: 'DELETE' });
    router.push('/admin/login');
  };

  const handlePasswordChange = async () => {
    if (!currentPassword || !newPassword) {
      setPwMsg({ text: 'Tous les champs sont requis', ok: false });
      return;
    }
    if (newPassword.length < 6) {
      setPwMsg({ text: 'Le mot de passe doit contenir au moins 6 caractères', ok: false });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwMsg({ text: 'Les mots de passe ne correspondent pas', ok: false });
      return;
    }
    setPwSaving(true);
    setPwMsg(null);
    try {
      const res = await fetch('/api/admin/auth/password', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (data.ok) {
        setPwMsg({ text: 'Mot de passe modifié avec succès', ok: true });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => setShowPasswordModal(false), 1500);
      } else {
        setPwMsg({ text: data.error || 'Erreur', ok: false });
      }
    } catch {
      setPwMsg({ text: 'Erreur de connexion', ok: false });
    } finally {
      setPwSaving(false);
    }
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
              onClick={() => {
                setShowPasswordModal(true);
                setPwMsg(null);
              }}
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

      {/* Password change modal */}
      {showPasswordModal && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm"
          onClick={() => setShowPasswordModal(false)}
        >
          <div className="w-full max-w-sm space-y-4 rounded-2xl bg-white p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-800">Changer le mot de passe</h2>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-sm font-bold text-slate-500 hover:bg-slate-200"
              >
                <X size={16} />
              </button>
            </div>

            {pwMsg && (
              <div className={cn('rounded-xl px-4 py-2.5 text-sm font-medium', pwMsg.ok ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600')}>
                {pwMsg.text}
              </div>
            )}

            {(['currentPassword', 'newPassword', 'confirmPassword'] as const).map((field, i) => {
              const labels = ['Mot de passe actuel', 'Nouveau mot de passe', 'Confirmer le mot de passe'];
              const values = [currentPassword, newPassword, confirmPassword];
              const setters = [setCurrentPassword, setNewPassword, setConfirmPassword];
              return (
                <label key={field} className="block space-y-1">
                  <span className="text-xs font-semibold text-slate-500">{labels[i]}</span>
                  <input
                    type="password"
                    value={values[i]}
                    onChange={e => setters[i](e.target.value)}
                    className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 outline-none transition-all focus:border-amber-400 focus:bg-white"
                  />
                </label>
              );
            })}

            <button
              onClick={handlePasswordChange}
              disabled={pwSaving}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-slate-900 text-sm font-bold text-white transition-all hover:bg-slate-700 disabled:opacity-60"
            >
              {pwSaving && <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />}
              {pwSaving ? 'En cours...' : 'Changer le mot de passe'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

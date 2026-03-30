'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Package,
  ShoppingCart,
  Users,
  DollarSign,
  Clock,
  Truck,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
  Inbox,
} from 'lucide-react';
import { formatPrice } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface Stats {
  totalOrders: number;
  todayOrders: number;
  totalProducts: number;
  totalCustomers: number;
  pending: number;
  confirmed: number;
  ready: number;
  shipped: number;
  shipping: number;
  delivered: number;
  cancelled: number;
  returned: number;
  no_response: number;
  revenue: number;
  recentOrders: Order[];
}

interface Order {
  id: string;
  name: string;
  phone: string;
  wilaya: string;
  total: number;
  status: string;
  createdAt: string;
}

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  pending: { label: 'En attente', color: 'bg-yellow-100 text-yellow-700' },
  no_response: { label: 'Pas de réponse', color: 'bg-gray-100 text-gray-500' },
  confirmed: { label: 'Confirmée', color: 'bg-blue-100 text-blue-700' },
  ready: { label: 'Prête', color: 'bg-cyan-100 text-cyan-700' },
  shipped: { label: 'Expédiée', color: 'bg-purple-100 text-purple-700' },
  shipping: { label: 'En livraison', color: 'bg-orange-100 text-orange-700' },
  delivered: { label: 'Livrée', color: 'bg-green-100 text-green-700' },
  cancelled: { label: 'Annulée', color: 'bg-red-100 text-red-700' },
  returned: { label: 'Retournée', color: 'bg-purple-100 text-purple-700' },
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/admin/stats', { signal: controller.signal })
      .then(r => r.json())
      .then(setStats)
      .catch(err => {
        if (err.name !== 'AbortError') console.error(err);
      });
    return () => controller.abort();
  }, []);

  if (!stats) {
    return (
      <div className="space-y-6">
        <div className="h-6 w-40 animate-pulse rounded-lg bg-gray-200" />
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-2xl bg-gray-100" />
          ))}
        </div>
      </div>
    );
  }

  const topCards = [
    {
      label: 'Total commandes',
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: 'from-blue-500 to-blue-600',
      sub: `Aujourd'hui: ${stats.todayOrders}`,
    },
    {
      label: 'En attente',
      value: stats.pending + (stats.no_response || 0),
      icon: Clock,
      color: 'from-yellow-500 to-orange-500',
      sub: `${stats.pending} attente · ${stats.no_response || 0} sans réponse`,
    },
    {
      label: 'En livraison',
      value: (stats.shipping || 0) + (stats.shipped || 0),
      icon: Truck,
      color: 'from-orange-500 to-orange-600',
      sub: `${stats.ready || 0} prêtes`,
    },
    {
      label: 'Livrées',
      value: stats.delivered,
      icon: CheckCircle2,
      color: 'from-green-500 to-emerald-600',
      sub: 'Complétées',
    },
    {
      label: 'Revenus',
      value: formatPrice(stats.revenue),
      icon: DollarSign,
      color: 'from-purple-500 to-violet-600',
      sub: 'Des livrées',
    },
    {
      label: 'Produits',
      value: stats.totalProducts,
      icon: Package,
      color: 'from-pink-500 to-rose-500',
      sub: `${stats.cancelled} annulées · ${stats.returned || 0} retours`,
    },
  ];

  const bars = [
    { label: 'En attente', val: stats.pending, color: 'bg-yellow-400' },
    { label: 'Sans réponse', val: stats.no_response || 0, color: 'bg-gray-300' },
    { label: 'Confirmées', val: stats.confirmed, color: 'bg-blue-400' },
    { label: 'Prêtes', val: stats.ready || 0, color: 'bg-cyan-400' },
    { label: 'En livraison', val: (stats.shipping || 0) + (stats.shipped || 0), color: 'bg-orange-400' },
    { label: 'Livrées', val: stats.delivered, color: 'bg-green-400' },
    { label: 'Annulées', val: stats.cancelled, color: 'bg-red-400' },
    { label: 'Retours', val: stats.returned || 0, color: 'bg-purple-400' },
  ];

  return (
    <div className="space-y-5 lg:space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="flex items-center gap-2 text-lg font-bold text-gray-800 lg:text-2xl">
          <TrendingUp size={24} className="text-amber-600" />
          Tableau de bord
        </h1>
        <span className="hidden text-sm text-gray-400 sm:inline">
          {new Date().toLocaleDateString('fr-FR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </span>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 lg:gap-4">
        {topCards.map((c, i) => {
          const Icon = c.icon;
          return (
            <div key={i} className={`rounded-2xl bg-gradient-to-br ${c.color} p-3 text-white shadow-lg lg:p-5`}>
              <div className="flex items-start justify-between">
                <div className="min-w-0">
                  <div className="truncate text-xl font-black lg:text-3xl">{c.value}</div>
                  <div className="mt-0.5 truncate text-[10px] font-semibold opacity-90 lg:text-sm">{c.label}</div>
                  <div className="mt-0.5 truncate text-[9px] opacity-70 lg:text-xs">{c.sub}</div>
                </div>
                <Icon size={28} className="shrink-0 opacity-80 lg:h-8 lg:w-8" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Status distribution */}
      <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm lg:p-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-bold text-gray-700 lg:text-base">Distribution des statuts</h2>
          <Link href="/admin/commandes" className="flex items-center gap-1 text-xs text-amber-600 hover:underline">
            Tout voir <ArrowRight size={12} />
          </Link>
        </div>
        <div className="space-y-2">
          {bars.map(s => (
            <div key={s.label} className="flex items-center gap-2 lg:gap-3">
              <span className="w-20 shrink-0 truncate text-right text-[10px] text-gray-600 lg:w-28 lg:text-xs">
                {s.label}
              </span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100">
                <div
                  className={cn('h-full rounded-full transition-all duration-700', s.color)}
                  style={{
                    width: stats.totalOrders > 0 ? `${Math.max(2, (s.val / stats.totalOrders) * 100)}%` : '2%',
                  }}
                />
              </div>
              <span className="w-6 shrink-0 text-left text-[10px] font-bold text-gray-700 lg:w-8 lg:text-xs">
                {s.val}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent orders */}
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 p-4 lg:p-5">
          <h2 className="text-sm font-bold text-gray-700 lg:text-base">Commandes récentes</h2>
          <Link href="/admin/commandes" className="flex items-center gap-1 text-xs text-amber-600 hover:underline">
            Tout voir <ArrowRight size={12} />
          </Link>
        </div>

        {stats.recentOrders.length === 0 ? (
          <div className="p-10 text-center text-gray-400">
            <Inbox size={36} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">Aucune commande pour le moment</p>
          </div>
        ) : (
          <>
            {/* Mobile: card list */}
            <div className="divide-y divide-gray-50 lg:hidden">
              {stats.recentOrders.slice(0, 5).map(o => {
                const s = STATUS_CONFIG[o.status] ?? { label: o.status, color: 'bg-gray-100 text-gray-600' };
                return (
                  <Link key={o.id} href={`/admin/commandes/${o.id}`} className="flex items-center gap-3 px-4 py-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="truncate text-sm font-bold text-gray-800">{o.name}</span>
                        <span className={cn('shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-bold', s.color)}>
                          {s.label}
                        </span>
                      </div>
                      <div className="mt-0.5 flex items-center gap-2">
                        <span className="font-mono text-[10px] text-gray-400" dir="ltr">
                          {o.phone}
                        </span>
                        <span className="text-[10px] text-gray-300">·</span>
                        <span className="text-[10px] text-gray-400">{o.wilaya}</span>
                      </div>
                    </div>
                    <div className="shrink-0 text-sm font-black text-amber-600">
                      {formatPrice(Number(o.total))}
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Desktop: table */}
            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    {['Client', 'Téléphone', 'Wilaya', 'Montant', 'Statut', 'Date'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {stats.recentOrders.map(o => {
                    const s = STATUS_CONFIG[o.status] ?? { label: o.status, color: 'bg-gray-100 text-gray-600' };
                    return (
                      <tr key={o.id} className="transition-colors hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-800">
                          <Link href={`/admin/commandes/${o.id}`} className="hover:text-amber-600">
                            {o.name}
                          </Link>
                        </td>
                        <td className="px-4 py-3 font-mono text-xs text-gray-600" dir="ltr">
                          {o.phone}
                        </td>
                        <td className="px-4 py-3 text-gray-600">{o.wilaya}</td>
                        <td className="px-4 py-3 font-bold text-amber-600">{formatPrice(Number(o.total))}</td>
                        <td className="px-4 py-3">
                          <span className={cn('rounded-full px-2 py-1 text-xs font-semibold', s.color)}>
                            {s.label}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-400">
                          {new Date(o.createdAt).toLocaleDateString('fr-FR')}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

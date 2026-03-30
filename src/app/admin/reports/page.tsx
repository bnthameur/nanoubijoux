'use client';

import { useState, useEffect } from 'react';
import {
  DollarSign,
  CheckCircle2,
  XCircle,
  BarChart3,
  Trophy,
  Calendar,
} from 'lucide-react';
import { formatPrice } from '@/lib/constants';
import { cn } from '@/lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface TopProduct {
  productId: number;
  name: string;
  orderCount: number;
}

interface ReportsData {
  revenue: number;
  deliveredCount: number;
  cancelledCount: number;
  cancellationRate: number;
  totalOrders: number;
  topProducts: TopProduct[];
  monthlyOrders: Record<string, number>;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Format "YYYY-MM" → "mars 2026" using fr-FR locale */
function formatMonth(key: string): string {
  const [year, month] = key.split('-');
  const date = new Date(Number(year), Number(month) - 1, 1);
  return date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
}

// ---------------------------------------------------------------------------
// Loading skeleton
// ---------------------------------------------------------------------------

function Skeleton({ className }: { className?: string }) {
  return <div className={cn('animate-pulse rounded-xl bg-gray-100', className)} />;
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <Skeleton className="h-7 w-48" />

      {/* Stat cards skeleton */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>

      {/* Panels skeleton */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Skeleton className="h-72" />
        <Skeleton className="h-72" />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function AdminReportsPage() {
  const [data, setData] = useState<ReportsData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    fetch('/api/admin/reports', { signal: controller.signal })
      .then(async (res) => {
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error ?? `HTTP ${res.status}`);
        }
        return res.json() as Promise<ReportsData>;
      })
      .then(setData)
      .catch((err) => {
        if (err.name !== 'AbortError') {
          console.error('[AdminReportsPage]', err);
          setError(err.message ?? 'Erreur inconnue');
        }
      });

    return () => controller.abort();
  }, []);

  if (error) {
    return (
      <div className="rounded-2xl border border-red-100 bg-red-50 p-8 text-center text-sm text-red-600">
        Impossible de charger les rapports : {error}
      </div>
    );
  }

  if (!data) {
    return <LoadingSkeleton />;
  }

  // -------------------------------------------------------------------------
  // Stat cards configuration
  // -------------------------------------------------------------------------

  const statCards = [
    {
      label: 'Revenu total',
      value: formatPrice(data.revenue),
      icon: DollarSign,
      valueClass: 'text-green-600',
      sub: 'Commandes livrées',
    },
    {
      label: 'Commandes livrées',
      value: data.deliveredCount,
      icon: CheckCircle2,
      valueClass: 'text-blue-600',
      sub: `Sur ${data.totalOrders} commandes`,
    },
    {
      label: 'Commandes annulées',
      value: data.cancelledCount,
      icon: XCircle,
      valueClass: 'text-red-500',
      sub: `Sur ${data.totalOrders} commandes`,
    },
    {
      label: "Taux d'annulation",
      value: `${data.cancellationRate} %`,
      icon: BarChart3,
      valueClass: 'text-orange-500',
      sub: data.totalOrders > 0 ? 'Des commandes totales' : 'Aucune commande',
    },
  ] as const;

  // -------------------------------------------------------------------------
  // Monthly orders — compute max for progress bar scaling
  // -------------------------------------------------------------------------

  const monthEntries = Object.entries(data.monthlyOrders);
  const maxMonthlyCount = monthEntries.reduce((m, [, c]) => Math.max(m, c), 1);

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <h1 className="flex items-center gap-2 text-lg font-bold text-gray-800 lg:text-2xl">
          <BarChart3 size={24} className="text-amber-600" />
          Rapports & Analytiques
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
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="rounded-2xl border border-gray-100 bg-white p-4 text-center shadow-sm lg:p-5"
            >
              <div className="mb-2 flex justify-center">
                <div className="rounded-full bg-amber-50 p-2">
                  <Icon size={20} className="text-amber-600" />
                </div>
              </div>
              <div className={cn('text-xl font-black lg:text-2xl', card.valueClass)}>
                {card.value}
              </div>
              <div className="mt-1 text-xs font-semibold text-gray-600 lg:text-sm">
                {card.label}
              </div>
              <div className="mt-0.5 text-[10px] text-gray-400 lg:text-xs">{card.sub}</div>
            </div>
          );
        })}
      </div>

      {/* Two panels */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">

        {/* Top products */}
        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm lg:p-5">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-bold text-gray-700 lg:text-base">
            <Trophy size={16} className="text-amber-500" />
            Top 10 produits
          </h2>

          {data.topProducts.length === 0 ? (
            <div className="py-10 text-center text-sm text-gray-400">
              Aucune donnée disponible
            </div>
          ) : (
            <ol className="space-y-2">
              {data.topProducts.map((product, index) => (
                <li
                  key={product.productId}
                  className="flex items-center gap-3 rounded-xl px-3 py-2 transition-colors hover:bg-amber-50"
                >
                  {/* Rank badge */}
                  <span
                    className={cn(
                      'flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold',
                      index === 0
                        ? 'bg-amber-400 text-white'
                        : index === 1
                        ? 'bg-gray-300 text-gray-700'
                        : index === 2
                        ? 'bg-orange-300 text-white'
                        : 'bg-gray-100 text-gray-500'
                    )}
                  >
                    {index + 1}
                  </span>

                  {/* Product name */}
                  <span className="min-w-0 flex-1 truncate text-sm text-gray-700">
                    {product.name}
                  </span>

                  {/* Order count */}
                  <span className="shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-700">
                    {product.orderCount} cmd
                  </span>
                </li>
              ))}
            </ol>
          )}
        </div>

        {/* Monthly orders */}
        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm lg:p-5">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-bold text-gray-700 lg:text-base">
            <Calendar size={16} className="text-amber-500" />
            Commandes par mois
          </h2>

          {monthEntries.length === 0 ? (
            <div className="py-10 text-center text-sm text-gray-400">
              Aucune donnée disponible
            </div>
          ) : (
            <ul className="space-y-3">
              {monthEntries.map(([monthKey, count]) => (
                <li key={monthKey} className="flex items-center gap-3">
                  {/* Month label */}
                  <span className="w-28 shrink-0 text-right text-xs capitalize text-gray-600 lg:w-32 lg:text-sm">
                    {formatMonth(monthKey)}
                  </span>

                  {/* Progress bar */}
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full bg-amber-400 transition-all duration-700"
                      style={{
                        width: `${Math.max(2, (count / maxMonthlyCount) * 100)}%`,
                      }}
                    />
                  </div>

                  {/* Count */}
                  <span className="w-8 shrink-0 text-left text-xs font-bold text-gray-700 lg:text-sm">
                    {count}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

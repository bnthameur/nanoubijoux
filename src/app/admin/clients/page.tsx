'use client';

import { useState, useEffect, useMemo } from 'react';
import { Search, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatPrice } from '@/lib/constants';
import { getErrorMessage } from '@/lib/error-utils';
import type { AggregatedClient } from '@/app/api/admin/clients/route';

// ─── Skeleton ────────────────────────────────────────────────────────────────

function SkeletonRow() {
  return (
    <tr>
      {[...Array(6)].map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 bg-gray-100 rounded-full animate-pulse" style={{ width: `${60 + (i % 3) * 20}%` }} />
        </td>
      ))}
    </tr>
  );
}

function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-4 space-y-3 animate-pulse">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="h-4 w-32 bg-gray-100 rounded-full" />
          <div className="h-3 w-24 bg-gray-100 rounded-full" />
        </div>
        <div className="h-6 w-10 bg-gray-100 rounded-full" />
      </div>
      <div className="flex gap-2">
        <div className="h-3 w-20 bg-gray-100 rounded-full" />
        <div className="h-3 w-24 bg-gray-100 rounded-full" />
      </div>
    </div>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDate(iso: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AdminClientsPage() {
  const [allCustomers, setAllCustomers] = useState<AggregatedClient[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');

    fetch('/api/admin/clients')
      .then((r) => r.json())
      .then((data) => {
        setAllCustomers(data.customers ?? []);
        setTotal(data.total ?? 0);
        if (data.error) setError(data.error);
      })
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  // Client-side filtering (search is done locally against already-fetched data)
  const filtered = useMemo(() => {
    if (!search.trim()) return allCustomers;
    const q = search.toLowerCase();
    return allCustomers.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.phone.toLowerCase().includes(q) ||
        c.wilaya.toLowerCase().includes(q)
    );
  }, [allCustomers, search]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-amber-50">
          <Users size={20} className="text-amber-600" />
        </div>
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold text-gray-900">Clients</h1>
          {!loading && (
            <span className="inline-flex items-center justify-center min-w-[1.5rem] h-6 px-2 rounded-full bg-amber-100 text-amber-700 text-xs font-semibold">
              {total}
            </span>
          )}
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher par nom, téléphone ou wilaya…"
          className={cn(
            'w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-white',
            'placeholder:text-gray-400 text-gray-900',
            'focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100',
            'transition-colors'
          )}
        />
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl border border-red-100">
          {error}
        </div>
      )}

      {/* Desktop Table */}
      <div className="hidden md:block rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/70">
              <th className="text-right px-4 py-3 font-medium text-gray-500">الاسم</th>
              <th className="text-right px-4 py-3 font-medium text-gray-500">الهاتف</th>
              <th className="text-right px-4 py-3 font-medium text-gray-500">الولاية</th>
              <th className="text-center px-4 py-3 font-medium text-gray-500">الطلبات</th>
              <th className="text-right px-4 py-3 font-medium text-gray-500">المجموع</th>
              <th className="text-right px-4 py-3 font-medium text-gray-500">آخر طلب</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <>
                <SkeletonRow />
                <SkeletonRow />
                <SkeletonRow />
                <SkeletonRow />
                <SkeletonRow />
              </>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={6}>
                  <div className="flex flex-col items-center justify-center gap-3 py-16 text-gray-400">
                    <Users size={40} className="opacity-40" />
                    <p className="text-sm">لا يوجد عملاء</p>
                  </div>
                </td>
              </tr>
            ) : (
              filtered.map((c, idx) => (
                <tr
                  key={`${c.phone}-${idx}`}
                  className="border-b border-gray-50 last:border-0 hover:bg-amber-50/30 transition-colors"
                >
                  <td className="px-4 py-3 font-semibold text-gray-900 text-right">
                    {c.name || '—'}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span
                      dir="ltr"
                      className="font-mono text-gray-600 tracking-wide"
                    >
                      {c.phone || '—'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600 text-right">
                    {c.wilaya || '—'}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="inline-flex items-center justify-center min-w-[1.5rem] h-6 px-2 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold">
                      {c.orderCount}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-amber-600">
                    {formatPrice(c.totalSpent)}
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-right text-xs">
                    {formatDate(c.lastOrderDate)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Table footer count */}
        {!loading && filtered.length > 0 && (
          <div className="px-4 py-2.5 border-t border-gray-100 bg-gray-50/50">
            <p className="text-xs text-gray-400">
              {filtered.length !== total
                ? `${filtered.length} من ${total} عميل`
                : `${total} عميل`}
            </p>
          </div>
        )}
      </div>

      {/* Mobile Card List */}
      <div className="md:hidden space-y-3">
        {loading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-gray-400">
            <Users size={40} className="opacity-40" />
            <p className="text-sm">لا يوجد عملاء</p>
          </div>
        ) : (
          filtered.map((c, idx) => (
            <div
              key={`${c.phone}-${idx}-mobile`}
              className="rounded-2xl border border-gray-100 bg-white shadow-sm p-4 space-y-3"
            >
              {/* Name + order count badge */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-gray-900 text-sm">
                    {c.name || '—'}
                  </p>
                  <p
                    dir="ltr"
                    className="font-mono text-xs text-gray-500 tracking-wide mt-0.5"
                  >
                    {c.phone || '—'}
                  </p>
                </div>
                <span className="inline-flex items-center justify-center min-w-[1.5rem] h-6 px-2 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold shrink-0">
                  {c.orderCount}
                </span>
              </div>

              {/* Wilaya + total + date */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
                {c.wilaya && (
                  <span className="inline-flex items-center gap-1">
                    <span className="text-gray-400">•</span>
                    {c.wilaya}
                  </span>
                )}
                <span className="font-medium text-amber-600">
                  {formatPrice(c.totalSpent)}
                </span>
                <span className="text-gray-400">{formatDate(c.lastOrderDate)}</span>
              </div>
            </div>
          ))
        )}

        {!loading && filtered.length > 0 && (
          <p className="text-xs text-gray-400 text-center pb-2">
            {filtered.length !== total
              ? `${filtered.length} من ${total} عميل`
              : `${total} عميل`}
          </p>
        )}
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Search, ShoppingCart, Eye, Truck, FileDown, Loader2 } from 'lucide-react';
import { getAllOrders, updateOrderStatus } from '@/lib/supabase/admin-queries';
import { getErrorMessage } from '@/lib/error-utils';
import { formatPrice } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  no_response: 'bg-gray-100 text-gray-500',
  confirmed: 'bg-blue-100 text-blue-700',
  ready: 'bg-cyan-100 text-cyan-700',
  shipped: 'bg-purple-100 text-purple-700',
  shipping: 'bg-orange-100 text-orange-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
  returned: 'bg-purple-100 text-purple-700',
};

const statusLabels: Record<string, string> = {
  pending: 'En attente',
  no_response: 'Pas de réponse',
  confirmed: 'Confirmée',
  ready: 'Prête',
  shipped: 'Expédiée',
  shipping: 'En livraison',
  delivered: 'Livrée',
  cancelled: 'Annulée',
  returned: 'Retournée',
};

const paymentLabels: Record<string, string> = {
  cod: 'Contre remboursement',
  baridimob: 'BaridiMob',
  ccp: 'CCP',
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(0);
  const limit = 20;

  // Selection state
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkShipping, setBulkShipping] = useState(false);
  const [bulkDownloading, setBulkDownloading] = useState(false);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const { orders: data, total: count } = await getAllOrders({
        status: statusFilter,
        search: search || undefined,
        limit,
        offset: page * limit,
      });
      setOrders(data);
      setTotal(count);
    } catch (err) {
      console.error('[Orders]', getErrorMessage(err));
      toast.error(`Erreur: ${getErrorMessage(err)}`);
    }
    setLoading(false);
  }, [page, statusFilter, search]);

  useEffect(() => {
    fetchOrders();
    // Clear selection when page/filter changes
    setSelectedIds(new Set());
  }, [page, statusFilter, search]);

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      toast.success(`Commande #${orderId} → ${statusLabels[newStatus]}`);
      fetchOrders();
    } catch {
      toast.error('Erreur lors de la mise à jour');
    }
  };

  // Selection handlers
  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const allSelected = orders.length > 0 && orders.every(o => selectedIds.has(String(o.id)));
  const someSelected = orders.some(o => selectedIds.has(String(o.id)));

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(orders.map(o => String(o.id))));
    }
  };

  const selectedCount = selectedIds.size;

  // Bulk ship selected orders
  const handleBulkShip = async () => {
    if (selectedCount === 0) return;
    setBulkShipping(true);
    try {
      const res = await fetch('/api/admin/orders/bulk-ship', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderIds: Array.from(selectedIds) }),
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.error || 'Erreur lors de l\'envoi');
      } else {
        const { success, total: attempted } = json;
        toast.success(`${success} / ${attempted} commande(s) envoyée(s) à EcoTrack`);
        setSelectedIds(new Set());
        fetchOrders();
      }
    } catch (err) {
      toast.error(`Erreur: ${getErrorMessage(err)}`);
    }
    setBulkShipping(false);
  };

  // Bulk download bordereaux — merge PDFs server-side and open in new tab
  const handleBulkDownload = async () => {
    if (selectedCount === 0) return;
    setBulkDownloading(true);
    try {
      const res = await fetch('/api/admin/orders/bulk-labels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderIds: Array.from(selectedIds) }),
      });

      if (!res.ok) {
        const json = await res.json().catch(() => ({ error: 'Erreur inconnue' }));
        toast.error(json.error || 'Erreur lors du téléchargement');
        return;
      }

      // Receive merged PDF blob and trigger download
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `bordereaux-${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      toast.error(`Erreur: ${getErrorMessage(err)}`);
    }
    setBulkDownloading(false);
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            placeholder="Rechercher par ID ou nom..."
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:border-gold focus:outline-none"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['all', 'pending', 'no_response', 'confirmed', 'ready', 'shipped', 'shipping', 'delivered', 'cancelled', 'returned'].map((s) => (
            <button
              key={s}
              onClick={() => { setStatusFilter(s); setPage(0); }}
              className={cn(
                'px-3 py-1.5 text-xs rounded-full font-medium transition-colors',
                statusFilter === s
                  ? 'bg-amber-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              )}
            >
              {s === 'all' ? 'Toutes' : statusLabels[s]}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-400">Chargement...</div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <ShoppingCart size={40} className="mx-auto mb-3 opacity-50" />
            <p>Aucune commande trouvée</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-4 py-3 w-10">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      ref={(el) => {
                        if (el) el.indeterminate = someSelected && !allSelected;
                      }}
                      onChange={toggleSelectAll}
                      className="rounded border-gray-300 text-amber-600 focus:ring-amber-500 cursor-pointer"
                      aria-label="Tout sélectionner"
                    />
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">ID</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Client</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Date</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Paiement</th>
                  <th className="text-center px-4 py-3 font-medium text-gray-500">Statut</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-500">Total</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  const orderId = String(order.id);
                  const isSelected = selectedIds.has(orderId);
                  return (
                    <tr
                      key={order.id}
                      className={cn(
                        'border-b border-gray-50 hover:bg-gray-50 transition-colors',
                        isSelected && 'bg-amber-50'
                      )}
                    >
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelect(orderId)}
                          className="rounded border-gray-300 text-amber-600 focus:ring-amber-500 cursor-pointer"
                          aria-label={`Sélectionner commande #${order.id}`}
                        />
                      </td>
                      <td className="px-4 py-3 font-medium">#{order.id}</td>
                      <td className="px-4 py-3 text-gray-500">
                        {order.full_name || '—'}
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        {new Date(order.created_at).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs">
                        {paymentLabels[order.payment_method] || order.payment_method}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          className={cn(
                            'text-xs px-2 py-1 rounded-full font-medium border-0 cursor-pointer',
                            statusColors[order.status]
                          )}
                        >
                          {Object.entries(statusLabels).map(([value, label]) => (
                            <option key={value} value={value}>{label}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3 text-right font-medium">{formatPrice(order.total)}</td>
                      <td className="px-4 py-3 text-right">
                        <Link
                          href={`/admin/commandes/${order.id}`}
                          className="p-1.5 text-gray-400 hover:text-gold transition-colors inline-block"
                        >
                          <Eye size={15} />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {total > limit && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
            <p className="text-xs text-gray-400">{total} commande(s)</p>
            <div className="flex gap-2">
              <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0} className="px-3 py-1 text-sm border rounded disabled:opacity-30">Précédent</button>
              <button onClick={() => setPage(p => p + 1)} disabled={(page + 1) * limit >= total} className="px-3 py-1 text-sm border rounded disabled:opacity-30">Suivant</button>
            </div>
          </div>
        )}
      </div>

      {/* Bulk action bar — appears when orders are selected */}
      {selectedCount > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3 bg-gray-900 text-white rounded-2xl shadow-xl border border-gray-700 animate-in fade-in slide-in-from-bottom-4">
          <span className="text-sm font-medium pr-2 border-r border-gray-600">
            {selectedCount} sélectionnée{selectedCount > 1 ? 's' : ''}
          </span>
          <button
            onClick={handleBulkShip}
            disabled={bulkShipping || bulkDownloading}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium bg-cyan-600 hover:bg-cyan-500 disabled:opacity-60 transition-colors"
          >
            {bulkShipping ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Truck size={14} />
            )}
            {bulkShipping ? 'Envoi...' : 'Expédier les sélectionnées'}
          </button>
          <button
            onClick={handleBulkDownload}
            disabled={bulkDownloading || bulkShipping}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium bg-green-600 hover:bg-green-500 disabled:opacity-60 transition-colors"
          >
            {bulkDownloading ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <FileDown size={14} />
            )}
            {bulkDownloading ? 'Génération...' : 'Télécharger les bordereaux'}
          </button>
        </div>
      )}
    </div>
  );
}

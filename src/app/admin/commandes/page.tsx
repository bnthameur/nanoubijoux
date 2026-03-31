'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Search, ShoppingCart, Eye, Truck, FileDown, Loader2, Phone } from 'lucide-react';
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
  cod: 'COD',
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

  // Per-row loading states
  const [shippingIds, setShippingIds] = useState<Set<string>>(new Set());
  const [downloadingIds, setDownloadingIds] = useState<Set<string>>(new Set());

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
    setSelectedIds(new Set());
  }, [page, statusFilter, search]);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      toast.success(`Commande → ${statusLabels[newStatus]}`);
      fetchOrders();
    } catch {
      toast.error('Erreur lors de la mise à jour');
    }
  };

  // ─── Inline EcoTrack actions per row ───────────────────────────────────

  const handleShipOne = async (orderId: string) => {
    setShippingIds(prev => new Set(prev).add(orderId));
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/ship`, { method: 'POST' });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.error || 'Erreur EcoTrack');
      } else {
        toast.success(`Tracking: ${json.tracking}`);
        fetchOrders();
      }
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
    setShippingIds(prev => { const n = new Set(prev); n.delete(orderId); return n; });
  };

  const handleDownloadOne = async (orderId: string) => {
    setDownloadingIds(prev => new Set(prev).add(orderId));
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/label`);
      if (!res.ok) {
        toast.error('Erreur lors du téléchargement');
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `bordereau-${orderId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
    setDownloadingIds(prev => { const n = new Set(prev); n.delete(orderId); return n; });
  };

  // ─── Selection handlers ────────────────────────────────────────────────

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const allSelected = orders.length > 0 && orders.every(o => selectedIds.has(String(o.id)));
  const someSelected = orders.some(o => selectedIds.has(String(o.id)));

  const toggleSelectAll = () => {
    setSelectedIds(allSelected ? new Set() : new Set(orders.map(o => String(o.id))));
  };

  const selectedCount = selectedIds.size;

  // ─── Bulk actions ──────────────────────────────────────────────────────

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
        toast.error(json.error || "Erreur lors de l'envoi");
      } else {
        toast.success(`${json.success} / ${json.total} envoyée(s) à EcoTrack`);
        setSelectedIds(new Set());
        fetchOrders();
      }
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
    setBulkShipping(false);
  };

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
        toast.error(json.error || 'Erreur téléchargement');
        return;
      }
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
      toast.error(getErrorMessage(err));
    }
    setBulkDownloading(false);
  };

  // ─── Render ────────────────────────────────────────────────────────────

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            placeholder="Rechercher par nom, tél, wilaya..."
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:border-amber-500 focus:outline-none bg-white"
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {['all', 'pending', 'no_response', 'confirmed', 'ready', 'shipped', 'shipping', 'delivered', 'cancelled', 'returned'].map((s) => (
            <button
              key={s}
              onClick={() => { setStatusFilter(s); setPage(0); }}
              className={cn(
                'px-2.5 py-1 text-xs rounded-full font-medium transition-colors',
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
          <div className="p-12 text-center text-gray-400">
            <Loader2 size={24} className="animate-spin mx-auto mb-2" />
            Chargement...
          </div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <ShoppingCart size={40} className="mx-auto mb-3 opacity-50" />
            <p>Aucune commande trouvée</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50/80">
                  <th className="px-3 py-2.5 w-8">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      ref={(el) => { if (el) el.indeterminate = someSelected && !allSelected; }}
                      onChange={toggleSelectAll}
                      className="rounded border-gray-300 text-amber-600 focus:ring-amber-500 cursor-pointer"
                    />
                  </th>
                  <th className="text-left px-3 py-2.5 font-medium text-gray-500 text-xs">Client</th>
                  <th className="text-left px-3 py-2.5 font-medium text-gray-500 text-xs">Tél</th>
                  <th className="text-left px-3 py-2.5 font-medium text-gray-500 text-xs hidden lg:table-cell">Wilaya</th>
                  <th className="text-center px-3 py-2.5 font-medium text-gray-500 text-xs">Statut</th>
                  <th className="text-right px-3 py-2.5 font-medium text-gray-500 text-xs">Total</th>
                  <th className="text-center px-3 py-2.5 font-medium text-gray-500 text-xs">EcoTrack</th>
                  <th className="text-right px-3 py-2.5 font-medium text-gray-500 text-xs w-10"></th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  const oid = String(order.id);
                  const isSelected = selectedIds.has(oid);
                  const hasTracking = !!order.ecotrack_tracking;
                  const canShip = order.status === 'confirmed' && !hasTracking;

                  return (
                    <tr
                      key={order.id}
                      className={cn(
                        'border-b border-gray-50 hover:bg-gray-50/50 transition-colors',
                        isSelected && 'bg-amber-50/60'
                      )}
                    >
                      {/* Checkbox */}
                      <td className="px-3 py-2.5">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelect(oid)}
                          className="rounded border-gray-300 text-amber-600 focus:ring-amber-500 cursor-pointer"
                        />
                      </td>

                      {/* Client + date */}
                      <td className="px-3 py-2.5">
                        <div className="font-medium text-gray-900 text-sm truncate max-w-[150px]">
                          {order.full_name || '—'}
                        </div>
                        <div className="text-[10px] text-gray-400 mt-0.5">
                          {new Date(order.created_at).toLocaleDateString('fr-FR')}
                          {' · '}
                          {paymentLabels[order.payment_method] || order.payment_method}
                        </div>
                      </td>

                      {/* Phone */}
                      <td className="px-3 py-2.5">
                        <a
                          href={`tel:${order.phone}`}
                          className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-amber-600 transition-colors"
                        >
                          <Phone size={11} />
                          {order.phone || '—'}
                        </a>
                      </td>

                      {/* Wilaya */}
                      <td className="px-3 py-2.5 text-xs text-gray-500 hidden lg:table-cell">
                        {order.wilayas?.name_fr || order.wilaya_id || '—'}
                      </td>

                      {/* Status */}
                      <td className="px-3 py-2.5 text-center">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(oid, e.target.value)}
                          className={cn(
                            'text-[10px] px-2 py-0.5 rounded-full font-medium border-0 cursor-pointer appearance-none text-center',
                            statusColors[order.status]
                          )}
                        >
                          {Object.entries(statusLabels).map(([value, label]) => (
                            <option key={value} value={value}>{label}</option>
                          ))}
                        </select>
                      </td>

                      {/* Total */}
                      <td className="px-3 py-2.5 text-right font-semibold text-sm">
                        {formatPrice(order.total)}
                      </td>

                      {/* EcoTrack actions */}
                      <td className="px-3 py-2.5 text-center">
                        {hasTracking ? (
                          <div className="flex items-center justify-center gap-1">
                            <span className="text-[9px] bg-cyan-50 text-cyan-700 px-1.5 py-0.5 rounded font-mono truncate max-w-[80px]" title={order.ecotrack_tracking}>
                              {order.ecotrack_tracking}
                            </span>
                            <button
                              onClick={() => handleDownloadOne(oid)}
                              disabled={downloadingIds.has(oid)}
                              className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors disabled:opacity-40"
                              title="Télécharger le bordereau"
                            >
                              {downloadingIds.has(oid) ? (
                                <Loader2 size={13} className="animate-spin" />
                              ) : (
                                <FileDown size={13} />
                              )}
                            </button>
                          </div>
                        ) : canShip ? (
                          <button
                            onClick={() => handleShipOne(oid)}
                            disabled={shippingIds.has(oid)}
                            className="inline-flex items-center gap-1 px-2 py-1 text-[10px] font-medium bg-cyan-50 text-cyan-700 hover:bg-cyan-100 rounded-lg transition-colors disabled:opacity-40"
                            title="Envoyer à EcoTrack"
                          >
                            {shippingIds.has(oid) ? (
                              <Loader2 size={11} className="animate-spin" />
                            ) : (
                              <Truck size={11} />
                            )}
                            Envoyer
                          </button>
                        ) : (
                          <span className="text-gray-300">—</span>
                        )}
                      </td>

                      {/* View detail */}
                      <td className="px-3 py-2.5 text-right">
                        <Link
                          href={`/admin/commandes/${order.id}`}
                          className="p-1 text-gray-400 hover:text-amber-600 transition-colors inline-block"
                          title="Voir le détail"
                        >
                          <Eye size={14} />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {total > limit && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
            <p className="text-xs text-gray-400">{total} commande(s) · Page {page + 1}</p>
            <div className="flex gap-2">
              <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0} className="px-3 py-1 text-xs border rounded-lg disabled:opacity-30 hover:bg-gray-50">Précédent</button>
              <button onClick={() => setPage(p => p + 1)} disabled={(page + 1) * limit >= total} className="px-3 py-1 text-xs border rounded-lg disabled:opacity-30 hover:bg-gray-50">Suivant</button>
            </div>
          </div>
        )}
      </div>

      {/* Bulk action bar */}
      {selectedCount > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3 bg-gray-900 text-white rounded-2xl shadow-2xl border border-gray-700">
          <span className="text-sm font-medium pr-3 border-r border-gray-600">
            {selectedCount} sélectionnée{selectedCount > 1 ? 's' : ''}
          </span>
          <button
            onClick={handleBulkShip}
            disabled={bulkShipping || bulkDownloading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-cyan-600 hover:bg-cyan-500 disabled:opacity-60 transition-colors"
          >
            {bulkShipping ? <Loader2 size={13} className="animate-spin" /> : <Truck size={13} />}
            Expédier
          </button>
          <button
            onClick={handleBulkDownload}
            disabled={bulkDownloading || bulkShipping}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-green-600 hover:bg-green-500 disabled:opacity-60 transition-colors"
          >
            {bulkDownloading ? <Loader2 size={13} className="animate-spin" /> : <FileDown size={13} />}
            Bordereaux PDF
          </button>
          <button
            onClick={() => setSelectedIds(new Set())}
            className="text-xs text-gray-400 hover:text-white ml-1 transition-colors"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}

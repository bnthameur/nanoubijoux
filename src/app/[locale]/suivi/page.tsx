'use client';

import { useState, FormEvent } from 'react';
import {
  Search,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  XCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatPrice } from '@/lib/constants';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface OrderItem {
  id: string;
  product_id: string;
  variant_id: string | null;
  quantity: number;
  unit_price: number;
  total_price: number;
  product_name: string | null;
  product_image: string | null;
  product_sku: string | null;
}

interface TrackingOrder {
  id: string;
  status: string;
  full_name: string;
  phone: string;
  total: number;
  created_at: string;
  tracking_number: string | null;
  ecotrack_tracking: string | null;
  wilaya_id: number | null;
  wilaya_name_fr: string | null;
  commune: string | null;
  items: OrderItem[];
}

// ---------------------------------------------------------------------------
// Status config
// ---------------------------------------------------------------------------

type TimelineStep = {
  key: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
};

const TIMELINE_STEPS: TimelineStep[] = [
  { key: 'pending', label: 'En attente', icon: Clock },
  { key: 'confirmed', label: 'Confirmée', icon: CheckCircle2 },
  { key: 'shipped', label: 'En livraison', icon: Truck },
  { key: 'delivered', label: 'Livrée', icon: Package },
];

// Maps status values to their timeline step index (0-based).
// statuses outside the timeline (cancelled, returned, etc.) return -1.
const STATUS_STEP_INDEX: Record<string, number> = {
  pending: 0,
  no_response: 0,
  confirmed: 1,
  ready: 1,
  shipped: 2,
  shipping: 2,
  delivered: 3,
};

const STATUS_LABELS: Record<string, string> = {
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

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function StatusBadge({ status }: { status: string }) {
  if (status === 'cancelled') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
        <XCircle size={13} />
        {STATUS_LABELS[status] ?? status}
      </span>
    );
  }

  if (status === 'returned') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">
        <XCircle size={13} />
        {STATUS_LABELS[status] ?? status}
      </span>
    );
  }

  const colorMap: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-700',
    no_response: 'bg-gray-100 text-gray-500',
    confirmed: 'bg-blue-100 text-blue-700',
    ready: 'bg-cyan-100 text-cyan-700',
    shipped: 'bg-amber-100 text-amber-700',
    shipping: 'bg-orange-100 text-orange-700',
    delivered: 'bg-green-100 text-green-700',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold',
        colorMap[status] ?? 'bg-gray-100 text-gray-700'
      )}
    >
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}

function OrderTimeline({ status }: { status: string }) {
  // Do not render timeline for terminal negative statuses
  if (status === 'cancelled' || status === 'returned') return null;

  const currentStepIndex = STATUS_STEP_INDEX[status] ?? 0;

  return (
    <div className="mt-5">
      <div className="flex items-center justify-between">
        {TIMELINE_STEPS.map((step, index) => {
          const isCompleted = index <= currentStepIndex;
          const isCurrent = index === currentStepIndex;
          const Icon = step.icon;

          return (
            <div key={step.key} className="flex flex-1 items-center">
              {/* Step node */}
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    'flex h-9 w-9 items-center justify-center rounded-full border-2 transition-colors',
                    isCompleted
                      ? isCurrent
                        ? 'border-amber-500 bg-amber-500 text-white shadow-sm shadow-amber-200'
                        : 'border-amber-400 bg-amber-400 text-white'
                      : 'border-gray-200 bg-white text-gray-300'
                  )}
                >
                  <Icon size={16} />
                </div>
                <span
                  className={cn(
                    'mt-1.5 hidden text-center text-xs sm:block',
                    isCompleted ? 'font-semibold text-amber-700' : 'text-gray-400'
                  )}
                  style={{ maxWidth: '5rem' }}
                >
                  {step.label}
                </span>
              </div>

              {/* Connector line (not after last step) */}
              {index < TIMELINE_STEPS.length - 1 && (
                <div
                  className={cn(
                    'mx-1 h-0.5 flex-1 transition-colors',
                    index < currentStepIndex ? 'bg-amber-400' : 'bg-gray-200'
                  )}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile step labels */}
      <div className="mt-2 flex justify-between sm:hidden">
        {TIMELINE_STEPS.map((step, index) => {
          const isCompleted = index <= currentStepIndex;
          return (
            <span
              key={step.key}
              className={cn(
                'flex-1 text-center text-[10px] leading-tight',
                isCompleted ? 'font-semibold text-amber-700' : 'text-gray-400'
              )}
            >
              {step.label}
            </span>
          );
        })}
      </div>
    </div>
  );
}

function OrderCard({ order }: { order: TrackingOrder }) {
  const date = new Date(order.created_at).toLocaleDateString('fr-DZ', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const effectiveTracking = order.tracking_number ?? order.ecotrack_tracking;

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      {/* Header row */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
            Commande
          </p>
          <p className="mt-0.5 font-mono text-sm font-bold text-gray-800">
            #{order.id.slice(0, 8).toUpperCase()}
          </p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      {/* Details grid */}
      <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 text-sm sm:grid-cols-4">
        <div>
          <p className="text-xs text-gray-400">Nom</p>
          <p className="font-medium text-gray-800">{order.full_name}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Total</p>
          <p className="font-semibold text-amber-700">{formatPrice(order.total)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Date</p>
          <p className="text-gray-700">{date}</p>
        </div>
        {effectiveTracking && (
          <div>
            <p className="text-xs text-gray-400">N° de suivi</p>
            <p className="font-mono text-xs font-semibold text-amber-600">
              {effectiveTracking}
            </p>
          </div>
        )}
        {order.wilaya_name_fr && (
          <div>
            <p className="text-xs text-gray-400">Wilaya</p>
            <p className="text-gray-700">{order.wilaya_name_fr}</p>
          </div>
        )}
      </div>

      {/* Items summary */}
      {order.items.length > 0 && (
        <div className="mt-4 border-t border-gray-100 pt-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
            Articles ({order.items.length})
          </p>
          <ul className="space-y-1">
            {order.items.map((item) => (
              <li key={item.id} className="flex justify-between text-sm">
                <span className="truncate text-gray-700">
                  {item.product_name ?? 'Article'}{' '}
                  <span className="text-gray-400">× {item.quantity}</span>
                </span>
                <span className="ml-4 shrink-0 font-medium text-gray-800">
                  {formatPrice(item.total_price)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Timeline */}
      <OrderTimeline status={order.status} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------

export default function TrackingPage() {
  const [phone, setPhone] = useState('');
  const [orders, setOrders] = useState<TrackingOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = phone.trim();
    if (!trimmed) return;

    setLoading(true);
    setError(null);
    setSearched(false);

    try {
      const res = await fetch(
        `/api/tracking?phone=${encodeURIComponent(trimmed)}`
      );
      const body = await res.json();

      if (!res.ok) {
        setError(body?.error ?? 'Une erreur est survenue.');
        setOrders([]);
      } else {
        setOrders(body.orders ?? []);
        setSearched(true);
      }
    } catch {
      setError('Impossible de contacter le serveur. Réessayez.');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-amber-50/40 py-10 px-4 sm:px-6">
      <div className="mx-auto max-w-2xl">
        {/* Page heading */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-600">
            <Package size={28} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Suivi de commande
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Entrez votre numéro de téléphone pour retrouver vos commandes.
          </p>
        </div>

        {/* Search form */}
        <form
          onSubmit={handleSearch}
          className="flex gap-2 rounded-2xl bg-white p-2 shadow-sm ring-1 ring-gray-100"
        >
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Ex: 0555123456"
              required
              className="w-full rounded-xl py-2.5 pl-9 pr-3 text-sm outline-none placeholder:text-gray-300 focus:ring-2 focus:ring-amber-400"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={cn(
              'shrink-0 rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2',
              loading && 'cursor-not-allowed opacity-60'
            )}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                {/* Simple CSS spinner */}
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Recherche…
              </span>
            ) : (
              'Rechercher'
            )}
          </button>
        </form>

        {/* Error state */}
        {error && (
          <div className="mt-4 flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">
            <XCircle size={18} className="mt-0.5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {/* Results */}
        {searched && !loading && (
          <div className="mt-6 space-y-4">
            {orders.length === 0 ? (
              /* Empty state */
              <div className="rounded-2xl border border-dashed border-gray-200 bg-white py-14 text-center">
                <Package size={40} className="mx-auto mb-3 text-gray-300" />
                <p className="font-semibold text-gray-600">
                  Aucune commande trouvée
                </p>
                <p className="mt-1 text-sm text-gray-400">
                  Vérifiez que le numéro saisi correspond à celui utilisé lors
                  de votre commande.
                </p>
              </div>
            ) : (
              <>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  {orders.length} commande{orders.length > 1 ? 's' : ''} trouvée
                  {orders.length > 1 ? 's' : ''}
                </p>
                {orders.map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

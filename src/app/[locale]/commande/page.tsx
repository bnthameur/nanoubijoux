'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { useCartStore } from '@/stores/cart-store';
import { formatPrice } from '@/lib/constants';
import { cn } from '@/lib/utils';
import {
  getWilayas,
  createOrder,
  validateCoupon,
  incrementCouponUsage,
} from '@/lib/supabase/queries';
import { createClient } from '@/lib/supabase/client';
import {
  Check,
  Package,
  Tag,
  Home,
  Building2,
  Loader2,
  ShoppingBag,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import Image from 'next/image';
import type { Product, CartItem } from '@/types';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface WilayaData {
  id: number;
  name_fr: string;
  name_ar?: string;
  name_en?: string;
  shipping_fee: number;
  delivery_days?: number;
  home_fee?: number;
  desk_fee?: number;
  free_from?: number;
}

interface FormState {
  fullName: string;
  phone: string;
  commune: string;
  notes: string;
}

// ---------------------------------------------------------------------------
// Helper — fetch a single product by ID (not in shared queries.ts)
// ---------------------------------------------------------------------------

async function fetchProductById(id: string): Promise<Product | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(*),
      brand:brands(*),
      images:product_images(*),
      variants:product_variants(*)
    `)
    .eq('id', id)
    .single();

  if (error) return null;
  return data as Product;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const { items: cartItems, getSubtotal, getDiscount, clearCart } = useCartStore();

  // "Buy Now" mode: ?product=ID&qty=1
  const buyNowProductId = searchParams.get('product');
  const buyNowQty = Math.max(1, parseInt(searchParams.get('qty') ?? '1', 10));

  // Effective items — either buy-now single product or full cart
  const [buyNowItem, setBuyNowItem] = useState<CartItem | null>(null);
  const [buyNowLoading, setBuyNowLoading] = useState(!!buyNowProductId);

  const effectiveItems: CartItem[] = buyNowItem ? [buyNowItem] : cartItems;

  // ---------------------------------------------------------------------------
  // Fetch buy-now product
  // ---------------------------------------------------------------------------

  useEffect(() => {
    if (!buyNowProductId) return;
    setBuyNowLoading(true);
    fetchProductById(buyNowProductId)
      .then((product) => {
        if (product) {
          setBuyNowItem({ product, variant: null, quantity: buyNowQty });
        } else {
          toast.error('Produit introuvable');
        }
      })
      .catch(() => toast.error('Erreur lors du chargement du produit'))
      .finally(() => setBuyNowLoading(false));
  }, [buyNowProductId, buyNowQty]);

  // ---------------------------------------------------------------------------
  // Wilayas + communes
  // ---------------------------------------------------------------------------

  const [wilayas, setWilayas] = useState<WilayaData[]>([]);
  const [communes, setCommunes] = useState<string[]>([]);
  const [selectedWilaya, setSelectedWilaya] = useState<WilayaData | null>(null);
  const [communesLoading, setCommunesLoading] = useState(false);

  useEffect(() => {
    getWilayas()
      .then((data) => setWilayas((data as WilayaData[]) ?? []))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!selectedWilaya) {
      setCommunes([]);
      return;
    }
    setCommunesLoading(true);
    fetch(`/api/communes?wilaya_code=${selectedWilaya.id}`)
      .then((r) => r.json())
      .then((data: string[]) => {
        setCommunes(Array.isArray(data) ? data : []);
        setFormData((prev) => ({ ...prev, commune: '' }));
      })
      .catch(() => setCommunes([]))
      .finally(() => setCommunesLoading(false));
  }, [selectedWilaya]);

  // ---------------------------------------------------------------------------
  // Form state
  // ---------------------------------------------------------------------------

  const [formData, setFormData] = useState<FormState>({
    fullName: '',
    phone: '',
    commune: '',
    notes: '',
  });
  const [deliveryType, setDeliveryType] = useState<'home' | 'desk'>('home');

  const handleField = useCallback(
    (field: keyof FormState) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData((prev) => ({ ...prev, [field]: e.target.value }));
      },
    []
  );

  // ---------------------------------------------------------------------------
  // Coupon
  // ---------------------------------------------------------------------------

  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponId, setCouponId] = useState<string | null>(null);
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponLoading, setCouponLoading] = useState(false);

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    try {
      const { coupon, discountAmount } = await validateCoupon(couponCode, subtotal);
      setCouponDiscount(discountAmount);
      setCouponId(coupon.id);
      setCouponApplied(true);
      toast.success(`Code promo appliqué ! -${formatPrice(discountAmount)}`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Code promo invalide';
      toast.error(message);
      setCouponDiscount(0);
      setCouponId(null);
      setCouponApplied(false);
    } finally {
      setCouponLoading(false);
    }
  };

  const removeCoupon = () => {
    setCouponCode('');
    setCouponDiscount(0);
    setCouponId(null);
    setCouponApplied(false);
  };

  // ---------------------------------------------------------------------------
  // Pricing helpers
  // ---------------------------------------------------------------------------

  // For buy-now mode: compute subtotal from effective items
  const subtotal = buyNowItem
    ? (buyNowItem.variant?.price_override ?? buyNowItem.product.price) * buyNowItem.quantity
    : getSubtotal();

  // Cart-store discount only applies to cart mode
  const cartDiscount = buyNowItem ? 0 : getDiscount();
  const discount = cartDiscount + couponDiscount;

  const getDeliveryFee = useCallback((): number => {
    if (!selectedWilaya) return 0;
    const homeFee = selectedWilaya.home_fee ?? selectedWilaya.shipping_fee ?? 0;
    const deskFee = selectedWilaya.desk_fee ?? 0;
    const fee = deliveryType === 'desk' && deskFee > 0 ? deskFee : homeFee;
    if (
      selectedWilaya.free_from &&
      selectedWilaya.free_from > 0 &&
      subtotal >= selectedWilaya.free_from
    ) {
      return 0;
    }
    return fee;
  }, [selectedWilaya, deliveryType, subtotal]);

  const shippingFee = getDeliveryFee();
  const total = Math.max(0, subtotal - discount + shippingFee);
  const hasDeskDelivery = selectedWilaya && (selectedWilaya.desk_fee ?? 0) > 0;

  // ---------------------------------------------------------------------------
  // Submit
  // ---------------------------------------------------------------------------

  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  const validate = (): boolean => {
    if (!formData.fullName.trim()) {
      toast.error('Veuillez entrer votre nom complet');
      return false;
    }
    if (!/^0[567]\d{8}$/.test(formData.phone.trim())) {
      toast.error('Numéro invalide — format attendu : 05XX, 06XX ou 07XX suivi de 8 chiffres');
      return false;
    }
    if (!selectedWilaya) {
      toast.error('Veuillez sélectionner une wilaya');
      return false;
    }
    if (!formData.commune) {
      toast.error('Veuillez sélectionner une commune');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (effectiveItems.length === 0) {
      toast.error('Votre panier est vide');
      return;
    }

    setSubmitting(true);
    try {
      const order = await createOrder({
        full_name: formData.fullName.trim(),
        phone: formData.phone.trim(),
        wilaya_id: selectedWilaya!.id,
        commune: formData.commune,
        address_line: '', // not collected — Algerian delivery uses wilaya/commune
        notes: formData.notes.trim() || undefined,
        payment_method: 'cod',
        delivery_type: deliveryType,
        subtotal,
        discount,
        shipping_fee: shippingFee,
        total,
        items: effectiveItems.map((item) => ({
          product_id: item.product.id,
          variant_id: item.variant?.id ?? null,
          quantity: item.quantity,
          unit_price: item.variant?.price_override ?? item.product.price,
          total_price:
            (item.variant?.price_override ?? item.product.price) * item.quantity,
          product_name: item.product.name_fr,
          product_image: item.product.images?.[0]?.url,
          product_sku: item.product.sku,
        })),
      });

      if (couponId) {
        await incrementCouponUsage(couponId).catch(console.error);
      }

      setOrderNumber(order.id.slice(0, 8).toUpperCase());

      // Only clear the real cart if this was a normal cart checkout
      if (!buyNowItem) {
        clearCart();
      }

      setConfirmed(true);
    } catch (err: unknown) {
      console.error('Order failed:', err);
      const message = err instanceof Error ? err.message : 'Erreur lors de la commande. Réessayez.';
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  // ---------------------------------------------------------------------------
  // Loading screen for buy-now fetch
  // ---------------------------------------------------------------------------

  if (buyNowLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-gray-500">
          <Loader2 size={32} className="animate-spin text-amber-500" />
          <p className="text-sm">Chargement du produit…</p>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Confirmation screen
  // ---------------------------------------------------------------------------

  if (confirmed) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-sm p-10 max-w-md w-full text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-amber-50 rounded-full flex items-center justify-center">
            <Check size={40} className="text-amber-500" />
          </div>
          <h1 className="font-heading text-2xl font-bold text-gray-900 mb-2">
            Merci pour votre commande !
          </h1>
          <p className="text-gray-500 mb-1">
            Commande : <strong className="text-gray-800">#NB-{orderNumber}</strong>
          </p>
          <p className="text-gray-500 mb-1">Livraison estimée : 1–3 jours ouvrables</p>
          <p className="text-sm text-gray-400 mt-4">
            Vous serez contacté(e) par téléphone pour confirmer votre commande.
          </p>
          <a
            href="/"
            className="mt-8 inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium px-6 py-3 rounded-xl transition-colors"
          >
            <ShoppingBag size={16} />
            Continuer mes achats
          </a>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Empty state
  // ---------------------------------------------------------------------------

  if (effectiveItems.length === 0 && !buyNowProductId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-sm p-10 max-w-md w-full text-center">
          <ShoppingBag size={48} className="mx-auto mb-4 text-gray-300" />
          <h2 className="font-heading text-xl font-semibold text-gray-800 mb-2">
            Votre panier est vide
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            Ajoutez des articles avant de passer commande.
          </p>
          <a
            href="/"
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium px-6 py-3 rounded-xl transition-colors"
          >
            Découvrir les produits
          </a>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Main checkout form
  // ---------------------------------------------------------------------------

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-gray-900 mb-8">
          Passer la commande
        </h1>

        <form onSubmit={handleSubmit} noValidate>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* ----------------------------------------------------------------
                Left column — form fields
            ----------------------------------------------------------------- */}
            <div className="lg:col-span-2 space-y-6">

              {/* Personal info */}
              <section className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm space-y-5">
                <h2 className="font-heading text-lg font-semibold text-gray-900">
                  Vos informations
                </h2>

                <div>
                  <label
                    htmlFor="fullName"
                    className="block text-sm font-medium text-gray-700 mb-1.5"
                  >
                    Nom complet <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="fullName"
                    placeholder="Ahmed Benaissa"
                    value={formData.fullName}
                    onChange={handleField('fullName')}
                    autoComplete="name"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 mb-1.5"
                  >
                    Numéro de téléphone <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="0555123456"
                    value={formData.phone}
                    onChange={handleField('phone')}
                    autoComplete="tel"
                    required
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Format : 05XX, 06XX ou 07XX suivi de 8 chiffres
                  </p>
                </div>
              </section>

              {/* Delivery info */}
              <section className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm space-y-5">
                <h2 className="font-heading text-lg font-semibold text-gray-900">
                  Adresse de livraison
                </h2>

                {/* Wilaya */}
                <div>
                  <label
                    htmlFor="wilaya"
                    className="block text-sm font-medium text-gray-700 mb-1.5"
                  >
                    Wilaya <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="wilaya"
                    value={selectedWilaya?.id ?? ''}
                    onChange={(e) => {
                      const w = wilayas.find((w) => w.id === Number(e.target.value));
                      setSelectedWilaya(w ?? null);
                      // Reset to home delivery if desk not available in new wilaya
                      if (w && (!w.desk_fee || w.desk_fee === 0)) {
                        setDeliveryType('home');
                      }
                    }}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100 transition-colors"
                    required
                  >
                    <option value="">Sélectionner une wilaya…</option>
                    {wilayas.map((w) => (
                      <option key={w.id} value={w.id}>
                        {w.id} — {w.name_fr} ({formatPrice(w.home_fee ?? w.shipping_fee)})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Commune */}
                <div>
                  <label
                    htmlFor="commune"
                    className="block text-sm font-medium text-gray-700 mb-1.5"
                  >
                    Commune <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      id="commune"
                      value={formData.commune}
                      onChange={handleField('commune')}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      required
                      disabled={!selectedWilaya || communesLoading}
                    >
                      <option value="">
                        {communesLoading
                          ? 'Chargement…'
                          : !selectedWilaya
                          ? 'Sélectionner d\'abord une wilaya'
                          : communes.length === 0
                          ? 'Aucune commune disponible'
                          : 'Sélectionner une commune…'}
                      </option>
                      {communes.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                    {communesLoading && (
                      <Loader2
                        size={16}
                        className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-amber-500 pointer-events-none"
                      />
                    )}
                  </div>
                </div>

                {/* Delivery type — only shown once a wilaya is selected */}
                {selectedWilaya && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type de livraison
                    </label>
                    <div className={cn('grid gap-3', hasDeskDelivery ? 'grid-cols-2' : 'grid-cols-1 max-w-xs')}>
                      {/* Home delivery */}
                      <button
                        type="button"
                        onClick={() => setDeliveryType('home')}
                        className={cn(
                          'p-4 rounded-xl border-2 text-left flex items-start gap-3 transition-all',
                          deliveryType === 'home'
                            ? 'border-amber-400 bg-amber-50'
                            : 'border-gray-200 hover:border-gray-300'
                        )}
                      >
                        <Home
                          size={20}
                          className={cn(
                            'mt-0.5 flex-shrink-0',
                            deliveryType === 'home' ? 'text-amber-500' : 'text-gray-400'
                          )}
                        />
                        <div>
                          <span
                            className={cn(
                              'font-medium text-sm',
                              deliveryType === 'home' ? 'text-amber-700' : 'text-gray-700'
                            )}
                          >
                            À domicile
                          </span>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {formatPrice(selectedWilaya.home_fee ?? selectedWilaya.shipping_fee)}
                          </p>
                        </div>
                      </button>

                      {/* Stop desk — only shown when available */}
                      {hasDeskDelivery && (
                        <button
                          type="button"
                          onClick={() => setDeliveryType('desk')}
                          className={cn(
                            'p-4 rounded-xl border-2 text-left flex items-start gap-3 transition-all',
                            deliveryType === 'desk'
                              ? 'border-amber-400 bg-amber-50'
                              : 'border-gray-200 hover:border-gray-300'
                          )}
                        >
                          <Building2
                            size={20}
                            className={cn(
                              'mt-0.5 flex-shrink-0',
                              deliveryType === 'desk' ? 'text-amber-500' : 'text-gray-400'
                            )}
                          />
                          <div>
                            <span
                              className={cn(
                                'font-medium text-sm',
                                deliveryType === 'desk' ? 'text-amber-700' : 'text-gray-700'
                              )}
                            >
                              Stop desk
                            </span>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {formatPrice(selectedWilaya.desk_fee!)}
                            </p>
                          </div>
                        </button>
                      )}
                    </div>

                    {/* Free delivery threshold notice */}
                    {selectedWilaya.free_from && selectedWilaya.free_from > 0 && (
                      <p
                        className={cn(
                          'text-xs mt-2',
                          subtotal >= selectedWilaya.free_from
                            ? 'text-green-600 font-medium'
                            : 'text-gray-500'
                        )}
                      >
                        {subtotal >= selectedWilaya.free_from ? (
                          <>Livraison gratuite appliquée !</>
                        ) : (
                          <>
                            Livraison gratuite à partir de{' '}
                            {formatPrice(selectedWilaya.free_from)} (il vous manque{' '}
                            {formatPrice(selectedWilaya.free_from - subtotal)})
                          </>
                        )}
                      </p>
                    )}
                  </div>
                )}

                {/* Notes */}
                <div>
                  <label
                    htmlFor="notes"
                    className="block text-sm font-medium text-gray-700 mb-1.5"
                  >
                    Notes (optionnel)
                  </label>
                  <textarea
                    id="notes"
                    placeholder="Instructions particulières pour la livraison…"
                    rows={3}
                    value={formData.notes}
                    onChange={handleField('notes')}
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100 transition-colors resize-none"
                  />
                </div>
              </section>

              {/* Payment notice */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                <Package size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-amber-800">
                    Paiement à la livraison (COD)
                  </p>
                  <p className="text-xs text-amber-600 mt-0.5">
                    Vous réglez en espèces directement au livreur. Aucun paiement en ligne requis.
                  </p>
                </div>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={submitting}
                className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 rounded-xl text-base transition-colors disabled:opacity-60"
              >
                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 size={18} className="animate-spin" />
                    Traitement en cours…
                  </span>
                ) : (
                  'Confirmer la commande'
                )}
              </Button>
            </div>

            {/* ----------------------------------------------------------------
                Right column — order summary sidebar
            ----------------------------------------------------------------- */}
            <div>
              <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24 space-y-4">
                <h3 className="font-heading text-lg font-semibold text-gray-900">
                  Récapitulatif
                </h3>

                {/* Item list */}
                <div className="space-y-3">
                  {effectiveItems.map((item) => {
                    const price = item.variant?.price_override ?? item.product.price;
                    const imgSrc = item.product.images?.[0]?.url || '/images/placeholder.jpg';
                    return (
                      <div
                        key={`${item.product.id}-${item.variant?.id ?? 'base'}`}
                        className="flex items-start gap-3"
                      >
                        <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 relative bg-gray-100">
                          <Image
                            src={imgSrc}
                            alt={item.product.name_fr}
                            fill
                            className="object-cover"
                            sizes="56px"
                          />
                          {/* Quantity badge */}
                          <span className="absolute -top-1.5 -right-1.5 bg-amber-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center leading-none">
                            {item.quantity}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-800 font-medium truncate">
                            {item.product.name_fr}
                          </p>
                          {item.variant && (
                            <p className="text-xs text-gray-400 mt-0.5">{item.variant.name}</p>
                          )}
                        </div>
                        <span className="text-sm font-semibold text-gray-800 whitespace-nowrap">
                          {formatPrice(price * item.quantity)}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Coupon */}
                <div className="border-t border-gray-100 pt-4">
                  {couponApplied ? (
                    <div className="flex items-center justify-between bg-green-50 border border-green-200 px-3 py-2 rounded-lg">
                      <div className="flex items-center gap-2 text-sm text-green-700">
                        <Tag size={14} />
                        <span className="font-semibold">{couponCode.toUpperCase()}</span>
                        <span>— {formatPrice(couponDiscount)} déduits</span>
                      </div>
                      <button
                        type="button"
                        onClick={removeCoupon}
                        className="text-xs text-red-500 hover:underline ml-2 flex-shrink-0"
                      >
                        Retirer
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <div className="flex-1 relative">
                        <Tag
                          size={14}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                        />
                        <input
                          type="text"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), applyCoupon())}
                          placeholder="Code promo"
                          className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-amber-400 focus:outline-none uppercase placeholder:normal-case"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={applyCoupon}
                        disabled={couponLoading || !couponCode.trim()}
                        className="px-4 flex-shrink-0"
                      >
                        {couponLoading ? <Loader2 size={14} className="animate-spin" /> : 'Appliquer'}
                      </Button>
                    </div>
                  )}
                </div>

                {/* Pricing breakdown */}
                <div className="border-t border-gray-100 pt-4 space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Sous-total</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Réduction</span>
                      <span>−{formatPrice(discount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-gray-600">
                    <span>
                      Livraison
                      {deliveryType === 'desk' && (
                        <span className="text-xs ml-1 text-gray-400">(stop desk)</span>
                      )}
                    </span>
                    <span
                      className={cn(
                        shippingFee === 0 && selectedWilaya ? 'text-green-600 font-medium' : ''
                      )}
                    >
                      {!selectedWilaya
                        ? '—'
                        : shippingFee === 0
                        ? 'Gratuite'
                        : formatPrice(shippingFee)}
                    </span>
                  </div>

                  <div className="border-t border-gray-100 pt-3">
                    <div className="flex justify-between text-base font-bold text-gray-900">
                      <span>Total</span>
                      <span className="text-amber-600">{formatPrice(total)}</span>
                    </div>
                  </div>
                </div>

                {/* Reassurance notice */}
                <div className="flex items-start gap-2 bg-gray-50 rounded-lg px-3 py-2.5 text-xs text-gray-500">
                  <AlertCircle size={14} className="flex-shrink-0 mt-0.5 text-gray-400" />
                  <span>Commande traitée sous 24h. Vous serez contacté pour confirmation.</span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

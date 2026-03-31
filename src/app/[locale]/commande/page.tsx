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
  ChevronDown,
  ChevronUp,
  X,
} from 'lucide-react';
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
// Helper — fetch a single product by ID
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
  // UI state — collapsible panels
  // ---------------------------------------------------------------------------
  const [summaryExpanded, setSummaryExpanded] = useState(false);
  const [notesExpanded, setNotesExpanded] = useState(false);
  const [couponExpanded, setCouponExpanded] = useState(false);

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

  const subtotal = buyNowItem
    ? (buyNowItem.variant?.price_override ?? buyNowItem.product.price) * buyNowItem.quantity
    : getSubtotal();

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

  const totalItemCount = effectiveItems.reduce((sum, item) => sum + item.quantity, 0);

  // ---------------------------------------------------------------------------
  // Submit
  // ---------------------------------------------------------------------------

  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  const validate = (): boolean => {
    if (!formData.fullName.trim()) {
      toast.error('الرجاء إدخال اسمك الكامل');
      return false;
    }
    if (!/^0[567]\d{8}$/.test(formData.phone.trim())) {
      toast.error('رقم الهاتف غير صحيح — يجب أن يبدأ بـ 05 أو 06 أو 07');
      return false;
    }
    if (!selectedWilaya) {
      toast.error('الرجاء اختيار الولاية');
      return false;
    }
    if (!formData.commune) {
      toast.error('الرجاء اختيار البلدية');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (effectiveItems.length === 0) {
      toast.error('سلة التسوق فارغة');
      return;
    }

    setSubmitting(true);
    try {
      const order = await createOrder({
        full_name: formData.fullName.trim(),
        phone: formData.phone.trim(),
        wilaya_id: selectedWilaya!.id,
        commune: formData.commune,
        address_line: '',
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

      if (!buyNowItem) {
        clearCart();
      }

      setConfirmed(true);
    } catch (err: unknown) {
      console.error('Order failed:', err);
      const message =
        err instanceof Error ? err.message : 'حدث خطأ أثناء تأكيد الطلب. حاول مجدداً.';
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
        <div className="bg-white rounded-2xl shadow-sm p-8 max-w-sm w-full text-center">
          <div className="w-16 h-16 mx-auto mb-5 bg-amber-50 rounded-full flex items-center justify-center">
            <Check size={32} className="text-amber-500" />
          </div>
          <h1 className="font-heading text-xl font-bold text-gray-900 mb-1">
            تم تأكيد طلبك!
          </h1>
          <p className="text-gray-500 text-sm mb-1">
            رقم الطلب:{' '}
            <strong className="text-gray-800 font-semibold">#NB-{orderNumber}</strong>
          </p>
          <p className="text-gray-500 text-sm">التسليم خلال 1–3 أيام عمل</p>
          <p className="text-xs text-gray-400 mt-3 leading-relaxed">
            سيتم التواصل معك هاتفياً لتأكيد الطلب.
          </p>
          <a
            href="/"
            className="mt-6 inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white text-sm font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            <ShoppingBag size={15} />
            مواصلة التسوق
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
        <div className="bg-white rounded-2xl shadow-sm p-8 max-w-sm w-full text-center">
          <ShoppingBag size={44} className="mx-auto mb-4 text-gray-300" />
          <h2 className="font-heading text-lg font-semibold text-gray-800 mb-2">
            سلة التسوق فارغة
          </h2>
          <p className="text-gray-500 text-sm mb-5">
            أضف منتجات إلى سلتك قبل إتمام الطلب.
          </p>
          <a
            href="/"
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white text-sm font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            اكتشفي المجوهرات
          </a>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Shared sub-components (inline, avoid prop-drilling)
  // ---------------------------------------------------------------------------

  // Item list — used in mobile expanded summary and desktop sidebar
  const renderItemList = () => (
    <div className="space-y-3">
      {effectiveItems.map((item) => {
        const price = item.variant?.price_override ?? item.product.price;
        const imgSrc = item.product.images?.[0]?.url || '/images/placeholder.jpg';
        return (
          <div
            key={`${item.product.id}-${item.variant?.id ?? 'base'}`}
            className="flex items-start gap-3"
          >
            <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 relative bg-gray-100">
              <Image
                src={imgSrc}
                alt={item.product.name_fr}
                fill
                className="object-cover"
                sizes="48px"
              />
              {/* Quantity badge */}
              <span className="absolute -top-1.5 -right-1.5 bg-amber-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none">
                {item.quantity}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-800 font-medium truncate leading-snug">
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
  );

  // Pricing breakdown rows
  const renderPricingRows = () => (
    <div className="space-y-1.5 text-sm">
      <div className="flex justify-between text-gray-500">
        <span>المجموع الجزئي</span>
        <span>{formatPrice(subtotal)}</span>
      </div>
      {discount > 0 && (
        <div className="flex justify-between text-green-600 font-medium">
          <span>تخفيض</span>
          <span>−{formatPrice(discount)}</span>
        </div>
      )}
      <div className="flex justify-between text-gray-500">
        <span>
          التوصيل
          {deliveryType === 'desk' && (
            <span className="text-xs mr-1 text-gray-400">(stop desk)</span>
          )}
        </span>
        <span
          className={cn(
            shippingFee === 0 && selectedWilaya ? 'text-green-600 font-medium' : ''
          )}
        >
          {!selectedWilaya ? '—' : shippingFee === 0 ? 'مجاني' : formatPrice(shippingFee)}
        </span>
      </div>
      <div className="border-t border-gray-100 pt-2 mt-1">
        <div className="flex justify-between font-bold text-gray-900">
          <span>المجموع</span>
          <span className="text-amber-600 text-base">{formatPrice(total)}</span>
        </div>
      </div>
    </div>
  );

  // Coupon widget
  const renderCoupon = () =>
    couponApplied ? (
      <div className="flex items-center justify-between bg-green-50 border border-green-200 px-3 py-2 rounded-xl">
        <div className="flex items-center gap-2 text-sm text-green-700">
          <Tag size={13} />
          <span className="font-semibold">{couponCode.toUpperCase()}</span>
          <span className="text-xs text-green-600">−{formatPrice(couponDiscount)}</span>
        </div>
        <button
          type="button"
          onClick={removeCoupon}
          aria-label="Retirer le code promo"
          className="text-red-400 hover:text-red-600 transition-colors flex-shrink-0 mr-1"
        >
          <X size={14} />
        </button>
      </div>
    ) : (
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Tag
            size={13}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
          <input
            type="text"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
            onKeyDown={(e) =>
              e.key === 'Enter' && (e.preventDefault(), applyCoupon())
            }
            placeholder="Code promo"
            className="w-full pr-9 pl-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100 uppercase placeholder:normal-case transition-colors"
          />
        </div>
        <button
          type="button"
          onClick={applyCoupon}
          disabled={couponLoading || !couponCode.trim()}
          className="px-4 py-2.5 text-sm font-medium border border-gray-200 rounded-xl bg-white hover:border-amber-300 hover:text-amber-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex-shrink-0"
        >
          {couponLoading ? <Loader2 size={14} className="animate-spin" /> : 'تطبيق'}
        </button>
      </div>
    );

  // Shared input base class — min 44px touch height per spec
  const inputCls =
    'w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-white focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100 transition-colors min-h-[44px]';

  // ---------------------------------------------------------------------------
  // Main layout
  // ---------------------------------------------------------------------------

  return (
    <div className="min-h-screen bg-gray-50 pb-28 lg:pb-12" dir="rtl">

      {/* ======================================================================
          MOBILE ONLY: Sticky top summary bar
          Collapses by default so the form is immediately visible on load.
      ====================================================================== */}
      <div className="lg:hidden sticky top-0 z-30 bg-white border-b border-gray-100 shadow-sm">
        <button
          type="button"
          onClick={() => setSummaryExpanded((v) => !v)}
          className="w-full flex items-center justify-between px-4 py-3 text-sm min-h-[44px]"
          aria-expanded={summaryExpanded}
          aria-controls="mobile-summary-panel"
        >
          <div className="flex items-center gap-2 text-gray-700">
            <ShoppingBag size={16} className="text-amber-500 flex-shrink-0" />
            <span className="font-medium">
              {totalItemCount} {totalItemCount === 1 ? 'منتج' : 'منتجات'}
            </span>
            {couponApplied && (
              <span className="bg-green-100 text-green-700 text-[10px] font-semibold px-1.5 py-0.5 rounded-full">
                خصم
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-amber-600">{formatPrice(total)}</span>
            {summaryExpanded ? (
              <ChevronUp size={16} className="text-gray-400" />
            ) : (
              <ChevronDown size={16} className="text-gray-400" />
            )}
          </div>
        </button>

        {/* Expandable items panel with CSS slide-down */}
        <div
          id="mobile-summary-panel"
          className={cn(
            'overflow-hidden transition-all duration-300 ease-in-out',
            summaryExpanded ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'
          )}
        >
          <div className="px-4 pb-4 pt-1 space-y-4 border-t border-gray-50">
            {renderItemList()}
            <div className="border-t border-gray-100 pt-3">
              {renderPricingRows()}
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================================
          MAIN CONTENT AREA
      ====================================================================== */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-5 lg:py-10">

        {/* Desktop page heading */}
        <h1 className="hidden lg:block font-heading text-2xl font-bold text-gray-900 mb-8">
          إتمام الطلب
        </h1>

        <form onSubmit={handleSubmit} noValidate>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-8">

            {/* ============================================================
                FORM COLUMN  (full width mobile, 2/3 desktop)
            ============================================================ */}
            <div className="lg:col-span-2 space-y-4">

              {/* ---- Personal info ---------------------------------------- */}
              <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  معلوماتك
                </p>

                {/* Full name */}
                <div>
                  <label
                    htmlFor="fullName"
                    className="block text-sm font-medium text-gray-700 mb-1.5"
                  >
                    الاسم الكامل <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    placeholder="الاسم الكامل"
                    value={formData.fullName}
                    onChange={handleField('fullName')}
                    autoComplete="name"
                    required
                    className={inputCls}
                  />
                </div>

                {/* Phone */}
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 mb-1.5"
                  >
                    رقم الهاتف <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    placeholder="0555123456"
                    value={formData.phone}
                    onChange={handleField('phone')}
                    autoComplete="tel"
                    inputMode="numeric"
                    required
                    className={inputCls}
                    dir="ltr"
                  />
                  <p className="text-xs text-gray-400 mt-1.5">
                    يبدأ بـ 05 أو 06 أو 07
                  </p>
                </div>
              </div>

              {/* ---- Delivery address ------------------------------------- */}
              <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  عنوان التوصيل
                </p>

                {/* Wilaya */}
                <div>
                  <label
                    htmlFor="wilaya"
                    className="block text-sm font-medium text-gray-700 mb-1.5"
                  >
                    الولاية <span className="text-red-400">*</span>
                  </label>
                  <select
                    id="wilaya"
                    value={selectedWilaya?.id ?? ''}
                    onChange={(e) => {
                      const w = wilayas.find((w) => w.id === Number(e.target.value));
                      setSelectedWilaya(w ?? null);
                      // Reset to home if desk not available in new wilaya
                      if (w && (!w.desk_fee || w.desk_fee === 0)) {
                        setDeliveryType('home');
                      }
                    }}
                    className={inputCls}
                    required
                  >
                    <option value="">اختر الولاية…</option>
                    {wilayas.map((w) => (
                      <option key={w.id} value={w.id}>
                        {w.id} — {w.name_fr}
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
                    البلدية <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <select
                      id="commune"
                      value={formData.commune}
                      onChange={handleField('commune')}
                      className={cn(
                        inputCls,
                        'disabled:opacity-50 disabled:cursor-not-allowed'
                      )}
                      required
                      disabled={!selectedWilaya || communesLoading}
                    >
                      <option value="">
                        {communesLoading
                          ? 'جاري التحميل…'
                          : !selectedWilaya
                          ? 'اختر الولاية أولاً'
                          : communes.length === 0
                          ? 'لا توجد بلديات'
                          : 'اختر البلدية…'}
                      </option>
                      {communes.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                    {communesLoading && (
                      <Loader2
                        size={15}
                        className="absolute left-3 top-1/2 -translate-y-1/2 animate-spin text-amber-500 pointer-events-none"
                      />
                    )}
                  </div>
                </div>

                {/* Delivery type — pill toggle, only shown when desk option exists */}
                {selectedWilaya && hasDeskDelivery && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      طريقة التوصيل
                    </label>
                    {/* Pill-style toggle container */}
                    <div className="inline-flex bg-gray-100 rounded-full p-1 gap-1">
                      <button
                        type="button"
                        onClick={() => setDeliveryType('home')}
                        className={cn(
                          'flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200',
                          deliveryType === 'home'
                            ? 'bg-white shadow text-amber-700'
                            : 'text-gray-500 hover:text-gray-700'
                        )}
                      >
                        <Home size={14} />
                        <span>للمنزل</span>
                        <span className="text-xs opacity-60">
                          {formatPrice(selectedWilaya.home_fee ?? selectedWilaya.shipping_fee)}
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeliveryType('desk')}
                        className={cn(
                          'flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200',
                          deliveryType === 'desk'
                            ? 'bg-white shadow text-amber-700'
                            : 'text-gray-500 hover:text-gray-700'
                        )}
                      >
                        <Building2 size={14} />
                        <span>Stop Desk</span>
                        <span className="text-xs opacity-60">
                          {formatPrice(selectedWilaya.desk_fee!)}
                        </span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Free delivery threshold notice */}
                {selectedWilaya &&
                  selectedWilaya.free_from &&
                  selectedWilaya.free_from > 0 && (
                    <p
                      className={cn(
                        'text-xs rounded-xl px-3 py-2.5 leading-relaxed',
                        subtotal >= selectedWilaya.free_from
                          ? 'bg-green-50 text-green-700 font-medium'
                          : 'bg-gray-50 text-gray-500'
                      )}
                    >
                      {subtotal >= selectedWilaya.free_from ? (
                        'التوصيل مجاني لهذا الطلب!'
                      ) : (
                        <>
                          توصيل مجاني من {formatPrice(selectedWilaya.free_from)} — ينقصك{' '}
                          {formatPrice(selectedWilaya.free_from - subtotal)}
                        </>
                      )}
                    </p>
                  )}

                {/* Notes — collapsed by default, tap to expand */}
                <div>
                  <button
                    type="button"
                    onClick={() => setNotesExpanded((v) => !v)}
                    className="flex items-center gap-1.5 text-sm text-amber-600 font-medium hover:text-amber-700 transition-colors"
                    aria-expanded={notesExpanded}
                    aria-controls="notes-panel"
                  >
                    <span>{notesExpanded ? 'إخفاء الملاحظة' : 'إضافة ملاحظة'}</span>
                    {notesExpanded ? (
                      <ChevronUp size={14} className="text-gray-400" />
                    ) : (
                      <ChevronDown size={14} className="text-gray-400" />
                    )}
                  </button>

                  {/* Slide-down notes textarea */}
                  <div
                    id="notes-panel"
                    className={cn(
                      'overflow-hidden transition-all duration-300 ease-in-out',
                      notesExpanded ? 'max-h-40 opacity-100 mt-3' : 'max-h-0 opacity-0'
                    )}
                  >
                    <textarea
                      id="notes"
                      placeholder="تعليمات خاصة بالتوصيل…"
                      rows={3}
                      value={formData.notes}
                      onChange={handleField('notes')}
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100 transition-colors resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* ---- COD badge -------------------------------------------- */}
              <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 flex items-start gap-3">
                <Package size={17} className="text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-amber-800">الدفع عند الاستلام</p>
                  <p className="text-xs text-amber-600 mt-0.5 leading-relaxed">
                    لا حاجة لبطاقة بنكية — تدفع نقداً للسائق عند التسليم.
                  </p>
                </div>
              </div>

              {/* ---- Coupon (mobile — inside form column, above submit) --- */}
              <div className="bg-white rounded-2xl px-5 py-4 shadow-sm lg:hidden">
                {!couponApplied ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setCouponExpanded((v) => !v)}
                      className="flex items-center gap-1.5 text-sm text-amber-600 font-medium hover:text-amber-700 transition-colors"
                      aria-expanded={couponExpanded}
                      aria-controls="coupon-panel-mobile"
                    >
                      <Tag size={14} />
                      <span>لديك كود خصم؟</span>
                      {couponExpanded ? (
                        <ChevronUp size={14} className="text-gray-400" />
                      ) : (
                        <ChevronDown size={14} className="text-gray-400" />
                      )}
                    </button>

                    <div
                      id="coupon-panel-mobile"
                      className={cn(
                        'overflow-hidden transition-all duration-300 ease-in-out',
                        couponExpanded ? 'max-h-20 opacity-100 mt-3' : 'max-h-0 opacity-0'
                      )}
                    >
                      {renderCoupon()}
                    </div>
                  </>
                ) : (
                  renderCoupon()
                )}
              </div>

              {/* ---- Desktop submit button (inside form, below all fields) */}
              <button
                type="submit"
                disabled={submitting}
                className="hidden lg:flex w-full items-center justify-between bg-amber-500 hover:bg-amber-600 active:bg-amber-700 disabled:opacity-60 text-white font-semibold px-6 py-4 rounded-xl text-base transition-colors"
              >
                {submitting ? (
                  <span className="flex items-center gap-2 mx-auto">
                    <Loader2 size={18} className="animate-spin" />
                    جاري المعالجة…
                  </span>
                ) : (
                  <>
                    <span>تأكيد الطلب</span>
                    <span className="text-amber-200 font-normal text-sm">
                      {formatPrice(total)} — الدفع عند الاستلام
                    </span>
                  </>
                )}
              </button>
            </div>

            {/* ============================================================
                DESKTOP SIDEBAR — order summary (hidden on mobile)
            ============================================================ */}
            <div className="hidden lg:block">
              <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24 space-y-5">
                <h3 className="font-heading text-base font-semibold text-gray-900">
                  ملخص الطلب
                </h3>

                {renderItemList()}

                {/* Coupon in sidebar */}
                <div className="border-t border-gray-100 pt-4 space-y-2">
                  {!couponApplied ? (
                    <>
                      <button
                        type="button"
                        onClick={() => setCouponExpanded((v) => !v)}
                        className="flex items-center gap-1.5 text-sm text-amber-600 font-medium hover:text-amber-700 transition-colors"
                        aria-expanded={couponExpanded}
                        aria-controls="coupon-panel-desktop"
                      >
                        <Tag size={13} />
                        <span>كود خصم؟</span>
                        {couponExpanded ? (
                          <ChevronUp size={13} className="text-gray-400" />
                        ) : (
                          <ChevronDown size={13} className="text-gray-400" />
                        )}
                      </button>
                      <div
                        id="coupon-panel-desktop"
                        className={cn(
                          'overflow-hidden transition-all duration-300 ease-in-out',
                          couponExpanded ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'
                        )}
                      >
                        {renderCoupon()}
                      </div>
                    </>
                  ) : (
                    renderCoupon()
                  )}
                </div>

                {/* Pricing breakdown */}
                <div className="border-t border-gray-100 pt-4">
                  {renderPricingRows()}
                </div>

                {/* Reassurance note */}
                <div className="bg-gray-50 rounded-xl px-3 py-2.5 text-xs text-gray-400 leading-relaxed text-center">
                  يُعالَج الطلب خلال 24 ساعة. سيتم التواصل معك هاتفياً.
                </div>
              </div>
            </div>

          </div>
        </form>
      </div>

      {/* ======================================================================
          MOBILE ONLY: Sticky bottom CTA bar
          Fixed at bottom — total price + confirm button.
      ====================================================================== */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-white border-t border-gray-100 shadow-[0_-4px_24px_rgba(0,0,0,0.06)] px-4 py-3">
        <button
          type="button"
          disabled={submitting}
          onClick={handleSubmit}
          className="w-full flex items-center justify-between bg-amber-500 hover:bg-amber-600 active:bg-amber-700 disabled:opacity-60 text-white font-semibold px-5 py-3.5 rounded-xl transition-colors min-h-[52px]"
        >
          {submitting ? (
            <span className="flex items-center gap-2 mx-auto text-sm">
              <Loader2 size={16} className="animate-spin" />
              جاري المعالجة…
            </span>
          ) : (
            <>
              <span className="text-base">تأكيد الطلب</span>
              <div className="flex flex-col items-end">
                <span className="text-base font-bold">{formatPrice(total)}</span>
                <span className="text-[10px] text-amber-200 font-normal leading-none mt-0.5">
                  الدفع عند الاستلام
                </span>
              </div>
            </>
          )}
        </button>
      </div>

    </div>
  );
}

'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link, useRouter } from '@/i18n/navigation';
import { Heart, ShoppingBag, Zap } from 'lucide-react';
import { useCartStore } from '@/stores/cart-store';
import { useWishlistStore } from '@/stores/wishlist-store';
import { useHydrated } from '@/hooks/use-hydrated';
import { formatPrice } from '@/lib/constants';
import { cn } from '@/lib/utils';
import type { Product } from '@/types';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const t = useTranslations('shop');
  const router = useRouter();
  const hydrated = useHydrated();
  const addToCart = useCartStore((s) => s.addItem);
  const toggleWishlist = useWishlistStore((s) => s.toggleItem);
  const isInWishlist = useWishlistStore((s) => s.isInWishlist(product.id));

  const name = product.name_fr || 'Produit';
  const primaryImage = product.images?.[0]?.url || '/images/placeholder.svg';
  const outOfStock = product.stock_quantity === 0;
  const hasDiscount = product.is_on_sale && product.compare_at_price;
  const discountPct = hasDiscount
    ? Math.round(((product.compare_at_price! - product.price) / product.compare_at_price!) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (outOfStock) return;
    addToCart(product);
    toast.success(t('addedToCart'));
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (outOfStock) return;
    addToCart(product);
    router.push('/panier');
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
    if (!isInWishlist) {
      toast.success(t('addedToWishlist'));
    }
  };

  return (
    <div className="group bg-white overflow-hidden rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300">
      {/* Image */}
      <Link href={`/produit/${product.slug}`}>
        <div className="relative aspect-[4/5] overflow-hidden bg-gray-50">
          <Image
            src={primaryImage}
            alt={name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />

          {/* Discount badge — top left */}
          {hasDiscount && (
            <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] sm:text-xs font-bold px-1.5 py-0.5 rounded-md">
              -{discountPct}%
            </span>
          )}

          {/* Out of stock overlay */}
          {outOfStock && (
            <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
              <span className="bg-gray-900 text-white text-xs font-medium px-3 py-1 rounded-full">
                Épuisé
              </span>
            </div>
          )}

          {/* Wishlist heart — top right */}
          <button
            onClick={handleToggleWishlist}
            className="absolute top-2 right-2 w-7 h-7 sm:w-8 sm:h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center transition-colors hover:bg-white"
          >
            <Heart
              size={14}
              className={cn(
                hydrated && isInWishlist ? 'fill-red-500 text-red-500' : 'text-gray-400'
              )}
            />
          </button>

        </div>
      </Link>

      {/* Info */}
      <div className="p-2.5 sm:p-3">
        <Link href={`/produit/${product.slug}`}>
          <h3 className="font-medium text-gray-900 text-xs sm:text-sm leading-tight line-clamp-1">
            {name}
          </h3>

          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-sm sm:text-base font-bold text-gray-900">
              {formatPrice(product.price)}
            </span>
            {hasDiscount && (
              <span className="text-[10px] sm:text-xs text-gray-400 line-through">
                {formatPrice(product.compare_at_price!)}
              </span>
            )}
          </div>
        </Link>

        {/* Action buttons */}
        {!outOfStock && (
          <div className="flex gap-1.5 mt-2">
            <button
              onClick={handleAddToCart}
              className="flex-1 flex items-center justify-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-800 text-[10px] sm:text-xs font-medium py-1.5 sm:py-2 rounded-lg transition-colors active:scale-95"
            >
              <ShoppingBag size={12} />
              <span className="hidden sm:inline">{t('addToCart')}</span>
              <span className="sm:hidden">Panier</span>
            </button>
            <button
              onClick={handleBuyNow}
              className="flex-1 flex items-center justify-center gap-1 bg-amber-500 hover:bg-amber-600 text-white text-[10px] sm:text-xs font-medium py-1.5 sm:py-2 rounded-lg transition-colors active:scale-95"
            >
              <Zap size={12} />
              <span className="hidden sm:inline">{t('buyNow')}</span>
              <span className="sm:hidden">Acheter</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link, useRouter } from '@/i18n/navigation';
import { Heart, ShoppingBag } from 'lucide-react';
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

          {/* Quick add button — bottom right, visible on hover (desktop) or always (mobile) */}
          {!outOfStock && (
            <button
              onClick={handleAddToCart}
              className="absolute bottom-2 right-2 w-8 h-8 sm:w-9 sm:h-9 bg-amber-500 text-white rounded-full flex items-center justify-center shadow-lg sm:opacity-0 sm:translate-y-2 sm:group-hover:opacity-100 sm:group-hover:translate-y-0 transition-all duration-200 active:scale-90"
            >
              <ShoppingBag size={14} />
            </button>
          )}
        </div>
      </Link>

      {/* Info — minimal */}
      <Link href={`/produit/${product.slug}`} className="block p-2.5 sm:p-3">
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
    </div>
  );
}

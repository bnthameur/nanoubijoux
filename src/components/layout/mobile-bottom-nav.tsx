'use client';

import { usePathname } from 'next/navigation';
import { Link } from '@/i18n/navigation';
import { Home, Search, ShoppingBag, Package } from 'lucide-react';
import { useCartStore } from '@/stores/cart-store';
import { useHydrated } from '@/hooks/use-hydrated';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', icon: Home, label: 'Accueil', match: /^\/[a-z]{2}\/?$/ },
  { href: '/boutique', icon: Search, label: 'Boutique', match: /\/boutique/ },
  { href: '/panier', icon: ShoppingBag, label: 'Panier', match: /\/panier/ },
  { href: '/suivi', icon: Package, label: 'Suivi', match: /\/suivi/ },
];

export function MobileBottomNav() {
  const pathname = usePathname();
  const hydrated = useHydrated();
  const cartCount = useCartStore((s) => s.items.length);

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 bg-white border-t border-gray-100 lg:hidden safe-area-bottom">
      <div className="flex items-center justify-around h-14">
        {navItems.map((item) => {
          const isActive = item.match.test(pathname);
          const Icon = item.icon;
          const showBadge = hydrated && item.label === 'Panier' && cartCount > 0;
          const badgeCount = cartCount;

          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center gap-0.5 w-full h-full relative transition-colors',
                isActive ? 'text-amber-500' : 'text-gray-400'
              )}
            >
              <div className="relative">
                <Icon size={20} strokeWidth={isActive ? 2.5 : 1.5} />
                {showBadge && (
                  <span className="absolute -top-1.5 -right-2.5 bg-amber-500 text-white text-[9px] font-bold min-w-[16px] h-4 rounded-full flex items-center justify-center px-1 leading-none">
                    {badgeCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-medium leading-none">{item.label}</span>
            </Link>
          );
        })}
      </div>
      {/* Safe area spacer for iOS */}
      <style jsx>{`
        .safe-area-bottom {
          padding-bottom: env(safe-area-inset-bottom, 0px);
        }
      `}</style>
    </nav>
  );
}

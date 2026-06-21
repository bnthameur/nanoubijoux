import type { Metadata } from 'next';
import { Link } from '@/i18n/navigation';
import { getLocale } from 'next-intl/server';

export const metadata: Metadata = {
  title: 'Bientôt Disponible | Nano Glamora',
  description: 'Cette collection arrive bientôt chez Nano Glamora. Revenez nous voir ou abonnez-vous à notre newsletter pour être informé(e) en avant-première.',
  robots: { index: false, follow: false },
};

export default async function BientotPage() {
  const locale = await getLocale();

  const content = {
    fr: {
      badge: 'Bientôt disponible',
      title: 'Cette collection arrive bientôt !',
      subtitle: 'Nous travaillons dur pour vous préparer de nouveaux bijoux et accessoires. Revenez très vite !',
      cta: 'Voir la boutique',
      explore: 'Explorer nos bijoux disponibles',
    },
    ar: {
      badge: 'قريباً',
      title: 'هذه المجموعة قادمة قريباً!',
      subtitle: 'نعمل بجد لتحضير مجوهرات وإكسسوارات جديدة لكم. عودوا قريباً!',
      cta: 'زيارة المتجر',
      explore: 'استكشاف المجوهرات المتاحة',
    },
    en: {
      badge: 'Coming Soon',
      title: 'This collection is coming soon!',
      subtitle: 'We\'re working hard to bring you new jewelry and accessories. Check back soon!',
      cta: 'Visit the Shop',
      explore: 'Explore our available jewelry',
    },
  };

  const c = content[locale as keyof typeof content] || content.fr;

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center bg-cream px-4 py-20 text-center">
      <div className="max-w-md mx-auto">
        <span className="inline-block bg-gold text-white text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-6">
          {c.badge}
        </span>

        <div className="text-8xl mb-6">💎</div>

        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-dark mb-4">
          {c.title}
        </h1>

        <p className="text-text-body text-base leading-relaxed mb-10">
          {c.subtitle}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/boutique"
            className="bg-gold text-white font-semibold px-8 py-3 hover:bg-gold-dark transition-colors"
          >
            {c.cta}
          </Link>
          <Link
            href="/"
            className="border-2 border-gold text-gold font-semibold px-8 py-3 hover:bg-gold hover:text-white transition-colors"
          >
            {c.explore}
          </Link>
        </div>
      </div>
    </div>
  );
}

import type { Metadata } from 'next';
import { TrackingPixels } from '@/components/shared/tracking-pixels';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Nano Glamora | Bijoux & Accessoires en Algérie — Oran, Alger, Annaba',
    template: '%s | Nano Glamora',
  },
  description: 'Nano Glamora — Boutique bijoux en ligne en Algérie. Bagues, colliers, bracelets, boucles d\'oreilles en acier inoxydable. Livraison rapide à Oran, Alger, Annaba et dans les 58 wilayas. مجوهرات في الجزائر — إكسسوارات أنيقة بالتوصيل السريع.',
  keywords: [
    'bijoux Algérie', 'bijoux Oran', 'bijoux Alger', 'bijoux Annaba', 'bijoux Constantine', 'bijoux Sétif',
    'accessoires femme Algérie', 'bague acier inoxydable', 'collier femme Algérie', 'bracelet Algérie',
    'boucles oreilles Algérie', 'parure bijoux Algérie', 'montre femme Algérie', 'bijoux pas cher Algérie',
    'bijoux livraison Algérie', 'nano glamora', 'boutique bijoux en ligne Algérie',
    'مجوهرات الجزائر', 'مجوهرات وهران', 'مجوهرات الجزائر العاصمة', 'اكسسوارات نساء الجزائر',
    'خواتم الجزائر', 'أساور الجزائر', 'قلادات الجزائر', 'مجوهرات رخيصة الجزائر', 'توصيل مجوهرات الجزائر',
  ],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://nanobijoux.dz'),
  openGraph: {
    type: 'website',
    locale: 'fr_DZ',
    alternateLocale: ['ar_DZ', 'en_US'],
    siteName: 'Nano Glamora',
    title: 'Nano Glamora | Bijoux & Accessoires en Algérie',
    description: 'Bijoux et accessoires en acier inoxydable. Livraison rapide à Oran, Alger, Annaba et dans toute l\'Algérie.',
    images: [{ url: '/logo.png', width: 394, height: 307, alt: 'Nano Glamora — Bijoux & Accessoires' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nano Glamora | Bijoux & Accessoires en Algérie',
    description: 'Bijoux et accessoires livrés dans les 58 wilayas d\'Algérie. مجوهرات وإكسسوارات في الجزائر.',
    images: ['/logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  alternates: {
    languages: {
      'fr': '/fr',
      'ar': '/ar',
      'en': '/en',
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className="h-full antialiased" suppressHydrationWarning>
      <head>
        <TrackingPixels />
      </head>
      <body className="min-h-full flex flex-col bg-white text-charcoal">
        {children}
      </body>
    </html>
  );
}

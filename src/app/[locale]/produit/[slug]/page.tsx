import type { Metadata } from 'next';
import { getProductBySlug } from '@/lib/supabase/queries';
import ProductContent from './product-content';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}): Promise<Metadata> {
  const { slug, locale } = await params;

  try {
    const product = await getProductBySlug(slug);
    if (!product) return {};

    const name =
      locale === 'ar' ? product.name_ar : locale === 'en' ? product.name_en : product.name_fr;
    const description =
      locale === 'ar'
        ? product.description_ar
        : locale === 'en'
          ? product.description_en
          : product.description_fr;

    const primaryImage = product.images?.[0]?.url;
    const ogImages = primaryImage
      ? [{ url: primaryImage, width: 800, height: 800, alt: name }]
      : [{ url: '/logo.png', width: 394, height: 307, alt: name }];

    return {
      title: `${name} | Nano Glamora`,
      description:
        description?.slice(0, 155) ||
        `Achetez ${name} chez Nano Glamora — livraison dans les 58 wilayas d'Algérie.`,
      openGraph: {
        title: `${name} | Nano Glamora`,
        description:
          description?.slice(0, 155) ||
          `Achetez ${name} chez Nano Glamora. Livraison rapide dans toute l'Algérie.`,
        type: 'website',
        images: ogImages,
        siteName: 'Nano Glamora',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${name} | Nano Glamora`,
        description: description?.slice(0, 155) || `${name} — Nano Glamora Algérie`,
        images: ogImages.map((img) => img.url),
      },
    };
  } catch {
    return {};
  }
}

export default function ProductPage() {
  return <ProductContent />;
}

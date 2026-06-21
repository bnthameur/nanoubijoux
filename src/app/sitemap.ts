import type { MetadataRoute } from 'next';
import { blogPosts } from '@/data/blog-posts';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://nanobijoux.dz';
const locales = ['fr', 'ar', 'en'];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  const staticPages = [
    { path: '', priority: 1.0, changeFreq: 'daily' as const },
    { path: '/boutique', priority: 0.9, changeFreq: 'daily' as const },
    { path: '/blog', priority: 0.8, changeFreq: 'weekly' as const },
    { path: '/a-propos', priority: 0.6, changeFreq: 'monthly' as const },
    { path: '/contact', priority: 0.6, changeFreq: 'monthly' as const },
    { path: '/livraison', priority: 0.5, changeFreq: 'monthly' as const },
    { path: '/suivi', priority: 0.5, changeFreq: 'monthly' as const },
    { path: '/connexion', priority: 0.3, changeFreq: 'yearly' as const },
    { path: '/inscription', priority: 0.3, changeFreq: 'yearly' as const },
  ];

  const categoryPaths = [
    'bagues', 'colliers', 'bracelets', 'boucles-oreilles',
    'gourmettes', 'parures', 'montres', 'accessoires',
    'foulards', 'porte-monnaie', 'chaines-cheville',
  ];

  for (const locale of locales) {
    for (const page of staticPages) {
      entries.push({
        url: `${BASE_URL}/${locale}${page.path}`,
        lastModified: new Date(),
        changeFrequency: page.changeFreq,
        priority: page.priority,
      });
    }

    for (const cat of categoryPaths) {
      entries.push({
        url: `${BASE_URL}/${locale}/boutique?category=${cat}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.75,
      });
    }

    for (const post of blogPosts) {
      entries.push({
        url: `${BASE_URL}/${locale}/blog/${post.slug}`,
        lastModified: new Date(post.publishedAt),
        changeFrequency: 'monthly',
        priority: 0.7,
      });
    }
  }

  try {
    const { createClient } = await import('@/lib/supabase/client');
    const supabase = createClient();
    const { data: products } = await supabase
      .from('products')
      .select('slug, updated_at');

    if (products) {
      for (const product of products) {
        for (const locale of locales) {
          entries.push({
            url: `${BASE_URL}/${locale}/produit/${product.slug}`,
            lastModified: new Date(product.updated_at),
            changeFrequency: 'weekly',
            priority: 0.8,
          });
        }
      }
    }
  } catch {
    // Silently fail if DB unavailable during build
  }

  return entries;
}

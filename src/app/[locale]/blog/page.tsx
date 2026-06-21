import type { Metadata } from 'next';
import { getLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { blogPosts } from '@/data/blog-posts';
import { Clock, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Blog Bijoux Algérie — Conseils, Tendances & Guides | Nano Glamora',
  description: 'Conseils bijoux, tendances mode, guides d\'achat pour la femme algérienne. Bijoux à Oran, Alger, Annaba, Constantine. مدونة المجوهرات في الجزائر.',
  keywords: [
    'blog bijoux algérie', 'conseils bijoux', 'tendances bijoux 2024', 'guide achat bijoux',
    'bijoux oran blog', 'bijoux alger blog', 'مدونة مجوهرات الجزائر', 'نصائح مجوهرات',
  ],
  openGraph: {
    title: 'Blog Bijoux Algérie | Nano Glamora',
    description: 'Conseils, tendances et guides bijoux pour la femme algérienne.',
    images: ['/logo.png'],
  },
};

export default async function BlogPage() {
  const locale = await getLocale();

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-cream border-b border-border py-12 text-center">
        <span className="text-gold font-medium text-sm uppercase tracking-widest">
          {locale === 'ar' ? 'مدونتنا' : 'Notre Blog'}
        </span>
        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-dark mt-2 mb-3">
          {locale === 'ar'
            ? 'مجوهرات، موضة ونصائح من الجزائر'
            : "Bijoux, Mode & Conseils d'Algérie"}
        </h1>
        <p className="text-text-body max-w-xl mx-auto text-sm">
          {locale === 'ar'
            ? 'دليلك الكامل للمجوهرات والإكسسوارات في الجزائر — وهران، الجزائر، عنابة وأكثر'
            : 'Votre guide complet sur les bijoux et accessoires en Algérie — Oran, Alger, Annaba et plus'}
        </p>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => {
            const title = locale === 'ar' ? post.title_ar : post.title_fr;
            const excerpt = locale === 'ar' ? post.excerpt_ar : post.excerpt_fr;

            return (
              <article key={post.slug} className="group border border-border hover:border-gold transition-colors">
                <div className="h-48 bg-gradient-to-br from-cream to-gold/20 flex items-center justify-center">
                  <span className="text-5xl">💎</span>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs bg-gold/10 text-gold px-2 py-1 rounded font-medium uppercase tracking-wide">
                      {post.category === 'guide'
                        ? locale === 'ar' ? 'دليل' : 'Guide'
                        : locale === 'ar' ? 'نصائح' : 'Conseils'}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-text-body">
                      <Clock size={12} />
                      {post.readTime} {locale === 'ar' ? 'دقائق' : 'min'}
                    </span>
                  </div>

                  <h2 className="font-heading text-base font-bold text-dark mb-2 group-hover:text-gold transition-colors line-clamp-2">
                    {title}
                  </h2>

                  <p className="text-text-body text-sm leading-relaxed mb-4 line-clamp-3">
                    {excerpt}
                  </p>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {post.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="text-xs bg-cream px-2 py-0.5 text-text-body">
                        #{tag.replace(/ /g, '')}
                      </span>
                    ))}
                  </div>

                  <Link
                    href={`/blog/${post.slug}`}
                    className="flex items-center gap-2 text-sm text-gold font-medium hover:gap-3 transition-all"
                  >
                    {locale === 'ar' ? 'اقرأ المزيد' : 'Lire la suite'}
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}

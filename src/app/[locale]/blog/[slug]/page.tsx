import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { blogPosts, getBlogPost } from '@/data/blog-posts';
import { Clock, ChevronRight, ArrowLeft } from 'lucide-react';

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}): Promise<Metadata> {
  const { slug, locale } = await params;
  const post = getBlogPost(slug);
  if (!post) return {};

  const title = locale === 'ar' ? post.title_ar : post.title_fr;
  const description = locale === 'ar' ? post.excerpt_ar : post.excerpt_fr;

  return {
    title,
    description,
    keywords: post.tags,
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime: post.publishedAt,
      tags: post.tags,
      images: [{ url: '/logo.png', width: 394, height: 307, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/logo.png'],
    },
    alternates: {
      languages: {
        fr: `/fr/blog/${slug}`,
        ar: `/ar/blog/${slug}`,
        en: `/en/blog/${slug}`,
      },
    },
  };
}

export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug } = await params;
  const locale = await getLocale();
  const post = getBlogPost(slug);

  if (!post) notFound();

  const title = locale === 'ar' ? post.title_ar : post.title_fr;
  const content = locale === 'ar' ? post.content_ar : post.content_fr;

  const relatedPosts = blogPosts.filter((p) => p.slug !== slug).slice(0, 3);

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-cream border-b border-border">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-2 text-sm text-text-body">
            <Link href="/" className="hover:text-gold transition-colors">Nano Glamora</Link>
            <ChevronRight size={14} />
            <Link href="/blog" className="hover:text-gold transition-colors">
              {locale === 'ar' ? 'المدونة' : 'Blog'}
            </Link>
            <ChevronRight size={14} />
            <span className="text-dark font-medium truncate">{title}</span>
          </div>
        </div>
      </div>

      <div className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Article Header */}
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs bg-gold/10 text-gold px-3 py-1 rounded-full font-medium uppercase tracking-wide">
              {post.category === 'guide'
                ? locale === 'ar' ? 'دليل' : 'Guide'
                : locale === 'ar' ? 'نصائح' : 'Conseils'}
            </span>
            <span className="flex items-center gap-1 text-xs text-text-body">
              <Clock size={12} />
              {post.readTime} {locale === 'ar' ? 'دقائق للقراءة' : 'min de lecture'}
            </span>
            <time className="text-xs text-text-body">
              {new Date(post.publishedAt).toLocaleDateString(locale === 'ar' ? 'ar-DZ' : 'fr-DZ', {
                year: 'numeric', month: 'long', day: 'numeric',
              })}
            </time>
          </div>

          <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-dark leading-tight mb-6">
            {title}
          </h1>

          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span key={tag} className="text-xs bg-cream border border-border px-3 py-1 text-text-body">
                #{tag.replace(/ /g, '')}
              </span>
            ))}
          </div>
        </header>

        {/* Hero banner */}
        <div className="w-full h-64 sm:h-80 bg-gradient-to-br from-cream via-gold/10 to-cream flex items-center justify-center mb-10 rounded-sm">
          <div className="text-center">
            <span className="text-7xl">💎</span>
            <p className="text-gold font-heading font-bold mt-3 text-lg">Nano Glamora</p>
          </div>
        </div>

        {/* Article Content */}
        <article
          className="prose prose-lg max-w-none text-dark-light
            prose-headings:font-heading prose-headings:text-dark prose-headings:font-bold
            prose-h1:text-2xl prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-4
            prose-h3:text-lg prose-h3:mt-6 prose-h3:mb-3
            prose-p:text-text-body prose-p:leading-relaxed prose-p:mb-4
            prose-ul:text-text-body prose-li:mb-1
            prose-strong:text-dark prose-strong:font-semibold
            prose-a:text-gold prose-a:no-underline hover:prose-a:underline
            prose-table:border-collapse prose-th:bg-cream prose-th:p-3 prose-td:p-3 prose-td:border prose-td:border-border"
          dangerouslySetInnerHTML={{ __html: markdownToHtml(content) }}
        />

        {/* CTA Banner */}
        <div className="mt-12 p-8 bg-gradient-to-r from-gold/10 to-cream border border-gold/30 text-center">
          <h3 className="font-heading text-xl font-bold text-dark mb-2">
            {locale === 'ar' ? 'اكتشفي مجموعة نانو غلامورا' : 'Découvrez la Collection Nano Glamora'}
          </h3>
          <p className="text-text-body text-sm mb-4">
            {locale === 'ar'
              ? 'مجوهرات أنيقة بالتوصيل في 58 ولاية'
              : 'Bijoux élégants livrés dans les 58 wilayas'}
          </p>
          <Link
            href="/boutique"
            className="inline-block bg-gold text-white font-semibold px-8 py-3 hover:bg-gold-dark transition-colors"
          >
            {locale === 'ar' ? 'تسوقي الآن' : 'Acheter maintenant'}
          </Link>
        </div>

        {/* Related Articles */}
        {relatedPosts.length > 0 && (
          <div className="mt-16">
            <h3 className="font-heading text-xl font-bold text-dark mb-6">
              {locale === 'ar' ? 'مقالات ذات صلة' : 'Articles similaires'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {relatedPosts.map((related) => {
                const relTitle = locale === 'ar' ? related.title_ar : related.title_fr;
                return (
                  <Link
                    key={related.slug}
                    href={`/blog/${related.slug}`}
                    className="group border border-border p-4 hover:border-gold transition-colors"
                  >
                    <h4 className="text-sm font-semibold text-dark group-hover:text-gold transition-colors line-clamp-2 mb-2">
                      {relTitle}
                    </h4>
                    <span className="flex items-center gap-1 text-xs text-gold">
                      {locale === 'ar' ? 'اقرأ المزيد' : 'Lire'}
                      <ArrowLeft size={12} className="rtl:rotate-180" />
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function markdownToHtml(md: string): string {
  return md
    .trim()
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>\n?)+/g, (m) => `<ul>${m}</ul>`)
    .replace(/^\|(.+)\|$/gm, (row) => {
      const cells = row.split('|').filter((c) => c.trim());
      return '<tr>' + cells.map((c) => `<td>${c.trim()}</td>`).join('') + '</tr>';
    })
    .replace(/(<tr>.*<\/tr>\n?)+/g, (m) => `<table>${m}</table>`)
    .replace(/^(?!<[hut]|$)(.+)$/gm, '<p>$1</p>')
    .replace(/\n{2,}/g, '\n');
}

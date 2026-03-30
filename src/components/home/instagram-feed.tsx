'use client';

import { useTranslations } from 'next-intl';
import { SectionHeading } from '@/components/ui/section-heading';
import { Instagram } from 'lucide-react';
import { SOCIAL_LINKS } from '@/lib/constants';
import Image from 'next/image';

const instagramPosts = [
  {
    src: 'https://images.unsplash.com/photo-1515562141589-67f0d569b6c2?w=400&h=400&fit=crop',
    alt: 'Bracelet Tiffany Acier inoxydable',
  },
  {
    src: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=400&h=400&fit=crop',
    alt: 'Parure Missika 4 pieces acier inoxydable',
  },
  {
    src: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&h=400&fit=crop',
    alt: 'Bague de fiancailles acier inoxydable',
  },
  {
    src: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=400&fit=crop',
    alt: 'Collier chaine or acier inoxydable',
  },
  {
    src: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=400&fit=crop',
    alt: 'Boucles oreilles pendantes',
  },
  {
    src: 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=400&h=400&fit=crop',
    alt: 'Bracelet jonc or rose',
  },
  {
    src: 'https://images.unsplash.com/photo-1603561596112-0a132b757442?w=400&h=400&fit=crop',
    alt: 'Bague Bvlgari acier inoxydable',
  },
  {
    src: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop',
    alt: 'Parure collier boucles oreilles',
  },
];

export function InstagramFeed() {
  const t = useTranslations('home');

  return (
    <section className="py-12 sm:py-16 bg-white">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading title={t('instagram')} subtitle="@nano31bijoux" />

        <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
          {instagramPosts.map((post, index) => (
            <a
              key={index}
              href={SOCIAL_LINKS.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square overflow-hidden bg-cream"
            >
              <Image
                src={post.src}
                alt={post.alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 768px) 25vw, 12.5vw"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-dark/0 group-hover:bg-dark/40 transition-colors flex items-center justify-center">
                <Instagram
                  size={20}
                  className="text-white opacity-0 group-hover:opacity-100 transition-opacity"
                />
              </div>
            </a>
          ))}
        </div>

        <div className="text-center mt-6">
          <a
            href={SOCIAL_LINKS.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-gold hover:underline"
          >
            <Instagram size={16} />
            Suivez-nous sur Instagram
          </a>
        </div>
      </div>
    </section>
  );
}

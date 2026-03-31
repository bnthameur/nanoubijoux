'use client';

import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-[5.5rem] lg:bottom-24 right-4 lg:right-6 z-30 w-9 h-9 lg:w-10 lg:h-10 bg-gray-900 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-amber-500 transition-colors rtl:right-auto rtl:left-4 lg:rtl:left-6"
      aria-label="Scroll to top"
    >
      <ArrowUp size={16} />
    </button>
  );
}

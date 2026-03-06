import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
}

export default function SEO({ title, description }: SEOProps) {
  useEffect(() => {
    const base = 'VibeCoder';
    document.title = title ? `${title} — ${base}` : `${base} — Маркетплейс AI-разработчиков`;
    
    if (description) {
      let meta = document.querySelector('meta[name="description"]');
      if (meta) meta.setAttribute('content', description);
    }
  }, [title, description]);

  return null;
}

import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Package } from 'lucide-react';
import type { Gig } from '../types';
import Avatar from './ui/Avatar';
import StarRating from './ui/StarRating';
import { VibeScoreBadge } from './VibeScore';
import { calculateVibeScore } from './VibeScore';
import { VerifiedCheck } from './VerifiedBadge';

interface GigCardProps {
  gig: Gig;
  index?: number;
}

export default function GigCard({ gig, index = 0 }: GigCardProps) {
  const { t } = useTranslation();
  return (
    <Link
      to={`/gigs/${gig.id}`}
      className="group block card overflow-hidden opacity-0 animate-fade-in transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_8px_30px_rgba(255,215,0,0.1),0_0_40px_rgba(255,215,0,0.06)]"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="aspect-video overflow-hidden relative bg-nebula">
        <img
          src={gig.image}
          alt={gig.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
          onError={(e) => { (e.target as HTMLImageElement).src = `https://placehold.co/800x450/0a0a0f/ffd700?text=${encodeURIComponent(gig.title.slice(0, 20))}`; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-void/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      <div className="p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Avatar src={gig.freelancer.avatar} alt={gig.freelancer.name} size="sm" isOnline={gig.freelancer.isOnline} />
          <span className="text-sm text-muted truncate">{gig.freelancer.name}</span>
          <VerifiedCheck level={gig.freelancer.level} />
          {gig.freelancer.level === 'pro' && (
            <span className="ml-auto text-[10px] font-bold bg-gold/20 text-gold px-2 py-0.5 rounded border border-gold/30 tracking-widest uppercase">PRO</span>
          )}
          {gig.tags.some(t => ['AI', 'OpenAI', 'ChatGPT', 'GPT', 'LangChain', 'Claude', 'Cursor', 'Copilot'].some(ai => t.toLowerCase().includes(ai.toLowerCase()))) && (
            <span className="text-[10px] font-bold bg-accent-blue/10 text-accent-blue px-2 py-0.5 rounded border border-accent-blue/20 tracking-wider">AI</span>
          )}
        </div>

        <h3 className="text-sm font-medium text-heading leading-snug line-clamp-2 group-hover:text-gold transition-colors duration-300">
          {gig.title}
        </h3>

        <div className="flex items-center gap-3 text-sm">
          <StarRating rating={gig.rating} count={gig.reviewCount} />
          <span className="text-gold/20">|</span>
          <span className="flex items-center gap-1 text-muted">
            <Package size={13} />
            <span className="font-mono">{gig.ordersCount}+</span>
          </span>
        </div>

        <div className="border-t border-[rgba(255,215,0,0.08)] pt-3">
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-1.5">
              {gig.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="px-2 py-0.5 text-xs bg-[rgba(255,255,255,0.04)] text-body rounded border border-[rgba(255,215,0,0.1)]">
                  {tag}
                </span>
              ))}
            </div>
            <span className="text-lg font-bold text-gold font-mono whitespace-nowrap ml-2">
              {t('common.from')} {gig.packages.economy.price.toLocaleString('ru-RU')} ₽
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

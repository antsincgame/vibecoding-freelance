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

const NEON_ACCENTS = [
  {
    cardClass: 'card-cyan',
    badgeClass: 'badge-cyan',
    priceColor: 'text-[#00f5ff]',
    priceShadow: '0 0 20px rgba(0,245,255,0.6), 0 0 40px rgba(0,245,255,0.25)',
    borderHover: 'group-hover:border-[rgba(0,245,255,0.5)]',
    tagHover: 'group-hover:border-[rgba(0,245,255,0.4)] group-hover:text-[#00f5ff]',
    glowHover: 'group-hover:shadow-[0_8px_40px_rgba(0,245,255,0.2),0_0_80px_rgba(0,245,255,0.08)]',
  },
  {
    cardClass: 'card-violet',
    badgeClass: 'badge-violet',
    priceColor: 'text-[#a78bfa]',
    priceShadow: '0 0 20px rgba(139,92,246,0.6), 0 0 40px rgba(139,92,246,0.25)',
    borderHover: 'group-hover:border-[rgba(139,92,246,0.5)]',
    tagHover: 'group-hover:border-[rgba(139,92,246,0.4)] group-hover:text-[#a78bfa]',
    glowHover: 'group-hover:shadow-[0_8px_40px_rgba(139,92,246,0.2),0_0_80px_rgba(139,92,246,0.08)]',
  },
  {
    cardClass: 'card-cyan',
    badgeClass: 'badge-cyan',
    priceColor: 'text-[#00f5ff]',
    priceShadow: '0 0 20px rgba(0,245,255,0.6), 0 0 40px rgba(0,245,255,0.25)',
    borderHover: 'group-hover:border-[rgba(0,245,255,0.5)]',
    tagHover: 'group-hover:border-[rgba(0,245,255,0.4)] group-hover:text-[#00f5ff]',
    glowHover: 'group-hover:shadow-[0_8px_40px_rgba(0,245,255,0.2),0_0_80px_rgba(0,245,255,0.08)]',
  },
  {
    cardClass: 'card-pink',
    badgeClass: 'badge-pink',
    priceColor: 'text-[#f953c6]',
    priceShadow: '0 0 15px rgba(249,83,198,0.5), 0 0 30px rgba(249,83,198,0.2)',
    borderHover: 'group-hover:border-[rgba(249,83,198,0.45)]',
    tagHover: 'group-hover:border-[rgba(249,83,198,0.3)] group-hover:text-[#f953c6]',
    glowHover: 'group-hover:shadow-[0_8px_30px_rgba(249,83,198,0.15),0_0_60px_rgba(249,83,198,0.06)]',
  },
] as const;

const AI_TOOLS = ['AI', 'OpenAI', 'ChatGPT', 'GPT', 'LangChain', 'Claude', 'Cursor', 'Copilot'];

export default function GigCard({ gig, index = 0 }: GigCardProps) {
  const { t } = useTranslation();
  const accent = NEON_ACCENTS[index % 4];
  const hasAI = gig.tags.some((tag) =>
    AI_TOOLS.some((ai) => tag.toLowerCase().includes(ai.toLowerCase()))
  );

  return (
    <Link
      to={`/gigs/${gig.id}`}
      className={`group block card ${accent.cardClass} overflow-hidden opacity-0 animate-fade-in transition-all duration-500 hover:-translate-y-3 ${accent.glowHover}`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Image */}
      <div className="aspect-video overflow-hidden relative bg-nebula">
        <img
          src={gig.image}
          alt={gig.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = `https://placehold.co/800x450/0a0a0f/00f5ff?text=${encodeURIComponent(gig.title.slice(0, 20))}`;
          }}
        />
        {/* Cyberpunk gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-void via-transparent to-transparent opacity-60" />
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-t from-void/80 via-void/20 to-transparent" />

        {/* Level badge top-right */}
        {gig.freelancer.level === 'pro' && (
          <div className={`absolute top-2 right-2 text-[9px] font-bold px-2 py-0.5 rounded tracking-widest uppercase ${accent.badgeClass}`}>
            PRO
          </div>
        )}
        {hasAI && (
          <div className="absolute top-2 left-2 text-[9px] font-bold px-2 py-0.5 rounded tracking-wider badge-cyan">
            AI
          </div>
        )}

        {/* Scan line sweep on hover */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-0 group-hover:opacity-100">
          <div
            className="absolute left-0 right-0 h-12 bg-gradient-to-b from-transparent via-white/[0.04] to-transparent"
            style={{ animation: 'scanSweep 1.2s ease-in-out' }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Author */}
        <div className="flex items-center gap-2 min-w-0">
          <Avatar src={gig.freelancer.avatar} alt={gig.freelancer.name} size="sm" isOnline={gig.freelancer.isOnline} />
          <span className="text-sm text-muted truncate">{gig.freelancer.name}</span>
          <VerifiedCheck level={gig.freelancer.level} />
        </div>

        {/* Title */}
        <h3 className="text-sm font-medium text-heading leading-snug line-clamp-2 group-hover:text-white transition-colors duration-300">
          {gig.title}
        </h3>

        {/* Stats */}
        <div className="flex items-center gap-3 text-sm">
          <StarRating rating={gig.rating} count={gig.reviewCount} />
          <span className="text-[#00f5ff]/15">|</span>
          <span className="flex items-center gap-1 text-muted">
            <Package size={13} />
            <span className="font-mono">{gig.ordersCount}+</span>
          </span>
        </div>

        {/* Tags + Price */}
        <div className={`border-t border-[rgba(0,245,255,0.06)] pt-3 transition-colors duration-400 ${accent.borderHover}`}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="flex flex-wrap gap-1.5">
              {gig.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className={`px-2 py-0.5 text-xs bg-[rgba(255,255,255,0.03)] text-muted rounded border border-[rgba(0,245,255,0.08)] transition-all duration-300 ${accent.tagHover}`}
                >
                  {tag}
                </span>
              ))}
            </div>
            <span
              className={`text-lg font-bold font-mono whitespace-nowrap tracking-wide ${accent.priceColor} transition-all duration-300`}
              style={{ textShadow: `0 0 0 transparent` }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLSpanElement).style.textShadow = accent.priceShadow;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLSpanElement).style.textShadow = '0 0 0 transparent';
              }}
            >
              {t('common.from')} {gig.packages.economy.price.toLocaleString('ru-RU')} ₽
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

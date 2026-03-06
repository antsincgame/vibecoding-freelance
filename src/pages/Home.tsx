import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Search, Zap, ShieldCheck, ArrowRight,
  Globe, Smartphone, Bot, Brain, Layout, Server, Database,
  Sparkles, Code, Bug, Cloud,
} from 'lucide-react';
import GigCard from '../components/GigCard';
import Button from '../components/ui/Button';
import Avatar from '../components/ui/Avatar';
import Skeleton from '../components/ui/Skeleton';
import SEO from '../components/SEO';
import LiveOrderTicker from '../components/LiveOrderTicker';
import { useCategories, useFeaturedGigs, useTopFreelancers, useLatestReviews } from '../hooks/useData';
import { popularSearches } from '../lib/freelance-db';
import { useInView } from '../hooks/useInView';

const iconMap: Record<string, React.ElementType> = {
  Globe, Smartphone, Bot, Brain, Layout, Server, Database, Sparkles, Code, Bug, Cloud,
};

const PARTICLE_COLORS = [
  { bg: '#00f5ff', shadow: 'rgba(0,245,255,0.8)' },
  { bg: '#8b5cf6', shadow: 'rgba(139,92,246,0.7)' },
  { bg: '#00f5ff', shadow: 'rgba(0,245,255,0.6)' },
  { bg: '#f953c6', shadow: 'rgba(249,83,198,0.6)' },
  { bg: '#00ff88', shadow: 'rgba(0,255,136,0.5)' },
  { bg: '#a78bfa', shadow: 'rgba(167,139,250,0.6)' },
];

const MATRIX_CHARS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン01';

function MatrixRain() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
      {Array.from({ length: 18 }).map((_, i) => {
        const chars = Array.from({ length: 12 + Math.floor(Math.random() * 8) })
          .map(() => MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)])
          .join('\n');
        const isViolet = i % 3 === 0;
        return (
          <div
            key={i}
            className={`matrix-col ${isViolet ? 'violet' : ''}`}
            style={{
              left: `${(i / 18) * 100 + Math.random() * 5}%`,
              animationDuration: `${8 + Math.random() * 12}s`,
              animationDelay: `${Math.random() * 8}s`,
              fontSize: `${10 + Math.random() * 6}px`,
              opacity: 0.15 + Math.random() * 0.25,
            }}
          >
            {chars}
          </div>
        );
      })}
    </div>
  );
}

function NeonParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 40 }).map((_, i) => {
        const color = PARTICLE_COLORS[i % PARTICLE_COLORS.length];
        const size = 2 + Math.random() * 4;
        return (
          <span
            key={i}
            className="particle animate-float-particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 12}s`,
              animationDuration: `${6 + Math.random() * 12}s`,
              width: `${size}px`,
              height: `${size}px`,
              background: color.bg,
              boxShadow: `0 0 ${8 + Math.random() * 12}px ${color.shadow}`,
            }}
          />
        );
      })}
    </div>
  );
}

function CyberSpiral() {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] h-[90vw] max-w-[800px] max-h-[800px] opacity-30 pointer-events-none">
      <div className="w-full h-full bg-[conic-gradient(from_0deg,transparent,rgba(0,245,255,0.15),transparent,rgba(139,92,246,0.12),transparent)] rounded-full animate-spiral-rotate" />
      <div
        className="absolute inset-[8%] bg-[conic-gradient(from_180deg,transparent,rgba(139,92,246,0.1),transparent,rgba(0,245,255,0.08),transparent)] rounded-full animate-spiral-rotate"
        style={{ animationDirection: 'reverse', animationDuration: '14s' }}
      />
      <div
        className="absolute inset-[20%] bg-[conic-gradient(from_90deg,transparent,rgba(249,83,198,0.06),transparent,rgba(0,245,255,0.06),transparent)] rounded-full animate-spiral-rotate"
        style={{ animationDuration: '25s' }}
      />
    </div>
  );
}

export default function Home() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const { ref: catRef, isInView: catVisible } = useInView();
  const { ref: gigsRef, isInView: gigsVisible } = useInView();

  const { data: categories, loading: catLoading } = useCategories();
  const { data: featuredGigs, loading: gigsLoading } = useFeaturedGigs();
  const { data: freelancers } = useTopFreelancers(8);
  const { data: latestReviews } = useLatestReviews(3);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) navigate(`/categories/all?search=${encodeURIComponent(searchQuery.trim())}`);
  };

  return (
    <div className="pb-20 md:pb-0">
      <SEO title="Фриланс биржа вайбкодеров — лучший фриланс с AI" description="VibeCoder — лучшая фриланс биржа вайбкодеров. Разработка сайтов, дизайн, Telegram-боты дёшево и быстро с помощью AI. Топ фрилансеров с жёстким отбором. Вайб-кодинг — безопасно, быстро, качественно." />

      {/* HERO */}
      <section className="relative min-h-[70vh] sm:min-h-[80vh] md:min-h-[90vh] flex items-center justify-center overflow-hidden sacred-bg">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150vw] h-[150vw] max-w-[900px] max-h-[900px] bg-[radial-gradient(ellipse_at_center,rgba(0,245,255,0.12)_0%,rgba(139,92,246,0.05)_30%,transparent_60%)] animate-glow-breathe" />
          <div className="absolute top-10 right-10 sm:top-20 sm:right-20 w-[80vw] h-[80vw] max-w-[500px] max-h-[500px] bg-[radial-gradient(circle,rgba(139,92,246,0.08)_0%,transparent_55%)]" />
          <div className="absolute bottom-20 left-10 w-[60vw] h-[60vw] max-w-[400px] max-h-[400px] bg-[radial-gradient(circle,rgba(0,245,255,0.06)_0%,transparent_55%)]" />
        </div>
        <MatrixRain />
        <CyberSpiral />
        <NeonParticles />

        <div className="relative z-10 max-w-3xl mx-auto px-4 text-center py-20 sm:py-28 space-y-10">
          <div className="space-y-6">
            <p className="text-xs text-[rgba(0,245,255,0.6)] tracking-[0.35em] uppercase font-heading"
               style={{ textShadow: '0 0 20px rgba(0,245,255,0.4)' }}>
              ◈ AI-разработка нового поколения ◈
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-[0.05em] sm:tracking-[0.1em] uppercase leading-[1.15]">
              <span
                className="quantum-shimmer glitch-text break-words"
                data-text="Фриланс биржа"
              >
                Фриланс биржа
              </span>
              <br />
              <span className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl tracking-[0.08em] sm:tracking-[0.12em] break-words"
                    style={{ textShadow: '0 0 40px rgba(255,255,255,0.1)' }}>
                вайбкодеров и AI-разработчиков
              </span>
            </h1>
            <p className="text-base sm:text-lg text-[rgba(255,255,255,0.65)] max-w-2xl mx-auto tracking-wide leading-relaxed">
              Наши разработчики используют AI-инструменты, чтобы доводить проекты до готового продукта
              быстрее и&nbsp;качественнее — за&nbsp;меньшие деньги. Жёсткий отбор, code review каждого проекта,
              гарантия результата.
            </p>
          </div>

          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="bg-[rgba(5,5,16,0.85)] backdrop-blur-lg rounded border border-[rgba(0,245,255,0.15)] p-1.5 shadow-[0_0_30px_rgba(0,245,255,0.06)] group focus-within:border-[rgba(0,245,255,0.5)] focus-within:shadow-[0_0_40px_rgba(0,245,255,0.15),0_0_80px_rgba(139,92,246,0.06)] transition-all duration-500">
              <div className="flex items-center gap-3 px-4 py-3">
                <Search size={20} className="text-[#00f5ff]/50 flex-shrink-0" />
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder={t('home.searchPlaceholder')} className="flex-1 bg-transparent text-white placeholder:text-[rgba(0,245,255,0.25)] text-base outline-none tracking-wide" />
                <Button type="submit" variant="primary" size="sm" className="flex-shrink-0">{t('common.search')}</Button>
              </div>
            </div>
          </form>

          <div className="flex flex-wrap justify-center gap-2">
            {popularSearches.slice(0, 6).map((tag, i) => {
              const tagColors = [
                'hover:border-[rgba(0,245,255,0.5)] hover:text-[#00f5ff] hover:shadow-[0_0_15px_rgba(0,245,255,0.15)]',
                'hover:border-[rgba(139,92,246,0.5)] hover:text-[#8b5cf6] hover:shadow-[0_0_15px_rgba(139,92,246,0.15)]',
              ];
              return (
                <Link key={tag} to={`/categories/all?search=${encodeURIComponent(tag)}`} className={`px-3 sm:px-4 py-2 text-sm bg-transparent text-[rgba(200,220,255,0.45)] rounded border border-[rgba(0,245,255,0.1)] cursor-pointer hover:bg-[rgba(0,245,255,0.04)] transition-all duration-300 tracking-wide ${tagColors[i % 2]}`}>{tag}</Link>
              );
            })}
          </div>

          <div className="flex items-center justify-center gap-3 pt-4">
            <div className="flex -space-x-2">
              {(freelancers || []).slice(0, 4).map((f) => <Avatar key={f.id} src={f.avatar} alt={f.name} size="sm" className="ring-2 ring-[#050510]" />)}
            </div>
            <div className="text-sm text-[rgba(200,220,255,0.5)]">
              <span className="text-[#00f5ff] font-semibold font-mono" style={{ textShadow: '0 0 10px rgba(0,245,255,0.5)' }}>{(freelancers || []).reduce((sum, f) => sum + f.ordersCompleted, 0) || '...'}+</span> {t('home.orders_completed')}
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="neon-divider mx-8 sm:mx-16" />

      {/* FEATURED GIGS */}
      <section ref={gigsRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-2xl sm:text-3xl font-display font-bold tracking-[0.1em] uppercase text-white mb-3">
              <span className="neon-text">Лучшие кворки</span> — качественно и доступно
            </h2>
            <p className="text-[rgba(255,255,255,0.5)] tracking-wide">Готовые услуги от проверенных разработчиков с AI-инструментами</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 transition-opacity duration-700 ${gigsVisible ? 'opacity-100' : 'opacity-0'}">
          {gigsLoading ? Array.from({ length: 4 }).map((_, i) => (<div key={i} className="card overflow-hidden"><Skeleton className="aspect-video" /><div className="p-4 space-y-3"><Skeleton className="h-4 w-full" /><Skeleton className="h-3 w-2/3" /></div></div>)) : (featuredGigs || []).map((gig, i) => <GigCard key={gig.id} gig={gig} index={i} />)}
        </div>
      </section>

      {/* Divider */}
      <div className="neon-divider mx-8 sm:mx-16" />

      {/* LIVE STATS */}
      <section className="relative py-12 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="card data-stream-bg p-4 sm:p-6 md:p-8 flex flex-wrap items-center justify-center gap-4 sm:gap-8 lg:gap-16 text-center">
            <div className="group">
              <p className="text-3xl sm:text-4xl font-display font-bold font-mono neon-text tracking-wider transition-all duration-300 group-hover:scale-110">
                {(categories || []).reduce((sum, c) => sum + c.gigCount, 0) || '...'}
              </p>
              <p className="text-xs text-[rgba(255,255,255,0.35)] mt-1 uppercase tracking-widest font-heading">Услуг в каталоге</p>
            </div>
            <div className="w-px h-10 bg-gradient-to-b from-transparent via-[rgba(0,245,255,0.25)] to-transparent hidden sm:block" />
            <div className="group">
              <p
                className="text-3xl sm:text-4xl font-display font-bold font-mono tracking-wider transition-all duration-300 group-hover:scale-110"
                style={{ color: '#00f5ff', textShadow: '0 0 25px rgba(0,245,255,0.5), 0 0 50px rgba(0,245,255,0.2)' }}
              >
                {(freelancers || []).length || '...'}
              </p>
              <p className="text-xs text-[rgba(255,255,255,0.35)] mt-1 uppercase tracking-widest font-heading">AI-разработчиков</p>
            </div>
            <div className="w-px h-10 bg-gradient-to-b from-transparent via-[rgba(0,245,255,0.25)] to-transparent hidden sm:block" />
            <div className="group">
              <p className="text-3xl sm:text-4xl font-display font-bold font-mono neon-text tracking-wider transition-all duration-300 group-hover:scale-110">
                {freelancers && freelancers.length > 0
                  ? (freelancers.reduce((s, f) => s + f.rating, 0) / freelancers.length).toFixed(1)
                  : '...'} ★
              </p>
              <p className="text-xs text-[rgba(255,255,255,0.35)] mt-1 uppercase tracking-widest font-heading">Средний рейтинг</p>
            </div>
            <div className="w-px h-10 bg-gradient-to-b from-transparent via-[rgba(0,245,255,0.25)] to-transparent hidden sm:block" />
            <div className="group">
              <p
                className="text-3xl sm:text-4xl font-display font-bold font-mono tracking-wider transition-all duration-300 group-hover:scale-110"
                style={{ color: '#00ff88', textShadow: '0 0 20px rgba(0,255,136,0.4), 0 0 40px rgba(0,255,136,0.15)' }}
              >
                0%
              </p>
              <p className="text-xs text-[rgba(255,255,255,0.35)] mt-1 uppercase tracking-widest font-heading">Комиссия</p>
            </div>
          </div>
        </div>
      </section>

      {/* LIVE ORDER TICKER */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <LiveOrderTicker />
      </section>

      {/* CATEGORIES */}
      <section ref={catRef} className="py-24 relative">
        <div className="absolute inset-0 bg-[#0d0d1a] hex-grid-bg" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-2xl sm:text-3xl font-display font-bold tracking-[0.1em] uppercase text-white mb-3">
                <span className="neon-text">Категории</span> — фриланс дизайн, разработка, AI
              </h2>
              <p className="text-[rgba(255,255,255,0.5)] tracking-wide">Найдите специалиста в любой IT-области</p>
            </div>
            <Link to="/categories/all" className="hidden sm:flex items-center gap-1.5 text-sm text-[rgba(200,220,255,0.5)] hover:text-[#00f5ff] transition-colors font-heading font-medium tracking-wider uppercase">{t('home.all_categories')} <ArrowRight size={14} /></Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {catLoading ? Array.from({ length: 8 }).map((_, i) => (<div key={i} className="card p-6"><Skeleton className="h-12 w-12 rounded mb-4" /><Skeleton className="h-4 w-3/4 mb-2" /><Skeleton className="h-3 w-1/2" /></div>)) : (categories || []).map((cat, i) => {
              const Icon = iconMap[cat.icon] || Globe;
              const catAccents = [
                { border: 'hover:border-[rgba(0,245,255,0.3)]', icon: 'text-[#00f5ff]', glow: 'group-hover:shadow-[0_0_20px_rgba(0,245,255,0.15)]', name: 'group-hover:text-[#00f5ff]', iconBg: 'group-hover:bg-[rgba(0,245,255,0.08)] group-hover:border-[rgba(0,245,255,0.3)]' },
                { border: 'hover:border-[rgba(139,92,246,0.3)]', icon: 'text-[#8b5cf6]', glow: 'group-hover:shadow-[0_0_20px_rgba(139,92,246,0.15)]', name: 'group-hover:text-[#8b5cf6]', iconBg: 'group-hover:bg-[rgba(139,92,246,0.08)] group-hover:border-[rgba(139,92,246,0.3)]' },
                { border: 'hover:border-[rgba(0,245,255,0.3)]', icon: 'text-[#00f5ff]', glow: 'group-hover:shadow-[0_0_20px_rgba(0,245,255,0.15)]', name: 'group-hover:text-[#00f5ff]', iconBg: 'group-hover:bg-[rgba(0,245,255,0.08)] group-hover:border-[rgba(0,245,255,0.3)]' },
                { border: 'hover:border-[rgba(249,83,198,0.3)]', icon: 'text-[#f953c6]', glow: 'group-hover:shadow-[0_0_20px_rgba(249,83,198,0.15)]', name: 'group-hover:text-[#f953c6]', iconBg: 'group-hover:bg-[rgba(249,83,198,0.08)] group-hover:border-[rgba(249,83,198,0.3)]' },
              ];
              const a = catAccents[i % 4];
              return (
                <Link
                  key={cat.slug}
                  to={`/categories/${cat.slug}`}
                  className={`card p-6 group ${a.border} ${a.glow} transition-all duration-500 ${catVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                  style={{ transitionDelay: `${i * 80}ms` }}
                >
                  <div className={`w-12 h-12 bg-[rgba(0,245,255,0.03)] border border-[rgba(0,245,255,0.1)] rounded flex items-center justify-center mb-4 ${a.iconBg} transition-all duration-500`}>
                    <Icon size={24} className={a.icon} />
                  </div>
                  <h3 className={`text-sm font-medium text-white mb-1 ${a.name} transition-colors`}>{cat.name}</h3>
                  <p className="text-xs text-[rgba(180,220,255,0.35)] font-mono">{cat.gigCount} {t('home.gigs_count')}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="neon-divider mx-8 sm:mx-16" />

      {/* TOP FREELANCERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-12">
          <p className="text-xs text-[rgba(139,92,246,0.7)] tracking-[0.3em] uppercase font-heading mb-3"
             style={{ textShadow: '0 0 15px rgba(139,92,246,0.4)' }}>◈ команда ◈</p>
          <h2 className="text-2xl sm:text-3xl font-display font-bold tracking-[0.1em] uppercase text-white mb-3">
            <span className="neon-text">Топ разработчиков</span> — проверенные профессионалы
          </h2>
          <p className="text-[rgba(255,255,255,0.5)] tracking-wide">Каждый прошёл отбор и подтвердил квалификацию реальными проектами</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {(freelancers || []).slice(0, 8).map((f, i) => {
            const freelancerAccents = [
              'group-hover:border-[rgba(0,245,255,0.35)] group-hover:shadow-[0_0_25px_rgba(0,245,255,0.1)]',
              'group-hover:border-[rgba(0,245,255,0.35)] group-hover:shadow-[0_0_25px_rgba(0,245,255,0.1)]',
              'group-hover:border-[rgba(139,92,246,0.35)] group-hover:shadow-[0_0_25px_rgba(139,92,246,0.1)]',
              'group-hover:border-[rgba(249,83,198,0.35)] group-hover:shadow-[0_0_25px_rgba(249,83,198,0.1)]',
            ];
            const nameColors = ['group-hover:text-[#00f5ff]', 'group-hover:text-[#00f5ff]', 'group-hover:text-[#8b5cf6]', 'group-hover:text-[#f953c6]'];
            return (
              <Link
                key={f.id}
                to={`/users/${f.username}`}
                className={`card p-5 text-center group transition-all opacity-0 animate-fade-in ${freelancerAccents[i % 4]}`}
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <Avatar src={f.avatar} alt={f.name} size="lg" className="mx-auto mb-3" isOnline={f.isOnline} />
                <h3 className={`text-sm font-medium text-white transition-colors ${nameColors[i % 4]}`}>{f.name}</h3>
                <p className="text-xs text-[rgba(255,255,255,0.4)] mt-0.5">{f.title}</p>
                <div className="flex items-center justify-center gap-3 mt-3 text-xs">
                  <span className="text-[#00f5ff] font-mono" style={{ textShadow: '0 0 8px rgba(0,245,255,0.4)' }}>★ {f.rating}</span>
                  <span className="text-[rgba(255,255,255,0.35)]">{f.ordersCompleted} заказов</span>
                </div>
                {f.level === 'pro' && (
                  <span className="inline-block mt-2 text-[9px] font-bold px-2 py-0.5 rounded tracking-widest uppercase badge-emerald">PRO</span>
                )}
              </Link>
            );
          })}
        </div>
      </section>

      {/* Divider */}
      <div className="neon-divider mx-8 sm:mx-16" />

      {/* TESTIMONIALS */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center mb-12">
          <p className="text-xs text-[rgba(0,245,255,0.6)] tracking-[0.3em] uppercase font-heading mb-3"
             style={{ textShadow: '0 0 15px rgba(0,245,255,0.3)' }}>◈ отзывы ◈</p>
          <h2 className="text-2xl sm:text-3xl font-display font-bold tracking-[0.1em] uppercase text-white mb-3">
            <span className="neon-text">Отзывы</span> заказчиков
          </h2>
        </div>
        <div className="grid sm:grid-cols-3 gap-6">
          {(latestReviews || []).map((review, i) => (
            <div key={review.id || i} className={`card p-6 ${['', 'card-cyan', 'card-violet'][i % 3]}`}>
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: review.rating }).map((_, j) => (
                  <span key={j} className="text-[#00f5ff] text-sm" style={{ textShadow: '0 0 6px rgba(0,245,255,0.5)' }}>★</span>
                ))}
                {Array.from({ length: 5 - review.rating }).map((_, j) => (
                  <span key={j} className="text-[#1a1a2e] text-sm">★</span>
                ))}
              </div>
              <p className="text-sm text-[rgba(255,255,255,0.65)] leading-relaxed mb-4">&ldquo;{review.text}&rdquo;</p>
              <div className="flex items-center gap-3">
                <Avatar src={review.avatar} alt={review.author} size="sm" />
                <p className="text-sm font-medium text-white">{review.author}</p>
              </div>
            </div>
          ))}
          {(!latestReviews || latestReviews.length === 0) && (
            <div className="col-span-3 text-center py-8 text-[rgba(255,255,255,0.3)] text-sm terminal-cursor">Отзывы появятся после первых заказов</div>
          )}
        </div>
      </section>

      {/* Divider */}
      <div className="neon-divider mx-8 sm:mx-16" />

      {/* AI TOOL SHOWCASE */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-10">
          <p className="text-xs text-[rgba(0,255,136,0.6)] tracking-[0.3em] uppercase font-heading mb-3"
             style={{ textShadow: '0 0 15px rgba(0,255,136,0.3)' }}>◈ технологии ◈</p>
          <h2 className="text-2xl sm:text-3xl font-display font-bold tracking-[0.1em] uppercase text-white mb-3">
            <span className="neon-text">AI-инструменты</span> наших разработчиков
          </h2>
          <p className="text-[rgba(255,255,255,0.5)] tracking-wide">Современные технологии для быстрой и качественной разработки</p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {(['Cursor', 'Claude', 'ChatGPT', 'v0', 'Bolt', 'Copilot', 'Midjourney', 'Windsurf', 'Replit', 'LangChain'] as const).map((tool, i) => {
            const toolAccents = [
              'hover:border-[rgba(0,245,255,0.4)] hover:text-[#00f5ff] hover:shadow-[0_0_20px_rgba(0,245,255,0.15)]',
              'hover:border-[rgba(0,245,255,0.4)] hover:text-[#00f5ff] hover:shadow-[0_0_20px_rgba(0,245,255,0.15)]',
              'hover:border-[rgba(139,92,246,0.4)] hover:text-[#8b5cf6] hover:shadow-[0_0_20px_rgba(139,92,246,0.15)]',
              'hover:border-[rgba(249,83,198,0.4)] hover:text-[#f953c6] hover:shadow-[0_0_20px_rgba(249,83,198,0.15)]',
            ];
            return (
              <div
                key={tool}
                className={`px-4 py-2 sm:px-5 sm:py-3 rounded bg-[rgba(255,255,255,0.02)] border border-[rgba(0,245,255,0.08)] text-xs sm:text-sm text-[rgba(255,255,255,0.55)] font-mono transition-all duration-400 cursor-default ${toolAccents[i % 4]}`}
              >
                {tool}
              </div>
            );
          })}
        </div>
      </section>

      {/* LATEST NEWS */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl sm:text-2xl font-display font-bold tracking-[0.1em] uppercase text-white">Новости</h2>
          <Link to="/news" className="text-sm text-[rgba(200,220,255,0.5)] hover:text-[#00f5ff] transition-colors tracking-wider uppercase font-heading">Все новости →</Link>
        </div>
        <div className="grid sm:grid-cols-3 gap-6">
          {[
            { emoji: '🚀', title: 'Запуск VibeCoder', desc: 'Первый маркетплейс для AI-разработчиков', date: '6 марта 2026' },
            { emoji: '🤖', title: 'AI-функции платформы', desc: 'AI-подбор специалиста, анализ кворков, Vibe Score', date: '6 марта 2026' },
            { emoji: '⚡', title: 'MVP за 1-3 дня', desc: 'Cursor + Claude + v0 = готовый продукт в разы быстрее', date: '6 марта 2026' },
          ].map((news, i) => (
            <Link key={i} to="/news" className={`card p-5 transition-all group ${['card-cyan', 'card-violet', 'card-pink'][i % 3]}`}>
              <span className="text-2xl">{news.emoji}</span>
              <h3 className="text-sm font-medium text-white mt-3 group-hover:text-[#00f5ff] transition-colors">{news.title}</h3>
              <p className="text-xs text-[rgba(255,255,255,0.4)] mt-1 leading-relaxed">{news.desc}</p>
              <p className="text-[10px] text-[rgba(255,255,255,0.25)] mt-3 font-mono">{news.date}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* SEO TEXT */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-16" itemScope itemType="https://schema.org/WebPage">
        <article className="max-w-none space-y-6 text-[rgba(255,255,255,0.55)] text-sm leading-relaxed break-words hyphens-auto">
          <h2 className="text-xl sm:text-2xl font-display font-bold tracking-[0.1em] uppercase text-white">
            VibeCoder — <span className="neon-text">фриланс биржа вайбкодеров</span> нового поколения
          </h2>
          <p>
            <strong className="text-white">VibeCoder</strong> — это первая <strong className="text-white">фриланс биржа вайбкодеров</strong>, где исполнители открыто
            используют искусственный интеллект для разработки проектов. Если вы&nbsp;ищете <em>лучший фриланс</em> с&nbsp;быстрым
            результатом и&nbsp;доступными ценами — вы&nbsp;нашли его. Наши специалисты создают сайты, боты,
            приложения и&nbsp;дизайн с&nbsp;помощью Cursor, Claude, ChatGPT, v0 и&nbsp;других AI-инструментов.
            Результат — <strong className="text-white">фриланс дёшево</strong>, без потери качества. Разработчик доводит продукт до конца:
            проводит ревью, отлаживает, тестирует — и сдаёт готовое решение.
          </p>

          <h3 className="text-lg font-display font-semibold tracking-wider uppercase text-white">
            Почему вайб-кодинг безопасен?
          </h3>
          <p>
            Вайб-кодинг — это метод разработки, при котором AI генерирует код, а&nbsp;разработчик проводит
            ревью, отладку и&nbsp;тестирование. На&nbsp;нашей бирже действуют <strong className="text-white">строгие правила для
            исполнителей</strong>: каждый проект проходит обязательный code review, ручную проверку логики
            и&nbsp;финальное тестирование перед сдачей. Мы&nbsp;отбираем только ответственных разработчиков,
            которые понимают, что AI — инструмент ускорения, а&nbsp;не&nbsp;замена инженерной экспертизы.
            Жёсткий отбор гарантирует, что вы&nbsp;получите рабочий, чистый и&nbsp;безопасный код.
          </p>

          <h3 className="text-lg font-display font-semibold tracking-wider uppercase text-white">
            Лучшие фриланс биржи — чем VibeCoder отличается?
          </h3>
          <p>
            Среди <em>лучших фриланс бирж</em> VibeCoder выделяется прозрачностью: исполнители не&nbsp;скрывают
            использование AI, а&nbsp;заказчики получают выгоду — проекты выполняются в&nbsp;2–5&nbsp;раз быстрее
            при стоимости ниже рыночной. Это не&nbsp;просто <em>фриланс биржа в&nbsp;России</em> — это
            глобальная платформа для тех, кто ценит скорость, честность и&nbsp;результат.
            Комиссия 0%, безопасная сделка, гарантия возврата.
          </p>

          <h3 className="text-lg font-display font-semibold tracking-wider uppercase text-white">
            Топ фрилансеров для любых задач
          </h3>
          <p>
            Наш <em>топ фрилансеров</em> включает специалистов по&nbsp;всем направлениям:
            <strong className="text-white"> фриланс дизайн</strong> (UI/UX, логотипы, фирменный стиль),
            веб-разработка (React, Next.js, WordPress), мобильные приложения,
            Telegram-боты и&nbsp;<strong className="text-white">фриланс ТГ</strong>-интеграции, AI-чатботы,
            RAG-системы и&nbsp;автоматизация бизнес-процессов. Не&nbsp;знаете, <em>фриланс где брать</em>
            &nbsp;исполнителя? На&nbsp;VibeCoder — проверенные разработчики уже ждут ваш заказ.
          </p>

          <h3 className="text-lg font-display font-semibold tracking-wider uppercase text-white">
            Как работает наша фриланс биржа?
          </h3>
          <p>
            Разместите задачу или выберите готовый кворк. Исполнитель создаёт проект с&nbsp;помощью AI,
            проводит code review и&nbsp;отладку, затем сдаёт готовый продукт. Вы&nbsp;проверяете и&nbsp;принимаете
            работу через безопасную сделку. Средний срок выполнения MVP — 1–3&nbsp;дня. Наши
            разработчики работают прозрачно: вы&nbsp;видите процесс, инструменты и&nbsp;промежуточные
            результаты. <strong className="text-white">VibeCoder — лучший фриланс</strong> для тех, кто хочет получить
            качественный продукт быстро и&nbsp;по&nbsp;разумной цене.
          </p>
        </article>
      </section>

      {/* TRUST BADGES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-[rgba(255,255,255,0.35)]">
          <div className="flex items-center gap-2"><ShieldCheck size={16} className="text-[#00f5ff]" /><span className="tracking-wider uppercase text-xs font-heading">{t('common.safe_deal')}</span></div>
          <div className="flex items-center gap-2"><Sparkles size={16} className="text-[#8b5cf6]" /><span className="tracking-wider uppercase text-xs font-heading">{t('common.guarantee')}</span></div>
          <div className="flex items-center gap-2"><Zap size={16} className="text-[#00f5ff]" /><span className="tracking-wider uppercase text-xs font-heading">{t('common.fast_delivery')}</span></div>
        </div>
      </section>
    </div>
  );
}

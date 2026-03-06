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

function GoldParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 20 }).map((_, i) => (
        <span
          key={i}
          className="particle animate-float-particle"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 8}s`,
            animationDuration: `${6 + Math.random() * 8}s`,
            width: `${2 + Math.random() * 3}px`,
            height: `${2 + Math.random() * 3}px`,
            boxShadow: `0 0 ${4 + Math.random() * 6}px rgba(255, 215, 0, 0.5)`,
          }}
        />
      ))}
    </div>
  );
}

function GoldenSpiral() {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] opacity-20 pointer-events-none">
      <div className="w-full h-full bg-[conic-gradient(from_0deg,transparent,rgba(255,215,0,0.15),transparent)] rounded-full animate-spiral-rotate" />
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
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden sacred-bg">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-[radial-gradient(ellipse_at_center,rgba(255,215,0,0.08)_0%,transparent_60%)] animate-glow-breathe" />
          <div className="absolute top-20 right-20 w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(0,245,255,0.03)_0%,transparent_60%)]" />
        </div>
        <GoldenSpiral />
        <GoldParticles />

        <div className="relative z-10 max-w-3xl mx-auto px-4 text-center py-20 sm:py-28 space-y-10">
          <div className="space-y-6">
            <p className="text-xs text-[rgba(255,255,255,0.35)] tracking-[0.25em] uppercase font-heading">
              AI-разработка нового поколения
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold tracking-[0.1em] uppercase leading-[1.15]">
              <span className="quantum-shimmer">Фриланс биржа</span><br />
              <span className="text-white text-3xl sm:text-4xl lg:text-5xl tracking-[0.12em]">вайбкодеров и AI-разработчиков</span>
            </h1>
            <p className="text-base sm:text-lg text-[rgba(255,255,255,0.6)] max-w-2xl mx-auto tracking-wide leading-relaxed">
              Наши разработчики используют AI-инструменты, чтобы доводить проекты до готового продукта
              быстрее и&nbsp;качественнее — за&nbsp;меньшие деньги. Жёсткий отбор, code review каждого проекта,
              гарантия результата.
            </p>
          </div>

          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="bg-[#0d0d1a]/80 backdrop-blur-md rounded border border-[rgba(255,215,0,0.1)] p-1.5 shadow-[0_0_30px_rgba(255,215,0,0.04)] group focus-within:border-[rgba(255,215,0,0.3)] focus-within:shadow-[0_0_40px_rgba(255,215,0,0.08),0_0_80px_rgba(255,215,0,0.03)] transition-all duration-500">
              <div className="flex items-center gap-3 px-4 py-3">
                <Search size={20} className="text-[#ffd700]/40 flex-shrink-0" />
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder={t('home.searchPlaceholder')} className="flex-1 bg-transparent text-white placeholder:text-[rgba(255,255,255,0.3)] text-base outline-none tracking-wide" />
                <Button type="submit" variant="primary" size="sm" className="flex-shrink-0">{t('common.search')}</Button>
              </div>
            </div>
          </form>

          <div className="flex flex-wrap justify-center gap-2">
            {popularSearches.slice(0, 6).map((tag) => (
              <Link key={tag} to={`/categories/all?search=${encodeURIComponent(tag)}`} className="px-4 py-2 text-sm bg-transparent text-[rgba(255,255,255,0.5)] rounded border border-[rgba(255,215,0,0.1)] cursor-pointer hover:border-[rgba(255,215,0,0.35)] hover:text-[#ffd700] hover:bg-[rgba(255,215,0,0.04)] hover:shadow-[0_0_12px_rgba(255,215,0,0.08)] transition-all duration-300 tracking-wide">{tag}</Link>
            ))}
          </div>

          <div className="flex items-center justify-center gap-3 pt-4">
            <div className="flex -space-x-2">
              {(freelancers || []).slice(0, 4).map((f) => <Avatar key={f.id} src={f.avatar} alt={f.name} size="sm" className="ring-2 ring-[#0a0a0f]" />)}
            </div>
            <div className="text-sm text-[rgba(255,255,255,0.5)]">
              <span className="text-[#ffd700] font-semibold font-mono">{(freelancers || []).reduce((sum, f) => sum + f.ordersCompleted, 0) || '...'}+</span> {t('home.orders_completed')}
            </div>
          </div>
        </div>
      </section>

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
        <div className={`grid sm:grid-cols-2 lg:grid-cols-4 gap-6 transition-opacity duration-700 ${gigsVisible ? 'opacity-100' : 'opacity-0'}`}>
          {gigsLoading ? Array.from({ length: 4 }).map((_, i) => (<div key={i} className="card overflow-hidden"><Skeleton className="aspect-video" /><div className="p-4 space-y-3"><Skeleton className="h-4 w-full" /><Skeleton className="h-3 w-2/3" /></div></div>)) : (featuredGigs || []).map((gig, i) => <GigCard key={gig.id} gig={gig} index={i} />)}
        </div>
      </section>

      {/* LIVE STATS */}
      <section className="relative py-12 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="card p-6 sm:p-8 flex flex-wrap items-center justify-center gap-8 sm:gap-16 text-center">
            <div>
              <p className="text-3xl sm:text-4xl font-display font-bold font-mono neon-text tracking-wider">{(categories || []).reduce((sum, c) => sum + c.gigCount, 0) || '...'}</p>
              <p className="text-xs text-[rgba(255,255,255,0.35)] mt-1 uppercase tracking-widest font-heading">Услуг в каталоге</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-display font-bold font-mono text-[#00f5ff] tracking-wider" style={{ textShadow: '0 0 20px rgba(0, 245, 255, 0.3)' }}>{(freelancers || []).length || '...'}</p>
              <p className="text-xs text-[rgba(255,255,255,0.35)] mt-1 uppercase tracking-widest font-heading">AI-разработчиков</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-display font-bold font-mono neon-text tracking-wider">{freelancers && freelancers.length > 0 ? (freelancers.reduce((s, f) => s + f.rating, 0) / freelancers.length).toFixed(1) : '...'} ★</p>
              <p className="text-xs text-[rgba(255,255,255,0.35)] mt-1 uppercase tracking-widest font-heading">Средний рейтинг</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-display font-bold font-mono text-[#00ff88] tracking-wider" style={{ textShadow: '0 0 15px rgba(0, 255, 136, 0.2)' }}>0%</p>
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
            <Link to="/categories/all" className="hidden sm:flex items-center gap-1.5 text-sm text-[rgba(255,255,255,0.5)] hover:text-[#ffd700] transition-colors font-heading font-medium tracking-wider uppercase">{t('home.all_categories')} <ArrowRight size={14} /></Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {catLoading ? Array.from({ length: 8 }).map((_, i) => (<div key={i} className="card p-6"><Skeleton className="h-12 w-12 rounded mb-4" /><Skeleton className="h-4 w-3/4 mb-2" /><Skeleton className="h-3 w-1/2" /></div>)) : (categories || []).map((cat, i) => {
              const Icon = iconMap[cat.icon] || Globe;
              return (
                <Link
                  key={cat.slug}
                  to={`/categories/${cat.slug}`}
                  className={`card p-6 group hover:border-[rgba(255,215,0,0.2)] transition-all duration-500 ${catVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                  style={{ transitionDelay: `${i * 80}ms` }}
                >
                  <div className="w-12 h-12 bg-[rgba(255,215,0,0.04)] border border-[rgba(255,215,0,0.1)] rounded flex items-center justify-center mb-4 group-hover:bg-[rgba(255,215,0,0.08)] group-hover:border-[rgba(255,215,0,0.25)] group-hover:shadow-[0_0_15px_rgba(255,215,0,0.08)] transition-all duration-500">
                    <Icon size={24} className="text-[#ffd700]" />
                  </div>
                  <h3 className="text-sm font-medium text-white mb-1 group-hover:text-[#ffd700] transition-colors">{cat.name}</h3>
                  <p className="text-xs text-[rgba(255,255,255,0.35)] font-mono">{cat.gigCount} {t('home.gigs_count')}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* TOP FREELANCERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-display font-bold tracking-[0.1em] uppercase text-white mb-3">
            <span className="neon-text">Топ разработчиков</span> — проверенные профессионалы
          </h2>
          <p className="text-[rgba(255,255,255,0.5)] tracking-wide">Каждый прошёл отбор и подтвердил квалификацию реальными проектами</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {(freelancers || []).slice(0, 8).map((f, i) => (
            <Link key={f.id} to={`/users/${f.username}`} className="card p-5 text-center group hover:border-[rgba(255,215,0,0.2)] transition-all opacity-0 animate-fade-in" style={{ animationDelay: `${i * 80}ms` }}>
              <Avatar src={f.avatar} alt={f.name} size="lg" className="mx-auto mb-3" isOnline={f.isOnline} />
              <h3 className="text-sm font-medium text-white group-hover:text-[#ffd700] transition-colors">{f.name}</h3>
              <p className="text-xs text-[rgba(255,255,255,0.4)] mt-0.5">{f.title}</p>
              <div className="flex items-center justify-center gap-3 mt-3 text-xs">
                <span className="text-[#ffd700] font-mono">★ {f.rating}</span>
                <span className="text-[rgba(255,255,255,0.35)]">{f.ordersCompleted} заказов</span>
              </div>
              {f.level === 'pro' && <span className="inline-block mt-2 text-[10px] font-semibold bg-[rgba(255,215,0,0.08)] text-[#ffd700] px-2 py-0.5 rounded border border-[rgba(255,215,0,0.2)] tracking-widest uppercase">PRO</span>}
            </Link>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-display font-bold tracking-[0.1em] uppercase text-white mb-3">
            <span className="neon-text">Отзывы</span> заказчиков
          </h2>
        </div>
        <div className="grid sm:grid-cols-3 gap-6">
          {(latestReviews || []).map((review, i) => (
            <div key={review.id || i} className="card p-6">
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: review.rating }).map((_, j) => <span key={j} className="text-[#ffd700] text-sm">★</span>)}
                {Array.from({ length: 5 - review.rating }).map((_, j) => <span key={j} className="text-[#1a1a2e] text-sm">★</span>)}
              </div>
              <p className="text-sm text-[rgba(255,255,255,0.6)] leading-relaxed mb-4">&ldquo;{review.text}&rdquo;</p>
              <div className="flex items-center gap-3">
                <Avatar src={review.avatar} alt={review.author} size="sm" />
                <p className="text-sm font-medium text-white">{review.author}</p>
              </div>
            </div>
          ))}
          {(!latestReviews || latestReviews.length === 0) && (
            <div className="col-span-3 text-center py-8 text-[rgba(255,255,255,0.3)] text-sm">Отзывы появятся после первых заказов</div>
          )}
        </div>
      </section>

      {/* AI TOOL SHOWCASE */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-display font-bold tracking-[0.1em] uppercase text-white mb-3">
            <span className="neon-text">AI-инструменты</span> наших разработчиков
          </h2>
          <p className="text-[rgba(255,255,255,0.5)] tracking-wide">Современные технологии для быстрой и качественной разработки</p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4">
          {['Cursor', 'Claude', 'ChatGPT', 'v0', 'Bolt', 'Copilot', 'Midjourney', 'Windsurf', 'Replit', 'LangChain'].map(tool => (
            <div key={tool} className="px-5 py-3 rounded bg-[rgba(255,215,0,0.03)] border border-[rgba(255,215,0,0.08)] text-sm text-[rgba(255,255,255,0.6)] font-mono hover:border-[rgba(255,215,0,0.3)] hover:bg-[rgba(255,215,0,0.06)] hover:text-[#ffd700] hover:shadow-[0_0_20px_rgba(255,215,0,0.1)] transition-all duration-500 cursor-default">
              {tool}
            </div>
          ))}
        </div>
      </section>

      {/* LATEST NEWS */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl sm:text-2xl font-display font-bold tracking-[0.1em] uppercase text-white">Новости</h2>
          <Link to="/news" className="text-sm text-[rgba(255,255,255,0.5)] hover:text-[#ffd700] transition-colors tracking-wider uppercase font-heading">Все новости →</Link>
        </div>
        <div className="grid sm:grid-cols-3 gap-6">
          {[
            { emoji: '🚀', title: 'Запуск VibeCoder', desc: 'Первый маркетплейс для AI-разработчиков', date: '6 марта 2026' },
            { emoji: '🤖', title: 'AI-функции платформы', desc: 'AI-подбор специалиста, анализ кворков, Vibe Score', date: '6 марта 2026' },
            { emoji: '⚡', title: 'MVP за 1-3 дня', desc: 'Cursor + Claude + v0 = готовый продукт в разы быстрее', date: '6 марта 2026' },
          ].map((news, i) => (
            <Link key={i} to="/news" className="card p-5 hover:border-[rgba(255,215,0,0.2)] transition-all group">
              <span className="text-2xl">{news.emoji}</span>
              <h3 className="text-sm font-medium text-white mt-3 group-hover:text-[#ffd700] transition-colors">{news.title}</h3>
              <p className="text-xs text-[rgba(255,255,255,0.4)] mt-1 leading-relaxed">{news.desc}</p>
              <p className="text-[10px] text-[rgba(255,255,255,0.25)] mt-3 font-mono">{news.date}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* SEO TEXT */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-16" itemScope itemType="https://schema.org/WebPage">
        <article className="max-w-none space-y-6 text-[rgba(255,255,255,0.55)] text-sm leading-relaxed">
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
          <div className="flex items-center gap-2"><Sparkles size={16} className="text-[#ffd700]" /><span className="tracking-wider uppercase text-xs font-heading">{t('common.guarantee')}</span></div>
          <div className="flex items-center gap-2"><Zap size={16} className="text-[#ffd700]" /><span className="tracking-wider uppercase text-xs font-heading">{t('common.fast_delivery')}</span></div>
        </div>
      </section>
    </div>
  );
}

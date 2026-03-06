import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Search, Zap, ShieldCheck, ArrowRight,
  Globe, Smartphone, Bot, Brain, Layout, Server, Database, Rocket,
  ClipboardList, CreditCard, MessageSquare, Sparkles, Code, Bug, Cloud,
} from 'lucide-react';
import GigCard from '../components/GigCard';
import Button from '../components/ui/Button';
import Avatar from '../components/ui/Avatar';
import Skeleton from '../components/ui/Skeleton';
import SEO from '../components/SEO';
import AIMatching from '../components/AIMatching';
import LiveOrderTicker from '../components/LiveOrderTicker';
import { useCategories, useFeaturedGigs, useTopFreelancers } from '../hooks/useData';
import { popularSearches } from '../lib/freelance-db';
import { useInView } from '../hooks/useInView';

const iconMap: Record<string, React.ElementType> = {
  Globe, Smartphone, Bot, Brain, Layout, Server, Database, Rocket, Sparkles, Code, Bug, Cloud,
};

function ParticleField() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 15 }).map((_, i) => (
        <span key={i} className="particle animate-float-particle" style={{ left: `${Math.random()*100}%`, animationDelay: `${Math.random()*8}s`, animationDuration: `${6+Math.random()*6}s`, opacity: 0.3+Math.random()*0.4, width: `${2+Math.random()*3}px`, height: `${2+Math.random()*3}px` }} />
      ))}
    </div>
  );
}

export default function Home() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const { ref: whyRef, isInView: whyVisible } = useInView();
  const { ref: catRef, isInView: catVisible } = useInView();
  const { ref: gigsRef, isInView: gigsVisible } = useInView();
  const { ref: stepsRef, isInView: stepsVisible } = useInView();

  const { data: categories, loading: catLoading } = useCategories();
  const { data: featuredGigs, loading: gigsLoading } = useFeaturedGigs();
  const { data: freelancers } = useTopFreelancers(8);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) navigate(`/categories/all?search=${encodeURIComponent(searchQuery.trim())}`);
  };

  const steps = [
    { num: 1, icon: Search, title: t('home.step1'), desc: t('home.step1_desc') },
    { num: 2, icon: ClipboardList, title: t('home.step2'), desc: t('home.step2_desc') },
    { num: 3, icon: CreditCard, title: t('home.step3'), desc: t('home.step3_desc') },
    { num: 4, icon: MessageSquare, title: t('home.step4'), desc: t('home.step4_desc') },
  ];

  return (
    <div className="pb-20 md:pb-0">
      <SEO title="Маркетплейс AI-разработчиков" description="Фриланс-маркетплейс нового поколения. Найдите AI-разработчиков, вайб-кодеров и IT-специалистов." />
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden sacred-bg">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(ellipse_at_center,rgba(0,255,249,0.12)_0%,transparent_60%)] animate-glow-breathe" />
          <div className="absolute top-20 right-20 w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(255,0,110,0.08)_0%,transparent_60%)]" />
          <div className="absolute bottom-20 left-20 w-[300px] h-[300px] bg-[radial-gradient(circle,rgba(57,255,20,0.06)_0%,transparent_60%)]" />
        </div>
        <ParticleField />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] opacity-20">
          <div className="w-full h-full bg-[conic-gradient(from_0deg,transparent,rgba(0,255,249,0.15),transparent)] rounded-full animate-spiral-rotate" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center py-20 sm:py-28 space-y-10">
          <div className="space-y-6">
            <h1 className="font-display text-4xl sm:text-5xl lg:text-7xl font-bold tracking-[0.08em] uppercase leading-[1.1]">
              <span className="neon-text text-[var(--neon-cyan)]">{t('home.heroTitle')}</span><br />
              <span className="text-heading text-3xl sm:text-4xl lg:text-5xl tracking-[0.15em]">{t('home.heroSubtitle')}</span>
            </h1>
            <p className="text-lg sm:text-xl text-body max-w-2xl mx-auto font-heading font-light tracking-wide">{t('home.heroDesc')}</p>
          </div>
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="bg-nebula/80 backdrop-blur-md rounded-xl border-2 border-gold/50 p-1.5 shadow-[0_0_30px_rgba(0,255,249,0.15)] group focus-within:border-gold focus-within:shadow-[0_0_40px_rgba(0,255,249,0.3)] transition-all duration-500">
              <div className="flex items-center gap-3 px-4 py-3">
                <Search size={20} className="text-gold flex-shrink-0" />
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder={t('home.searchPlaceholder')} className="flex-1 bg-transparent text-heading placeholder:text-muted text-base outline-none" />
                <Button type="submit" variant="primary" size="sm" className="flex-shrink-0">{t('common.search')}</Button>
              </div>
            </div>
          </form>
          <div className="flex flex-wrap justify-center gap-2">
            {popularSearches.slice(0, 6).map((tag) => (
              <Link key={tag} to={`/categories/all?search=${encodeURIComponent(tag)}`} className="px-4 py-2 text-sm bg-transparent text-gold/80 rounded-full border border-gold/40 cursor-pointer hover:border-gold hover:text-gold hover:bg-gold/10 hover:shadow-[0_0_15px_rgba(0,255,249,0.3)] transition-all duration-300 font-heading tracking-wide">{tag}</Link>
            ))}
          </div>
          <div className="flex items-center justify-center gap-3 pt-4">
            <div className="flex -space-x-2">
              {(freelancers || []).slice(0, 4).map((f) => <Avatar key={f.id} src={f.avatar} alt={f.name} size="sm" className="ring-2 ring-void" />)}
            </div>
            <div className="text-sm text-body"><span className="text-gold font-semibold font-mono">{(freelancers || []).reduce((sum, f) => sum + f.ordersCompleted, 0) || '...'}+</span> {t('home.orders_completed')}</div>
          </div>
        </div>
      </section>

      {/* LIVE STATS */}
      <section className="relative py-12 -mt-12 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="card p-6 sm:p-8 flex flex-wrap items-center justify-center gap-8 sm:gap-16 text-center">
            <div><p className="text-3xl sm:text-4xl font-bold font-mono text-gold">{(categories || []).reduce((sum, c) => sum + c.gigCount, 0) || '...'}</p><p className="text-xs text-muted mt-1">Услуг в каталоге</p></div>
            <div><p className="text-3xl sm:text-4xl font-bold font-mono text-neon-cyan">{(freelancers || []).length || '...'}</p><p className="text-xs text-muted mt-1">AI-фрилансеров</p></div>
            <div><p className="text-3xl sm:text-4xl font-bold font-mono text-neon-green">{freelancers && freelancers.length > 0 ? (freelancers.reduce((s, f) => s + f.rating, 0) / freelancers.length).toFixed(1) : '...'} ★</p><p className="text-xs text-muted mt-1">Средний рейтинг</p></div>
            <div><p className="text-3xl sm:text-4xl font-bold font-mono text-accent-violet">0%</p><p className="text-xs text-muted mt-1">Комиссия</p></div>
          </div>
        </div>
      </section>

      {/* LIVE ORDER TICKER */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <LiveOrderTicker />
      </section>

      <section ref={whyRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-14">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-gold-gradient tracking-[0.1em] uppercase mb-4">{t('home.whyVibeCoders')}</h2>
          <p className="text-body font-heading font-light tracking-wide">{t('home.whyDesc')}</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[{ icon: Zap, color: 'text-gold', title: t('home.why_cheaper'), desc: t('home.why_cheaper_desc') }, { icon: Rocket, color: 'text-neon-pink', title: t('home.why_faster'), desc: t('home.why_faster_desc') }, { icon: ShieldCheck, color: 'text-neon-green', title: t('home.why_transparent'), desc: t('home.why_transparent_desc') }].map((item, i) => (
            <div key={i} className={`card p-8 text-center transition-all duration-700 ${whyVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: `${i*200}ms` }}>
              <div className="w-16 h-16 rounded-2xl bg-gold/10 border border-gold/30 flex items-center justify-center mx-auto mb-6"><item.icon size={30} className={item.color} /></div>
              <h3 className="text-lg font-heading font-semibold text-heading mb-3 tracking-wide">{item.title}</h3>
              <p className="text-sm text-body leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section ref={catRef} className="py-24 relative">
        <div className="absolute inset-0 bg-deep-space sacred-bg" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="font-display text-3xl font-bold text-gold-gradient tracking-[0.1em] uppercase mb-3">{t('home.categories')}</h2>
              <p className="text-body font-heading font-light">{t('home.find_specialist')}</p>
            </div>
            <Link to="/categories/all" className="hidden sm:flex items-center gap-1.5 text-sm text-gold/70 hover:text-gold transition-colors font-heading font-medium tracking-wide">{t('home.all_categories')} <ArrowRight size={14} /></Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {catLoading ? Array.from({ length: 8 }).map((_, i) => (<div key={i} className="card p-6"><Skeleton className="h-12 w-12 rounded-xl mb-4" /><Skeleton className="h-4 w-3/4 mb-2" /><Skeleton className="h-3 w-1/2" /></div>)) : (categories || []).map((cat, i) => {
              const Icon = iconMap[cat.icon] || Globe;
              return (<Link key={cat.slug} to={`/categories/${cat.slug}`} className={`card p-6 group hover:border-gold/30 transition-all duration-500 ${catVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: `${i*80}ms` }}>
                <div className="w-12 h-12 bg-gold/10 border border-gold/30 rounded-xl flex items-center justify-center mb-4 group-hover:bg-gold/15 group-hover:border-gold/50 group-hover:shadow-[0_0_20px_rgba(0,255,249,0.3)] transition-all duration-500"><Icon size={24} className="text-gold" /></div>
                <h3 className="text-sm font-heading font-semibold text-heading mb-1 group-hover:text-gold transition-colors">{cat.name}</h3>
                <p className="text-xs text-muted font-mono">{cat.gigCount} {t('home.gigs_count')}</p>
              </Link>);
            })}
          </div>
        </div>
      </section>

      <section ref={gigsRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="font-display text-3xl font-bold text-gold-gradient tracking-[0.1em] uppercase mb-3">{t('home.featuredGigs')}</h2>
            <p className="text-body font-heading font-light">{t('home.best_offers')}</p>
          </div>
        </div>
        <div className={`grid sm:grid-cols-2 lg:grid-cols-4 gap-6 transition-opacity duration-700 ${gigsVisible ? 'opacity-100' : 'opacity-0'}`}>
          {gigsLoading ? Array.from({ length: 4 }).map((_, i) => (<div key={i} className="card overflow-hidden"><Skeleton className="aspect-video" /><div className="p-4 space-y-3"><Skeleton className="h-4 w-full" /><Skeleton className="h-3 w-2/3" /></div></div>)) : (featuredGigs || []).map((gig, i) => <GigCard key={gig.id} gig={gig} index={i} />)}
        </div>
      </section>

      <section ref={stepsRef} id="how-it-works" className="py-24 relative">
        <div className="absolute inset-0 bg-deep-space" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl font-bold text-gold-gradient tracking-[0.1em] uppercase mb-4">{t('home.howItWorks')}</h2>
            <p className="text-body font-heading font-light">{t('home.steps_subtitle')}</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            <div className="hidden lg:block absolute top-10 left-[15%] right-[15%] h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
            {steps.map((step, i) => (
              <div key={step.num} className={`relative text-center transition-all duration-700 ${stepsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: `${i*200}ms` }}>
                <div className="w-20 h-20 rounded-full border border-gold/30 bg-void flex items-center justify-center mx-auto mb-6 relative z-10 shadow-[0_0_25px_rgba(0,255,249,0.15)]"><step.icon size={28} className="text-gold" /></div>
                <span className="text-xs font-mono text-gold/60 mb-2 block tracking-[0.2em] uppercase">{step.num}</span>
                <h3 className="text-base font-heading font-semibold text-heading mb-2">{step.title}</h3>
                <p className="text-sm text-body leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TOP FREELANCERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl font-bold text-gold-gradient tracking-[0.1em] uppercase mb-3">Топ специалисты</h2>
          <p className="text-body font-heading font-light">Проверенные вайб-кодеры с лучшими рейтингами</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {(freelancers || []).slice(0, 8).map((f, i) => (
            <Link key={f.id} to={`/users/${f.username}`} className="card p-5 text-center group hover:border-gold/30 transition-all opacity-0 animate-fade-in" style={{ animationDelay: `${i * 80}ms` }}>
              <Avatar src={f.avatar} alt={f.name} size="lg" className="mx-auto mb-3" isOnline={f.isOnline} />
              <h3 className="text-sm font-heading font-semibold text-heading group-hover:text-gold transition-colors">{f.name}</h3>
              <p className="text-xs text-muted mt-0.5">{f.title}</p>
              <div className="flex items-center justify-center gap-3 mt-3 text-xs">
                <span className="text-gold font-mono">★ {f.rating}</span>
                <span className="text-muted">{f.ordersCompleted} заказов</span>
              </div>
              {f.level === 'pro' && <span className="inline-block mt-2 text-[10px] font-bold bg-gold/20 text-gold px-2 py-0.5 rounded-full border border-gold/30">PRO</span>}
            </Link>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS MINI */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-deep-space sacred-bg" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold text-gold-gradient tracking-[0.1em] uppercase mb-3">Как это работает</h2>
            <p className="text-body font-heading font-light">3 простых шага</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              { num: '01', title: 'Выберите услугу', desc: 'Найдите кворк в каталоге или опишите задачу — AI подберёт специалиста', icon: '🔍' },
              { num: '02', title: 'Оформите заказ', desc: 'Выберите пакет, опишите требования. Деньги в безопасности до приёмки', icon: '📦' },
              { num: '03', title: 'Получите результат', desc: 'Фрилансер сдаёт работу. Проверьте, примите, оставьте отзыв', icon: '✅' },
            ].map((step) => (
              <div key={step.num} className="text-center card p-6">
                <div className="text-4xl mb-4">{step.icon}</div>
                <div className="text-xs text-gold font-mono mb-2">{step.num}</div>
                <h3 className="text-base font-heading font-semibold text-heading mb-2">{step.title}</h3>
                <p className="text-sm text-body leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/how-it-works" className="text-sm text-gold hover:underline">Подробнее →</Link>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl font-bold text-gold-gradient tracking-[0.1em] uppercase mb-3">Отзывы заказчиков</h2>
        </div>
        <div className="grid sm:grid-cols-3 gap-6">
          {[
            { name: 'Михаил К.', role: 'Стартап-фаундер', text: 'MVP был готов за 2 дня. Раньше это занимало месяц. Вайб-кодинг — это революция.', rating: 5, avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&q=80' },
            { name: 'Ольга С.', role: 'Владелец бизнеса', text: 'AI-бот для поддержки экономит нам 3 часа в день. Окупился за первую неделю.', rating: 5, avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&q=80' },
            { name: 'Алексей И.', role: 'Продакт-менеджер', text: 'Получил полноценный SaaS с подписками за 7 дней. Cursor + Claude = космос.', rating: 5, avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&q=80' },
          ].map((t, i) => (
            <div key={i} className="card p-6">
              <div className="flex gap-0.5 mb-3">{Array.from({length: t.rating}).map((_, j) => <span key={j} className="text-gold text-sm">★</span>)}</div>
              <p className="text-sm text-body leading-relaxed mb-4">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <img src={t.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                <div><p className="text-sm font-medium text-heading">{t.name}</p><p className="text-xs text-muted">{t.role}</p></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* AI TOOL SHOWCASE */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-10">
          <h2 className="font-display text-3xl font-bold text-gold-gradient tracking-[0.1em] uppercase mb-3">AI-инструменты наших кодеров</h2>
          <p className="text-body font-heading font-light">Мы используем лучшие AI для максимальной скорости</p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4">
          {['Cursor', 'Claude', 'ChatGPT', 'v0', 'Bolt', 'Copilot', 'Midjourney', 'Windsurf', 'Replit', 'LangChain'].map(tool => (
            <div key={tool} className="px-5 py-3 rounded-xl bg-gold/5 border border-gold/15 text-sm text-body font-mono hover:border-gold/40 hover:bg-gold/10 transition-all">
              ⚡ {tool}
            </div>
          ))}
        </div>
      </section>

      {/* LATEST NEWS */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-display text-2xl font-bold text-gold-gradient tracking-[0.1em] uppercase">Новости</h2>
          <Link to="/news" className="text-sm text-gold hover:underline">Все новости →</Link>
        </div>
        <div className="grid sm:grid-cols-3 gap-6">
          {[
            { emoji: '🚀', title: 'Запуск VibeCoder', desc: 'Первый маркетплейс для AI-разработчиков и вайб-кодеров', date: '6 марта 2026' },
            { emoji: '🤖', title: 'AI-функции', desc: 'AI-подбор специалиста, анализ кворков, Vibe Score', date: '6 марта 2026' },
            { emoji: '⚡', title: 'MVP за 1-3 дня', desc: 'Cursor + Claude + v0 = создаём проекты в разы быстрее', date: '6 марта 2026' },
          ].map((news, i) => (
            <Link key={i} to="/news" className="card p-5 hover:border-gold/30 transition-all group">
              <span className="text-2xl">{news.emoji}</span>
              <h3 className="text-sm font-heading font-semibold text-heading mt-3 group-hover:text-gold transition-colors">{news.title}</h3>
              <p className="text-xs text-muted mt-1 leading-relaxed">{news.desc}</p>
              <p className="text-[10px] text-muted mt-3">{news.date}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* BECOME FREELANCER CTA */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-gold/5 via-neon-cyan/5 to-accent-violet/5" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-display text-3xl font-bold tracking-[0.1em] uppercase mb-4">
            <span className="text-heading">Ты </span>
            <span className="neon-text text-[var(--neon-cyan)]">вайб-кодер?</span>
          </h2>
          <p className="text-body text-lg font-heading font-light mb-8 max-w-2xl mx-auto">Зарабатывай на своих навыках. Создавай проекты с AI-инструментами, получай заказы, расти в рейтинге. 0% комиссия.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/for-sellers"><Button variant="primary" size="lg">Стать фрилансером <ArrowRight size={18} /></Button></Link>
            <Link to="/how-it-works"><Button variant="secondary" size="lg">Как это работает</Button></Link>
          </div>
        </div>
      </section>

      {/* AI MATCHING */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <AIMatching />
      </section>

      {/* PROJECTS PROMO */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-deep-space sacred-bg" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-display text-3xl font-bold text-gold-gradient tracking-[0.1em] uppercase mb-4">Нужен специалист?</h2>
          <p className="text-body text-lg font-heading font-light mb-8 max-w-2xl mx-auto">Разместите проект на бирже — фрилансеры сами предложат свои решения и цены. Быстро, удобно, бесплатно.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/projects"><Button variant="primary" size="lg">Разместить проект <ArrowRight size={18} /></Button></Link>
            <Link to="/categories/all"><Button variant="secondary" size="lg">Искать услуги</Button></Link>
          </div>
          <div className="flex items-center justify-center gap-6 mt-8 text-sm text-muted">
            <span>✓ Без комиссии</span>
            <span>✓ Безопасная сделка</span>
            <span>✓ Гарантия результата</span>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="relative rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-nebula via-nebula-light to-nebula" />
          <div className="absolute inset-0 sacred-bg opacity-50" />
          <div className="absolute inset-0 border border-gold/30 rounded-2xl" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
          <div className="relative p-12 sm:p-16 text-center space-y-6">
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-[0.08em] uppercase">
              <span className="text-gold-gradient">{t('home.cta_title')}</span><br />
              <span className="text-heading text-2xl sm:text-3xl tracking-[0.12em]">{t('home.cta_subtitle')}</span>
            </h2>
            <p className="text-body max-w-lg mx-auto font-heading font-light">{t('home.cta_desc')}</p>
            <Link to="/auth"><Button variant="primary" size="lg" className="mt-4">{t('home.becomeFreelancer')}<ArrowRight size={18} /></Button></Link>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-muted">
          <div className="flex items-center gap-2"><ShieldCheck size={16} className="text-neon-cyan" /><span className="font-heading">{t('common.safe_deal')}</span></div>
          <div className="flex items-center gap-2"><Sparkles size={16} className="text-neon-pink" /><span className="font-heading">{t('common.guarantee')}</span></div>
          <div className="flex items-center gap-2"><Zap size={16} className="text-neon-green" /><span className="font-heading">{t('common.fast_delivery')}</span></div>
        </div>
      </section>
    </div>
  );
}

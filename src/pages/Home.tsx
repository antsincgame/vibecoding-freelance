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
  const { data: freelancers } = useTopFreelancers(4);

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
            <div className="text-sm text-body"><span className="text-gold font-semibold font-mono">500+</span> {t('home.orders_completed')}</div>
          </div>
        </div>
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

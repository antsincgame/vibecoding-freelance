import { Link } from 'react-router-dom';
import { Calendar, Zap, Bot, Shield, Star, Rocket, Award, ArrowRight } from 'lucide-react';
import SEO from '../components/SEO';
import { NEWS_DATA } from '../data/news';

export default function News() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 pb-24">
      <SEO title="Новости" description="Последние обновления и новости фриланс-маркетплейса VibeCoder." />

      <div className="text-center mb-12">
        <h1 className="font-display text-3xl font-bold text-neon-gradient tracking-[0.08em] uppercase mb-3">Новости</h1>
        <p className="text-body font-heading font-light">Обновления и события на платформе</p>
      </div>

      <div className="space-y-4">
        {NEWS_DATA.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.id} to={`/news/${item.id}`} className="card p-6 flex items-start gap-5 hover:border-[#00f5ff]/30 transition-all group block">
              <div className={`w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 ${item.color}`}>
                <Icon size={22} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <span className="flex items-center gap-1 text-xs text-muted"><Calendar size={12} /> {item.date}</span>
                  {item.tags.map(tag => (
                    <span key={tag} className="text-[10px] px-2 py-0.5 bg-[#00f5ff]/10 text-muted rounded-full border border-[#00f5ff]/20">{tag}</span>
                  ))}
                </div>
                <h2 className="text-base font-heading font-semibold text-heading mb-1 group-hover:text-[#00f5ff] transition-colors">{item.title}</h2>
                <p className="text-sm text-muted leading-relaxed">{item.summary}</p>
              </div>
              <ArrowRight size={18} className="text-muted group-hover:text-[#00f5ff] flex-shrink-0 mt-3 transition-colors" />
            </Link>
          );
        })}
      </div>

      <div className="text-center mt-12 text-sm text-muted">
        Следите за обновлениями в нашем{' '}
        <a href="https://t.me/vibecoding" target="_blank" className="text-[#00f5ff] hover:underline">Telegram канале</a>
      </div>
    </div>
  );
}

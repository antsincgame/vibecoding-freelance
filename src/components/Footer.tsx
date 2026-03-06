import { Link } from 'react-router-dom';
import { Zap, MessageCircle, Shield, Star, HelpCircle } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-gold/20 bg-deep-space relative z-[1] hidden md:block">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <Zap size={24} className="text-gold" />
              <span className="text-lg font-display font-bold tracking-wider text-gold-gradient">VIBECODER</span>
            </Link>
            <p className="text-sm text-muted leading-relaxed mb-4">Маркетплейс AI-разработчиков и вайб-кодеров нового поколения</p>
            <div className="flex items-center gap-3 text-xs text-muted">
              <Shield size={14} className="text-neon-cyan" />
              <span>Безопасные сделки</span>
            </div>
          </div>

          {/* For Buyers */}
          <div>
            <h4 className="text-sm font-heading font-semibold text-heading mb-4">Заказчикам</h4>
            <ul className="space-y-2.5">
              <li><Link to="/categories/all" className="text-sm text-muted hover:text-gold transition-colors">Каталог услуг</Link></li>
              <li><Link to="/projects" className="text-sm text-muted hover:text-gold transition-colors">Биржа проектов</Link></li>
              <li><Link to="/#how-it-works" className="text-sm text-muted hover:text-gold transition-colors">Как заказать</Link></li>
              <li><Link to="/faq" className="text-sm text-muted hover:text-gold transition-colors">FAQ</Link></li>
            </ul>
          </div>

          {/* For Sellers */}
          <div>
            <h4 className="text-sm font-heading font-semibold text-heading mb-4">Фрилансерам</h4>
            <ul className="space-y-2.5">
              <li><Link to="/for-sellers" className="text-sm text-muted hover:text-gold transition-colors">Стать фрилансером</Link></li>
              <li><Link to="/dashboard/create-gig" className="text-sm text-muted hover:text-gold transition-colors">Создать услугу</Link></li>
              <li><Link to="/dashboard/freelancer" className="text-sm text-muted hover:text-gold transition-colors">Панель продавца</Link></li>
              <li><Link to="/projects" className="text-sm text-muted hover:text-gold transition-colors">Найти проект</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-heading font-semibold text-heading mb-4">Компания</h4>
            <ul className="space-y-2.5">
              <li><Link to="/support" className="text-sm text-muted hover:text-gold transition-colors">Поддержка</Link></li>
              <li><Link to="/faq" className="text-sm text-muted hover:text-gold transition-colors">Вопросы и ответы</Link></li>
              <li><Link to="/terms" className="text-sm text-muted hover:text-gold transition-colors">Правила сервиса</Link></li>
              <li><Link to="/privacy" className="text-sm text-muted hover:text-gold transition-colors">Конфиденциальность</Link></li>
              <li><a href="https://vibecoding.by" target="_blank" className="text-sm text-muted hover:text-gold transition-colors">Школа VibeCoding</a></li>
              <li><a href="https://t.me/vibecoding" target="_blank" className="text-sm text-muted hover:text-gold transition-colors flex items-center gap-1"><MessageCircle size={12} /> Telegram</a></li>
            </ul>
          </div>
        </div>

        {/* Stats bar */}
        <div className="mt-12 pt-8 border-t border-gold/10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-6 text-xs text-muted">
            <span className="flex items-center gap-1"><Star size={12} className="text-gold" /> 500+ услуг</span>
            <span className="flex items-center gap-1"><Shield size={12} className="text-neon-cyan" /> Безопасные сделки</span>
            <span className="flex items-center gap-1"><Zap size={12} className="text-neon-green" /> 0% комиссия</span>
          </div>
          <p className="text-xs text-muted/60">© {new Date().getFullYear()} VibeCoder. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
}

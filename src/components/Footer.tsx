import { Link } from 'react-router-dom';
import { Zap, MessageCircle, Shield, Star } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-[rgba(0,245,255,0.08)] bg-[rgba(5,5,16,0.95)] relative z-[1] hidden md:block sacred-bg">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[rgba(0,245,255,0.3)] to-transparent" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[rgba(139,92,246,0.15)] to-transparent translate-y-[1px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <img src="/logo.png" alt="VibeCoder" className="h-10" />
            </Link>
            <p className="text-sm text-[rgba(200,220,255,0.5)] leading-relaxed mb-4">Маркетплейс AI-разработчиков нового поколения</p>
            <div className="flex items-center gap-3 text-xs text-[rgba(200,220,255,0.35)]">
              <Shield size={14} className="text-[#00f5ff]" style={{ filter: 'drop-shadow(0 0 6px rgba(0,245,255,0.5))' }} />
              <span>Безопасные сделки</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-[#00f5ff] mb-4 uppercase tracking-widest font-heading" style={{ textShadow: '0 0 10px rgba(0,245,255,0.3)' }}>Заказчикам</h4>
            <ul className="space-y-2.5">
              <li><Link to="/categories/all" className="text-sm text-[rgba(200,220,255,0.4)] hover:text-[#00f5ff] transition-colors">Каталог услуг</Link></li>
              <li><Link to="/projects" className="text-sm text-[rgba(200,220,255,0.4)] hover:text-[#00f5ff] transition-colors">Биржа проектов</Link></li>
              <li><Link to="/how-it-works" className="text-sm text-[rgba(200,220,255,0.4)] hover:text-[#00f5ff] transition-colors">Как это работает</Link></li>
              <li><Link to="/faq" className="text-sm text-[rgba(200,220,255,0.4)] hover:text-[#00f5ff] transition-colors">FAQ</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-[#8b5cf6] mb-4 uppercase tracking-widest font-heading" style={{ textShadow: '0 0 10px rgba(139,92,246,0.3)' }}>Фрилансерам</h4>
            <ul className="space-y-2.5">
              <li><Link to="/for-sellers" className="text-sm text-[rgba(200,220,255,0.4)] hover:text-[#8b5cf6] transition-colors">Стать фрилансером</Link></li>
              <li><Link to="/dashboard/create-gig" className="text-sm text-[rgba(200,220,255,0.4)] hover:text-[#8b5cf6] transition-colors">Создать услугу</Link></li>
              <li><Link to="/dashboard/freelancer" className="text-sm text-[rgba(200,220,255,0.4)] hover:text-[#8b5cf6] transition-colors">Панель продавца</Link></li>
              <li><Link to="/projects" className="text-sm text-[rgba(200,220,255,0.4)] hover:text-[#8b5cf6] transition-colors">Найти проект</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-[#f953c6] mb-4 uppercase tracking-widest font-heading" style={{ textShadow: '0 0 10px rgba(249,83,198,0.3)' }}>Компания</h4>
            <ul className="space-y-2.5">
              <li><Link to="/support" className="text-sm text-[rgba(200,220,255,0.4)] hover:text-[#f953c6] transition-colors">Поддержка</Link></li>
              <li><Link to="/news" className="text-sm text-[rgba(200,220,255,0.4)] hover:text-[#f953c6] transition-colors">Новости</Link></li>
              <li><Link to="/faq" className="text-sm text-[rgba(200,220,255,0.4)] hover:text-[#f953c6] transition-colors">Вопросы и ответы</Link></li>
              <li><Link to="/terms" className="text-sm text-[rgba(200,220,255,0.4)] hover:text-[#f953c6] transition-colors">Правила сервиса</Link></li>
              <li><Link to="/privacy" className="text-sm text-[rgba(200,220,255,0.4)] hover:text-[#f953c6] transition-colors">Конфиденциальность</Link></li>
              <li><a href="https://vibecoding.by" target="_blank" className="text-sm text-[rgba(200,220,255,0.4)] hover:text-[#f953c6] transition-colors">Школа VibeCoding</a></li>
              <li><a href="https://t.me/vibecoding" target="_blank" className="text-sm text-[rgba(200,220,255,0.4)] hover:text-[#00f5ff] transition-colors flex items-center gap-1"><MessageCircle size={12} /> Telegram</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-[rgba(0,245,255,0.06)] flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-6 text-xs text-[rgba(200,220,255,0.35)]">
            <span className="flex items-center gap-1"><Star size={12} className="text-[#00f5ff]" /> Каталог услуг</span>
            <span className="flex items-center gap-1"><Shield size={12} className="text-[#8b5cf6]" /> Безопасные сделки</span>
            <span className="flex items-center gap-1"><Zap size={12} className="text-[#00f5ff]" /> 0% комиссия</span>
          </div>
          <p className="text-xs text-[rgba(200,220,255,0.2)] font-mono">&copy; {new Date().getFullYear()} VibeCoder<span className="terminal-cursor" /></p>
        </div>
      </div>
    </footer>
  );
}

import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Menu, X, Zap, ChevronDown, Flame } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Button from './ui/Button';
import LanguageSwitcher from './LanguageSwitcher';
import { megaMenuCategories } from '../data/megaMenu';

interface HeaderProps {
  onOpenSearch: () => void;
}

export default function Header({ onOpenSearch }: HeaderProps) {
  const { t } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMega, setActiveMega] = useState<string | null>(null);
  const megaRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const location = useLocation();

  useEffect(() => {
    const handle = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handle, { passive: true });
    return () => window.removeEventListener('scroll', handle);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setActiveMega(null);
  }, [location]);

  const handleMegaEnter = (slug: string) => {
    clearTimeout(timeoutRef.current);
    setActiveMega(slug);
  };

  const handleMegaLeave = () => {
    timeoutRef.current = setTimeout(() => setActiveMega(null), 150);
  };

  const activeCat = megaMenuCategories.find((c) => c.slug === activeMega);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[rgba(5,5,16,0.97)] backdrop-blur-xl border-b border-[rgba(0,245,255,0.25)] shadow-[0_0_30px_rgba(0,245,255,0.15),0_0_60px_rgba(139,92,246,0.08)]'
          : 'bg-[rgba(5,5,16,0.8)] backdrop-blur-md border-b border-[rgba(0,245,255,0.08)]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2.5 flex-shrink-0 group">
            <div className="relative">
              <Zap
                size={22}
                className="text-[#00f5ff] transition-all duration-300 group-hover:text-[#8b5cf6] group-hover:drop-shadow-[0_0_20px_rgba(139,92,246,0.9)]"
                style={{ filter: 'drop-shadow(0 0 8px rgba(0,245,255,0.6))' }}
              />
              <div className="absolute inset-0 rounded-full bg-[#00f5ff]/5 group-hover:bg-[#8b5cf6]/15 blur-lg transition-all duration-500 scale-[2]" />
            </div>
            <span
              className="text-xl font-display font-bold tracking-wider text-neon-gradient glitch-text transition-all duration-300"
              data-text="VIBECODER"
            >
              VIBECODER
            </span>
          </Link>

          <button
            onClick={onOpenSearch}
            className="hidden md:flex items-center gap-2 bg-[rgba(0,245,255,0.03)] border border-[rgba(0,245,255,0.15)] rounded px-4 py-2 text-sm text-muted hover:border-[rgba(0,245,255,0.5)] hover:bg-[rgba(0,245,255,0.06)] hover:shadow-[0_0_25px_rgba(0,245,255,0.15)] transition-all duration-300 cursor-pointer w-72"
          >
            <Search size={16} className="text-[#00f5ff]/60" />
            <span className="tracking-wide">{t('header.find_services')}</span>
            <kbd className="ml-auto text-[10px] bg-[rgba(0,245,255,0.06)] px-1.5 py-0.5 rounded border border-[rgba(0,245,255,0.15)] font-mono text-[rgba(0,245,255,0.35)]">⌘K</kbd>
          </button>

          <div className="hidden md:flex items-center gap-3">
            <LanguageSwitcher />
            <Link to="/auth">
              <Button variant="ghost" size="sm">{t('common.login')}</Button>
            </Link>
            <Link to="/auth">
              <Button variant="primary" size="sm">{t('common.register')}</Button>
            </Link>
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-muted hover:text-[#00f5ff] transition-colors cursor-pointer"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <div className="hidden md:block border-t border-[rgba(0,245,255,0.08)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-0 overflow-x-auto" ref={megaRef}>
            {megaMenuCategories.map((cat) => (
              <div
                key={cat.slug}
                className="relative"
                onMouseEnter={() => handleMegaEnter(cat.slug)}
                onMouseLeave={handleMegaLeave}
              >
                <button
                  className={`flex items-center gap-1 px-4 py-3 text-sm whitespace-nowrap tracking-wide transition-all duration-200 cursor-pointer ${
                    activeMega === cat.slug
                      ? 'text-[#00f5ff] border-b-2 border-[#00f5ff] shadow-[0_2px_12px_rgba(0,245,255,0.4)]'
                      : 'text-[rgba(200,220,255,0.6)] hover:text-white'
                  }`}
                >
                  {cat.label}
                  <ChevronDown size={11} className={`transition-transform ${activeMega === cat.slug ? 'rotate-180' : ''}`} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {activeCat && (
        <div
          className="hidden md:block absolute left-0 right-0 bg-[rgba(5,5,16,0.98)] backdrop-blur-xl border-t border-[rgba(0,245,255,0.1)] shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_40px_rgba(0,245,255,0.06)] z-50"
          onMouseEnter={() => { clearTimeout(timeoutRef.current); setActiveMega(activeCat.slug); }}
          onMouseLeave={handleMegaLeave}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-4 gap-x-8 gap-y-6">
              {activeCat.sections.map((section) => (
                <div key={section.title}>
                  <h4 className="text-sm font-heading font-semibold text-[#00f5ff]/80 mb-3 uppercase tracking-wider">{section.title}</h4>
                  <ul className="space-y-1.5">
                    {section.items.map((item) => (
                      <li key={item.slug}>
                        <Link
                          to={`/categories/${item.slug}`}
                          className="flex items-center gap-2 text-sm text-body hover:text-[#00f5ff] transition-colors group"
                          onClick={() => setActiveMega(null)}
                        >
                          <span className="group-hover:translate-x-1 transition-transform">{item.label}</span>
                          {item.isNew && (
                            <span className="px-1.5 py-0.5 text-[10px] font-bold bg-[#00f5ff]/20 text-[#00f5ff] rounded uppercase leading-none border border-[#00f5ff]/30">new</span>
                          )}
                          {item.isHot && (
                            <Flame size={12} className="text-neon-rose" />
                          )}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {mobileOpen && (
        <div className="md:hidden bg-deep-space border-t border-[#00f5ff]/20">
          <div className="px-4 py-4 space-y-3">
            <button
              onClick={() => { onOpenSearch(); setMobileOpen(false); }}
              className="flex items-center gap-2 w-full bg-[#00f5ff]/10 border border-[#00f5ff]/20 rounded-lg px-4 py-3 text-sm text-muted cursor-pointer"
            >
              <Search size={16} className="text-[#00f5ff]/50" />
              <span>{t('header.find_services')}...</span>
            </button>
            <div className="space-y-1">
              {megaMenuCategories.map((cat) => (
                <Link
                  key={cat.slug}
                  to={`/categories/${cat.sections[0]?.items[0]?.slug || 'web-development'}`}
                  className="block px-3 py-2.5 text-sm text-body hover:text-[#00f5ff] hover:bg-[#00f5ff]/10 rounded-lg transition-colors"
                >
                  {cat.label}
                </Link>
              ))}
            </div>
            <div className="flex items-center justify-center py-2">
              <LanguageSwitcher />
            </div>
            <div className="flex gap-3 pt-2 border-t border-[#00f5ff]/20">
              <Link to="/auth" className="flex-1">
                <Button variant="secondary" size="md" className="w-full">{t('common.login')}</Button>
              </Link>
              <Link to="/auth" className="flex-1">
                <Button variant="primary" size="md" className="w-full">{t('common.register')}</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

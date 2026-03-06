import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Search, ArrowRight, X } from 'lucide-react';
import { useCategories, useSearch } from '../hooks/useData';
import { popularSearches } from '../lib/freelance-db';

interface CommandPaletteProps { isOpen: boolean; onClose: () => void; }

export default function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { data: categories } = useCategories();
  const { results: searchResults } = useSearch(query);

  useEffect(() => { if (isOpen) { setQuery(''); setTimeout(() => inputRef.current?.focus(), 50); } }, [isOpen]);
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); if (isOpen) onClose(); else document.dispatchEvent(new CustomEvent('open-search')); }
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredCategories = query
    ? (categories || []).filter((c) => c.name.toLowerCase().includes(query.toLowerCase())).slice(0, 3)
    : (categories || []).slice(0, 4);

  const handleSearchSubmit = () => { if (query.trim()) { navigate(`/categories/all?search=${encodeURIComponent(query.trim())}`); onClose(); } };

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div className="relative w-full max-w-2xl mx-4 bg-[#12121f] border border-[rgba(255,215,0,0.12)] rounded-lg shadow-[0_20px_60px_rgba(0,0,0,0.6),0_0_40px_rgba(255,215,0,0.04)] overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 px-5 py-4 border-b border-[rgba(255,215,0,0.08)]">
          <Search size={20} className="text-[#ffd700]/50 flex-shrink-0" />
          <input ref={inputRef} value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit()} placeholder={t('header.search_placeholder')} className="flex-1 bg-transparent text-white placeholder:text-[rgba(255,255,255,0.3)] text-base outline-none" />
          <button onClick={onClose} className="text-[rgba(255,255,255,0.3)] hover:text-white transition-colors cursor-pointer"><X size={18} /></button>
        </div>
        <div className="max-h-[60vh] overflow-y-auto p-2">
          {!query && (
            <div className="px-3 py-2">
              <p className="text-xs font-medium text-[rgba(255,255,255,0.35)] uppercase tracking-widest mb-2 font-heading">{t('header.popular_searches')}</p>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((s) => (<button key={s} onClick={() => setQuery(s)} className="px-3 py-1.5 text-sm bg-[rgba(255,215,0,0.04)] text-[rgba(255,255,255,0.6)] rounded border border-[rgba(255,215,0,0.1)] hover:border-[rgba(255,215,0,0.3)] hover:text-[#ffd700] transition-all cursor-pointer">{s}</button>))}
              </div>
            </div>
          )}
          {filteredCategories.length > 0 && (
            <div className="px-3 py-2">
              <p className="text-xs font-medium text-[rgba(255,255,255,0.35)] uppercase tracking-widest mb-2 font-heading">{query ? t('home.categories') : t('home.all_categories')}</p>
              {filteredCategories.map((cat) => (
                <button key={cat.slug} onClick={() => { navigate(`/categories/${cat.slug}`); onClose(); }} className="flex items-center justify-between w-full px-3 py-2.5 rounded text-sm text-[rgba(255,255,255,0.6)] hover:bg-[rgba(255,215,0,0.05)] hover:text-[#ffd700] transition-colors cursor-pointer">
                  <span>{cat.name}</span><span className="flex items-center gap-1 text-[rgba(255,255,255,0.3)]"><span className="font-mono text-xs">{cat.gigCount}</span><ArrowRight size={14} /></span>
                </button>
              ))}
            </div>
          )}
          {query && searchResults.length > 0 && (
            <div className="px-3 py-2">
              <p className="text-xs font-medium text-[rgba(255,255,255,0.35)] uppercase tracking-widest mb-2 font-heading">{t('profile.gigs')}</p>
              {searchResults.slice(0, 5).map((gig) => (
                <button key={gig.id} onClick={() => { navigate(`/gigs/${gig.id}`); onClose(); }} className="flex items-center gap-3 w-full px-3 py-2.5 rounded text-left hover:bg-[rgba(255,215,0,0.05)] transition-colors cursor-pointer">
                  <img src={gig.image} alt="" className="w-10 h-10 rounded object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0"><p className="text-sm text-white truncate">{gig.title}</p><p className="text-xs text-[rgba(255,255,255,0.35)]">{gig.freelancer.name}</p></div>
                  <span className="text-sm font-mono text-[#ffd700] flex-shrink-0">{gig.packages.economy.price.toLocaleString('ru-RU')} ₽</span>
                </button>
              ))}
            </div>
          )}
          {query && searchResults.length === 0 && filteredCategories.length === 0 && (
            <div className="px-3 py-8 text-center"><p className="text-[rgba(255,255,255,0.35)] text-sm">{t('common.nothing_found')} &ldquo;{query}&rdquo;</p></div>
          )}
        </div>
        <div className="px-5 py-3 border-t border-[rgba(255,215,0,0.08)] flex items-center gap-4 text-xs text-[rgba(255,255,255,0.3)]">
          <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 bg-[rgba(255,215,0,0.06)] rounded border border-[rgba(255,215,0,0.1)] font-mono text-[10px]">Enter</kbd></span>
          <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 bg-[rgba(255,215,0,0.06)] rounded border border-[rgba(255,215,0,0.1)] font-mono text-[10px]">Esc</kbd></span>
        </div>
      </div>
    </div>
  );
}

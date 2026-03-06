import SEO from "../components/SEO";
import { useState, useMemo } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { SlidersHorizontal, ChevronDown, X } from 'lucide-react';
import GigCard from '../components/GigCard';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import Button from '../components/ui/Button';
import Skeleton from '../components/ui/Skeleton';
import { useGigs, useCategory } from '../hooks/useData';

const techFilters = ['React', 'Next.js', 'TypeScript', 'Python', 'Node.js', 'Telegram', 'OpenAI', 'PostgreSQL', 'Docker', 'Figma'];

export default function Category() {
  const { t } = useTranslation();
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const isAll = slug === 'all';

  const { data: category } = useCategory(isAll ? undefined : slug);
  const { data: allGigs, loading } = useGigs(isAll ? { search: searchQuery || undefined } : { category_slug: slug });

  const [sort, setSort] = useState('popular');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [minRating, setMinRating] = useState(0);
  const [selectedTechs, setSelectedTechs] = useState<string[]>([]);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 12;

  // Reset page on filter/slug change
  const resetPage = () => setPage(1);

  const sortOptions = [
    { value: 'popular', label: t('category.popular') },
    { value: 'new', label: t('category.new') },
    { value: 'cheap', label: t('category.cheap') },
    { value: 'expensive', label: t('category.expensive') },
    { value: 'rating', label: t('category.rating') },
  ];

  const categoryGigs = useMemo(() => {
    let filtered = allGigs || [];
    if (priceMin) filtered = filtered.filter((g) => g.packages.economy.price >= Number(priceMin));
    if (priceMax) filtered = filtered.filter((g) => g.packages.economy.price <= Number(priceMax));
    if (minRating > 0) filtered = filtered.filter((g) => g.rating >= minRating);
    if (selectedTechs.length > 0) filtered = filtered.filter((g) => g.tags.some((tag) => selectedTechs.includes(tag)));
    if (searchQuery && isAll) filtered = filtered.filter((g) => g.title.toLowerCase().includes(searchQuery.toLowerCase()) || g.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));
    switch (sort) {
      case 'cheap': return [...filtered].sort((a, b) => a.packages.economy.price - b.packages.economy.price);
      case 'expensive': return [...filtered].sort((a, b) => b.packages.economy.price - a.packages.economy.price);
      case 'rating': return [...filtered].sort((a, b) => b.rating - a.rating);
      case 'new': return [...filtered].reverse();
      default: return filtered;
    }
  }, [allGigs, sort, priceMin, priceMax, minRating, selectedTechs, searchQuery, isAll]);

  const toggleTech = (tech: string) => setSelectedTechs((prev) => prev.includes(tech) ? prev.filter((t) => t !== tech) : [...prev, tech]);

  const catName = isAll ? (searchQuery ? `Поиск: ${searchQuery}` : 'Все услуги') : (category?.name || slug || '');
  const catDesc = isAll ? '' : (category?.description || '');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-8">
      <SEO title={catName} description={catDesc || `Услуги в категории ${catName}`} />
      <Breadcrumbs items={[{ label: t('category.home'), href: '/' }, { label: t('category.categories'), href: '/' }, { label: catName }]} />
      <div className="mt-6 mb-8">
        <h1 className="font-display text-3xl font-bold text-gold-gradient tracking-[0.08em] uppercase mb-2">{catName}</h1>
        {catDesc && <p className="text-body">{catDesc}</p>}
      </div>
      <div className="flex items-center justify-between mb-6 gap-4">
        <button onClick={() => setFiltersOpen(!filtersOpen)} className="lg:hidden flex items-center gap-2 px-4 py-2 bg-gold/10 border border-gold/30 rounded-xl text-sm text-body hover:text-heading transition-colors cursor-pointer">
          <SlidersHorizontal size={16} /> {t('category.filters')}
          {(selectedTechs.length > 0 || minRating > 0 || priceMin || priceMax) && <span className="w-2 h-2 bg-gold rounded-full" />}
        </button>
        <div className="flex items-center gap-2 ml-auto">
          <span className="text-sm text-muted hidden sm:inline">{t('category.sort')}</span>
          <div className="relative">
            <select value={sort} onChange={(e) => { setSort(e.target.value); resetPage(); }} className="bg-nebula-light border border-gold/30 rounded-xl px-4 py-2 pr-8 text-sm text-body appearance-none cursor-pointer focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/40">
              {sortOptions.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
          </div>
        </div>
      </div>
      <div className="flex gap-8">
        <aside className={`${filtersOpen ? 'fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:static lg:bg-transparent lg:backdrop-blur-none' : 'hidden'} lg:block lg:w-64 flex-shrink-0`}>
          <div className={`${filtersOpen ? 'absolute right-0 top-0 h-full w-80 bg-deep-space p-6 overflow-y-auto shadow-xl border-l border-gold/20' : ''} lg:static lg:w-auto lg:bg-transparent lg:p-0 lg:shadow-none lg:border-0 space-y-6`}>
            {filtersOpen && (<div className="flex items-center justify-between lg:hidden mb-4"><h3 className="text-lg font-heading font-semibold text-heading">{t('category.filters')}</h3><button onClick={() => setFiltersOpen(false)} className="text-muted hover:text-heading cursor-pointer"><X size={20} /></button></div>)}
            <div>
              <h4 className="text-sm font-heading font-medium text-heading mb-3">{t('category.price')}</h4>
              <div className="flex gap-2">
                <input type="number" placeholder={t('category.price_from')} value={priceMin} onChange={(e) => { setPriceMin(e.target.value); resetPage(); }} className="w-full bg-gold/10 border border-gold/30 rounded-lg px-3 py-2 text-sm text-heading placeholder:text-muted focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/40 font-mono" />
                <input type="number" placeholder={t('category.price_to')} value={priceMax} onChange={(e) => { setPriceMax(e.target.value); resetPage(); }} className="w-full bg-gold/10 border border-gold/30 rounded-lg px-3 py-2 text-sm text-heading placeholder:text-muted focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/40 font-mono" />
              </div>
            </div>
            <div>
              <h4 className="text-sm font-heading font-medium text-heading mb-3">{t('category.min_rating')}</h4>
              <div className="flex gap-2">
                {[0, 3, 4, 4.5].map((r) => (<button key={r} onClick={() => { setMinRating(r); resetPage(); }} className={`px-3 py-1.5 text-sm rounded-lg border transition-all cursor-pointer ${minRating === r ? 'border-gold bg-gold/10 text-gold' : 'border-gold/20 bg-gold/10 text-muted hover:text-body'}`}>{r === 0 ? t('common.all') : `${r}+`}</button>))}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-heading font-medium text-heading mb-3">{t('category.technologies')}</h4>
              <div className="flex flex-wrap gap-2">
                {techFilters.map((tech) => (<button key={tech} onClick={() => toggleTech(tech)} className={`px-3 py-1.5 text-xs rounded-lg border transition-all cursor-pointer ${selectedTechs.includes(tech) ? 'border-gold bg-gold/10 text-gold' : 'border-gold/20 bg-gold/10 text-muted hover:text-body'}`}>{tech}</button>))}
              </div>
            </div>
            {filtersOpen && <Button variant="primary" size="md" className="w-full lg:hidden" onClick={() => setFiltersOpen(false)}>{t('common.apply')}</Button>}
          </div>
        </aside>
        <div className="flex-1 min-w-0">
          {loading ? (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (<div key={i} className="card overflow-hidden"><Skeleton className="aspect-video" /><div className="p-4 space-y-3"><Skeleton className="h-4 w-full" /><Skeleton className="h-3 w-2/3" /></div></div>))}
            </div>
          ) : (
            <>
              <div className="text-sm text-muted mb-4">{categoryGigs.length} услуг найдено</div>
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {categoryGigs.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE).map((gig, i) => <GigCard key={gig.id} gig={gig} index={i} />)}
              </div>
              {categoryGigs.length === 0 && (
                <div className="text-center py-20">
                  <p className="text-muted text-lg">{t('common.nothing_found')}</p>
                  <p className="text-muted text-sm mt-2">{t('common.try_change_filters')}</p>
                </div>
              )}
              {categoryGigs.length > ITEMS_PER_PAGE && (
                <div className="flex justify-center gap-2 mt-12">
                  {Array.from({ length: Math.ceil(categoryGigs.length / ITEMS_PER_PAGE) }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => { setPage(i + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                      className={`w-10 h-10 rounded-xl text-sm font-mono transition-all cursor-pointer ${page === i + 1 ? 'border border-gold bg-gold/10 text-gold' : 'border border-gold/20 text-muted hover:text-body'}`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

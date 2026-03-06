import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, Flame } from 'lucide-react';
import { megaMenuCategories } from '../data/megaMenu';

export default function CategoriesBar() {
  const [activeMega, setActiveMega] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const location = useLocation();

  useEffect(() => {
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
    <div className="fixed top-[var(--header-height,60px)] left-0 right-0 z-40 bg-void/95 backdrop-blur-xl border-t border-b border-[#00f5ff]/20">
      {/* Categories row */}
      <div className="hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-0 overflow-x-auto">
            {megaMenuCategories.map((cat) => (
              <div
                key={cat.slug}
                className="relative"
                onMouseEnter={() => handleMegaEnter(cat.slug)}
                onMouseLeave={handleMegaLeave}
              >
                <button
                  className={`flex items-center gap-1 px-4 py-3 text-sm whitespace-nowrap transition-all cursor-pointer ${
                    activeMega === cat.slug
                      ? 'text-[#00f5ff] border-b-2 border-[#00f5ff]'
                      : 'text-body hover:text-heading'
                  }`}
                >
                  {cat.label}
                  <ChevronDown size={12} className={`transition-transform ${activeMega === cat.slug ? 'rotate-180' : ''}`} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mega dropdown */}
      {activeCat && (
        <div
          className="hidden md:block absolute left-0 right-0 border-t border-[#00f5ff]/20 shadow-2xl z-50" style={{ background: "rgba(10,10,20,0.99)", backdropFilter: "blur(20px)", boxShadow: "0 20px 60px rgba(0,0,0,0.8), 0 0 30px rgba(0,255,249,0.1)" }}
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
    </div>
  );
}

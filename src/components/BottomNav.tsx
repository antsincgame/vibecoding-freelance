import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Home, Search, Briefcase, MessageCircle, User } from 'lucide-react';

interface BottomNavProps {
  onOpenSearch: () => void;
}

export default function BottomNav({ onOpenSearch }: BottomNavProps) {
  const { t } = useTranslation();
  const location = useLocation();

  const navItems = [
    { icon: Home, label: t('category.home'), href: '/' },
    { icon: Search, label: t('common.search'), href: '#search' },
    { icon: Briefcase, label: 'Проекты', href: '/projects' },
    { icon: MessageCircle, label: 'Чат', href: '/chat' },
    { icon: User, label: t('common.profile'), href: '/dashboard' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-[#0a0a0f]/95 backdrop-blur-xl border-t border-[rgba(255,215,0,0.08)]">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const isActive = item.href !== '#search' && location.pathname === item.href;
          const Icon = item.icon;

          if (item.href === '#search') {
            return (
              <button
                key={item.label}
                onClick={onOpenSearch}
                className="flex flex-col items-center gap-1 px-3 py-1 cursor-pointer"
              >
                <Icon size={20} className="text-[rgba(255,255,255,0.35)]" />
                <span className="text-[10px] text-[rgba(255,255,255,0.35)]">{item.label}</span>
              </button>
            );
          }

          return (
            <Link
              key={item.label}
              to={item.href}
              className="flex flex-col items-center gap-1 px-3 py-1"
            >
              <Icon size={20} className={isActive ? 'text-[#ffd700]' : 'text-[rgba(255,255,255,0.35)]'} />
              <span className={`text-[10px] ${isActive ? 'text-[#ffd700] font-medium' : 'text-[rgba(255,255,255,0.35)]'}`}>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

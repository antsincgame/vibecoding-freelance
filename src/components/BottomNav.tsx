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
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-[rgba(5,5,16,0.96)] backdrop-blur-xl border-t border-[rgba(0,245,255,0.12)]">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[rgba(0,245,255,0.3)] to-transparent" />
      <div className="flex items-center justify-around h-16 px-1 max-w-full">
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
                <Icon size={20} className="text-[rgba(200,220,255,0.35)]" />
                <span className="text-[10px] text-[rgba(200,220,255,0.35)]">{item.label}</span>
              </button>
            );
          }

          return (
            <Link
              key={item.label}
              to={item.href}
              className="flex flex-col items-center gap-1 px-3 py-1"
            >
              <Icon
                size={20}
                className={isActive ? 'text-[#00f5ff]' : 'text-[rgba(200,220,255,0.35)]'}
                style={isActive ? { filter: 'drop-shadow(0 0 8px rgba(0,245,255,0.6))' } : undefined}
              />
              <span className={`text-[10px] ${isActive ? 'text-[#00f5ff] font-medium' : 'text-[rgba(200,220,255,0.35)]'}`}>{item.label}</span>
              {isActive && <span className="absolute bottom-0 w-8 h-0.5 bg-[#00f5ff] shadow-[0_0_10px_rgba(0,245,255,0.5)] rounded-full" />}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

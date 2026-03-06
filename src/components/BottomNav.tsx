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
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-void/95 backdrop-blur-xl border-t border-gold/20">
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
                <Icon size={20} className="text-muted" />
                <span className="text-[10px] text-muted">{item.label}</span>
              </button>
            );
          }

          return (
            <Link
              key={item.label}
              to={item.href}
              className="flex flex-col items-center gap-1 px-3 py-1"
            >
              <Icon size={20} className={isActive ? 'text-gold' : 'text-muted'} />
              <span className={`text-[10px] ${isActive ? 'text-gold font-medium' : 'text-muted'}`}>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

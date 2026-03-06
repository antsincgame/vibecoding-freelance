import { useState, useEffect } from 'react';
import { Link, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '@vibecoding/shared';
import { LayoutDashboard, FolderTree, Package, Users, ShoppingBag, Star, Settings, ArrowLeft, Shield, HeadphonesIcon } from 'lucide-react';
import { isAdmin } from '../../lib/admin-api';

const navItems = [
  { path: '/admin', icon: LayoutDashboard, label: 'Дашборд' },
  { path: '/admin/categories', icon: FolderTree, label: 'Категории' },
  { path: '/admin/gigs', icon: Package, label: 'Гиги' },
  { path: '/admin/users', icon: Users, label: 'Пользователи' },
  { path: '/admin/orders', icon: ShoppingBag, label: 'Заказы' },
  { path: '/admin/reviews', icon: Star, label: 'Отзывы' },
  { path: '/admin/tickets', icon: HeadphonesIcon, label: 'Поддержка' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const location = useLocation();

  useEffect(() => {
    if (!user) return;
    isAdmin().then(setAuthorized);
  }, [user]);

  if (loading || authorized === null) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-gold animate-pulse text-lg">Загрузка...</div>
    </div>
  );

  if (!user) return <Navigate to="/auth" replace />;
  if (!authorized) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="card p-8 text-center space-y-4">
        <Shield size={48} className="text-neon-rose mx-auto" />
        <h1 className="text-xl font-bold text-heading">Доступ запрещён</h1>
        <p className="text-muted text-sm">У вас нет прав администратора</p>
        <Link to="/" className="text-gold text-sm hover:underline">← На главную</Link>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-nebula border-r border-gold/20 flex-shrink-0 hidden lg:flex flex-col">
        <div className="p-5 border-b border-gold/20">
          <Link to="/" className="flex items-center gap-2 text-gold hover:opacity-80 transition-opacity">
            <ArrowLeft size={16} />
            <span className="text-sm">На сайт</span>
          </Link>
          <h1 className="text-lg font-display font-bold text-gold-gradient tracking-wider mt-3">ADMIN</h1>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${active ? 'bg-gold/10 text-gold' : 'text-muted hover:text-body hover:bg-gold/5'}`}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-gold/20">
          <div className="text-xs text-muted">{user.email}</div>
        </div>
      </aside>

      {/* Mobile nav */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-nebula border-t border-gold/20 flex">
        {navItems.slice(0, 6).map((item) => {
          const active = location.pathname === item.path;
          return (
            <Link key={item.path} to={item.path} className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs transition-all ${active ? 'text-gold' : 'text-muted'}`}>
              <item.icon size={18} />
              <span className="truncate">{item.label.slice(0, 6)}</span>
            </Link>
          );
        })}
      </div>

      {/* Content */}
      <main className="flex-1 min-w-0 bg-void">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 pb-24 lg:pb-6">
          {children}
        </div>
      </main>
    </div>
  );
}

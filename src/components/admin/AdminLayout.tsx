import { useState, useEffect } from 'react';
import { Link, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '@vibecoding/shared';
import { LayoutDashboard, FolderTree, Package, Users, ShoppingBag, Star, ArrowLeft, Shield, HeadphonesIcon, MessageCircle } from 'lucide-react';
import { getAdminRole, type AdminRole } from '../../lib/admin-api';

const allNavItems = [
  { path: '/admin', icon: LayoutDashboard, label: 'Дашборд', roles: ['admin', 'moderator'] },
  { path: '/admin/categories', icon: FolderTree, label: 'Категории', roles: ['admin'] },
  { path: '/admin/gigs', icon: Package, label: 'Модерация', roles: ['admin', 'moderator'] },
  { path: '/admin/users', icon: Users, label: 'Пользователи', roles: ['admin', 'moderator'] },
  { path: '/admin/orders', icon: ShoppingBag, label: 'Заказы', roles: ['admin'] },
  { path: '/admin/reviews', icon: Star, label: 'Отзывы', roles: ['admin', 'moderator'] },
  { path: '/admin/tickets', icon: HeadphonesIcon, label: 'Поддержка', roles: ['admin', 'moderator'] },
  { path: '/admin/chat', icon: MessageCircle, label: 'Чат', roles: ['admin', 'moderator'] },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const [role, setRole] = useState<AdminRole | 'loading'>('loading');
  const location = useLocation();

  useEffect(() => {
    if (!user) return;
    getAdminRole().then(r => setRole(r));
  }, [user]);

  if (loading || role === 'loading') return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-[#00f5ff] animate-pulse text-lg">Загрузка...</div>
    </div>
  );

  if (!user) return <Navigate to="/auth" replace />;
  if (!role) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="card p-8 text-center space-y-4">
        <Shield size={48} className="text-neon-rose mx-auto" />
        <h1 className="text-xl font-bold text-heading">Доступ запрещён</h1>
        <p className="text-muted text-sm">У вас нет прав администратора или модератора</p>
        <Link to="/" className="text-[#00f5ff] text-sm hover:underline">← На главную</Link>
      </div>
    </div>
  );

  const navItems = allNavItems.filter(item => item.roles.includes(role));

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-nebula border-r border-[#00f5ff]/20 flex-shrink-0 hidden lg:flex flex-col">
        <div className="p-5 border-b border-[#00f5ff]/20">
          <Link to="/" className="flex items-center gap-2 text-[#00f5ff] hover:opacity-80 transition-opacity">
            <ArrowLeft size={16} />
            <span className="text-sm">На сайт</span>
          </Link>
          <div className="flex items-center gap-2 mt-3">
            <h1 className="text-lg font-display font-bold text-neon-gradient tracking-wider">ADMIN</h1>
            {role === 'moderator' && <span className="text-[10px] bg-accent-violet/20 text-accent-violet px-2 py-0.5 rounded-full border border-accent-violet/30">MOD</span>}
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${active ? 'bg-[#00f5ff]/10 text-[#00f5ff]' : 'text-muted hover:text-body hover:bg-[#00f5ff]/5'}`}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-[#00f5ff]/20">
          <div className="text-xs text-muted">{user.email}</div>
          <div className="text-[10px] text-[#00f5ff] mt-0.5">{role === 'admin' ? 'Администратор' : 'Модератор'}</div>
        </div>
      </aside>

      {/* Mobile nav */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-nebula border-t border-[#00f5ff]/20 flex">
        {navItems.slice(0, 6).map((item) => {
          const active = location.pathname === item.path;
          return (
            <Link key={item.path} to={item.path} className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs transition-all ${active ? 'text-[#00f5ff]' : 'text-muted'}`}>
              <item.icon size={18} />
              <span className="truncate text-[10px]">{item.label.slice(0, 8)}</span>
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

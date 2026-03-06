import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Users, ShoppingBag, Star, FolderTree, TrendingUp } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { getAdminStats } from '../../lib/admin-api';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => { getAdminStats().then(setStats); }, []);

  const cards = stats ? [
    { label: 'Гиги', value: stats.gigsCount, icon: Package, color: 'text-[#00f5ff]', link: '/admin/gigs' },
    { label: 'Пользователи', value: stats.profilesCount, icon: Users, color: 'text-neon-cyan', link: '/admin/users' },
    { label: 'Заказы', value: stats.ordersCount, icon: ShoppingBag, color: 'text-accent-violet', link: '/admin/orders' },
    { label: 'Отзывы', value: stats.reviewsCount, icon: Star, color: 'text-[#00f5ff]', link: '/admin/reviews' },
    { label: 'Категории', value: stats.categoriesCount, icon: FolderTree, color: 'text-neon-green', link: '/admin/categories' },
  ] : [];

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold text-heading mb-6">Панель управления</h1>

      {!stats ? (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => <div key={i} className="card p-6 animate-pulse"><div className="h-8 bg-[#00f5ff]/10 rounded mb-2" /><div className="h-4 bg-[#00f5ff]/10 rounded w-1/2" /></div>)}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {cards.map((card) => (
            <Link key={card.label} to={card.link} className="card p-6 hover:border-[#00f5ff]/30 transition-all group">
              <div className="flex items-center gap-3 mb-3">
                <card.icon size={22} className={card.color} />
                <span className="text-sm text-muted group-hover:text-body transition-colors">{card.label}</span>
              </div>
              <p className="text-3xl font-bold text-heading font-mono">{card.value}</p>
            </Link>
          ))}
        </div>
      )}

      <div className="mt-8 grid lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-heading mb-4">Быстрые действия</h2>
          <div className="space-y-2">
            <Link to="/admin/categories" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#00f5ff]/5 transition-colors text-sm text-body">
              <FolderTree size={16} className="text-[#00f5ff]" /> Управление категориями
            </Link>
            <Link to="/admin/gigs" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#00f5ff]/5 transition-colors text-sm text-body">
              <Package size={16} className="text-[#00f5ff]" /> Модерация гигов
            </Link>
            <Link to="/admin/users" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#00f5ff]/5 transition-colors text-sm text-body">
              <Users size={16} className="text-[#00f5ff]" /> Управление пользователями
            </Link>
          </div>
        </div>
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-heading mb-4">Статус платформы</h2>
          <div className="space-y-3">
            <div className="flex justify-between text-sm"><span className="text-muted">Appwrite</span><span className="text-neon-green">Online</span></div>
            <div className="flex justify-between text-sm"><span className="text-muted">База данных</span><span className="text-neon-green">vibecoding</span></div>
            <div className="flex justify-between text-sm"><span className="text-muted">Документов</span><span className="text-body font-mono">{stats ? Object.values(stats).reduce((a: number, b: any) => a + (b || 0), 0) : 0}</span></div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

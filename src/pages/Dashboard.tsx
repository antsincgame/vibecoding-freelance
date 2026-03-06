import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LayoutDashboard, ShoppingBag, MessageCircle, Heart, Settings, TrendingUp, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import Avatar from '../components/ui/Avatar';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import GigCard from '../components/GigCard';
import Skeleton from '../components/ui/Skeleton';
import { useMyOrders, useFavoriteGigs, useConversations } from '../hooks/useData';
import { useAuth } from '@vibecoding/shared';
import { updateFreelancerProfile } from '../lib/freelance-db';
import type { Order } from '../types';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const { t } = useTranslation();
  const { user, profile } = useAuth();
  const [activeSection, setActiveSection] = useState('overview');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const { data: orders, loading: ordersLoading } = useMyOrders('buyer');
  const { data: conversations } = useConversations();
  const { data: favoriteGigs, loading: favsLoading } = useFavoriteGigs();

  const [settingsForm, setSettingsForm] = useState({ name: profile?.full_name || '', city: '' });

  const statusConfig: Record<Order['status'], { label: string; variant: 'green' | 'violet' | 'emerald' | 'blue' }> = {
    new: { label: t('dashboard.status_new'), variant: 'green' },
    in_progress: { label: t('dashboard.status_in_progress'), variant: 'violet' },
    delivered: { label: t('dashboard.status_delivered'), variant: 'emerald' },
    completed: { label: t('dashboard.status_completed'), variant: 'blue' },
  };

  const sidebarItems = [
    { id: 'overview', icon: LayoutDashboard, label: t('dashboard.overview') },
    { id: 'orders', icon: ShoppingBag, label: t('dashboard.my_orders') },
    { id: 'messages', icon: MessageCircle, label: t('dashboard.messages') },
    { id: 'favorites', icon: Heart, label: t('dashboard.favorites') },
    { id: 'settings', icon: Settings, label: t('dashboard.settings') },
  ];

  const allOrders = orders || [];
  const filteredOrders = statusFilter === 'all' ? allOrders : allOrders.filter((o) => o.status === statusFilter);

  const stats = [
    { label: t('dashboard.active'), value: allOrders.filter((o) => o.status === 'in_progress').length, icon: Clock, color: 'text-accent-violet' },
    { label: t('dashboard.completed'), value: allOrders.filter((o) => o.status === 'completed').length, icon: CheckCircle2, color: 'text-accent-emerald' },
    { label: t('dashboard.total_orders'), value: allOrders.length, icon: TrendingUp, color: 'text-gold' },
    { label: t('dashboard.pending'), value: allOrders.filter((o) => o.status === 'new' || o.status === 'delivered').length, icon: AlertCircle, color: 'text-accent-amber' },
  ];

  const handleSaveSettings = async () => {
    const ok = await updateFreelancerProfile({ name: settingsForm.name, location: settingsForm.city });
    if (ok) toast.success('Сохранено'); else toast.error('Ошибка');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-8">
      <div className="flex gap-8">
        <aside className="hidden lg:block w-56 flex-shrink-0">
          <nav className="card p-3 space-y-1 sticky top-24">
            {sidebarItems.map((item) => (
              <button key={item.id} onClick={() => setActiveSection(item.id)} className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm transition-all cursor-pointer ${activeSection === item.id ? 'bg-gold/10 text-gold' : 'text-muted hover:text-body hover:bg-gold/10'}`}>
                <item.icon size={18} />{item.label}
              </button>
            ))}
          </nav>
        </aside>
        <div className="flex-1 min-w-0">
          <div className="lg:hidden flex gap-2 mb-6 overflow-x-auto pb-2">
            {sidebarItems.map((item) => (
              <button key={item.id} onClick={() => setActiveSection(item.id)} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm whitespace-nowrap transition-all cursor-pointer ${activeSection === item.id ? 'bg-gold/10 text-gold border border-gold' : 'bg-gold/10 text-muted border border-gold/20'}`}>
                <item.icon size={16} />{item.label}
              </button>
            ))}
          </div>

          {activeSection === 'overview' && (
            <div className="space-y-8">
              <div>
                <h1 className="text-2xl font-bold text-heading mb-6">{t('dashboard.overview')}</h1>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {stats.map((stat) => (<div key={stat.label} className="card p-5"><div className="flex items-center gap-3 mb-2"><stat.icon size={20} className={stat.color} /><span className="text-xs text-muted">{stat.label}</span></div><p className="text-3xl font-bold text-heading font-mono">{stat.value}</p></div>))}
                </div>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-heading mb-4">{t('dashboard.recent_orders')}</h2>
                {ordersLoading ? <Skeleton className="h-20" /> : (
                  <div className="space-y-3">
                    {allOrders.slice(0, 3).map((order) => (
                      <div key={order.id} className="card p-4 flex items-center gap-4">
                        <Avatar src={order.freelancerAvatar} alt={order.freelancerName} size="sm" />
                        <div className="flex-1 min-w-0"><p className="text-sm text-heading truncate">{order.gigTitle}</p><p className="text-xs text-muted">{order.freelancerName}</p></div>
                        <Badge variant={statusConfig[order.status]?.variant || 'green'}>{statusConfig[order.status]?.label || order.status}</Badge>
                        <span className="text-sm font-mono text-heading font-semibold hidden sm:block">{order.price.toLocaleString('ru-RU')} ₽</span>
                      </div>
                    ))}
                    {allOrders.length === 0 && <p className="text-sm text-muted">Нет заказов</p>}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeSection === 'orders' && (
            <div>
              <h1 className="text-2xl font-bold text-heading mb-6">{t('dashboard.my_orders')}</h1>
              <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                {[{ value: 'all', label: t('common.all') }, ...Object.entries(statusConfig).map(([k, v]) => ({ value: k, label: v.label }))].map((f) => (
                  <button key={f.value} onClick={() => setStatusFilter(f.value)} className={`px-4 py-2 text-sm rounded-xl border whitespace-nowrap transition-all cursor-pointer ${statusFilter === f.value ? 'border-gold bg-gold/10 text-gold' : 'border-gold/20 text-muted hover:text-body'}`}>{f.label}</button>
                ))}
              </div>
              <div className="space-y-3">
                {filteredOrders.map((order) => (
                  <div key={order.id} className="card p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <Avatar src={order.freelancerAvatar} alt={order.freelancerName} size="md" />
                    <div className="flex-1 min-w-0"><p className="text-sm font-medium text-heading">{order.gigTitle}</p><p className="text-xs text-muted mt-0.5">{order.freelancerName} / {order.packageType}</p></div>
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                      <span className="text-xs text-muted font-mono">{order.date}</span>
                      <Badge variant={statusConfig[order.status]?.variant || 'green'}>{statusConfig[order.status]?.label || order.status}</Badge>
                      <span className="text-sm font-bold font-mono text-heading ml-auto sm:ml-0">{order.price.toLocaleString('ru-RU')} ₽</span>
                    </div>
                  </div>
                ))}
                {filteredOrders.length === 0 && <p className="text-sm text-muted py-8 text-center">Нет заказов</p>}
              </div>
            </div>
          )}

          {activeSection === 'messages' && (
            <div>
              <h1 className="text-2xl font-bold text-heading mb-6">{t('dashboard.messages')}</h1>
              <div className="space-y-2">
                {(conversations || []).map((conv: any) => (
                  <div key={conv.id} className="card p-4 flex items-center gap-4 cursor-pointer hover:border-gold/30 transition-all">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-muted truncate">{conv.last_message || 'Новый диалог'}</p>
                    </div>
                    <span className="text-xs text-muted">{conv.last_message_at ? new Date(conv.last_message_at).toLocaleDateString('ru-RU') : ''}</span>
                  </div>
                ))}
                {(!conversations || conversations.length === 0) && <p className="text-sm text-muted py-8 text-center">Нет сообщений</p>}
              </div>
            </div>
          )}

          {activeSection === 'favorites' && (
            <div>
              <h1 className="text-2xl font-bold text-heading mb-6">{t('dashboard.favorites')}</h1>
              {favsLoading ? <Skeleton className="h-40" /> : (
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {(favoriteGigs || []).map((gig, i) => <GigCard key={gig.id} gig={gig} index={i} />)}
                  {(!favoriteGigs || favoriteGigs.length === 0) && <p className="text-sm text-muted col-span-3 py-8 text-center">Нет избранных услуг</p>}
                </div>
              )}
            </div>
          )}

          {activeSection === 'settings' && (
            <div>
              <h1 className="text-2xl font-bold text-heading mb-6">{t('dashboard.settings')}</h1>
              <div className="card p-6 space-y-6 max-w-xl">
                <div className="flex items-center gap-4">
                  <Avatar src={profile?.avatar_url || ''} alt={profile?.full_name || ''} size="lg" />
                  <div><p className="text-sm font-medium text-heading">{profile?.full_name || 'Пользователь'}</p><p className="text-xs text-muted">{user?.email}</p></div>
                </div>
                <div>
                  <label className="block text-sm text-muted mb-1.5">{t('dashboard.name_label')}</label>
                  <input type="text" value={settingsForm.name} onChange={(e) => setSettingsForm({...settingsForm, name: e.target.value})} className="w-full bg-gold/10 border border-gold/30 rounded-xl px-4 py-3 text-sm text-heading focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/40 transition-all" />
                </div>
                <div>
                  <label className="block text-sm text-muted mb-1.5">{t('dashboard.email_label')}</label>
                  <input type="text" defaultValue={user?.email || ''} disabled className="w-full bg-gold/10 border border-gold/30 rounded-xl px-4 py-3 text-sm text-muted focus:outline-none transition-all opacity-60" />
                </div>
                <div>
                  <label className="block text-sm text-muted mb-1.5">{t('dashboard.city_label')}</label>
                  <input type="text" value={settingsForm.city} onChange={(e) => setSettingsForm({...settingsForm, city: e.target.value})} className="w-full bg-gold/10 border border-gold/30 rounded-xl px-4 py-3 text-sm text-heading focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/40 transition-all" />
                </div>
                <Button variant="primary" size="md" onClick={handleSaveSettings}>{t('common.save')}</Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

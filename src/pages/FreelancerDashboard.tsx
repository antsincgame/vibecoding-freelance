import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LayoutDashboard, Package, ShoppingBag, BarChart3, Wallet, Eye, TrendingUp, ArrowUpRight, Pause, Edit3, Trash2 } from 'lucide-react';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Skeleton from '../components/ui/Skeleton';
import { useMyOrders, useFreelancerGigs, useCurrentFreelancer } from '../hooks/useData';
import { deleteGig, updateGig } from '../lib/freelance-db';
import toast from 'react-hot-toast';

export default function FreelancerDashboard() {
  const { t } = useTranslation();
  const [activeSection, setActiveSection] = useState('overview');
  const { data: freelancer } = useCurrentFreelancer();
  const { data: myGigs, loading: gigsLoading, refetch: refetchGigs } = useFreelancerGigs(freelancer?.id);
  const { data: orders, loading: ordersLoading } = useMyOrders('seller');

  const allOrders = orders || [];
  const allGigs = myGigs || [];

  const sidebarItems = [
    { id: 'overview', icon: LayoutDashboard, label: t('dashboard.overview') },
    { id: 'gigs', icon: Package, label: t('freelancer_dashboard.my_gigs') },
    { id: 'orders', icon: ShoppingBag, label: t('freelancer_dashboard.orders') },
    { id: 'analytics', icon: BarChart3, label: t('freelancer_dashboard.analytics') },
    { id: 'wallet', icon: Wallet, label: t('freelancer_dashboard.wallet') },
  ];

  const handleDeleteGig = async (gigId: string) => {
    if (!confirm('Удалить услугу?')) return;
    const ok = await deleteGig(gigId);
    if (ok) { toast.success('Удалено'); refetchGigs(); } else toast.error('Ошибка');
  };

  const handlePauseGig = async (gigId: string) => {
    const ok = await updateGig(gigId, { status: 'paused' });
    if (ok) { toast.success('Приостановлено'); refetchGigs(); } else toast.error('Ошибка');
  };

  const totalEarnings = allOrders.filter(o => o.status === 'completed').reduce((sum, o) => sum + o.price, 0);

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
              <h1 className="text-2xl font-bold text-heading">{t('freelancer_dashboard.title')}</h1>
              <div className="card p-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-neon-pink/5" />
                <div className="relative z-10">
                  <p className="text-sm text-muted mb-1">{t('freelancer_dashboard.monthly_income')}</p>
                  <p className="text-5xl font-bold text-heading font-mono">{totalEarnings.toLocaleString('ru-RU')} ₽</p>
                </div>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: t('freelancer_dashboard.active_orders'), value: allOrders.filter(o => o.status === 'in_progress').length, color: 'text-accent-violet' },
                  { label: t('freelancer_dashboard.views'), value: '-', color: 'text-gold' },
                  { label: t('freelancer_dashboard.conversion'), value: '-', color: 'text-accent-emerald' },
                  { label: t('freelancer_dashboard.rating'), value: freelancer?.rating?.toFixed(1) || '-', color: 'text-accent-amber' },
                ].map((stat) => (<div key={stat.label} className="card p-5"><p className="text-xs text-muted mb-1">{stat.label}</p><p className={`text-2xl font-bold font-mono ${stat.color}`}>{stat.value}</p></div>))}
              </div>
              <div>
                <h2 className="text-lg font-semibold text-heading mb-4">{t('freelancer_dashboard.active_orders_title')}</h2>
                <div className="space-y-3">
                  {allOrders.filter(o => o.status === 'in_progress').map((order) => (
                    <div key={order.id} className="card p-4 flex items-center gap-4">
                      <div className="flex-1 min-w-0"><p className="text-sm font-medium text-heading">{order.gigTitle}</p><p className="text-xs text-muted">{order.date} / {order.packageType}</p></div>
                      <Badge variant="violet">{t('dashboard.status_in_progress')}</Badge>
                      <span className="text-sm font-mono text-heading font-semibold">{order.price.toLocaleString('ru-RU')} ₽</span>
                    </div>
                  ))}
                  {allOrders.filter(o => o.status === 'in_progress').length === 0 && <p className="text-sm text-muted">Нет активных заказов</p>}
                </div>
              </div>
            </div>
          )}

          {activeSection === 'gigs' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-heading">{t('freelancer_dashboard.my_gigs')}</h1>
                <Button variant="primary" size="sm" onClick={() => window.location.href = '/dashboard/create-gig'}>{t('freelancer_dashboard.create_gig')}</Button>
              </div>
              {gigsLoading ? <Skeleton className="h-40" /> : (
                <div className="space-y-4">
                  {allGigs.map((gig) => (
                    <div key={gig.id} className="card p-5 flex flex-col sm:flex-row items-start gap-4">
                      <img src={gig.image} alt={gig.title} className="w-full sm:w-32 h-20 rounded-xl object-cover flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-heading">{gig.title}</p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-muted">
                          <span className="flex items-center gap-1"><Package size={12} /> {gig.ordersCount} {t('common.ordersCount')}</span>
                          <span className="flex items-center gap-1"><TrendingUp size={12} /> {gig.rating}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <span className="text-sm font-mono text-heading font-bold">{t('common.from')} {gig.packages.economy.price.toLocaleString('ru-RU')} ₽</span>
                        <button className="p-2 text-muted hover:text-body rounded-lg hover:bg-gold/10 transition-all cursor-pointer"><Edit3 size={16} /></button>
                        <button onClick={() => handlePauseGig(gig.id)} className="p-2 text-muted hover:text-gold rounded-lg hover:bg-gold/10 transition-all cursor-pointer"><Pause size={16} /></button>
                        <button onClick={() => handleDeleteGig(gig.id)} className="p-2 text-muted hover:text-neon-rose rounded-lg hover:bg-gold/10 transition-all cursor-pointer"><Trash2 size={16} /></button>
                      </div>
                    </div>
                  ))}
                  {allGigs.length === 0 && <p className="text-sm text-muted text-center py-8">Нет услуг. Создайте первую!</p>}
                </div>
              )}
            </div>
          )}

          {activeSection === 'orders' && (
            <div>
              <h1 className="text-2xl font-bold text-heading mb-6">{t('freelancer_dashboard.orders')}</h1>
              {ordersLoading ? <Skeleton className="h-40" /> : (
                <div className="space-y-3">
                  {allOrders.map((order) => {
                    const cfg = { new: { label: t('dashboard.status_new'), variant: 'green' as const }, in_progress: { label: t('dashboard.status_in_progress'), variant: 'violet' as const }, delivered: { label: t('dashboard.status_delivered'), variant: 'emerald' as const }, completed: { label: t('dashboard.status_completed'), variant: 'blue' as const } };
                    return (
                      <div key={order.id} className="card p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <div className="flex-1 min-w-0"><p className="text-sm font-medium text-heading">{order.gigTitle}</p><p className="text-xs text-muted mt-0.5">{order.date} / {order.packageType}</p></div>
                        <Badge variant={cfg[order.status]?.variant || 'green'}>{cfg[order.status]?.label || order.status}</Badge>
                        <span className="text-sm font-bold font-mono text-heading">{order.price.toLocaleString('ru-RU')} ₽</span>
                      </div>
                    );
                  })}
                  {allOrders.length === 0 && <p className="text-sm text-muted text-center py-8">Нет заказов</p>}
                </div>
              )}
            </div>
          )}

          {activeSection === 'analytics' && (
            <div>
              <h1 className="text-2xl font-bold text-heading mb-6">{t('freelancer_dashboard.analytics')}</h1>
              <div className="card p-6 text-center py-12">
                <p className="text-muted">Аналитика будет доступна после первых заказов</p>
              </div>
            </div>
          )}

          {activeSection === 'wallet' && (
            <div>
              <h1 className="text-2xl font-bold text-heading mb-6">{t('freelancer_dashboard.wallet')}</h1>
              <div className="card p-8 max-w-md space-y-6">
                <div><p className="text-sm text-muted mb-1">{t('freelancer_dashboard.available_balance')}</p><p className="text-4xl font-bold text-heading font-mono">{totalEarnings.toLocaleString('ru-RU')} ₽</p></div>
                <div>
                  <label className="block text-sm text-muted mb-1.5">{t('freelancer_dashboard.withdrawal_amount')}</label>
                  <input type="number" placeholder="0" className="w-full bg-gold/10 border border-gold/30 rounded-xl px-4 py-3 text-lg text-heading font-mono placeholder:text-muted focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/40 transition-all" />
                </div>
                <div>
                  <label className="block text-sm text-muted mb-1.5">{t('freelancer_dashboard.withdrawal_method')}</label>
                  <select className="w-full bg-gold/10 border border-gold/30 rounded-xl px-4 py-3 text-sm text-body appearance-none cursor-pointer focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/40">
                    <option>{t('freelancer_dashboard.bank_card')}</option><option>ЮMoney</option><option>QIWI</option>
                  </select>
                </div>
                <Button variant="primary" size="lg" className="w-full">{t('freelancer_dashboard.withdraw_btn')}</Button>
                <p className="text-xs text-muted text-center">{t('freelancer_dashboard.commission')}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { adminGetOrders, adminUpdateOrder } from '../../lib/admin-api';
import toast from 'react-hot-toast';

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  new: { label: 'Новый', color: 'bg-neon-green/20 text-neon-green' },
  in_progress: { label: 'В работе', color: 'bg-accent-violet/20 text-accent-violet' },
  delivered: { label: 'Доставлен', color: 'bg-accent-emerald/20 text-accent-emerald' },
  completed: { label: 'Завершён', color: 'bg-neon-cyan/20 text-neon-cyan' },
  cancelled: { label: 'Отменён', color: 'bg-neon-rose/20 text-neon-rose' },
  dispute: { label: 'Спор', color: 'bg-accent-amber/20 text-accent-amber' },
};

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const load = async () => { setLoading(true); const data = await adminGetOrders(filter); setOrders(data); setLoading(false); };
  useEffect(() => { load(); }, [filter]);

  const handleStatus = async (id: string, status: string) => {
    const updates: any = { status };
    if (status === 'completed') updates.completed_at = new Date().toISOString();
    if (status === 'delivered') updates.delivered_at = new Date().toISOString();
    const { error } = await adminUpdateOrder(id, updates);
    if (error) toast.error('Ошибка'); else { toast.success('Статус обновлён'); load(); }
  };

  const totalRevenue = orders.filter(o => o.status === 'completed').reduce((sum, o) => sum + (o.price || 0), 0);

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-heading">Заказы</h1>
        <div className="text-sm text-muted">
          Выручка: <span className="text-gold font-mono font-bold">{totalRevenue.toLocaleString('ru-RU')} ₽</span>
        </div>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {['all', ...Object.keys(STATUS_MAP)].map((s) => (
          <button key={s} onClick={() => setFilter(s)} className={`px-4 py-2 text-sm rounded-xl border whitespace-nowrap transition-all cursor-pointer ${filter === s ? 'border-gold bg-gold/10 text-gold' : 'border-gold/20 text-muted hover:text-body'}`}>
            {s === 'all' ? `Все (${orders.length})` : STATUS_MAP[s]?.label || s}
          </button>
        ))}
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gold/20">
                <th className="text-left py-3 px-4 text-xs text-muted font-medium uppercase">ID</th>
                <th className="text-left py-3 px-4 text-xs text-muted font-medium uppercase">Гиг</th>
                <th className="text-left py-3 px-4 text-xs text-muted font-medium uppercase">Продавец</th>
                <th className="text-left py-3 px-4 text-xs text-muted font-medium uppercase">Пакет</th>
                <th className="text-left py-3 px-4 text-xs text-muted font-medium uppercase">Цена</th>
                <th className="text-left py-3 px-4 text-xs text-muted font-medium uppercase">Статус</th>
                <th className="text-left py-3 px-4 text-xs text-muted font-medium uppercase">Дата</th>
              </tr>
            </thead>
            <tbody>
              {loading ? Array.from({ length: 3 }).map((_, i) => (
                <tr key={i} className="border-b border-gold/10"><td colSpan={7} className="py-4 px-4"><div className="h-4 bg-gold/10 rounded animate-pulse" /></td></tr>
              )) : orders.map((order) => {
                const st = STATUS_MAP[order.status] || { label: order.status, color: 'bg-gold/10 text-muted' };
                return (
                  <tr key={order.id} className="border-b border-gold/10 hover:bg-gold/5 transition-colors">
                    <td className="py-3 px-4 text-xs text-muted font-mono">{order.id?.slice(0, 8)}</td>
                    <td className="py-3 px-4 text-sm text-heading truncate max-w-[200px]">{order.gig_title || '-'}</td>
                    <td className="py-3 px-4 text-sm text-muted">{order.seller_name || '-'}</td>
                    <td className="py-3 px-4 text-sm text-muted">{order.package_type || '-'}</td>
                    <td className="py-3 px-4 text-sm text-heading font-mono font-bold">{(order.price || 0).toLocaleString('ru-RU')} ₽</td>
                    <td className="py-3 px-4">
                      <select value={order.status} onChange={(e) => handleStatus(order.id, e.target.value)}
                        className={`text-xs font-medium px-3 py-1 rounded-full border-0 cursor-pointer focus:outline-none ${st.color}`}>
                        {Object.entries(STATUS_MAP).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                      </select>
                    </td>
                    <td className="py-3 px-4 text-xs text-muted font-mono">{order.$createdAt ? new Date(order.$createdAt).toLocaleDateString('ru-RU') : '-'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {!loading && orders.length === 0 && <p className="text-sm text-muted text-center py-8">Нет заказов</p>}
      </div>
    </AdminLayout>
  );
}

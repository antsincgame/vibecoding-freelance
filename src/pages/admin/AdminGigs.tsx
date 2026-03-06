import { useState, useEffect } from 'react';
import { Eye, Star, Trash2, Check, X, Pause, Play, ExternalLink } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { adminGetGigs, adminSetGigStatus, adminSetGigFeatured, adminDeleteGig } from '../../lib/admin-api';
import toast from 'react-hot-toast';

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  active: { label: 'Активен', color: 'text-neon-green' },
  paused: { label: 'Приостановлен', color: 'text-accent-amber' },
  pending: { label: 'На модерации', color: 'text-accent-violet' },
  rejected: { label: 'Отклонён', color: 'text-neon-rose' },
  deleted: { label: 'Удалён', color: 'text-muted' },
};

export default function AdminGigs() {
  const [gigs, setGigs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const load = async () => { setLoading(true); const data = await adminGetGigs(filter); setGigs(data); setLoading(false); };
  useEffect(() => { load(); }, [filter]);

  const handleStatus = async (id: string, status: string) => {
    const { error } = await adminSetGigStatus(id, status);
    if (error) toast.error('Ошибка'); else { toast.success('Статус обновлён'); load(); }
  };

  const handleFeatured = async (id: string, featured: boolean) => {
    const { error } = await adminSetGigFeatured(id, featured);
    if (error) toast.error('Ошибка'); else { toast.success(featured ? 'В топе' : 'Убрано из топа'); load(); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить гиг полностью?')) return;
    const { error } = await adminDeleteGig(id);
    if (error) toast.error('Ошибка'); else { toast.success('Удалён'); load(); }
  };

  const parsePkg = (raw: any) => {
    if (!raw) return null;
    try { return typeof raw === 'string' ? JSON.parse(raw) : raw; } catch { return null; }
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-heading">Гиги</h1>
        <span className="text-sm text-muted">{gigs.length} шт.</span>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {['all', 'active', 'paused', 'pending', 'rejected', 'deleted'].map((s) => (
          <button key={s} onClick={() => setFilter(s)} className={`px-4 py-2 text-sm rounded-xl border whitespace-nowrap transition-all cursor-pointer ${filter === s ? 'border-gold bg-gold/10 text-gold' : 'border-gold/20 text-muted hover:text-body'}`}>
            {s === 'all' ? 'Все' : STATUS_MAP[s]?.label || s}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {loading ? Array.from({ length: 4 }).map((_, i) => <div key={i} className="card p-5 animate-pulse"><div className="h-5 bg-gold/10 rounded w-2/3 mb-2" /><div className="h-4 bg-gold/10 rounded w-1/3" /></div>) : (
          gigs.map((gig) => {
            const econ = parsePkg(gig.package_economy);
            const status = STATUS_MAP[gig.status] || { label: gig.status, color: 'text-muted' };
            return (
              <div key={gig.id} className="card p-5">
                <div className="flex flex-col sm:flex-row items-start gap-4">
                  {gig.image && <img src={gig.image} alt="" className="w-full sm:w-28 h-20 rounded-xl object-cover flex-shrink-0" />}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-medium text-heading truncate">{gig.title}</h3>
                      {gig.is_featured && <span className="text-[10px] font-bold bg-gold/20 text-gold px-2 py-0.5 rounded-full border border-gold/30">TOP</span>}
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted">
                      <span>{gig.freelancer_name || 'Unknown'} (@{gig.freelancer_username})</span>
                      <span className="font-mono">{gig.category_slug}</span>
                      <span className={status.color}>{status.label}</span>
                      <span className="font-mono">★ {gig.rating}</span>
                      {econ && <span className="font-mono">от {econ.price?.toLocaleString('ru-RU')} ₽</span>}
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {(Array.isArray(gig.tags) ? gig.tags : []).slice(0, 5).map((t: string) => (
                        <span key={t} className="px-2 py-0.5 text-[10px] bg-gold/10 text-muted rounded border border-gold/20">{t}</span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 self-end sm:self-center flex-shrink-0">
                    <a href={`/gigs/${gig.id}`} target="_blank" className="p-2 text-muted hover:text-gold hover:bg-gold/10 rounded-lg cursor-pointer"><ExternalLink size={14} /></a>
                    {gig.status === 'active' ? (
                      <button onClick={() => handleStatus(gig.id, 'paused')} className="p-2 text-muted hover:text-accent-amber hover:bg-gold/10 rounded-lg cursor-pointer" title="Приостановить"><Pause size={14} /></button>
                    ) : gig.status !== 'deleted' ? (
                      <button onClick={() => handleStatus(gig.id, 'active')} className="p-2 text-muted hover:text-neon-green hover:bg-gold/10 rounded-lg cursor-pointer" title="Активировать"><Play size={14} /></button>
                    ) : null}
                    <button onClick={() => handleFeatured(gig.id, !gig.is_featured)} className={`p-2 hover:bg-gold/10 rounded-lg cursor-pointer ${gig.is_featured ? 'text-gold' : 'text-muted hover:text-gold'}`} title="Топ">
                      <Star size={14} fill={gig.is_featured ? 'currentColor' : 'none'} />
                    </button>
                    <button onClick={() => handleDelete(gig.id)} className="p-2 text-muted hover:text-neon-rose hover:bg-gold/10 rounded-lg cursor-pointer" title="Удалить"><Trash2 size={14} /></button>
                  </div>
                </div>
              </div>
            );
          })
        )}
        {!loading && gigs.length === 0 && <p className="text-sm text-muted text-center py-8">Нет гигов</p>}
      </div>
    </AdminLayout>
  );
}

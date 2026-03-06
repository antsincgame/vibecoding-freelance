import { useState, useEffect } from 'react';
import { Star, Trash2, Pause, Play, ExternalLink, Check, X, MessageCircle, Clock, Eye } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { adminGetGigs, adminSetGigStatus, adminSetGigFeatured, adminDeleteGig, adminApproveGig, adminRejectGig } from '../../lib/admin-api';
import toast from 'react-hot-toast';

const STATUS_MAP: Record<string, { label: string; color: string; bg: string }> = {
  active: { label: 'Активен', color: 'text-neon-green', bg: 'bg-neon-green/15' },
  paused: { label: 'Пауза', color: 'text-[#00f5ff]', bg: 'bg-[#00f5ff]/15' },
  pending: { label: 'Модерация', color: 'text-accent-violet', bg: 'bg-accent-violet/15' },
  rejected: { label: 'Отклонён', color: 'text-neon-rose', bg: 'bg-neon-rose/15' },
  deleted: { label: 'Удалён', color: 'text-muted', bg: 'bg-white/5' },
};

export default function AdminGigs() {
  const [gigs, setGigs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [rejectModal, setRejectModal] = useState<{ id: string; title: string } | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [expandedGig, setExpandedGig] = useState<string | null>(null);

  const load = async () => { setLoading(true); const data = await adminGetGigs(filter); setGigs(data); setLoading(false); };
  useEffect(() => { load(); }, [filter]);

  const handleApprove = async (id: string) => {
    const { error } = await adminApproveGig(id);
    if (error) toast.error('Ошибка'); else { toast.success('Одобрен ✓'); load(); }
  };

  const handleReject = async () => {
    if (!rejectModal || !rejectReason.trim()) { toast.error('Укажите причину отклонения'); return; }
    const { error } = await adminRejectGig(rejectModal.id, rejectReason);
    if (error) toast.error('Ошибка'); else { toast.success('Отклонён'); setRejectModal(null); setRejectReason(''); load(); }
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

  const handleStatus = async (id: string, status: string) => {
    const { error } = await adminSetGigStatus(id, status);
    if (error) toast.error('Ошибка'); else { toast.success('Статус обновлён'); load(); }
  };

  const parsePkg = (raw: any) => {
    if (!raw) return null;
    try { return typeof raw === 'string' ? JSON.parse(raw) : raw; } catch { return null; }
  };

  const pendingCount = gigs.filter(g => g.status === 'pending').length;

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-heading">Модерация гигов</h1>
          {pendingCount > 0 && <p className="text-sm text-accent-violet mt-1">⏳ {pendingCount} на модерации</p>}
        </div>
        <span className="text-sm text-muted">{gigs.length} шт.</span>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {['all', 'pending', 'active', 'paused', 'rejected', 'deleted'].map((s) => (
          <button key={s} onClick={() => setFilter(s)} className={`px-4 py-2 text-sm rounded-xl border whitespace-nowrap transition-all cursor-pointer ${filter === s ? 'border-[#00f5ff] bg-[#00f5ff]/10 text-[#00f5ff]' : 'border-[#00f5ff]/20 text-muted hover:text-body'}`}>
            {s === 'all' ? 'Все' : STATUS_MAP[s]?.label || s}
            {s === 'pending' && pendingCount > 0 && <span className="ml-1 w-5 h-5 inline-flex items-center justify-center bg-accent-violet text-void text-[10px] font-bold rounded-full">{pendingCount}</span>}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {loading ? Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="card p-5 animate-pulse"><div className="h-5 bg-[#00f5ff]/10 rounded w-2/3 mb-2" /><div className="h-4 bg-[#00f5ff]/10 rounded w-1/3" /></div>
        )) : gigs.map((gig) => {
          const econ = parsePkg(gig.package_economy);
          const status = STATUS_MAP[gig.status] || { label: gig.status, color: 'text-muted', bg: 'bg-white/5' };
          const expanded = expandedGig === gig.id;

          return (
            <div key={gig.id} className={`card overflow-hidden ${gig.status === 'pending' ? 'border-accent-violet/40' : ''}`}>
              <div className="p-5">
                <div className="flex flex-col sm:flex-row items-start gap-4">
                  {gig.image && <img src={gig.image} alt="" className="w-full sm:w-28 h-20 rounded-xl object-cover flex-shrink-0" />}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <button onClick={() => setExpandedGig(expanded ? null : gig.id)} className="text-sm font-medium text-heading truncate hover:text-[#00f5ff] transition-colors cursor-pointer text-left">{gig.title}</button>
                      {gig.is_featured && <span className="text-[10px] font-bold bg-[#00f5ff]/20 text-[#00f5ff] px-2 py-0.5 rounded-full border border-[#00f5ff]/30">TOP</span>}
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${status.bg} ${status.color}`}>{status.label}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted">
                      <span>{gig.freelancer_name} (@{gig.freelancer_username})</span>
                      <span className="font-mono">{gig.category_slug}</span>
                      <span className="font-mono">★ {gig.rating}</span>
                      {econ && <span className="font-mono">от {econ.price?.toLocaleString('ru-RU')} ₽</span>}
                      {gig.moderated_by && <span className="text-[#00f5ff]/60">Модератор: {gig.moderated_by}</span>}
                    </div>
                    {gig.rejection_reason && (
                      <div className="mt-2 px-3 py-2 bg-neon-rose/10 border border-neon-rose/20 rounded-lg">
                        <p className="text-xs text-neon-rose">Причина отклонения: {gig.rejection_reason}</p>
                      </div>
                    )}
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-1 self-end sm:self-center flex-shrink-0">
                    {gig.status === 'pending' && (
                      <>
                        <button onClick={() => handleApprove(gig.id)} className="flex items-center gap-1 px-3 py-1.5 bg-neon-green/20 text-neon-green rounded-lg text-xs hover:bg-neon-green/30 transition-all cursor-pointer" title="Одобрить">
                          <Check size={14} /> Одобрить
                        </button>
                        <button onClick={() => { setRejectModal({ id: gig.id, title: gig.title }); setRejectReason(''); }} className="flex items-center gap-1 px-3 py-1.5 bg-neon-rose/20 text-neon-rose rounded-lg text-xs hover:bg-neon-rose/30 transition-all cursor-pointer" title="Отклонить">
                          <X size={14} /> Отклонить
                        </button>
                      </>
                    )}
                    {gig.status === 'active' && (
                      <button onClick={() => handleStatus(gig.id, 'paused')} className="p-2 text-muted hover:text-[#00f5ff] hover:bg-[#00f5ff]/10 rounded-lg cursor-pointer" title="Пауза"><Pause size={14} /></button>
                    )}
                    {(gig.status === 'paused' || gig.status === 'rejected') && (
                      <button onClick={() => handleApprove(gig.id)} className="p-2 text-muted hover:text-neon-green hover:bg-[#00f5ff]/10 rounded-lg cursor-pointer" title="Активировать"><Play size={14} /></button>
                    )}
                    <a href={`/gigs/${gig.id}`} target="_blank" className="p-2 text-muted hover:text-[#00f5ff] hover:bg-[#00f5ff]/10 rounded-lg cursor-pointer"><ExternalLink size={14} /></a>
                    <button onClick={() => handleFeatured(gig.id, !gig.is_featured)} className={`p-2 hover:bg-[#00f5ff]/10 rounded-lg cursor-pointer ${gig.is_featured ? 'text-[#00f5ff]' : 'text-muted hover:text-[#00f5ff]'}`}><Star size={14} fill={gig.is_featured ? 'currentColor' : 'none'} /></button>
                    <button onClick={() => handleDelete(gig.id)} className="p-2 text-muted hover:text-neon-rose hover:bg-[#00f5ff]/10 rounded-lg cursor-pointer"><Trash2 size={14} /></button>
                  </div>
                </div>
              </div>

              {/* Expanded details */}
              {expanded && (
                <div className="px-5 pb-5 pt-0 border-t border-[#00f5ff]/10">
                  <div className="grid sm:grid-cols-3 gap-4 mt-4 text-xs">
                    {['economy', 'standard', 'premium'].map((pkg) => {
                      const p = parsePkg(gig[`package_${pkg}`]);
                      if (!p) return null;
                      return (
                        <div key={pkg} className="bg-[#00f5ff]/5 rounded-lg p-3 border border-[#00f5ff]/10">
                          <p className="font-medium text-heading mb-1">{p.name || pkg}</p>
                          <p className="text-[#00f5ff] font-mono font-bold">{p.price?.toLocaleString('ru-RU')} ₽</p>
                          <p className="text-muted">{p.deliveryDays} дн.</p>
                          {p.features?.map((f: string) => <p key={f} className="text-muted">• {f}</p>)}
                        </div>
                      );
                    })}
                  </div>
                  <p className="text-xs text-muted mt-3 whitespace-pre-line">{gig.description?.slice(0, 500)}</p>
                </div>
              )}
            </div>
          );
        })}
        {!loading && gigs.length === 0 && <p className="text-sm text-muted text-center py-8">Нет гигов</p>}
      </div>

      {/* Reject modal */}
      {rejectModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={() => setRejectModal(null)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative w-full max-w-md bg-nebula-light border border-[#00f5ff]/30 rounded-2xl p-6 space-y-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-heading">Отклонить гиг</h3>
            <p className="text-sm text-muted truncate">«{rejectModal.title}»</p>
            <div>
              <label className="text-sm text-muted mb-1 block">Причина отклонения *</label>
              <textarea
                rows={3}
                placeholder="Опишите причину отклонения..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full bg-[#00f5ff]/10 border border-[#00f5ff]/30 rounded-xl px-4 py-3 text-sm text-heading placeholder:text-muted focus:outline-none focus:border-[#00f5ff] focus:ring-1 focus:ring-[#00f5ff]/40 resize-none"
                autoFocus
              />
            </div>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setRejectModal(null)} className="px-4 py-2 text-sm text-muted hover:text-body rounded-lg cursor-pointer">Отмена</button>
              <button onClick={handleReject} className="px-4 py-2 text-sm bg-neon-rose/20 text-neon-rose rounded-lg hover:bg-neon-rose/30 cursor-pointer">Отклонить</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

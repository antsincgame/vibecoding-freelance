import { useState, useEffect } from 'react';
import { Shield, Trash2, Award, ChevronUp, ChevronDown, ExternalLink } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { adminGetProfiles, adminSetUserLevel, adminDeleteProfile } from '../../lib/admin-api';
import toast from 'react-hot-toast';

const LEVELS: Record<string, { label: string; color: string }> = {
  new: { label: 'Новый', color: 'text-muted' },
  verified: { label: 'Верифицирован', color: 'text-neon-cyan' },
  pro: { label: 'PRO', color: 'text-gold' },
};

export default function AdminUsers() {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => { setLoading(true); const data = await adminGetProfiles(); setProfiles(data); setLoading(false); };
  useEffect(() => { load(); }, []);

  const handleLevel = async (id: string, level: string) => {
    const { error } = await adminSetUserLevel(id, level);
    if (error) toast.error('Ошибка'); else { toast.success(`Уровень: ${LEVELS[level]?.label}`); load(); }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Удалить профиль "${name}"?`)) return;
    const { error } = await adminDeleteProfile(id);
    if (error) toast.error('Ошибка'); else { toast.success('Удалён'); load(); }
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-heading">Пользователи</h1>
        <span className="text-sm text-muted">{profiles.length} профилей</span>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gold/20">
                <th className="text-left py-3 px-4 text-xs text-muted font-medium uppercase">Пользователь</th>
                <th className="text-left py-3 px-4 text-xs text-muted font-medium uppercase">Username</th>
                <th className="text-left py-3 px-4 text-xs text-muted font-medium uppercase">Роль</th>
                <th className="text-left py-3 px-4 text-xs text-muted font-medium uppercase">Уровень</th>
                <th className="text-left py-3 px-4 text-xs text-muted font-medium uppercase">Рейтинг</th>
                <th className="text-left py-3 px-4 text-xs text-muted font-medium uppercase">Заказов</th>
                <th className="text-left py-3 px-4 text-xs text-muted font-medium uppercase">Город</th>
                <th className="text-right py-3 px-4 text-xs text-muted font-medium uppercase">Действия</th>
              </tr>
            </thead>
            <tbody>
              {loading ? Array.from({ length: 4 }).map((_, i) => (
                <tr key={i} className="border-b border-gold/10"><td colSpan={8} className="py-4 px-4"><div className="h-4 bg-gold/10 rounded animate-pulse" /></td></tr>
              )) : profiles.map((p) => {
                const lvl = LEVELS[p.level] || LEVELS.new;
                return (
                  <tr key={p.id} className="border-b border-gold/10 hover:bg-gold/5 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        {p.avatar ? <img src={p.avatar} alt="" className="w-8 h-8 rounded-full object-cover" /> : <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center text-xs text-gold">{(p.name || '?')[0]}</div>}
                        <span className="text-sm text-heading">{p.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-muted font-mono">@{p.username}</td>
                    <td className="py-3 px-4 text-sm text-muted">{p.role || 'freelancer'}</td>
                    <td className="py-3 px-4">
                      <select value={p.level || 'new'} onChange={(e) => handleLevel(p.id, e.target.value)} className="bg-transparent text-sm cursor-pointer focus:outline-none" style={{ color: lvl.color === 'text-gold' ? '#d4af37' : lvl.color === 'text-neon-cyan' ? '#00fff9' : '#888' }}>
                        {Object.entries(LEVELS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                      </select>
                    </td>
                    <td className="py-3 px-4 text-sm text-muted font-mono">★ {p.rating || 0}</td>
                    <td className="py-3 px-4 text-sm text-muted font-mono">{p.orders_completed || 0}</td>
                    <td className="py-3 px-4 text-sm text-muted">{p.location || '-'}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex gap-1 justify-end">
                        <a href={`/users/${p.username}`} target="_blank" className="p-2 text-muted hover:text-gold hover:bg-gold/10 rounded-lg cursor-pointer"><ExternalLink size={14} /></a>
                        <button onClick={() => handleDelete(p.id, p.name)} className="p-2 text-muted hover:text-neon-rose hover:bg-gold/10 rounded-lg cursor-pointer"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {!loading && profiles.length === 0 && <p className="text-sm text-muted text-center py-8">Нет пользователей</p>}
      </div>
    </AdminLayout>
  );
}

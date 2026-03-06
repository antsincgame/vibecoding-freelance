import SEO from "../components/SEO";
import AIMatching from '../components/AIMatching';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Clock, DollarSign, Tag, User, MessageCircle, Filter, ChevronDown } from 'lucide-react';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Avatar from '../components/ui/Avatar';
import { useAuth } from '@vibecoding/shared';
import { getSupabase, getAccount } from '@vibecoding/shared';
import { useCategories } from '../hooks/useData';
import toast from 'react-hot-toast';

export default function Projects() {
  const { user } = useAuth();
  const { data: categories } = useCategories();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [filter, setFilter] = useState('all');
  const [form, setForm] = useState({ title: '', description: '', budget_from: '', budget_to: '', category: '', deadline_days: '7' });

  useEffect(() => { loadProjects(); }, [filter]);

  const loadProjects = async () => {
    setLoading(true);
    const db = getSupabase();
    let q = db.from('fl_projects').select('*').order('$createdAt', { ascending: false });
    if (filter !== 'all') q = q.eq('status', filter);
    const { data } = await q;
    setProjects(Array.isArray(data) ? data : data ? [data] : []);
    setLoading(false);
  };

  const handleCreate = async () => {
    if (!form.title.trim()) { toast.error('Укажите название'); return; }
    if (!form.description.trim()) { toast.error('Опишите задачу'); return; }
    try {
      const acc = getAccount();
      const u = await acc.get();
      const db = getSupabase();
      const { data: profile } = await db.from('fl_profiles').select('*').eq('user_id', u.$id).maybeSingle();
      
      const { error } = await db.from('fl_projects').insert({
        user_id: u.$id,
        user_name: profile?.name || u.name || 'User',
        user_avatar: profile?.avatar || '',
        title: form.title,
        description: form.description,
        budget_from: Number(form.budget_from) || 0,
        budget_to: Number(form.budget_to) || 0,
        category: form.category,
        deadline_days: Number(form.deadline_days) || 7,
        status: 'open',
        responses_count: 0,
      });
      if (error) throw error;
      toast.success('Проект опубликован!');
      setCreating(false);
      setForm({ title: '', description: '', budget_from: '', budget_to: '', category: '', deadline_days: '7' });
      loadProjects();
    } catch (e: any) { toast.error('Ошибка: ' + (e.message || 'Unknown')); }
  };

  const inputClass = 'w-full bg-[#00f5ff]/10 border border-[#00f5ff]/30 rounded-xl px-4 py-3.5 text-base text-heading placeholder:text-muted focus:outline-none focus:border-[#00f5ff] focus:ring-1 focus:ring-[#00f5ff]/40 transition-all';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
      <SEO title="Биржа проектов" description="Разместите задачу — фрилансеры предложат решения. Биржа проектов VibeCoder." />
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl font-bold text-neon-gradient tracking-[0.08em] uppercase">Биржа проектов</h1>
          <p className="text-body text-sm mt-1">Разместите задачу — фрилансеры предложат решения</p>
        </div>
        {user && (
          <Button variant="primary" size="sm" onClick={() => setCreating(!creating)}>
            <Plus size={16} /> Создать проект
          </Button>
        )}
      </div>

      {/* Create form */}
      {creating && (
        <div className="card p-6 mb-6 space-y-4">
          <h3 className="text-lg font-semibold text-heading">Новый проект</h3>
          <div>
            <label className="block text-sm text-muted mb-1">Название задачи *</label>
            <input placeholder="Что нужно сделать?" value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} className={inputClass} />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">Описание *</label>
            <textarea rows={4} placeholder="Подробно опишите задачу, требования, примеры..." value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} className={`${inputClass} resize-none`} />
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-muted mb-1">Бюджет от (₽)</label>
              <input type="number" placeholder="500" value={form.budget_from} onChange={(e) => setForm({...form, budget_from: e.target.value})} className={`${inputClass} font-mono`} />
            </div>
            <div>
              <label className="block text-xs text-muted mb-1">Бюджет до (₽)</label>
              <input type="number" placeholder="10000" value={form.budget_to} onChange={(e) => setForm({...form, budget_to: e.target.value})} className={`${inputClass} font-mono`} />
            </div>
            <div>
              <label className="block text-xs text-muted mb-1">Срок (дней)</label>
              <input type="number" placeholder="7" value={form.deadline_days} onChange={(e) => setForm({...form, deadline_days: e.target.value})} className={`${inputClass} font-mono`} />
            </div>
          </div>
          <div>
            <label className="block text-xs text-muted mb-1">Категория</label>
            <select value={form.category} onChange={(e) => setForm({...form, category: e.target.value})} className={`${inputClass} cursor-pointer`}>
              <option value="">Любая</option>
              {(categories || []).map(c => <option key={c.slug} value={c.slug}>{c.name}</option>)}
            </select>
          </div>
          <div className="flex gap-3">
            <Button variant="primary" size="md" onClick={handleCreate}>Опубликовать</Button>
            <Button variant="ghost" size="md" onClick={() => setCreating(false)}>Отмена</Button>
          </div>
        </div>
      )}

      {/* AI Matching */}
      <div className="mb-8">
        <AIMatching />
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {[
          { value: 'all', label: 'Все' },
          { value: 'open', label: 'Открытые' },
          { value: 'in_progress', label: 'В работе' },
          { value: 'completed', label: 'Завершённые' },
        ].map(f => (
          <button key={f.value} onClick={() => setFilter(f.value)} className={`px-4 py-2 text-sm rounded-xl border whitespace-nowrap transition-all cursor-pointer ${filter === f.value ? 'border-[#00f5ff] bg-[#00f5ff]/10 text-[#00f5ff]' : 'border-[#00f5ff]/20 text-muted hover:text-body'}`}>
            {f.label}
          </button>
        ))}
      </div>

      {/* Projects list */}
      <div className="space-y-4">
        {loading ? Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="card p-6 animate-pulse"><div className="h-5 bg-[#00f5ff]/10 rounded w-2/3 mb-3" /><div className="h-3 bg-[#00f5ff]/10 rounded w-full mb-2" /><div className="h-3 bg-[#00f5ff]/10 rounded w-1/2" /></div>
        )) : projects.length === 0 ? (
          <div className="card p-12 text-center">
            <MessageCircle size={48} className="text-muted/30 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-heading mb-2">Пока нет проектов</h3>
            <p className="text-sm text-muted mb-4">Будьте первым — опубликуйте свою задачу</p>
            {user && <Button variant="primary" size="md" onClick={() => setCreating(true)}><Plus size={16} /> Создать проект</Button>}
          </div>
        ) : projects.map((project) => (
          <div key={project.id} className="card p-6 hover:border-[#00f5ff]/30 transition-all">
            <div className="flex items-start gap-4">
              <Avatar src={project.user_avatar} alt={project.user_name} size="md" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-base font-semibold text-heading">{project.title}</h3>
                  <Badge variant={project.status === 'open' ? 'green' : project.status === 'in_progress' ? 'violet' : 'blue'}>
                    {project.status === 'open' ? 'Открыт' : project.status === 'in_progress' ? 'В работе' : 'Завершён'}
                  </Badge>
                </div>
                <p className="text-sm text-body leading-relaxed mb-3 line-clamp-3">{project.description}</p>
                <div className="flex flex-wrap items-center gap-4 text-xs text-muted">
                  <span className="flex items-center gap-1"><User size={12} /> {project.user_name}</span>
                  {(project.budget_from || project.budget_to) && (
                    <span className="flex items-center gap-1 text-[#00f5ff] font-mono">
                      <DollarSign size={12} />
                      {project.budget_from ? `${Number(project.budget_from).toLocaleString('ru-RU')}` : '?'} — {project.budget_to ? `${Number(project.budget_to).toLocaleString('ru-RU')} ₽` : '?'}
                    </span>
                  )}
                  {project.deadline_days && <span className="flex items-center gap-1"><Clock size={12} /> {project.deadline_days} дн.</span>}
                  {project.category && <span className="flex items-center gap-1"><Tag size={12} /> {project.category}</span>}
                  <span className="flex items-center gap-1"><MessageCircle size={12} /> {project.responses_count || 0} откликов</span>
                  <span>{project.$createdAt ? new Date(project.$createdAt).toLocaleDateString('ru-RU') : ''}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

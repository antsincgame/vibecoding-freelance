import { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, Save, X, GripVertical } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { adminGetCategories, adminCreateCategory, adminUpdateCategory, adminDeleteCategory } from '../../lib/admin-api';
import toast from 'react-hot-toast';

const ICONS = ['Globe', 'Smartphone', 'Bot', 'Brain', 'Layout', 'Server', 'Database', 'Rocket', 'Sparkles', 'Code', 'Bug', 'Cloud'];

export default function AdminCategories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ slug: '', name: '', icon: 'Globe', description: '', sort_order: 0 });

  const load = async () => { setLoading(true); const data = await adminGetCategories(); setCategories(data); setLoading(false); };
  useEffect(() => { load(); }, []);

  const resetForm = () => { setForm({ slug: '', name: '', icon: 'Globe', description: '', sort_order: 0 }); setAdding(false); setEditing(null); };

  const handleCreate = async () => {
    if (!form.slug || !form.name) { toast.error('Slug и название обязательны'); return; }
    const { error } = await adminCreateCategory(form);
    if (error) toast.error('Ошибка: ' + error.message); else { toast.success('Категория создана'); resetForm(); load(); }
  };

  const handleUpdate = async (id: string) => {
    const { error } = await adminUpdateCategory(id, form);
    if (error) toast.error('Ошибка'); else { toast.success('Обновлено'); resetForm(); load(); }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Удалить "${name}"?`)) return;
    const { error } = await adminDeleteCategory(id);
    if (error) toast.error('Ошибка'); else { toast.success('Удалено'); load(); }
  };

  const startEdit = (cat: any) => {
    setEditing(cat.id);
    setForm({ slug: cat.slug, name: cat.name, icon: cat.icon || 'Globe', description: cat.description || '', sort_order: cat.sort_order || 0 });
  };

  const inputClass = 'bg-gold/10 border border-gold/30 rounded-lg px-3 py-2 text-sm text-heading placeholder:text-muted focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/40 transition-all';

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-heading">Категории</h1>
        <button onClick={() => { setAdding(true); resetForm(); setForm(f => ({ ...f, sort_order: categories.length + 1 })); }} className="flex items-center gap-2 px-4 py-2 bg-gold/10 border border-gold/30 rounded-xl text-sm text-gold hover:bg-gold/20 transition-all cursor-pointer">
          <Plus size={16} /> Добавить
        </button>
      </div>

      {/* Add form */}
      {adding && (
        <div className="card p-6 mb-6 space-y-4">
          <h3 className="text-sm font-semibold text-heading">Новая категория</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <input placeholder="slug (латиница)" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })} className={inputClass} />
            <input placeholder="Название" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} />
            <select value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} className={`${inputClass} cursor-pointer`}>
              {ICONS.map(i => <option key={i} value={i}>{i}</option>)}
            </select>
            <input type="number" placeholder="Порядок" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} className={`${inputClass} w-full`} />
          </div>
          <input placeholder="Описание" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={`${inputClass} w-full`} />
          <div className="flex gap-2">
            <button onClick={handleCreate} className="flex items-center gap-1 px-4 py-2 bg-gold/20 text-gold rounded-lg text-sm hover:bg-gold/30 transition-all cursor-pointer"><Save size={14} /> Создать</button>
            <button onClick={resetForm} className="flex items-center gap-1 px-4 py-2 bg-gold/10 text-muted rounded-lg text-sm hover:text-body transition-all cursor-pointer"><X size={14} /> Отмена</button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gold/20">
                <th className="text-left py-3 px-4 text-xs text-muted font-medium uppercase tracking-wider">#</th>
                <th className="text-left py-3 px-4 text-xs text-muted font-medium uppercase tracking-wider">Slug</th>
                <th className="text-left py-3 px-4 text-xs text-muted font-medium uppercase tracking-wider">Название</th>
                <th className="text-left py-3 px-4 text-xs text-muted font-medium uppercase tracking-wider">Иконка</th>
                <th className="text-left py-3 px-4 text-xs text-muted font-medium uppercase tracking-wider">Гигов</th>
                <th className="text-left py-3 px-4 text-xs text-muted font-medium uppercase tracking-wider">Описание</th>
                <th className="text-right py-3 px-4 text-xs text-muted font-medium uppercase tracking-wider">Действия</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="border-b border-gold/10"><td colSpan={7} className="py-4 px-4"><div className="h-4 bg-gold/10 rounded animate-pulse" /></td></tr>
                ))
              ) : categories.map((cat) => (
                <tr key={cat.id} className="border-b border-gold/10 hover:bg-gold/5 transition-colors">
                  {editing === cat.id ? (
                    <>
                      <td className="py-3 px-4"><input type="number" value={form.sort_order} onChange={(e) => setForm({...form, sort_order: Number(e.target.value)})} className={`${inputClass} w-16`} /></td>
                      <td className="py-3 px-4"><input value={form.slug} onChange={(e) => setForm({...form, slug: e.target.value})} className={`${inputClass} w-32`} /></td>
                      <td className="py-3 px-4"><input value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} className={`${inputClass} w-40`} /></td>
                      <td className="py-3 px-4"><select value={form.icon} onChange={(e) => setForm({...form, icon: e.target.value})} className={`${inputClass} w-28`}>{ICONS.map(i => <option key={i} value={i}>{i}</option>)}</select></td>
                      <td className="py-3 px-4 text-sm text-muted font-mono">{cat.gig_count || 0}</td>
                      <td className="py-3 px-4"><input value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} className={`${inputClass} w-full`} /></td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex gap-1 justify-end">
                          <button onClick={() => handleUpdate(cat.id)} className="p-2 text-neon-green hover:bg-gold/10 rounded-lg cursor-pointer"><Save size={14} /></button>
                          <button onClick={resetForm} className="p-2 text-muted hover:bg-gold/10 rounded-lg cursor-pointer"><X size={14} /></button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="py-3 px-4 text-sm text-muted font-mono">{cat.sort_order || '-'}</td>
                      <td className="py-3 px-4 text-sm text-body font-mono">{cat.slug}</td>
                      <td className="py-3 px-4 text-sm text-heading font-medium">{cat.name}</td>
                      <td className="py-3 px-4 text-sm text-muted">{cat.icon}</td>
                      <td className="py-3 px-4 text-sm text-muted font-mono">{cat.gig_count || 0}</td>
                      <td className="py-3 px-4 text-sm text-muted truncate max-w-[200px]">{cat.description}</td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex gap-1 justify-end">
                          <button onClick={() => startEdit(cat)} className="p-2 text-muted hover:text-gold hover:bg-gold/10 rounded-lg cursor-pointer"><Edit3 size={14} /></button>
                          <button onClick={() => handleDelete(cat.id, cat.name)} className="p-2 text-muted hover:text-neon-rose hover:bg-gold/10 rounded-lg cursor-pointer"><Trash2 size={14} /></button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!loading && categories.length === 0 && <p className="text-sm text-muted text-center py-8">Нет категорий</p>}
      </div>
    </AdminLayout>
  );
}

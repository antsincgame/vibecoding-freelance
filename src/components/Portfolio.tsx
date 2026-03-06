import { useState, useEffect } from 'react';
import { Plus, X, ExternalLink, Loader2, Image as ImageIcon } from 'lucide-react';
import { getSupabase, getAccount } from '@vibecoding/shared';
import { uploadImage } from '../lib/upload';
import toast from 'react-hot-toast';

interface PortfolioItem {
  id: string;
  image: string;
  title: string;
  description: string;
  link: string;
  tags: string[];
}

interface Props {
  userId: string;
  editable?: boolean;
}

export default function Portfolio({ userId, editable = false }: Props) {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({ image: '', title: '', description: '', link: '', tags: '' });

  useEffect(() => { loadPortfolio(); }, [userId]);

  const loadPortfolio = async () => {
    setLoading(true);
    const db = getSupabase();
    const { data } = await db.from('fl_portfolio').select('*').eq('user_id', userId).order('$createdAt', { ascending: false });
    const rows = Array.isArray(data) ? data : data ? [data] : [];
    setItems(rows.map((r: any) => ({
      id: r.id,
      image: r.image || '',
      title: r.title || '',
      description: r.description || '',
      link: r.link || '',
      tags: Array.isArray(r.tags) ? r.tags : [],
    })));
    setLoading(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const url = await uploadImage(file);
    setUploading(false);
    if (url) setForm(prev => ({ ...prev, image: url }));
    else toast.error('Ошибка загрузки');
  };

  const handleAdd = async () => {
    if (!form.title.trim()) { toast.error('Укажите название'); return; }
    try {
      const acc = getAccount();
      const u = await acc.get();
      const db = getSupabase();
      await db.from('fl_portfolio').insert({
        user_id: u.$id,
        image: form.image,
        title: form.title,
        description: form.description,
        link: form.link,
        tags: JSON.stringify(form.tags.split(',').map(t => t.trim()).filter(Boolean)),
      });
      toast.success('Работа добавлена');
      setForm({ image: '', title: '', description: '', link: '', tags: '' });
      setAdding(false);
      loadPortfolio();
    } catch { toast.error('Ошибка'); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить?')) return;
    const db = getSupabase();
    await db.from('fl_portfolio').delete().eq('id', id);
    loadPortfolio();
  };

  const inputClass = 'w-full bg-gold/10 border border-gold/30 rounded-lg px-3 py-2 text-sm text-heading placeholder:text-muted focus:outline-none focus:border-gold';

  if (loading) return <div className="grid grid-cols-2 md:grid-cols-3 gap-4">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="aspect-video bg-gold/10 rounded-xl animate-pulse" />)}</div>;

  return (
    <div>
      {editable && (
        <div className="mb-4">
          {!adding ? (
            <button onClick={() => setAdding(true)} className="flex items-center gap-2 px-4 py-2 bg-gold/10 border border-gold/30 rounded-xl text-sm text-gold hover:bg-gold/20 transition-all cursor-pointer">
              <Plus size={16} /> Добавить работу
            </button>
          ) : (
            <div className="card p-5 space-y-3">
              <div className="flex gap-4">
                {form.image ? (
                  <div className="relative w-32 h-20 rounded-lg overflow-hidden flex-shrink-0">
                    <img src={form.image} alt="" className="w-full h-full object-cover" />
                    <button onClick={() => setForm(f => ({...f, image: ''}))} className="absolute top-1 right-1 w-5 h-5 bg-void/80 rounded-full flex items-center justify-center text-neon-rose cursor-pointer"><X size={10} /></button>
                  </div>
                ) : (
                  <label className={`w-32 h-20 rounded-lg border-2 border-dashed border-gold/20 flex items-center justify-center cursor-pointer hover:border-gold ${uploading ? 'opacity-50' : ''}`}>
                    {uploading ? <Loader2 size={18} className="animate-spin text-gold" /> : <ImageIcon size={18} className="text-muted" />}
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                  </label>
                )}
                <div className="flex-1 space-y-2">
                  <input placeholder="Название проекта" value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} className={inputClass} />
                  <input placeholder="Ссылка (опционально)" value={form.link} onChange={(e) => setForm({...form, link: e.target.value})} className={inputClass} />
                </div>
              </div>
              <input placeholder="Описание" value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} className={inputClass} />
              <input placeholder="Теги через запятую: React, AI, Bot" value={form.tags} onChange={(e) => setForm({...form, tags: e.target.value})} className={inputClass} />
              <div className="flex gap-2">
                <button onClick={handleAdd} className="px-4 py-2 text-sm bg-gold/20 text-gold rounded-lg hover:bg-gold/30 cursor-pointer">Добавить</button>
                <button onClick={() => setAdding(false)} className="px-4 py-2 text-sm text-muted rounded-lg hover:text-body cursor-pointer">Отмена</button>
              </div>
            </div>
          )}
        </div>
      )}

      {items.length === 0 ? (
        <p className="text-sm text-muted text-center py-8">{editable ? 'Добавьте примеры ваших работ' : 'Нет работ в портфолио'}</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {items.map((item) => (
            <div key={item.id} className="group relative rounded-xl overflow-hidden border border-gold/20 hover:border-gold/40 transition-all">
              <div className="aspect-video bg-nebula">
                {item.image ? (
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center"><ImageIcon size={32} className="text-muted/30" /></div>
                )}
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-void/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <p className="text-sm font-medium text-heading truncate">{item.title}</p>
                {item.description && <p className="text-xs text-muted truncate mt-0.5">{item.description}</p>}
                <div className="flex items-center gap-2 mt-1">
                  {item.tags.slice(0, 3).map(t => <span key={t} className="text-[9px] px-1.5 py-0.5 bg-gold/20 text-gold rounded">{t}</span>)}
                  {item.link && <a href={item.link} target="_blank" className="ml-auto text-gold"><ExternalLink size={12} /></a>}
                </div>
              </div>
              {editable && (
                <button onClick={() => handleDelete(item.id)} className="absolute top-2 right-2 w-6 h-6 bg-void/80 rounded-full flex items-center justify-center text-neon-rose opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"><X size={12} /></button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

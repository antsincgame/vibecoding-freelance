import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Upload, X, Loader2 } from 'lucide-react';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Skeleton from '../components/ui/Skeleton';
import { useGig, useCategories } from '../hooks/useData';
import { updateGig } from '../lib/freelance-db';
import { uploadImage } from '../lib/upload';
import AIGigAnalyzer from '../components/AIGigAnalyzer';
import toast from 'react-hot-toast';

export default function EditGig() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: gig, loading } = useGig(id);
  const { data: categories } = useCategories();
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [form, setForm] = useState({
    title: '', category_slug: '', description: '', tags: [] as string[], tagInput: '',
    images: [] as string[],
    economy: { price: '', days: '', desc: '', features: '' },
    standard: { price: '', days: '', desc: '', features: '' },
    premium: { price: '', days: '', desc: '', features: '' },
  });

  useEffect(() => {
    if (!gig) return;
    setForm({
      title: gig.title,
      category_slug: gig.categorySlug,
      description: gig.description,
      tags: gig.tags,
      tagInput: '',
      images: gig.images,
      economy: { price: String(gig.packages.economy.price), days: String(gig.packages.economy.deliveryDays), desc: gig.packages.economy.description, features: gig.packages.economy.features.join(', ') },
      standard: { price: String(gig.packages.standard.price), days: String(gig.packages.standard.deliveryDays), desc: gig.packages.standard.description, features: gig.packages.standard.features.join(', ') },
      premium: { price: String(gig.packages.premium.price), days: String(gig.packages.premium.deliveryDays), desc: gig.packages.premium.description, features: gig.packages.premium.features.join(', ') },
    });
  }, [gig]);

  const addTag = () => {
    if (form.tagInput.trim() && !form.tags.includes(form.tagInput.trim())) setForm({ ...form, tags: [...form.tags, form.tagInput.trim()], tagInput: '' });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    if (form.images.length >= 5) { toast.error('Максимум 5'); return; }
    setUploadingImage(true);
    for (const file of Array.from(files).slice(0, 5 - form.images.length)) {
      const url = await uploadImage(file);
      if (url) setForm(prev => ({ ...prev, images: [...prev.images, url] }));
    }
    setUploadingImage(false);
    e.target.value = '';
  };

  const removeImage = (idx: number) => setForm(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }));

  const handleSave = async () => {
    if (!id || !form.title) { toast.error('Заполните название'); return; }
    setSaving(true);
    const cat = (categories || []).find(c => c.slug === form.category_slug);
    const makePkg = (d: typeof form.economy) => ({
      name: '', price: Number(d.price) || 0, deliveryDays: Number(d.days) || 1, description: d.desc, features: d.features.split(',').map(f => f.trim()).filter(Boolean)
    });

    const ok = await updateGig(id, {
      title: form.title,
      description: form.description,
      short_description: form.title,
      category: cat?.name || form.category_slug,
      category_slug: form.category_slug,
      tags: form.tags,
      image: form.images[0] || '',
      images: form.images,
      packages: { economy: makePkg(form.economy), standard: makePkg(form.standard), premium: makePkg(form.premium) },
    });
    setSaving(false);
    if (ok) { toast.success('Сохранено!'); navigate('/dashboard/freelancer'); }
    else toast.error('Ошибка');
  };

  if (loading) return <div className="max-w-3xl mx-auto px-4 py-8"><Skeleton className="h-8 w-1/3 mb-6" /><div className="card p-6"><Skeleton className="h-60" /></div></div>;
  if (!gig) return <div className="max-w-3xl mx-auto px-4 py-20 text-center text-muted">Гиг не найден</div>;

  const inputClass = 'w-full bg-gold/10 border border-gold/30 rounded-xl px-4 py-3 text-sm text-heading placeholder:text-muted focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/40 transition-all';

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 pb-24">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-muted hover:text-gold mb-6 cursor-pointer">
        <ArrowLeft size={16} /> Назад
      </button>
      <h1 className="text-2xl font-bold text-heading mb-6">Редактировать гиг</h1>

      <div className="space-y-6">
        {/* Images */}
        <div className="card p-6">
          <h3 className="text-sm font-semibold text-heading mb-4">Изображения</h3>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
            {form.images.map((url, i) => (
              <div key={i} className="relative aspect-video rounded-lg overflow-hidden border border-gold/30">
                <img src={url} alt="" className="w-full h-full object-cover" />
                <button onClick={() => removeImage(i)} className="absolute top-1 right-1 w-5 h-5 rounded-full bg-void/80 flex items-center justify-center text-neon-rose cursor-pointer"><X size={10} /></button>
                {i === 0 && <span className="absolute bottom-1 left-1 text-[8px] bg-gold/80 text-void px-1 py-0.5 rounded font-bold">COVER</span>}
              </div>
            ))}
            {form.images.length < 5 && (
              <label className={`aspect-video rounded-lg border-2 border-dashed border-gold/20 hover:border-gold flex items-center justify-center cursor-pointer ${uploadingImage ? 'opacity-50' : ''}`}>
                {uploadingImage ? <Loader2 size={18} className="animate-spin text-gold" /> : <Upload size={18} className="text-muted" />}
                <input type="file" className="hidden" accept="image/*" multiple onChange={handleImageUpload} disabled={uploadingImage} />
              </label>
            )}
          </div>
        </div>

        {/* Basic info */}
        <div className="card p-6 space-y-4">
          <h3 className="text-sm font-semibold text-heading mb-2">Основное</h3>
          <div><label className="block text-xs text-muted mb-1">Название</label><input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputClass} /></div>
          <div><label className="block text-xs text-muted mb-1">Категория</label>
            <select value={form.category_slug} onChange={(e) => setForm({ ...form, category_slug: e.target.value })} className={`${inputClass} cursor-pointer`}>
              {(categories || []).map(c => <option key={c.slug} value={c.slug}>{c.name}</option>)}
            </select>
          </div>
          <div><label className="block text-xs text-muted mb-1">Описание</label><textarea rows={6} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={`${inputClass} resize-none`} /></div>
          <div><label className="block text-xs text-muted mb-1">Теги</label>
            <div className="flex gap-2">
              <input placeholder="React..." value={form.tagInput} onChange={(e) => setForm({ ...form, tagInput: e.target.value })} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())} className={inputClass} />
              <Button variant="secondary" size="md" onClick={addTag}>+</Button>
            </div>
            {form.tags.length > 0 && <div className="flex flex-wrap gap-2 mt-2">{form.tags.map(t => <Badge key={t} variant="green" className="cursor-pointer" onClick={() => setForm(prev => ({ ...prev, tags: prev.tags.filter(x => x !== t) }))}>{t} ×</Badge>)}</div>}
          </div>
        </div>

        {/* Packages */}
        <div className="card p-6 space-y-6">
          <h3 className="text-sm font-semibold text-heading">Пакеты</h3>
          {(['economy', 'standard', 'premium'] as const).map((pkg) => {
            const labels = { economy: 'Эконом', standard: 'Стандарт', premium: 'Премиум' };
            const d = form[pkg];
            return (
              <div key={pkg} className="space-y-3">
                <h4 className="text-sm font-medium text-heading">{labels[pkg]}</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="block text-[10px] text-muted mb-0.5">Цена ₽</label><input type="number" value={d.price} onChange={(e) => setForm({ ...form, [pkg]: { ...d, price: e.target.value } })} className={`${inputClass} font-mono`} /></div>
                  <div><label className="block text-[10px] text-muted mb-0.5">Дней</label><input type="number" value={d.days} onChange={(e) => setForm({ ...form, [pkg]: { ...d, days: e.target.value } })} className={`${inputClass} font-mono`} /></div>
                </div>
                <div><label className="block text-[10px] text-muted mb-0.5">Описание</label><input value={d.desc} onChange={(e) => setForm({ ...form, [pkg]: { ...d, desc: e.target.value } })} className={inputClass} /></div>
                <div><label className="block text-[10px] text-muted mb-0.5">Включено (через запятую)</label><input value={d.features} onChange={(e) => setForm({ ...form, [pkg]: { ...d, features: e.target.value } })} className={inputClass} /></div>
                {pkg !== 'premium' && <div className="border-b border-gold/15" />}
              </div>
            );
          })}
        </div>

        <AIGigAnalyzer title={form.title} description={form.description} tags={form.tags} price={Number(form.economy.price) || 0} />

        <Button variant="primary" size="lg" className="w-full" onClick={handleSave} disabled={saving}>
          <Save size={16} /> {saving ? 'Сохранение...' : 'Сохранить изменения'}
        </Button>
      </div>
    </div>
  );
}

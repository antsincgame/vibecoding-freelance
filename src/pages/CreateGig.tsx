import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Check, ArrowLeft, ArrowRight, Upload, Eye, X, Loader2 } from 'lucide-react';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { useCategories } from '../hooks/useData';
import { createGig } from '../lib/freelance-db';
import { uploadImage } from '../lib/upload';
import AIGigAnalyzer from '../components/AIGigAnalyzer';
import toast from 'react-hot-toast';

export default function CreateGig() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: categories } = useCategories();
  const [step, setStep] = useState(0);
  const [publishing, setPublishing] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [form, setForm] = useState({
    title: '', category: '', description: '', tags: [] as string[], tagInput: '',
    images: [] as string[],
    economy: { price: '', days: '', desc: '', features: '' },
    standard: { price: '', days: '', desc: '', features: '' },
    premium: { price: '', days: '', desc: '', features: '' },
  });

  const stepLabels = [t('create_gig.step_description'), t('create_gig.step_prices'), t('create_gig.step_media'), t('create_gig.step_publish')];
  const next = () => step < 3 && setStep(step + 1);
  const prev = () => step > 0 && setStep(step - 1);
  const addTag = () => {
    if (form.tagInput.trim() && !form.tags.includes(form.tagInput.trim())) setForm({ ...form, tags: [...form.tags, form.tagInput.trim()], tagInput: '' });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    if (form.images.length >= 5) { toast.error('Максимум 5 изображений'); return; }
    
    setUploadingImage(true);
    for (let i = 0; i < Math.min(files.length, 5 - form.images.length); i++) {
      const url = await uploadImage(files[i]);
      if (url) {
        setForm(prev => ({ ...prev, images: [...prev.images, url] }));
      } else {
        toast.error(`Ошибка загрузки ${files[i].name}`);
      }
    }
    setUploadingImage(false);
    e.target.value = '';
  };

  const removeImage = (idx: number) => {
    setForm(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }));
  };

  const handlePublish = async () => {
    if (!form.title) { toast.error('Укажите название'); return; }
    if (!form.category) { toast.error('Выберите категорию'); return; }
    if (!form.economy.price) { toast.error('Укажите цену эконом-пакета'); return; }
    
    setPublishing(true);
    const cat = (categories || []).find(c => c.slug === form.category);
    const makePkg = (d: typeof form.economy) => ({
      name: '', price: Number(d.price) || 0, deliveryDays: Number(d.days) || 1, description: d.desc, features: d.features.split(',').map(f => f.trim()).filter(Boolean)
    });

    const gig = await createGig({
      title: form.title,
      description: form.description,
      shortDescription: form.title,
      category: cat?.name || form.category,
      categorySlug: form.category,
      tags: form.tags,
      image: form.images[0] || '',
      images: form.images,
      packages: { economy: makePkg(form.economy), standard: makePkg(form.standard), premium: makePkg(form.premium) },
    });

    setPublishing(false);
    if (gig) { toast.success('Услуга опубликована!'); navigate('/dashboard/freelancer'); }
    else toast.error('Ошибка публикации');
  };

  const inputClass = 'w-full bg-cyber/10 border border-cyber/30 rounded-xl px-4 py-3.5 text-base text-heading placeholder:text-muted focus:outline-none focus:border-cyber focus:ring-1 focus:ring-cyber/40 transition-all';

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-8">
      <h1 className="text-2xl font-bold text-heading mb-8">{t('create_gig.title')}</h1>
      <div className="flex items-center gap-2 mb-10">
        {stepLabels.map((label, i) => (
          <div key={label} className="flex items-center gap-2 flex-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all ${i < step ? 'bg-neon-emerald text-void' : i === step ? 'border-2 border-cyber bg-cyber/10 text-[#00f5ff]' : 'bg-cyber/10 border border-cyber/20 text-muted'}`}>{i < step ? <Check size={14} /> : i + 1}</div>
            <span className={`text-xs hidden sm:block ${i === step ? 'text-[#00f5ff]' : 'text-muted'}`}>{label}</span>
            {i < stepLabels.length - 1 && <div className={`flex-1 h-px ${i < step ? 'bg-neon-emerald' : 'bg-cyber/10'}`} />}
          </div>
        ))}
      </div>
      <div className="card p-8">
        {step === 0 && (
          <div className="space-y-5">
            <div><label className="block text-sm text-muted mb-1.5">{t('create_gig.gig_title')}</label><input type="text" placeholder={t('create_gig.gig_title_placeholder')} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputClass} /></div>
            <div><label className="block text-sm text-muted mb-1.5">{t('create_gig.category')}</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={`${inputClass} appearance-none cursor-pointer`}>
                <option value="">{t('create_gig.select_category')}</option>
                {(categories || []).map((cat) => <option key={cat.slug} value={cat.slug}>{cat.name}</option>)}
              </select>
            </div>
            <div><label className="block text-sm text-muted mb-1.5">{t('create_gig.description')}</label><textarea rows={6} placeholder={t('create_gig.description_placeholder')} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={`${inputClass} resize-none`} /></div>
            <div><label className="block text-sm text-muted mb-1.5">{t('create_gig.technologies')}</label>
              <div className="flex gap-2">
                <input type="text" placeholder="React, Next.js..." value={form.tagInput} onChange={(e) => setForm({ ...form, tagInput: e.target.value })} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())} className={inputClass} />
                <Button variant="secondary" size="md" onClick={addTag}>+</Button>
              </div>
              {form.tags.length > 0 && <div className="flex flex-wrap gap-2 mt-3">{form.tags.map((tag) => <Badge key={tag} variant="green" className="cursor-pointer" onClick={() => setForm({ ...form, tags: form.tags.filter((t) => t !== tag) })}>{tag} ×</Badge>)}</div>}
            </div>
          </div>
        )}
        {step === 1 && (
          <div className="space-y-8">
            {(['economy', 'standard', 'premium'] as const).map((pkg) => {
              const labels = { economy: t('gig.economy'), standard: t('gig.standard'), premium: t('gig.premium') };
              const pkgData = form[pkg];
              return (
                <div key={pkg} className="space-y-4">
                  <h3 className="text-base font-semibold text-heading">{labels[pkg]}</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div><label className="block text-xs text-muted mb-1">{t('create_gig.price_label')}</label><input type="number" placeholder="0" value={pkgData.price} onChange={(e) => setForm({ ...form, [pkg]: { ...pkgData, price: e.target.value } })} className={`${inputClass} font-mono`} /></div>
                    <div><label className="block text-xs text-muted mb-1">{t('create_gig.deadline_label')}</label><input type="number" placeholder="3" value={pkgData.days} onChange={(e) => setForm({ ...form, [pkg]: { ...pkgData, days: e.target.value } })} className={`${inputClass} font-mono`} /></div>
                  </div>
                  <div><label className="block text-xs text-muted mb-1">{t('create_gig.package_desc')}</label><input type="text" placeholder={t('create_gig.package_desc_placeholder')} value={pkgData.desc} onChange={(e) => setForm({ ...form, [pkg]: { ...pkgData, desc: e.target.value } })} className={inputClass} /></div>
                  <div><label className="block text-xs text-muted mb-1">{t('create_gig.includes')}</label><input type="text" placeholder={t('create_gig.includes_placeholder')} value={pkgData.features} onChange={(e) => setForm({ ...form, [pkg]: { ...pkgData, features: e.target.value } })} className={inputClass} /></div>
                  {pkg !== 'premium' && <div className="border-b border-cyber/20" />}
                </div>
              );
            })}
          </div>
        )}
        {step === 2 && (
          <div className="space-y-6">
            <h3 className="text-base font-semibold text-heading">{t('create_gig.upload_images')}</h3>
            <div className="grid sm:grid-cols-3 gap-4">
              {form.images.map((url, i) => (
                <div key={i} className="relative aspect-video rounded-xl overflow-hidden border-2 border-cyber/30">
                  <img src={url} alt="" className="w-full h-full object-cover" />
                  <button onClick={() => removeImage(i)} className="absolute top-2 right-2 w-6 h-6 rounded-full bg-void/80 flex items-center justify-center text-neon-rose cursor-pointer hover:bg-void"><X size={12} /></button>
                  {i === 0 && <span className="absolute bottom-2 left-2 text-[10px] bg-cyber/80 text-void px-2 py-0.5 rounded font-bold">ГЛАВНАЯ</span>}
                </div>
              ))}
              {form.images.length < 5 && (
                <label className={`aspect-video rounded-xl border-2 border-dashed border-cyber/20 hover:border-cyber flex flex-col items-center justify-center gap-2 cursor-pointer transition-all hover:bg-cyber/10 ${uploadingImage ? 'opacity-50 pointer-events-none' : ''}`}>
                  {uploadingImage ? <Loader2 size={24} className="text-[#00f5ff] animate-spin" /> : <Upload size={24} className="text-muted" />}
                  <span className="text-xs text-muted">{uploadingImage ? 'Загрузка...' : `Фото ${form.images.length + 1}`}</span>
                  <input type="file" className="hidden" accept="image/*" multiple onChange={handleImageUpload} disabled={uploadingImage} />
                </label>
              )}
            </div>
            <p className="text-xs text-muted">Первое изображение — обложка. Максимум 5 фото. JPG, PNG, WebP.</p>
          </div>
        )}
        {step === 3 && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4"><Eye size={20} className="text-[#00f5ff]" /><h3 className="text-base font-semibold text-heading">{t('create_gig.preview')}</h3></div>
            {form.images.length > 0 && <img src={form.images[0]} alt="" className="w-full aspect-video object-cover rounded-xl mb-4" />}
            <AIGigAnalyzer title={form.title} description={form.description} tags={form.tags} price={Number(form.economy.price) || 0} />
            <div className="space-y-4">
              <div><p className="text-xs text-muted mb-1">{t('create_gig.gig_title')}</p><p className="text-lg font-medium text-heading">{form.title || t('gig.not_specified')}</p></div>
              <div><p className="text-xs text-muted mb-1">{t('create_gig.category')}</p><p className="text-sm text-body">{(categories || []).find((c) => c.slug === form.category)?.name || t('gig.not_selected')}</p></div>
              <div><p className="text-xs text-muted mb-1">{t('create_gig.description')}</p><p className="text-sm text-body leading-relaxed whitespace-pre-line">{form.description || t('gig.not_specified')}</p></div>
              {form.tags.length > 0 && <div><p className="text-xs text-muted mb-1">{t('create_gig.technologies')}</p><div className="flex flex-wrap gap-2">{form.tags.map((tag) => <Badge key={tag} variant="default">{tag}</Badge>)}</div></div>}
              <div className="border-t border-cyber/20 pt-4">
                <p className="text-xs text-muted mb-3">{t('create_gig.step_prices')}</p>
                <div className="grid sm:grid-cols-3 gap-4">
                  {(['economy', 'standard', 'premium'] as const).map((pkg) => {
                    const labels = { economy: t('gig.economy'), standard: t('gig.standard'), premium: t('gig.premium') };
                    const d = form[pkg];
                    return (<div key={pkg} className="bg-cyber/10 rounded-xl p-4 border border-cyber/20"><p className="text-sm font-semibold text-heading mb-2">{labels[pkg]}</p><p className="text-xl font-bold text-heading font-mono">{d.price ? `${Number(d.price).toLocaleString('ru-RU')} ₽` : '---'}</p><p className="text-xs text-muted mt-1">{d.days ? `${d.days} ${t('common.days')}` : '---'}</p></div>);
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-cyber/20">
          <Button variant="ghost" size="md" onClick={prev} disabled={step === 0}><ArrowLeft size={16} />{t('common.back')}</Button>
          {step < 3
            ? <Button variant="primary" size="md" onClick={next}>{t('common.next')}<ArrowRight size={16} /></Button>
            : <Button variant="primary" size="lg" onClick={handlePublish} disabled={publishing}>{publishing ? '...' : t('create_gig.publish_gig')}</Button>
          }
        </div>
      </div>
    </div>
  );
}

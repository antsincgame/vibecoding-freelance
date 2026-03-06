import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Check, ArrowLeft, ArrowRight, Upload, Eye } from 'lucide-react';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { useCategories } from '../hooks/useData';
import { createGig } from '../lib/freelance-db';
import toast from 'react-hot-toast';

export default function CreateGig() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: categories } = useCategories();
  const [step, setStep] = useState(0);
  const [publishing, setPublishing] = useState(false);
  const [form, setForm] = useState({
    title: '', category: '', description: '', tags: [] as string[], tagInput: '',
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

  const handlePublish = async () => {
    if (!form.title || !form.category) { toast.error('Заполните название и категорию'); return; }
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
      image: '',
      images: [],
      packages: { economy: makePkg(form.economy), standard: makePkg(form.standard), premium: makePkg(form.premium) },
    });

    setPublishing(false);
    if (gig) { toast.success('Услуга опубликована!'); navigate('/dashboard/freelancer'); } else { toast.error('Ошибка публикации'); }
  };

  const inputClass = 'w-full bg-gold/10 border border-gold/30 rounded-xl px-4 py-3 text-sm text-heading placeholder:text-muted focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/40 transition-all';

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-8">
      <h1 className="text-2xl font-bold text-heading mb-8">{t('create_gig.title')}</h1>
      <div className="flex items-center gap-2 mb-10">
        {stepLabels.map((label, i) => (
          <div key={label} className="flex items-center gap-2 flex-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all ${i < step ? 'bg-neon-emerald text-void' : i === step ? 'border-2 border-gold bg-gold/10 text-gold' : 'bg-gold/10 border border-gold/20 text-muted'}`}>{i < step ? <Check size={14} /> : i + 1}</div>
            <span className={`text-xs hidden sm:block ${i === step ? 'text-gold' : 'text-muted'}`}>{label}</span>
            {i < stepLabels.length - 1 && <div className={`flex-1 h-px ${i < step ? 'bg-neon-emerald' : 'bg-gold/10'}`} />}
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
              {form.tags.length > 0 && <div className="flex flex-wrap gap-2 mt-3">{form.tags.map((tag) => <Badge key={tag} variant="green" className="cursor-pointer" onClick={() => setForm({ ...form, tags: form.tags.filter((t) => t !== tag) })}>{tag} x</Badge>)}</div>}
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
                  {pkg !== 'premium' && <div className="border-b border-gold/20" />}
                </div>
              );
            })}
          </div>
        )}
        {step === 2 && (
          <div className="space-y-6">
            <h3 className="text-base font-semibold text-heading mb-4">{t('create_gig.upload_images')}</h3>
            <div className="grid sm:grid-cols-3 gap-4">
              {[1, 2, 3].map((n) => (
                <label key={n} className="aspect-video rounded-xl border-2 border-dashed border-gold/20 hover:border-gold flex flex-col items-center justify-center gap-2 cursor-pointer transition-all hover:bg-gold/10">
                  <Upload size={24} className="text-muted" /><span className="text-xs text-muted">{t('create_gig.image_n')} {n}</span><input type="file" className="hidden" accept="image/*" />
                </label>
              ))}
            </div>
            <p className="text-xs text-muted mt-2">{t('create_gig.image_hint')}</p>
          </div>
        )}
        {step === 3 && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4"><Eye size={20} className="text-gold" /><h3 className="text-base font-semibold text-heading">{t('create_gig.preview')}</h3></div>
            <div className="space-y-4">
              <div><p className="text-xs text-muted mb-1">{t('create_gig.gig_title')}</p><p className="text-lg font-medium text-heading">{form.title || t('gig.not_specified')}</p></div>
              <div><p className="text-xs text-muted mb-1">{t('create_gig.category')}</p><p className="text-sm text-body">{(categories || []).find((c) => c.slug === form.category)?.name || t('gig.not_selected')}</p></div>
              <div><p className="text-xs text-muted mb-1">{t('create_gig.description')}</p><p className="text-sm text-body leading-relaxed">{form.description || t('gig.not_specified')}</p></div>
              {form.tags.length > 0 && <div><p className="text-xs text-muted mb-1">{t('create_gig.technologies')}</p><div className="flex flex-wrap gap-2">{form.tags.map((tag) => <Badge key={tag} variant="default">{tag}</Badge>)}</div></div>}
              <div className="border-t border-gold/20 pt-4">
                <p className="text-xs text-muted mb-3">{t('create_gig.step_prices')}</p>
                <div className="grid sm:grid-cols-3 gap-4">
                  {(['economy', 'standard', 'premium'] as const).map((pkg) => {
                    const labels = { economy: t('gig.economy'), standard: t('gig.standard'), premium: t('gig.premium') };
                    const d = form[pkg];
                    return (<div key={pkg} className="bg-gold/10 rounded-xl p-4 border border-gold/20"><p className="text-sm font-semibold text-heading mb-2">{labels[pkg]}</p><p className="text-xl font-bold text-heading font-mono">{d.price ? `${Number(d.price).toLocaleString('ru-RU')} ₽` : '---'}</p><p className="text-xs text-muted mt-1">{d.days ? `${d.days} ${t('common.days')}` : '---'}</p></div>);
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-gold/20">
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

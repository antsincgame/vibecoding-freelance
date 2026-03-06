import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Save, ArrowLeft } from 'lucide-react';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Avatar from '../components/ui/Avatar';
import { useAuth } from '@vibecoding/shared';
import { getCurrentFreelancerProfile, updateFreelancerProfile } from '../lib/freelance-db';
import { uploadImage } from '../lib/upload';
import Portfolio from '../components/Portfolio';
import toast from 'react-hot-toast';

export default function EditProfile() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [userId, setUserId] = useState('');
  const [form, setForm] = useState({
    name: '', username: '', title: '', bio: '', location: '', avatar: '',
    skills: [] as string[], skillInput: '',
  });

  useEffect(() => {
    (async () => {
      const profile = await getCurrentFreelancerProfile();
      if (profile) {
        setUserId(profile.id);
        setForm({
          name: profile.name || '',
          username: profile.username || '',
          title: profile.title || '',
          bio: profile.bio || '',
          location: profile.location || '',
          avatar: profile.avatar || '',
          skills: profile.skills || [],
          skillInput: '',
        });
      }
      setLoading(false);
    })();
  }, []);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const url = await uploadImage(file);
    setUploading(false);
    if (url) setForm(prev => ({ ...prev, avatar: url }));
    else toast.error('Ошибка загрузки');
  };

  const addSkill = () => {
    const s = form.skillInput.trim();
    if (s && !form.skills.includes(s)) setForm(prev => ({ ...prev, skills: [...prev.skills, s], skillInput: '' }));
  };

  const handleSave = async () => {
    setSaving(true);
    const ok = await updateFreelancerProfile({
      name: form.name,
      title: form.title,
      bio: form.bio,
      location: form.location,
      avatar: form.avatar,
      skills: form.skills,
    });
    setSaving(false);
    if (ok) { toast.success('Профиль сохранён!'); navigate('/dashboard'); }
    else toast.error('Ошибка сохранения');
  };

  if (loading) return <div className="max-w-2xl mx-auto px-4 py-8"><div className="animate-pulse space-y-4"><div className="h-6 bg-[#00f5ff]/10 rounded w-1/3" /><div className="card p-6"><div className="h-40 bg-[#00f5ff]/10 rounded" /></div></div></div>;

  const inputClass = 'w-full bg-[#00f5ff]/10 border border-[#00f5ff]/30 rounded-xl px-4 py-3.5 text-base text-heading placeholder:text-muted focus:outline-none focus:border-[#00f5ff] focus:ring-1 focus:ring-[#00f5ff]/40 transition-all';

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 pb-24">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-muted hover:text-[#00f5ff] mb-6 cursor-pointer">
        <ArrowLeft size={16} /> Назад
      </button>

      <h1 className="text-2xl font-bold text-heading mb-6">Редактировать профиль</h1>

      <div className="card p-6 space-y-6">
        {/* Avatar */}
        <div className="flex items-center gap-6">
          <div className="relative">
            <Avatar src={form.avatar} alt={form.name} size="xl" />
            <label className={`absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#00f5ff]/80 flex items-center justify-center cursor-pointer hover:bg-[#00f5ff] transition-colors ${uploading ? 'opacity-50' : ''}`}>
              <Camera size={14} className="text-void" />
              <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} disabled={uploading} />
            </label>
          </div>
          <div>
            <p className="text-sm font-medium text-heading">{form.name || 'Ваше имя'}</p>
            <p className="text-xs text-muted">@{form.username}</p>
            {uploading && <p className="text-xs text-[#00f5ff] mt-1">Загрузка...</p>}
          </div>
        </div>

        {/* Name */}
        <div>
          <label className="block text-sm text-muted mb-1.5">Имя</label>
          <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} />
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm text-muted mb-1.5">Специализация</label>
          <input type="text" placeholder="Full-Stack Developer" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputClass} />
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm text-muted mb-1.5">Город</label>
          <input type="text" placeholder="Москва" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className={inputClass} />
        </div>

        {/* Bio */}
        <div>
          <label className="block text-sm text-muted mb-1.5">О себе</label>
          <textarea rows={4} placeholder="Расскажите о своём опыте и навыках..." value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} className={`${inputClass} resize-none`} />
        </div>

        {/* Skills */}
        <div>
          <label className="block text-sm text-muted mb-1.5">Навыки</label>
          <div className="flex gap-2">
            <input type="text" placeholder="React, Python..." value={form.skillInput} onChange={(e) => setForm({ ...form, skillInput: e.target.value })} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())} className={inputClass} />
            <Button variant="secondary" size="md" onClick={addSkill}>+</Button>
          </div>
          {form.skills.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {form.skills.map((s) => (
                <Badge key={s} variant="green" className="cursor-pointer" onClick={() => setForm(prev => ({ ...prev, skills: prev.skills.filter(x => x !== s) }))}>
                  {s} ×
                </Badge>
              ))}
            </div>
          )}
        </div>

        <Button variant="primary" size="lg" className="w-full" onClick={handleSave} disabled={saving}>
          <Save size={16} /> {saving ? 'Сохранение...' : 'Сохранить'}
        </Button>
      </div>

      {/* Portfolio */}
      {userId && (
        <div className="mt-8">
          <h2 className="text-xl font-bold text-heading mb-4">Портфолио</h2>
          <Portfolio userId={userId} editable={true} />
        </div>
      )}
    </div>
  );
}

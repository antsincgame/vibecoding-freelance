import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Zap, AtSign, MapPin, Briefcase, Code, ArrowRight } from 'lucide-react';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { useAuth } from '@vibecoding/shared';
import { createFreelancerProfile } from '../lib/freelance-db';
import toast from 'react-hot-toast';

export default function SetupProfile() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    username: '',
    title: '',
    bio: '',
    location: '',
    skills: [] as string[],
    skillInput: '',
    role: 'freelancer' as 'freelancer' | 'client',
  });

  const addSkill = () => {
    const s = form.skillInput.trim();
    if (s && !form.skills.includes(s)) setForm({ ...form, skills: [...form.skills, s], skillInput: '' });
  };

  const handleSubmit = async () => {
    if (!form.username.trim()) { toast.error('Укажите имя пользователя'); return; }
    if (form.username.length < 3) { toast.error('Минимум 3 символа'); return; }

    setLoading(true);
    const ok = await createFreelancerProfile({
      username: form.username.toLowerCase().replace(/[^a-z0-9_]/g, ''),
      name: profile?.full_name || user?.name || form.username,
      avatar: profile?.avatar_url || '',
      title: form.title,
      bio: form.bio,
      location: form.location,
      skills: form.skills,
      role: form.role,
    });
    setLoading(false);

    if (ok) {
      toast.success('Профиль создан!');
      navigate(form.role === 'freelancer' ? '/dashboard/freelancer' : '/dashboard');
    } else {
      toast.error('Ошибка — возможно username уже занят');
    }
  };

  const inputClass = 'w-full bg-gold/10 border border-gold/30 rounded-xl px-4 py-3 pl-10 text-sm text-heading placeholder:text-muted focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/40 transition-all';

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 sacred-bg">
      <div className="w-full max-w-lg space-y-8">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 mb-6">
            <Zap size={28} className="text-gold" />
            <span className="text-2xl font-display font-bold tracking-wider text-gold-gradient">VIBECODER</span>
          </div>
          <h1 className="text-2xl font-heading font-bold text-heading">Добро пожаловать!</h1>
          <p className="text-sm text-muted mt-1">Настройте профиль чтобы начать</p>
        </div>

        <div className="card p-8 space-y-6">
          {/* Role */}
          <div>
            <p className="text-sm text-muted mb-2">Я хочу...</p>
            <div className="flex gap-3">
              <button
                onClick={() => setForm({ ...form, role: 'freelancer' })}
                className={`flex-1 py-4 text-sm rounded-xl border transition-all cursor-pointer text-center ${form.role === 'freelancer' ? 'border-gold bg-gold/10 text-gold' : 'border-gold/20 text-muted hover:text-body'}`}
              >
                <Code size={20} className="mx-auto mb-1" />
                Предлагать услуги
              </button>
              <button
                onClick={() => setForm({ ...form, role: 'client' })}
                className={`flex-1 py-4 text-sm rounded-xl border transition-all cursor-pointer text-center ${form.role === 'client' ? 'border-gold bg-gold/10 text-gold' : 'border-gold/20 text-muted hover:text-body'}`}
              >
                <Briefcase size={20} className="mx-auto mb-1" />
                Заказывать услуги
              </button>
            </div>
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm text-muted mb-1.5">Имя пользователя *</label>
            <div className="relative">
              <AtSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type="text"
                placeholder="myusername"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '') })}
                className={inputClass}
              />
            </div>
            <p className="text-xs text-muted mt-1">Латиница, цифры, подчёркивание. Будет в URL: /users/{form.username || '...'}</p>
          </div>

          {/* Title */}
          {form.role === 'freelancer' && (
            <div>
              <label className="block text-sm text-muted mb-1.5">Специализация</label>
              <div className="relative">
                <Briefcase size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  type="text"
                  placeholder="Full-Stack Developer"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className={inputClass}
                />
              </div>
            </div>
          )}

          {/* Location */}
          <div>
            <label className="block text-sm text-muted mb-1.5">Город</label>
            <div className="relative">
              <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type="text"
                placeholder="Москва"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className={inputClass}
              />
            </div>
          </div>

          {/* Skills (for freelancers) */}
          {form.role === 'freelancer' && (
            <div>
              <label className="block text-sm text-muted mb-1.5">Навыки</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="React, Python, Figma..."
                  value={form.skillInput}
                  onChange={(e) => setForm({ ...form, skillInput: e.target.value })}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                  className="w-full bg-gold/10 border border-gold/30 rounded-xl px-4 py-3 text-sm text-heading placeholder:text-muted focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/40 transition-all"
                />
                <Button variant="secondary" size="md" onClick={addSkill}>+</Button>
              </div>
              {form.skills.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {form.skills.map((s) => (
                    <Badge key={s} variant="green" className="cursor-pointer" onClick={() => setForm({ ...form, skills: form.skills.filter(x => x !== s) })}>
                      {s} ×
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Bio */}
          {form.role === 'freelancer' && (
            <div>
              <label className="block text-sm text-muted mb-1.5">О себе</label>
              <textarea
                rows={3}
                placeholder="Расскажите о своём опыте..."
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                className="w-full bg-gold/10 border border-gold/30 rounded-xl px-4 py-3 text-sm text-heading placeholder:text-muted focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/40 transition-all resize-none"
              />
            </div>
          )}

          <Button variant="primary" size="lg" className="w-full" onClick={handleSubmit} disabled={loading}>
            {loading ? '...' : 'Создать профиль'}
            {!loading && <ArrowRight size={18} />}
          </Button>
        </div>
      </div>
    </div>
  );
}

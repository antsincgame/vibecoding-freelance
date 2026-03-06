import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@vibecoding/shared';
import { Mail, Lock, User, Github, Globe, Eye, EyeOff } from 'lucide-react';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';

type AuthMode = 'login' | 'register';
type Role = 'client' | 'freelancer';

export default function Auth() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, signIn, signUp, signInWithGoogle } = useAuth();
  const [searchParams] = useSearchParams();
  const [mode, setMode] = useState<AuthMode>('login');
  const [role, setRole] = useState<Role>('client');
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'signup' || tab === 'register') {
      setMode('register');
    }
  }, [searchParams]);

  if (user) {
    navigate('/dashboard', { replace: true });
    return null;
  }

  const validate = () => {
    const e: Record<string, string> = {};
    if (mode === 'register' && !form.name.trim()) e.name = t('auth.enter_name');
    if (!form.email.includes('@')) e.email = t('auth.invalid_email');
    if (form.password.length < 6) e.password = t('auth.min_6_chars');
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    try {
      if (mode === 'login') {
        const { error } = await signIn(form.email, form.password);
        if (error) {
          toast.error(error.message || 'Ошибка входа');
        } else {
          toast.success('Вы вошли!');
          navigate('/dashboard', { replace: true });
        }
      } else {
        const { error } = await signUp(form.email, form.password, form.name);
        if (error) {
          toast.error(error.message || 'Ошибка регистрации');
        } else {
          toast.success('Проверьте email для подтверждения');
        }
      }
    } catch (err: any) {
      toast.error(err.message || 'Ошибка');
    }
    setLoading(false);
  };

  const handleGoogle = async () => {
    const { error } = await signInWithGoogle();
    if (error) toast.error(error.message);
  };

  const inputClass = (field: string) =>
    `w-full bg-[#0d0d1a] border ${errors[field] ? 'border-rose-700' : 'border-[rgba(255,215,0,0.1)] focus:border-[#ffd700]'} rounded px-4 py-3 pl-10 text-sm text-white placeholder:text-[rgba(255,255,255,0.3)] focus:outline-none focus:ring-1 focus:ring-[rgba(255,215,0,0.2)] focus:shadow-[0_0_15px_rgba(255,215,0,0.06)] transition-all duration-300`;

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 sacred-bg relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[radial-gradient(ellipse_at_center,rgba(255,215,0,0.06)_0%,transparent_60%)] animate-glow-breathe pointer-events-none" />
      <div className="w-full max-w-md space-y-8 relative z-10">
        <div className="text-center">
          <h1 className="text-2xl font-display font-bold tracking-[0.1em] uppercase quantum-shimmer">
            {mode === 'login' ? t('auth.welcome') : t('auth.create_account')}
          </h1>
          <p className="text-sm text-[rgba(255,255,255,0.4)] mt-1 tracking-wide">
            {mode === 'login' ? t('auth.login_to_account') : t('auth.join_vibecoder')}
          </p>
        </div>

        <div className="card p-8 space-y-6">
          <div className="flex rounded overflow-hidden border border-[rgba(255,215,0,0.1)]">
            <button
              onClick={() => { setMode('login'); setErrors({}); }}
              className={`flex-1 py-3 text-sm font-medium text-center tracking-wider uppercase transition-all cursor-pointer font-heading ${
                mode === 'login' ? 'bg-[rgba(255,215,0,0.08)] text-[#ffd700]' : 'text-[rgba(255,255,255,0.4)] hover:text-white'
              }`}
            >
              {t('auth.tab_login')}
            </button>
            <button
              onClick={() => { setMode('register'); setErrors({}); }}
              className={`flex-1 py-3 text-sm font-medium text-center tracking-wider uppercase transition-all cursor-pointer font-heading ${
                mode === 'register' ? 'bg-[rgba(255,215,0,0.08)] text-[#ffd700]' : 'text-[rgba(255,255,255,0.4)] hover:text-white'
              }`}
            >
              {t('auth.tab_register')}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <div className="relative">
                  <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[rgba(255,255,255,0.3)]" />
                  <input type="text" placeholder={t('auth.name')} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass('name')} />
                </div>
                {errors.name && <p className="text-xs text-rose-500 mt-1">{errors.name}</p>}
              </div>
            )}
            <div>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[rgba(255,255,255,0.3)]" />
                <input type="email" placeholder={t('auth.email')} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputClass('email')} />
              </div>
              {errors.email && <p className="text-xs text-rose-500 mt-1">{errors.email}</p>}
            </div>
            <div>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[rgba(255,255,255,0.3)]" />
                <input type={showPassword ? 'text' : 'password'} placeholder={t('auth.password')} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className={inputClass('password')} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[rgba(255,255,255,0.3)] hover:text-white cursor-pointer">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-rose-500 mt-1">{errors.password}</p>}
            </div>

            {mode === 'register' && (
              <div>
                <p className="text-sm text-[rgba(255,255,255,0.4)] mb-2 tracking-wide">{t('auth.role')}</p>
                <div className="flex gap-3">
                  <button type="button" onClick={() => setRole('client')}
                    className={`flex-1 py-3 text-sm rounded border transition-all cursor-pointer tracking-wider uppercase font-heading ${role === 'client' ? 'border-[#ffd700] bg-[rgba(255,215,0,0.08)] text-[#ffd700]' : 'border-[rgba(255,215,0,0.1)] text-[rgba(255,255,255,0.4)] hover:text-white'}`}>
                    {t('auth.customer')}
                  </button>
                  <button type="button" onClick={() => setRole('freelancer')}
                    className={`flex-1 py-3 text-sm rounded border transition-all cursor-pointer tracking-wider uppercase font-heading ${role === 'freelancer' ? 'border-[#ffd700] bg-[rgba(255,215,0,0.08)] text-[#ffd700]' : 'border-[rgba(255,215,0,0.1)] text-[rgba(255,255,255,0.4)] hover:text-white'}`}>
                    {t('auth.freelancer')}
                  </button>
                </div>
              </div>
            )}

            <Button type="submit" variant="primary" size="lg" className="w-full" disabled={loading}>
              {loading ? '...' : mode === 'login' ? t('auth.loginButton') : t('auth.registerButton')}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[rgba(255,215,0,0.08)]" /></div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-[#12121f] px-3 text-[rgba(255,255,255,0.35)]">{t('auth.orContinueWith')}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <button onClick={handleGoogle}
              className="flex items-center justify-center gap-2 py-3 rounded border border-[rgba(255,215,0,0.1)] text-sm text-[rgba(255,255,255,0.5)] hover:text-[#ffd700] hover:border-[rgba(255,215,0,0.25)] hover:shadow-[0_0_15px_rgba(255,215,0,0.06)] transition-all duration-300 cursor-pointer tracking-wider uppercase font-heading">
              <Globe size={16} />
              <span>Google</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

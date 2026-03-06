import { Link } from 'react-router-dom';
import { Zap, ShieldCheck, TrendingUp, Users, ArrowRight, Check, Star, Rocket, Clock, DollarSign, Award } from 'lucide-react';
import Button from '../components/ui/Button';
import SEO from '../components/SEO';

export default function ForSellers() {
  const steps = [
    { num: '01', title: 'Создайте профиль', desc: 'Зарегистрируйтесь, укажите навыки, загрузите портфолио. Это займёт 5 минут.', icon: Users },
    { num: '02', title: 'Опубликуйте услугу', desc: 'Опишите что вы делаете, установите цены пакетов, добавьте примеры работ.', icon: Rocket },
    { num: '03', title: 'Получайте заказы', desc: 'Заказчики находят вас в каталоге или бирже проектов. Общайтесь в чате.', icon: Clock },
    { num: '04', title: 'Выполняйте и растите', desc: 'Сдавайте работу, получайте отзывы, повышайте рейтинг и доход.', icon: TrendingUp },
  ];

  const benefits = [
    { icon: DollarSign, title: '0% комиссия', desc: 'Мы не берём комиссию с исполнителей. Всё что заработали — ваше.' },
    { icon: ShieldCheck, title: 'Безопасная сделка', desc: 'Деньги замораживаются при заказе и переводятся вам после принятия работы.' },
    { icon: Users, title: 'Поток заказчиков', desc: 'Не нужно искать клиентов — они приходят к вам через каталог и биржу.' },
    { icon: Star, title: 'Система рейтинга', desc: 'Чем лучше работаете — тем выше рейтинг. PRO-статус даёт максимум заказов.' },
    { icon: Award, title: 'Верификация', desc: 'Пройдите верификацию и получите знак доверия — заказчики выбирают проверенных.' },
    { icon: Zap, title: 'AI-инструменты', desc: 'Используйте AI для ускорения работы. Вайб-кодинг — это быстрее и дешевле.' },
  ];

  const levels = [
    { name: 'Новичок', color: 'text-muted', requirement: 'Регистрация', perks: ['Доступ к каталогу', 'До 5 услуг', 'Базовый профиль'] },
    { name: 'Верифицирован', color: 'text-neon-cyan', requirement: '5+ заказов, 4.5+ рейтинг', perks: ['Синяя галочка', 'До 15 услуг', 'Приоритет в выдаче'] },
    { name: 'PRO', color: 'text-[#00f5ff]', requirement: '20+ заказов, 4.8+ рейтинг', perks: ['Золотой бейдж', 'Безлимит услуг', 'Топ выдачи', 'Участие в промо'] },
  ];

  return (
    <div className="pb-20 md:pb-0">
      <SEO title="Стать фрилансером" description="Начните зарабатывать на VibeCoder. 0% комиссия, безопасные сделки, AI-инструменты." />

      {/* Hero */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden sacred-bg">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(ellipse_at_center,rgba(0,255,249,0.12)_0%,transparent_60%)]" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center py-20 space-y-8">
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-[0.08em] uppercase leading-[1.1]">
            <span className="neon-text text-[var(--neon-cyan)]">Зарабатывайте</span><br />
            <span className="text-heading text-3xl sm:text-4xl tracking-[0.12em]">на своих навыках</span>
          </h1>
          <p className="text-lg text-body max-w-2xl mx-auto font-heading font-light">
            VibeCoder — маркетплейс нового поколения для AI-разработчиков и вайб-кодеров. Без комиссии, с безопасными сделками и потоком заказчиков.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/auth"><Button variant="primary" size="lg">Начать зарабатывать <ArrowRight size={18} /></Button></Link>
            <a href="#how"><Button variant="secondary" size="lg">Как это работает</Button></a>
          </div>
          <div className="flex items-center justify-center gap-8 text-sm text-muted pt-4">
            <span className="flex items-center gap-1"><Check size={14} className="text-neon-green" /> Бесплатно</span>
            <span className="flex items-center gap-1"><Check size={14} className="text-neon-green" /> 0% комиссия</span>
            <span className="flex items-center gap-1"><Check size={14} className="text-neon-green" /> Безопасные сделки</span>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-14">
          <h2 className="font-display text-3xl font-bold text-neon-gradient tracking-[0.1em] uppercase mb-4">Почему VibeCoder</h2>
          <p className="text-body font-heading font-light">Преимущества для фрилансеров</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((b, i) => (
            <div key={i} className="card p-7 group hover:border-cyber/30 transition-all">
              <div className="w-14 h-14 rounded-2xl bg-cyber/10 border border-cyber/30 flex items-center justify-center mb-5 group-hover:shadow-[0_0_20px_rgba(0,255,249,0.2)] transition-all">
                <b.icon size={26} className="text-[#00f5ff]" />
              </div>
              <h3 className="text-base font-heading font-semibold text-heading mb-2">{b.title}</h3>
              <p className="text-sm text-body leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-24 relative">
        <div className="absolute inset-0 bg-deep-space sacred-bg" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl font-bold text-neon-gradient tracking-[0.1em] uppercase mb-4">Как начать</h2>
            <p className="text-body font-heading font-light">4 простых шага до первого заказа</p>
          </div>
          <div className="space-y-8">
            {steps.map((step, i) => (
              <div key={i} className="flex items-start gap-6 card p-6">
                <div className="w-16 h-16 rounded-2xl bg-cyber/10 border border-cyber/30 flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl font-display font-bold text-[#00f5ff]">{step.num}</span>
                </div>
                <div>
                  <h3 className="text-lg font-heading font-semibold text-heading mb-1">{step.title}</h3>
                  <p className="text-sm text-body leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Levels */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-24">
        <div className="text-center mb-14">
          <h2 className="font-display text-3xl font-bold text-neon-gradient tracking-[0.1em] uppercase mb-4">Уровни продавца</h2>
          <p className="text-body font-heading font-light">Растите вместе с нами</p>
        </div>
        <div className="grid sm:grid-cols-3 gap-6">
          {levels.map((level, i) => (
            <div key={i} className="card p-6 text-center hover:border-cyber/30 transition-all">
              <div className={`text-xl font-display font-bold ${level.color} mb-3`}>{level.name}</div>
              <p className="text-xs text-muted mb-4">{level.requirement}</p>
              <div className="space-y-2">
                {level.perks.map(perk => (
                  <div key={perk} className="flex items-center gap-2 text-sm text-body">
                    <Check size={14} className="text-neon-green flex-shrink-0" /> {perk}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-24">
        <div className="card p-12 sm:p-16 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-cyber/5 via-transparent to-neon-pink/5" />
          <div className="relative z-10 space-y-6">
            <h2 className="font-display text-3xl font-bold text-neon-gradient tracking-[0.08em] uppercase">Готовы начать?</h2>
            <p className="text-body max-w-lg mx-auto">Создайте профиль за 5 минут и опубликуйте первую услугу. Заказчики уже ждут.</p>
            <Link to="/auth"><Button variant="primary" size="lg">Зарегистрироваться <ArrowRight size={18} /></Button></Link>
          </div>
        </div>
      </section>
    </div>
  );
}

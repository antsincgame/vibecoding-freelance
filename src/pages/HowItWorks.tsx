import { Link } from 'react-router-dom';
import { Search, ShoppingBag, MessageCircle, Check, Star, Shield, Zap, ArrowRight, Users, Bot, Rocket, Clock, Award } from 'lucide-react';
import Button from '../components/ui/Button';
import SEO from '../components/SEO';

export default function HowItWorks() {
  const buyerSteps = [
    { icon: Search, title: 'Найдите услугу', desc: 'Воспользуйтесь каталогом или AI-подбором. Широкий выбор услуг от проверенных вайб-кодеров и AI-разработчиков.' },
    { icon: ShoppingBag, title: 'Оформите заказ', desc: 'Выберите пакет (Эконом/Стандарт/Премиум), опишите задачу и отправьте заказ. Деньги замораживаются на счёте платформы.' },
    { icon: MessageCircle, title: 'Работа и общение', desc: 'Общайтесь с исполнителем в чате, отслеживайте прогресс. Фрилансер сдаёт работу — вы проверяете.' },
    { icon: Check, title: 'Примите результат', desc: 'Если всё отлично — подтвердите. Если нужна доработка — запросите. Деньги переводятся исполнителю только после вашего одобрения.' },
    { icon: Star, title: 'Оставьте отзыв', desc: 'Поделитесь впечатлениями — это поможет другим заказчикам и мотивирует фрилансера.' },
  ];

  const sellerSteps = [
    { icon: Users, title: 'Создайте профиль', desc: 'Укажите навыки, загрузите аватар и портфолио. Пройдите верификацию для повышения доверия.' },
    { icon: Rocket, title: 'Опубликуйте услуги', desc: 'Создайте кворки с описанием, пакетами и ценами. AI-анализатор поможет оптимизировать карточку.' },
    { icon: Bot, title: 'Получайте заказы', desc: 'Заказчики найдут вас через каталог, AI-подбор или биржу проектов. Примите заказ и начните работу.' },
    { icon: Clock, title: 'Выполняйте в срок', desc: 'Сдавайте качественную работу вовремя. Это ключ к высокому рейтингу и повторным заказам.' },
    { icon: Award, title: 'Растите в рейтинге', desc: 'Новичок → Верифицирован → PRO. Чем выше уровень — тем больше заказов и доверия.' },
  ];

  const guarantees = [
    { icon: Shield, title: 'Безопасная сделка', desc: 'Деньги замораживаются до принятия работы. 100% возврат при невыполнении.' },
    { icon: Zap, title: '0% комиссия', desc: 'Мы не берём комиссию. Фрилансер получает всю сумму заказа.' },
    { icon: Star, title: 'Проверенные исполнители', desc: 'Система рейтингов, верификация, модерация — только качественные специалисты.' },
    { icon: Bot, title: 'AI-инструменты', desc: 'AI-подбор исполнителя, AI-анализ кворков, Vibe Score — технологии нового поколения.' },
  ];

  return (
    <div className="pb-20 md:pb-0">
      <SEO title="Как это работает" description="Узнайте как заказать услугу или начать зарабатывать на VibeCoder — фриланс-маркетплейсе AI-разработчиков." />

      {/* Hero */}
      <section className="py-20 text-center px-4">
        <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-[0.08em] uppercase mb-4">
          <span className="neon-text text-[var(--neon-cyan)]">Как это</span>{' '}
          <span className="text-heading">работает</span>
        </h1>
        <p className="text-lg text-body max-w-2xl mx-auto font-heading font-light">Простой и безопасный процесс для заказчиков и фрилансеров</p>
      </section>

      {/* For Buyers */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="font-display text-2xl font-bold text-gold-gradient tracking-[0.1em] uppercase mb-2">Для заказчиков</h2>
          <p className="text-body text-sm">5 шагов до результата</p>
        </div>
        <div className="space-y-6">
          {buyerSteps.map((step, i) => (
            <div key={i} className="flex items-start gap-5 card p-6">
              <div className="w-14 h-14 rounded-2xl bg-neon-cyan/10 border border-neon-cyan/30 flex items-center justify-center flex-shrink-0">
                <span className="text-xl font-display font-bold text-neon-cyan">{i + 1}</span>
              </div>
              <div>
                <h3 className="text-base font-heading font-semibold text-heading mb-1 flex items-center gap-2">
                  <step.icon size={18} className="text-neon-cyan" /> {step.title}
                </h3>
                <p className="text-sm text-body leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link to="/categories/all"><Button variant="primary" size="lg">Найти услугу <ArrowRight size={18} /></Button></Link>
        </div>
      </section>

      {/* For Sellers */}
      <section className="py-16 relative">
        <div className="absolute inset-0 bg-deep-space sacred-bg" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="font-display text-2xl font-bold text-gold-gradient tracking-[0.1em] uppercase mb-2">Для фрилансеров</h2>
            <p className="text-body text-sm">5 шагов до первого заработка</p>
          </div>
          <div className="space-y-6">
            {sellerSteps.map((step, i) => (
              <div key={i} className="flex items-start gap-5 card p-6">
                <div className="w-14 h-14 rounded-2xl bg-gold/10 border border-gold/30 flex items-center justify-center flex-shrink-0">
                  <span className="text-xl font-display font-bold text-gold">{i + 1}</span>
                </div>
                <div>
                  <h3 className="text-base font-heading font-semibold text-heading mb-1 flex items-center gap-2">
                    <step.icon size={18} className="text-gold" /> {step.title}
                  </h3>
                  <p className="text-sm text-body leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/for-sellers"><Button variant="primary" size="lg">Стать фрилансером <ArrowRight size={18} /></Button></Link>
          </div>
        </div>
      </section>

      {/* Guarantees */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="font-display text-2xl font-bold text-gold-gradient tracking-[0.1em] uppercase mb-2">Гарантии</h2>
        </div>
        <div className="grid sm:grid-cols-2 gap-6">
          {guarantees.map((g, i) => (
            <div key={i} className="card p-6 flex items-start gap-4">
              <g.icon size={24} className="text-gold flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-heading font-semibold text-heading mb-1">{g.title}</h3>
                <p className="text-xs text-body leading-relaxed">{g.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <div className="card p-10 text-center">
          <h2 className="text-2xl font-bold text-heading mb-4">Остались вопросы?</h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/faq"><Button variant="secondary" size="md">FAQ</Button></Link>
            <Link to="/support"><Button variant="secondary" size="md">Поддержка</Button></Link>
          </div>
        </div>
      </section>
    </div>
  );
}

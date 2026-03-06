import { Calendar, ArrowRight, Zap, Bot, Shield, Star, Rocket, Award } from 'lucide-react';
import SEO from '../components/SEO';

const news = [
  {
    date: '6 марта 2026',
    title: '🚀 Запуск VibeCoder — маркетплейс AI-разработчиков',
    content: 'Мы рады представить VibeCoder — первый фриланс-маркетплейс, созданный специально для вайб-кодеров и AI-разработчиков. Наша миссия — сделать разработку доступной через AI-инструменты нового поколения.',
    tags: ['Запуск', 'Платформа'],
    icon: Rocket,
    color: 'text-neon-cyan',
  },
  {
    date: '6 марта 2026',
    title: '🤖 AI-функции: подбор специалиста, анализ кворков, Vibe Score',
    content: 'В отличие от других бирж фриланса, VibeCoder использует AI на каждом шагу. AI-матчинг подберёт лучшего исполнителя для вашей задачи. AI-анализатор поможет фрилансерам оптимизировать карточки услуг. А Vibe Score покажет реальный уровень вайб-кодера.',
    tags: ['AI', 'Фичи'],
    icon: Bot,
    color: 'text-accent-violet',
  },
  {
    date: '6 марта 2026',
    title: '⚡ Вайб-кодинг: MVP за 1-3 дня',
    content: 'Благодаря AI-инструментам (Cursor, Claude, v0, Bolt) наши фрилансеры создают полноценные MVP за 1-3 дня вместо недель. Лендинги, SaaS, боты, мобильные приложения — всё в разы быстрее и дешевле.',
    tags: ['Вайб-кодинг', 'Тренды'],
    icon: Zap,
    color: 'text-gold',
  },
  {
    date: '6 марта 2026',
    title: '🛡 Безопасные сделки и 0% комиссия',
    content: 'Все заказы на VibeCoder защищены системой безопасной сделки. Деньги замораживаются до принятия работы. При этом мы не берём комиссию ни с заказчиков, ни с фрилансеров. Нулевая комиссия — наш подарок первым пользователям.',
    tags: ['Безопасность', 'Финансы'],
    icon: Shield,
    color: 'text-neon-green',
  },
  {
    date: '6 марта 2026',
    title: '🏆 Система уровней и достижений',
    content: 'Мы внедрили геймификацию: 15 достижений, 3 уровня продавца (Новичок → Верифицирован → PRO), Vibe Score. Верифицированные фрилансеры получают приоритет в выдаче и больше заказов.',
    tags: ['Геймификация', 'Уровни'],
    icon: Award,
    color: 'text-accent-amber',
  },
  {
    date: '6 марта 2026',
    title: '📱 Биржа проектов — разместите задачу',
    content: 'Теперь заказчики могут размещать задачи на бирже проектов. Укажите бюджет, сроки и описание — фрилансеры сами предложат свои решения. AI-матчинг дополнительно подберёт лучших специалистов.',
    tags: ['Биржа', 'Проекты'],
    icon: Star,
    color: 'text-neon-rose',
  },
];

export default function News() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 pb-24">
      <SEO title="Новости" description="Последние обновления и новости фриланс-маркетплейса VibeCoder." />

      <div className="text-center mb-12">
        <h1 className="font-display text-3xl font-bold text-gold-gradient tracking-[0.08em] uppercase mb-3">Новости</h1>
        <p className="text-body font-heading font-light">Обновления и события на платформе</p>
      </div>

      <div className="space-y-6">
        {news.map((item, i) => {
          const Icon = item.icon;
          return (
            <article key={i} className="card p-6 hover:border-gold/30 transition-all">
              <div className="flex items-start gap-5">
                <div className={`w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 ${item.color}`}>
                  <Icon size={22} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="flex items-center gap-1 text-xs text-muted"><Calendar size={12} /> {item.date}</span>
                    {item.tags.map(tag => (
                      <span key={tag} className="text-[10px] px-2 py-0.5 bg-gold/10 text-muted rounded-full border border-gold/20">{tag}</span>
                    ))}
                  </div>
                  <h2 className="text-base font-heading font-semibold text-heading mb-2">{item.title}</h2>
                  <p className="text-sm text-body leading-relaxed">{item.content}</p>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <div className="text-center mt-12 text-sm text-muted">
        Следите за обновлениями в нашем{' '}
        <a href="https://t.me/vibecoding" target="_blank" className="text-gold hover:underline">Telegram канале</a>
      </div>
    </div>
  );
}

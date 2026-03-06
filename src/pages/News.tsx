import { useState } from 'react';
import { Calendar, Zap, Bot, Shield, Star, Rocket, Award, ChevronDown, Share2 } from 'lucide-react';
import SEO from '../components/SEO';

const news = [
  {
    id: 'launch',
    date: '6 марта 2026',
    title: '🚀 Запуск VibeCoder — маркетплейс AI-разработчиков',
    summary: 'Мы рады представить VibeCoder — первый фриланс-маркетплейс, созданный специально для вайб-кодеров и AI-разработчиков.',
    content: `Наша миссия — сделать разработку доступной через AI-инструменты нового поколения.

VibeCoder — это не просто биржа фриланса. Это платформа, где каждый вайб-кодер может предложить свои услуги, а заказчик — получить результат в разы быстрее и дешевле благодаря AI.

Что мы предлагаем:
• Каталог AI-услуг с тремя пакетами цен
• Биржа проектов — опишите задачу, фрилансеры предложат решения
• AI-подбор специалиста — Claude анализирует вашу задачу и подбирает лучших
• Безопасные сделки с гарантией возврата
• 0% комиссия для всех пользователей

Мы верим, что будущее разработки — за AI-ассистированным кодированием. Присоединяйтесь!`,
    tags: ['Запуск', 'Платформа'],
    icon: Rocket,
    color: 'text-neon-cyan',
  },
  {
    id: 'ai-features',
    date: '6 марта 2026',
    title: '🤖 AI-функции: подбор специалиста, анализ кворков, Vibe Score',
    summary: 'VibeCoder использует AI на каждом шагу — и это наше главное отличие от конкурентов.',
    content: `В отличие от других бирж фриланса, VibeCoder использует AI на каждом шагу.

🎯 AI-матчинг
Опишите задачу — Claude проанализирует всех фрилансеров и их услуги, подберёт топ-3 с процентом совпадения и объяснением почему они подходят.

🤖 AI-анализатор кворков
При создании услуги нажмите «Проверить с AI» — получите оценку 0-100 и конкретные советы: как улучшить заголовок, описание, цену для повышения конверсии.

⚡ Vibe Score
Уникальный рейтинг вайб-кодера: учитывает AI-инструменты в навыках, AI-теги в услугах, скорость выполнения и отзывы. 5 уровней от Starter до Legendary.

🏆 Достижения
15 бейджей: «Первый заказ», «AI-мастер», «Легенда», «Молниеносный» и другие. Геймификация мотивирует расти.`,
    tags: ['AI', 'Фичи'],
    icon: Bot,
    color: 'text-accent-violet',
  },
  {
    id: 'vibe-coding',
    date: '6 марта 2026',
    title: '⚡ Вайб-кодинг: MVP за 1-3 дня',
    summary: 'Благодаря AI-инструментам наши фрилансеры создают полноценные MVP за 1-3 дня вместо недель.',
    content: `Вайб-кодинг — это новый подход к разработке, где AI-инструменты берут на себя рутину, а разработчик фокусируется на архитектуре и бизнес-логике.

Инструменты наших кодеров:
• Cursor — AI-редактор кода с Claude/GPT
• Claude — генерация кода, ревью, рефакторинг
• v0 — генерация UI компонентов от Vercel
• Bolt — полные приложения из описания
• Copilot — автодополнение от GitHub

Результаты:
• Лендинг — 1 день (вместо 5-7)
• MVP SaaS — 3 дня (вместо 2-4 недель)
• Telegram бот с AI — 2 дня (вместо недели)
• React дашборд — 3 дня (вместо 2 недель)

Цены в 3-5 раз ниже классической разработки при том же качестве.`,
    tags: ['Вайб-кодинг', 'Тренды'],
    icon: Zap,
    color: 'text-gold',
  },
  {
    id: 'safe-deals',
    date: '6 марта 2026',
    title: '🛡 Безопасные сделки и 0% комиссия',
    summary: 'Все заказы защищены системой безопасной сделки. Комиссия — 0%.',
    content: `Безопасность — наш приоритет.

Как работает безопасная сделка:
1. Заказчик оформляет заказ — деньги замораживаются на счёте платформы
2. Фрилансер выполняет работу
3. Заказчик проверяет и принимает результат
4. Деньги переводятся фрилансеру

Если работа не выполнена — 100% возврат. Если есть спор — техподдержка разберётся.

Комиссия 0% — это наш подарок первым пользователям. Мы хотим создать сообщество, а не зарабатывать на комиссиях. В будущем может появиться минимальная комиссия, но мы заранее предупредим.`,
    tags: ['Безопасность', 'Финансы'],
    icon: Shield,
    color: 'text-neon-green',
  },
  {
    id: 'levels',
    date: '6 марта 2026',
    title: '🏆 Система уровней и достижений',
    summary: 'Геймификация: 15 достижений, 3 уровня продавца, Vibe Score.',
    content: `Мы внедрили систему мотивации для фрилансеров.

Уровни продавца:
• Новичок — после регистрации
• Верифицирован — 5+ заказов, рейтинг 4.5+, прошёл проверку
• PRO — 20+ заказов, рейтинг 4.8+, 95% успешных заказов

PRO-фрилансеры получают:
• Золотой бейдж в профиле и на карточках
• Приоритет в поисковой выдаче
• Безлимит на количество услуг
• Участие в промо-кампаниях

15 достижений — от «Первый шаг» до «Легенда» (100 заказов). Каждое достижение — это бейдж на вашем профиле.`,
    tags: ['Геймификация', 'Уровни'],
    icon: Award,
    color: 'text-accent-amber',
  },
  {
    id: 'projects',
    date: '6 марта 2026',
    title: '📱 Биржа проектов — разместите задачу',
    summary: 'Заказчики размещают задачи на бирже. Фрилансеры предлагают решения.',
    content: `Биржа проектов — это второй способ найти исполнителя (помимо каталога услуг).

Как это работает:
1. Заказчик создаёт проект — описание, бюджет, сроки, категория
2. Фрилансеры видят проект и отправляют предложения
3. Заказчик выбирает лучшее предложение
4. Работа идёт через безопасную сделку

Дополнительно: AI-матчинг автоматически подберёт лучших специалистов для вашей задачи.

Биржа идеальна для уникальных задач, которых нет в каталоге готовых услуг.`,
    tags: ['Биржа', 'Проекты'],
    icon: Star,
    color: 'text-neon-rose',
  },
];

export default function News() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 pb-24">
      <SEO title="Новости" description="Последние обновления и новости фриланс-маркетплейса VibeCoder." />

      <div className="text-center mb-12">
        <h1 className="font-display text-3xl font-bold text-gold-gradient tracking-[0.08em] uppercase mb-3">Новости</h1>
        <p className="text-body font-heading font-light">Обновления и события на платформе</p>
      </div>

      <div className="space-y-4">
        {news.map((item) => {
          const Icon = item.icon;
          const isOpen = expanded === item.id;
          return (
            <article key={item.id} className={`card overflow-hidden transition-all ${isOpen ? 'border-gold/30' : ''}`}>
              <button
                onClick={() => setExpanded(isOpen ? null : item.id)}
                className="w-full p-6 text-left cursor-pointer hover:bg-gold/5 transition-colors"
              >
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
                    <h2 className="text-base font-heading font-semibold text-heading mb-1">{item.title}</h2>
                    <p className="text-sm text-muted leading-relaxed">{item.summary}</p>
                  </div>
                  <ChevronDown size={18} className={`text-muted flex-shrink-0 mt-1 transition-transform ${isOpen ? 'rotate-180 text-gold' : ''}`} />
                </div>
              </button>
              
              {isOpen && (
                <div className="px-6 pb-6 pt-0">
                  <div className="ml-[68px] border-t border-gold/20 pt-4">
                    <div className="text-sm text-body leading-relaxed whitespace-pre-line">{item.content}</div>
                    <div className="flex items-center gap-4 mt-6 pt-4 border-t border-gold/10">
                      <button
                        onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(window.location.href + '#' + item.id); }}
                        className="flex items-center gap-1.5 text-xs text-muted hover:text-gold cursor-pointer"
                      >
                        <Share2 size={12} /> Поделиться
                      </button>
                    </div>
                  </div>
                </div>
              )}
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

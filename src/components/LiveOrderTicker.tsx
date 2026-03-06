import { useEffect, useState } from 'react';
import { Zap, ShoppingBag, Clock } from 'lucide-react';

// Simulated live orders for demo (when real orders exist, use those)
const DEMO_ORDERS = [
  { buyer: 'Михаил К.', gig: 'MVP SaaS на Next.js', price: 15000, time: '2 мин назад' },
  { buyer: 'Ольга С.', gig: 'Telegram бот с ChatGPT', price: 8000, time: '5 мин назад' },
  { buyer: 'Алексей И.', gig: 'Лендинг за 2 дня', price: 5000, time: '12 мин назад' },
  { buyer: 'Екатерина Р.', gig: 'AI агент для бизнеса', price: 15000, time: '18 мин назад' },
  { buyer: 'Дмитрий П.', gig: 'RAG система на документах', price: 20000, time: '25 мин назад' },
  { buyer: 'Наталья М.', gig: 'UI/UX дизайн приложения', price: 10000, time: '32 мин назад' },
  { buyer: 'Сергей В.', gig: 'Сайт на Cursor + Claude', price: 5000, time: '41 мин назад' },
  { buyer: 'Анна Л.', gig: 'React дашборд с аналитикой', price: 15000, time: '48 мин назад' },
  { buyer: 'Павел Т.', gig: 'Парсинг данных с AI', price: 6000, time: '55 мин назад' },
  { buyer: 'Ирина Ш.', gig: 'Интеграция Claude API', price: 12000, time: '1 час назад' },
];

export default function LiveOrderTicker() {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setOffset(prev => (prev + 1) % DEMO_ORDERS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const visible = [...DEMO_ORDERS, ...DEMO_ORDERS].slice(offset, offset + 3);

  return (
    <div className="w-full overflow-hidden">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse" />
        <span className="text-xs text-muted uppercase tracking-wider font-heading">Последние заказы</span>
      </div>
      <div className="space-y-2">
        {visible.map((order, i) => (
          <div
            key={`${order.buyer}-${offset}-${i}`}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-gold/5 border border-gold/10 animate-fade-in"
            style={{ animationDuration: '0.5s' }}
          >
            <ShoppingBag size={14} className="text-gold flex-shrink-0" />
            <div className="flex-1 min-w-0 flex items-center gap-2">
              <span className="text-xs text-heading font-medium truncate">{order.buyer}</span>
              <span className="text-xs text-muted">заказал</span>
              <span className="text-xs text-gold truncate">«{order.gig}»</span>
            </div>
            <span className="text-xs text-heading font-mono font-bold flex-shrink-0">{order.price.toLocaleString('ru-RU')} ₽</span>
            <span className="text-[10px] text-muted flex-shrink-0 hidden sm:block">{order.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

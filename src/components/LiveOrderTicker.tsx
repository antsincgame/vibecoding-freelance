import { useEffect, useState } from 'react';
import { ShoppingBag } from 'lucide-react';
import { getSupabase } from '../lib/appwrite';

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

function timeAgo(date: string): string {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'только что';
  if (mins < 60) return `${mins} мин назад`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} ч назад`;
  return `${Math.floor(hours / 24)} дн назад`;
}

export default function LiveOrderTicker() {
  const [orders, setOrders] = useState(DEMO_ORDERS);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const db = getSupabase();
        const { data } = await db.from('fl_orders').select('*').order('$createdAt', { ascending: false }).limit(10);
        const list = Array.isArray(data) ? data : data ? [data] : [];
        if (list.length > 0) {
          setOrders(list.map(o => ({
            buyer: o.seller_name || 'Покупатель',
            gig: o.gig_title || 'Услуга',
            price: o.price || 0,
            time: o.$createdAt ? timeAgo(o.$createdAt) : '',
          })));
        }
      } catch {}
    })();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setOffset(prev => (prev + 1) % orders.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [orders.length]);

  const visible = [...orders, ...orders].slice(offset, offset + 3);

  return (
    <div className="w-full overflow-hidden">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-2 h-2 bg-[#00f5ff] rounded-full animate-aura-pulse" />
        <span className="text-xs text-[rgba(255,255,255,0.4)] uppercase tracking-widest font-heading">Последние заказы</span>
      </div>
      <div className="space-y-2">
        {visible.map((order, i) => (
          <div
            key={`${order.buyer}-${offset}-${i}`}
            className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3 px-4 py-2.5 rounded bg-[rgba(0,245,255,0.03)] border border-[rgba(0,245,255,0.08)] animate-fade-in"
            style={{ animationDuration: '0.5s' }}
          >
            <div className="flex items-center gap-2">
              <ShoppingBag size={14} className="text-[#00f5ff] flex-shrink-0" />
              <span className="text-xs text-white font-medium truncate">{order.buyer}</span>
            </div>
            <div className="flex items-center justify-between gap-2 pl-6 sm:pl-0 sm:flex-1">
              <span className="text-xs text-[#00f5ff] truncate flex-1">&laquo;{order.gig}&raquo;</span>
              <span className="text-xs text-white font-mono font-bold flex-shrink-0">{order.price.toLocaleString('ru-RU')} ₽</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

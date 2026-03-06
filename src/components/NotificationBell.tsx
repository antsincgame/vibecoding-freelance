import { useState, useEffect, useRef } from 'react';
import { Bell, Package, MessageCircle, Star, AlertCircle, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@vibecoding/shared';
import { getSupabase, getAccount } from '@vibecoding/shared';

interface Notification {
  id: string;
  type: 'order' | 'message' | 'review' | 'system';
  title: string;
  text: string;
  link: string;
  time: string;
  read: boolean;
}

const ICONS = {
  order: Package,
  message: MessageCircle,
  review: Star,
  system: AlertCircle,
};

export default function NotificationBell() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    if (!user) return;
    loadNotifications();
    const interval = setInterval(loadNotifications, 30000); // poll every 30s
    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const loadNotifications = async () => {
    try {
      const acc = getAccount();
      const u = await acc.get();
      const db = getSupabase();
      
      const notifs: Notification[] = [];

      // Check recent orders (as buyer or seller)
      const { data: orders } = await db.from('fl_orders').select('*').order('$createdAt', { ascending: false }).limit(5);
      const orderList = Array.isArray(orders) ? orders : orders ? [orders] : [];
      for (const o of orderList) {
        if (o.buyer_id === u.$id || o.seller_id === u.$id) {
          const isNew = (Date.now() - new Date(o.$createdAt).getTime()) < 86400000; // 24h
          if (isNew) {
            notifs.push({
              id: `order-${o.id}`,
              type: 'order',
              title: o.buyer_id === u.$id ? 'Ваш заказ' : 'Новый заказ',
              text: `${o.gig_title?.slice(0, 50)} — ${o.status}`,
              link: `/orders/${o.id}`,
              time: new Date(o.$createdAt).toLocaleString('ru-RU'),
              read: false,
            });
          }
        }
      }

      setNotifications(notifs);
    } catch {}
  };

  if (!user) return null;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 text-muted hover:text-gold transition-colors cursor-pointer"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-neon-rose text-void text-[9px] font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-nebula-light border border-gold/30 rounded-2xl shadow-2xl overflow-hidden z-[60]">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gold/20">
            <h3 className="text-sm font-heading font-semibold text-heading">Уведомления</h3>
            <button onClick={() => setOpen(false)} className="text-muted hover:text-heading cursor-pointer"><X size={14} /></button>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell size={24} className="text-muted/30 mx-auto mb-2" />
                <p className="text-xs text-muted">Нет уведомлений</p>
              </div>
            ) : (
              notifications.map((n) => {
                const Icon = ICONS[n.type];
                return (
                  <Link
                    key={n.id}
                    to={n.link}
                    onClick={() => setOpen(false)}
                    className={`flex items-start gap-3 px-4 py-3 hover:bg-gold/5 transition-colors border-b border-gold/10 ${!n.read ? 'bg-gold/5' : ''}`}
                  >
                    <Icon size={16} className="text-gold mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-heading">{n.title}</p>
                      <p className="text-[11px] text-muted truncate">{n.text}</p>
                      <p className="text-[10px] text-muted/60 mt-0.5">{n.time}</p>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
          <Link to="/dashboard" onClick={() => setOpen(false)} className="block text-center py-2.5 text-xs text-gold hover:bg-gold/5 border-t border-gold/20 transition-colors">
            Все уведомления
          </Link>
        </div>
      )}
    </div>
  );
}

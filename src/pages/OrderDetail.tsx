import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Clock, Check, X, Star, Send, Package, AlertCircle, MessageCircle } from 'lucide-react';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Avatar from '../components/ui/Avatar';
import { useAuth } from '@vibecoding/shared';
import { getSupabase, getAccount } from '@vibecoding/shared';
import { createReview } from '../lib/freelance-db';
import toast from 'react-hot-toast';

const STATUS_FLOW: Record<string, { label: string; variant: 'green' | 'violet' | 'emerald' | 'blue' | 'amber'; next?: string[]; nextLabels?: string[] }> = {
  new: { label: 'Новый', variant: 'green', next: ['in_progress', 'cancelled'], nextLabels: ['Взять в работу', 'Отменить'] },
  in_progress: { label: 'В работе', variant: 'violet', next: ['delivered'], nextLabels: ['Сдать работу'] },
  delivered: { label: 'Доставлен', variant: 'emerald', next: ['completed', 'revision'], nextLabels: ['Принять', 'Доработка'] },
  revision: { label: 'Доработка', variant: 'amber', next: ['delivered'], nextLabels: ['Сдать работу'] },
  completed: { label: 'Завершён', variant: 'blue' },
  cancelled: { label: 'Отменён', variant: 'amber' },
};

export default function OrderDetail() {
  const { t } = useTranslation();
  const { id } = useParams();
  const { user } = useAuth();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState('');
  const [updating, setUpdating] = useState(false);

  // Review state
  const [showReview, setShowReview] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [reviewSent, setReviewSent] = useState(false);

  // Delivery message
  const [deliveryMsg, setDeliveryMsg] = useState('');

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const acc = getAccount();
        const u = await acc.get();
        setUserId(u.$id);
        const db = getSupabase();
        const { data } = await db.from('fl_orders').select('*').eq('id', id).maybeSingle();
        setOrder(data);
      } catch {}
      setLoading(false);
    })();
  }, [id]);

  const isBuyer = userId === order?.buyer_id;
  const isSeller = userId === order?.seller_id;
  const statusInfo = STATUS_FLOW[order?.status] || STATUS_FLOW.new;

  const handleStatusChange = async (newStatus: string) => {
    if (!order) return;
    setUpdating(true);
    const db = getSupabase();
    const updates: any = { status: newStatus };
    if (newStatus === 'delivered') updates.delivered_at = new Date().toISOString();
    if (newStatus === 'completed') updates.completed_at = new Date().toISOString();
    
    const { error } = await db.from('fl_orders').update(updates).eq('id', order.id);
    setUpdating(false);
    if (error) { toast.error('Ошибка'); return; }
    setOrder({ ...order, ...updates });
    toast.success('Статус обновлён');
    if (newStatus === 'completed') setShowReview(true);

    // Email notification
    try {
      const { notifyOrderStatus } = await import('../lib/email');
      // Notify the other party
      const notifyId = isBuyer ? order.seller_id : order.buyer_id;
      const { data: notifyProfile } = await db.from('fl_profiles').select('*').eq('user_id', notifyId).maybeSingle();
      // We don't have email in fl_profiles, so we skip for now
      // Email could be sent via API endpoint that has access to Appwrite users
    } catch {}
  };

  const handleReview = async () => {
    if (!order || !reviewText.trim()) { toast.error('Напишите отзыв'); return; }
    const ok = await createReview({ gig_id: order.gig_id, order_id: order.id, rating: reviewRating, text: reviewText });
    if (ok) { toast.success('Отзыв отправлен!'); setReviewSent(true); setShowReview(false); }
    else toast.error('Ошибка');
  };

  if (loading) return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="animate-pulse space-y-4">
        <div className="h-6 bg-cyber/10 rounded w-1/3" />
        <div className="card p-6"><div className="h-40 bg-cyber/10 rounded" /></div>
      </div>
    </div>
  );

  if (!order) return (
    <div className="max-w-3xl mx-auto px-4 py-20 text-center">
      <AlertCircle size={48} className="text-muted mx-auto mb-4" />
      <p className="text-muted">Заказ не найден</p>
      <Link to="/dashboard" className="text-[#00f5ff] text-sm mt-4 inline-block">← В дашборд</Link>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 pb-24">
      <Link to="/dashboard" className="flex items-center gap-2 text-sm text-muted hover:text-[#00f5ff] mb-6">
        <ArrowLeft size={16} /> Мои заказы
      </Link>

      {/* Header */}
      <div className="card p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold text-heading">{order.gig_title}</h1>
            <p className="text-sm text-muted mt-1">Заказ #{order.id?.slice(0, 8)}</p>
          </div>
          <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mt-4">
          <div className="flex items-center gap-3">
            <Avatar src={order.seller_avatar} alt={order.seller_name} size="sm" />
            <div>
              <p className="text-xs text-muted">Фрилансер</p>
              <p className="text-sm text-heading">{order.seller_name}</p>
            </div>
          </div>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between"><span className="text-muted">Пакет:</span><span className="text-heading">{order.package_type}</span></div>
            <div className="flex justify-between"><span className="text-muted">Цена:</span><span className="text-[#00f5ff] font-mono font-bold">{(order.price || 0).toLocaleString('ru-RU')} ₽</span></div>
            {order.delivery_days && <div className="flex justify-between"><span className="text-muted">Срок:</span><span className="text-heading">{order.delivery_days} дн.</span></div>}
            <div className="flex justify-between"><span className="text-muted">Создан:</span><span className="text-heading">{order.$createdAt ? new Date(order.$createdAt).toLocaleDateString('ru-RU') : '-'}</span></div>
          </div>
        </div>

        {order.requirements && (
          <div className="mt-4 p-4 bg-cyber/5 rounded-xl border border-cyber/10">
            <p className="text-xs text-muted mb-1">Требования заказчика:</p>
            <p className="text-sm text-body">{order.requirements}</p>
          </div>
        )}
      </div>

      {/* Status timeline */}
      <div className="card p-6 mb-6">
        <h2 className="text-sm font-semibold text-heading mb-4">Статус заказа</h2>
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {['new', 'in_progress', 'delivered', 'completed'].map((s, i) => {
            const info = STATUS_FLOW[s];
            const reached = ['new', 'in_progress', 'delivered', 'revision', 'completed'].indexOf(order.status) >= ['new', 'in_progress', 'delivered', 'delivered', 'completed'].indexOf(s);
            const current = order.status === s;
            return (
              <div key={s} className="flex items-center gap-2 flex-shrink-0">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${current ? 'bg-cyber/20 text-[#00f5ff] border-2 border-cyber' : reached ? 'bg-neon-green/20 text-neon-green' : 'bg-cyber/10 text-muted'}`}>
                  {reached && !current ? <Check size={14} /> : i + 1}
                </div>
                <span className={`text-xs whitespace-nowrap ${current ? 'text-[#00f5ff]' : reached ? 'text-body' : 'text-muted'}`}>{info.label}</span>
                {i < 3 && <div className={`w-8 h-px ${reached ? 'bg-neon-green' : 'bg-cyber/20'}`} />}
              </div>
            );
          })}
        </div>
        {order.status === 'cancelled' && <p className="text-sm text-neon-rose mt-3">Заказ отменён</p>}
        {order.status === 'revision' && <p className="text-sm text-accent-amber mt-3">Заказ на доработке</p>}
      </div>

      {/* Actions */}
      {order.status !== 'completed' && order.status !== 'cancelled' && (
        <div className="card p-6 mb-6">
          <h2 className="text-sm font-semibold text-heading mb-4">Действия</h2>
          
          {/* Seller: accept / deliver */}
          {isSeller && order.status === 'new' && (
            <div className="flex gap-3">
              <Button variant="primary" size="md" onClick={() => handleStatusChange('in_progress')} disabled={updating}>
                <Package size={16} /> Взять в работу
              </Button>
              <Button variant="ghost" size="md" onClick={() => handleStatusChange('cancelled')} disabled={updating}>
                Отменить
              </Button>
            </div>
          )}

          {isSeller && (order.status === 'in_progress' || order.status === 'revision') && (
            <div className="space-y-3">
              <textarea
                rows={3}
                placeholder="Сообщение при сдаче (опционально)..."
                value={deliveryMsg}
                onChange={(e) => setDeliveryMsg(e.target.value)}
                className="w-full bg-cyber/10 border border-cyber/30 rounded-xl px-4 py-3 text-sm text-heading placeholder:text-muted focus:outline-none focus:border-cyber resize-none"
              />
              <Button variant="primary" size="md" onClick={() => handleStatusChange('delivered')} disabled={updating}>
                <Send size={16} /> Сдать работу
              </Button>
            </div>
          )}

          {/* Buyer: accept / request revision */}
          {isBuyer && order.status === 'delivered' && (
            <div className="flex gap-3">
              <Button variant="primary" size="md" onClick={() => handleStatusChange('completed')} disabled={updating}>
                <Check size={16} /> Принять работу
              </Button>
              <Button variant="secondary" size="md" onClick={() => handleStatusChange('revision')} disabled={updating}>
                Запросить доработку
              </Button>
            </div>
          )}

          {/* Buyer: cancel new order */}
          {isBuyer && order.status === 'new' && (
            <Button variant="ghost" size="md" onClick={() => handleStatusChange('cancelled')} disabled={updating}>
              <X size={16} /> Отменить заказ
            </Button>
          )}
        </div>
      )}

      {/* Review form */}
      {order.status === 'completed' && isBuyer && !reviewSent && (
        <div className="card p-6 mb-6">
          {!showReview ? (
            <Button variant="secondary" size="md" onClick={() => setShowReview(true)}>
              <Star size={16} /> Оставить отзыв
            </Button>
          ) : (
            <div className="space-y-4">
              <h2 className="text-sm font-semibold text-heading">Оставьте отзыв</h2>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button key={s} onClick={() => setReviewRating(s)} className="cursor-pointer">
                    <Star size={28} className={s <= reviewRating ? 'fill-[#00f5ff] text-[#00f5ff]' : 'text-muted/30'} />
                  </button>
                ))}
              </div>
              <textarea
                rows={3}
                placeholder="Расскажите о работе с фрилансером..."
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                className="w-full bg-cyber/10 border border-cyber/30 rounded-xl px-4 py-3 text-sm text-heading placeholder:text-muted focus:outline-none focus:border-cyber resize-none"
              />
              <div className="flex gap-3">
                <Button variant="primary" size="md" onClick={handleReview}>Отправить</Button>
                <Button variant="ghost" size="md" onClick={() => setShowReview(false)}>Отмена</Button>
              </div>
            </div>
          )}
        </div>
      )}

      {reviewSent && (
        <div className="card p-6 mb-6 text-center">
          <Check size={32} className="text-neon-green mx-auto mb-2" />
          <p className="text-sm text-heading">Спасибо за отзыв!</p>
        </div>
      )}

      {order.delivered_at && <p className="text-xs text-muted mt-2">Сдан: {new Date(order.delivered_at).toLocaleString('ru-RU')}</p>}
      {order.completed_at && <p className="text-xs text-muted">Завершён: {new Date(order.completed_at).toLocaleString('ru-RU')}</p>}
    </div>
  );
}

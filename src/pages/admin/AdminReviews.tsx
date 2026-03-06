import { useState, useEffect } from 'react';
import { Star, Trash2 } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { adminGetReviews, adminDeleteReview } from '../../lib/admin-api';
import toast from 'react-hot-toast';

export default function AdminReviews() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => { setLoading(true); const data = await adminGetReviews(); setReviews(data); setLoading(false); };
  useEffect(() => { load(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить отзыв?')) return;
    const { error } = await adminDeleteReview(id);
    if (error) toast.error('Ошибка'); else { toast.success('Удалён'); load(); }
  };

  const avgRating = reviews.length > 0 ? (reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length).toFixed(1) : '0';

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-heading">Отзывы</h1>
        <div className="flex items-center gap-3 text-sm text-muted">
          <span>{reviews.length} отзывов</span>
          <span className="flex items-center gap-1"><Star size={14} className="text-[#00f5ff] fill-[#00f5ff]" /> {avgRating}</span>
        </div>
      </div>

      <div className="space-y-3">
        {loading ? Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="card p-5 animate-pulse"><div className="h-4 bg-[#00f5ff]/10 rounded w-1/3 mb-2" /><div className="h-3 bg-[#00f5ff]/10 rounded w-2/3" /></div>
        )) : reviews.map((review) => (
          <div key={review.id} className="card p-5">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                {review.author_avatar ? (
                  <img src={review.author_avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-[#00f5ff]/20 flex items-center justify-center text-sm text-[#00f5ff]">
                    {(review.author_name || '?')[0]}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-sm font-medium text-heading">{review.author_name || 'Аноним'}</span>
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={12} className={i < (review.rating || 0) ? 'fill-[#00f5ff] text-[#00f5ff]' : 'text-muted/30'} />
                    ))}
                  </div>
                  <span className="text-xs text-muted font-mono">
                    {review.$createdAt ? new Date(review.$createdAt).toLocaleDateString('ru-RU') : ''}
                  </span>
                </div>
                <p className="text-sm text-body mb-2">{review.text}</p>
                {review.reply && (
                  <div className="pl-4 border-l-2 border-[#00f5ff]/30 mt-2">
                    <p className="text-xs text-[#00f5ff] mb-0.5">Ответ фрилансера</p>
                    <p className="text-sm text-muted">{review.reply}</p>
                  </div>
                )}
                <div className="flex items-center gap-3 mt-2 text-xs text-muted">
                  <span>Гиг: <span className="font-mono">{review.gig_id?.slice(0, 12)}</span></span>
                  <span>Автор: <span className="font-mono">{review.author_id?.slice(0, 12)}</span></span>
                </div>
              </div>
              <button onClick={() => handleDelete(review.id)} className="p-2 text-muted hover:text-neon-rose hover:bg-[#00f5ff]/10 rounded-lg cursor-pointer flex-shrink-0" title="Удалить">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
        {!loading && reviews.length === 0 && <p className="text-sm text-muted text-center py-8">Нет отзывов</p>}
      </div>
    </AdminLayout>
  );
}

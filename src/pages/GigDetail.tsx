import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Clock, ShieldCheck, MessageCircle, Star, Check, ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import Avatar from '../components/ui/Avatar';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import StarRating from '../components/ui/StarRating';
import SEO from "../components/SEO";
import Skeleton from '../components/ui/Skeleton';
import GigExtras from '../components/GigExtras';
import { useGig, useGigReviews, useFavoriteStatus } from '../hooks/useData';
import { createOrder, startConversation } from '../lib/freelance-db';
import { useAuth } from '@vibecoding/shared';
import type { GigPackage } from '../types';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

type PackageKey = 'economy' | 'standard' | 'premium';

export default function GigDetail() {
  const { t } = useTranslation();
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: gig, loading } = useGig(id);
  const { data: reviews } = useGigReviews(id);
  const { isFavorite, toggleFavorite } = useFavoriteStatus(id);
  const [activePackage, setActivePackage] = useState<PackageKey>('standard');
  const [currentImage, setCurrentImage] = useState(0);
  const [ordering, setOrdering] = useState(false);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [requirements, setRequirements] = useState('');
  const [extrasTotal, setExtrasTotal] = useState(0);

  if (loading) return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Skeleton className="h-6 w-64 mb-6" />
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1"><Skeleton className="aspect-video rounded-2xl mb-4" /><Skeleton className="h-8 w-3/4 mb-4" /><Skeleton className="h-4 w-full mb-2" /><Skeleton className="h-4 w-2/3" /></div>
        <div className="lg:w-[380px]"><Skeleton className="h-96 rounded-2xl" /></div>
      </div>
    </div>
  );

  if (!gig) return <div className="max-w-7xl mx-auto px-4 py-20 text-center"><p className="text-muted text-lg">Гиг не найден</p></div>;

  const packageLabels: Record<PackageKey, string> = { economy: t('gig.economy'), standard: t('gig.standard'), premium: t('gig.premium') };
  const pkg: GigPackage = gig.packages[activePackage];
  const images = gig.images.length > 0 ? gig.images : [gig.image];

  const prevImage = () => setCurrentImage((p) => (p === 0 ? images.length - 1 : p - 1));
  const nextImage = () => setCurrentImage((p) => (p === images.length - 1 ? 0 : p + 1));

  const handleOrder = async () => {
    if (!user) { toast.error('Войдите чтобы заказать'); return; }
    if (!showOrderForm) { setShowOrderForm(true); return; }
    setOrdering(true);
    const order = await createOrder({ gig_id: gig.id, package_type: activePackage, requirements });
    setOrdering(false);
    if (order) { toast.success('Заказ создан!'); navigate(`/orders/${order.id}`); } else { toast.error('Ошибка создания заказа'); }
  };

  const handleMessage = async () => {
    if (!user) { toast.error('Войдите чтобы написать'); return; }
    const convId = await startConversation(gig.freelancer.id, gig.freelancer.name, gig.freelancer.avatar);
    if (convId) navigate(`/chat/${convId}`);
    else toast.error('Ошибка');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-8">
      <SEO title={gig.title} description={gig.shortDescription || gig.title} />
      <Breadcrumbs items={[{ label: t('category.home'), href: '/' }, { label: gig.category, href: `/categories/${gig.categorySlug}` }, { label: gig.title }]} />
      <div className="mt-6 flex flex-col lg:flex-row gap-8">
        <div className="flex-1 min-w-0 space-y-8">
          <div className="space-y-3">
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-nebula">
              <img src={images[currentImage]} alt={gig.title} className="w-full h-full object-cover" />
              {images.length > 1 && (<>
                <button onClick={prevImage} className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-void/80 backdrop-blur-sm border border-gold/20 flex items-center justify-center text-heading hover:bg-void transition-colors cursor-pointer"><ChevronLeft size={20} /></button>
                <button onClick={nextImage} className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-void/80 backdrop-blur-sm border border-gold/20 flex items-center justify-center text-heading hover:bg-void transition-colors cursor-pointer"><ChevronRight size={20} /></button>
              </>)}
              {user && (
                <button onClick={toggleFavorite} className={`absolute top-3 right-3 w-10 h-10 rounded-full bg-void/80 backdrop-blur-sm border border-gold/20 flex items-center justify-center cursor-pointer transition-all ${isFavorite ? 'text-neon-rose' : 'text-muted hover:text-neon-rose'}`}>
                  <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} />
                </button>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-2">
                {images.map((img, i) => (<button key={i} onClick={() => setCurrentImage(i)} className={`w-20 h-14 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${i === currentImage ? 'border-gold' : 'border-gold/20 opacity-60 hover:opacity-100'}`}><img src={img} alt="" className="w-full h-full object-cover" /></button>))}
              </div>
            )}
          </div>
          <div>
            <h1 className="text-2xl font-heading font-bold text-heading mb-4">{gig.title}</h1>
            <div className="flex items-center gap-4 mb-6">
              <Link to={`/users/${gig.freelancer.username}`} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <Avatar src={gig.freelancer.avatar} alt={gig.freelancer.name} size="sm" isOnline={gig.freelancer.isOnline} />
                <span className="text-sm text-body">{gig.freelancer.name}</span>
              </Link>
              <StarRating rating={gig.rating} count={gig.reviewCount} />
              {gig.freelancer.level === 'pro' && <Badge variant="amber">PRO</Badge>}
            </div>
            <div className="max-w-none">
              {gig.description.split('\n').map((line, i) => {
                if (line.startsWith('**') && line.endsWith('**')) return <h3 key={i} className="text-base font-heading font-semibold text-heading mt-6 mb-2">{line.replace(/\*\*/g, '')}</h3>;
                if (line.startsWith('- ')) return <div key={i} className="flex items-start gap-2 ml-1 mb-1"><Check size={14} className="text-neon-emerald mt-1 flex-shrink-0" /><span className="text-sm text-body">{line.slice(2)}</span></div>;
                if (line.trim() === '') return <div key={i} className="h-2" />;
                return <p key={i} className="text-sm text-body leading-relaxed">{line}</p>;
              })}
            </div>
          </div>
          <div>
            <h2 className="text-xl font-heading font-bold text-heading mb-4">{t('gig.compare_packages')}</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead><tr className="border-b border-gold/20"><th className="text-left py-3 px-4 text-sm text-muted font-medium">{t('gig.package')}</th>
                  {(Object.keys(gig.packages) as PackageKey[]).map((key) => (<th key={key} className="text-center py-3 px-4"><span className={`text-sm font-semibold ${key === activePackage ? 'text-gold' : 'text-heading'}`}>{packageLabels[key]}</span></th>))}
                </tr></thead>
                <tbody>
                  <tr className="border-b border-gold/20"><td className="py-3 px-4 text-sm text-muted">{t('gig.price')}</td>
                    {(Object.keys(gig.packages) as PackageKey[]).map((key) => (<td key={key} className="text-center py-3 px-4 font-mono text-sm font-bold text-gold">{gig.packages[key].price.toLocaleString('ru-RU')} ₽</td>))}
                  </tr>
                  <tr className="border-b border-gold/20"><td className="py-3 px-4 text-sm text-muted">{t('gig.deadline')}</td>
                    {(Object.keys(gig.packages) as PackageKey[]).map((key) => (<td key={key} className="text-center py-3 px-4 text-sm text-body font-mono">{gig.packages[key].deliveryDays} {t('common.days')}</td>))}
                  </tr>
                  {gig.packages.premium.features.map((_, fi) => (
                    <tr key={fi} className="border-b border-gold/30"><td className="py-3 px-4 text-sm text-muted">{gig.packages.premium.features[fi]}</td>
                      {(Object.keys(gig.packages) as PackageKey[]).map((key) => (<td key={key} className="text-center py-3 px-4">{fi < gig.packages[key].features.length ? <Check size={16} className="text-neon-emerald mx-auto" /> : <span className="text-muted">-</span>}</td>))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {gig.tags.map((tag) => <span key={tag} className="px-3 py-1.5 text-xs bg-gold/10 text-muted rounded-lg border border-gold/20">{tag}</span>)}
          </div>
          <div>
            <h2 className="text-xl font-heading font-bold text-heading mb-6">{t('gig.reviews')} <span className="text-sm font-normal text-muted ml-2">({gig.reviewCount})</span></h2>
            <div className="space-y-6">
              {(reviews || []).map((review) => (
                <div key={review.id} className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Avatar src={review.avatar} alt={review.author} size="sm" />
                    <div><p className="text-sm font-medium text-heading">{review.author}</p>
                      <div className="flex items-center gap-2">
                        <div className="flex gap-0.5">{Array.from({ length: 5 }).map((_, i) => <Star key={i} size={12} className={i < review.rating ? 'fill-gold text-gold' : 'text-muted/30'} />)}</div>
                        <span className="text-xs text-muted">{review.date}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-body leading-relaxed pl-11">{review.text}</p>
                  {review.reply && (<div className="ml-11 pl-4 border-l-2 border-gold/30"><p className="text-xs text-gold mb-1">{t('gig.freelancer_reply')}</p><p className="text-sm text-muted">{review.reply}</p></div>)}
                </div>
              ))}
              {(!reviews || reviews.length === 0) && <p className="text-sm text-muted">Пока нет отзывов</p>}
            </div>
          </div>
        </div>
        <div className="lg:w-[380px] flex-shrink-0">
          <div className="lg:sticky lg:top-24 space-y-6">
            <div className="card p-6 space-y-5">
              <div className="flex rounded-xl overflow-hidden border border-gold/30">
                {(Object.keys(gig.packages) as PackageKey[]).map((key) => (
                  <button key={key} onClick={() => setActivePackage(key)} className={`flex-1 py-3 text-sm font-medium text-center transition-all cursor-pointer ${activePackage === key ? 'bg-gold/10 text-gold border-b-2 border-gold' : 'text-muted hover:text-body'}`}>{packageLabels[key]}</button>
                ))}
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between"><span className="text-body text-sm">{pkg.description}</span><span className="text-2xl font-bold text-gold font-mono">{pkg.price.toLocaleString('ru-RU')} ₽</span></div>
                <div className="flex items-center gap-2 text-sm text-muted"><Clock size={14} /><span>{t('gig.deliveryTime')}: <span className="text-body font-mono">{pkg.deliveryDays} {t('common.days')}</span></span></div>
                <div className="space-y-2 pt-2">{pkg.features.map((f) => <div key={f} className="flex items-center gap-2"><Check size={14} className="text-neon-emerald flex-shrink-0" /><span className="text-sm text-body">{f}</span></div>)}</div>
              </div>
              <GigExtras gigId={gig.id} onExtrasChange={(_, total) => setExtrasTotal(total)} />
              {showOrderForm && (
                <div className="space-y-3 pt-2">
                  <div className="border-t border-gold/20 pt-3">
                    <p className="text-xs text-gold mb-2">Опишите ваши требования:</p>
                    <textarea
                      rows={3}
                      placeholder="Что именно вам нужно? Ссылки, примеры, ТЗ..."
                      value={requirements}
                      onChange={(e) => setRequirements(e.target.value)}
                      className="w-full bg-gold/10 border border-gold/30 rounded-xl px-4 py-3 text-sm text-heading placeholder:text-muted focus:outline-none focus:border-gold resize-none"
                    />
                  </div>
                </div>
              )}
              {extrasTotal > 0 && (
                <div className="flex justify-between text-sm pt-2 border-t border-gold/20">
                  <span className="text-muted">Итого с опциями:</span>
                  <span className="text-gold font-mono font-bold">{(pkg.price + extrasTotal).toLocaleString('ru-RU')} ₽</span>
                </div>
              )}
              <Button variant="primary" size="lg" className="w-full" onClick={handleOrder} disabled={ordering}>{ordering ? '...' : showOrderForm ? `Подтвердить ${(pkg.price + extrasTotal).toLocaleString('ru-RU')} ₽` : `${t('gig.orderNow')} ${(pkg.price + extrasTotal).toLocaleString('ru-RU')} ₽`}</Button>
              <div className="flex items-center justify-center gap-2 text-xs text-muted"><ShieldCheck size={14} className="text-neon-cyan" /><span>{t('gig.safe_deal')}</span></div>
            </div>
            <div className="card p-6 space-y-4">
              <Link to={`/users/${gig.freelancer.username}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                <Avatar src={gig.freelancer.avatar} alt={gig.freelancer.name} size="lg" isOnline={gig.freelancer.isOnline} />
                <div><p className="text-sm font-semibold text-heading">{gig.freelancer.name}</p><p className="text-xs text-muted">{gig.freelancer.title}</p><StarRating rating={gig.freelancer.rating} count={gig.freelancer.reviewCount} size={12} /></div>
              </Link>
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="bg-gold/10 rounded-xl p-3 border border-gold/30"><p className="text-lg font-bold text-heading font-mono">{gig.freelancer.ordersCompleted}</p><p className="text-xs text-muted">{t('gig.completed_orders')}</p></div>
                <div className="bg-gold/10 rounded-xl p-3 border border-gold/30"><p className="text-lg font-bold text-neon-emerald font-mono">{gig.freelancer.successRate}%</p><p className="text-xs text-muted">{t('gig.success_rate')}</p></div>
              </div>
              <Button variant="secondary" size="md" className="w-full" onClick={handleMessage}><MessageCircle size={16} />{t('gig.write_message')}</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

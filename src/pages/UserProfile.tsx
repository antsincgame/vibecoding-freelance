import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MapPin, Clock, Calendar, TrendingUp, Star, ShieldCheck } from 'lucide-react';
import SEO from "../components/SEO";
import Breadcrumbs from '../components/ui/Breadcrumbs';
import Avatar from '../components/ui/Avatar';
import Badge from '../components/ui/Badge';
import StarRating from '../components/ui/StarRating';
import Tabs from '../components/ui/Tabs';
import GigCard from '../components/GigCard';
import Skeleton from '../components/ui/Skeleton';
import Portfolio from '../components/Portfolio';
import { useFreelancerByUsername, useFreelancerGigs, useGigReviews } from '../hooks/useData';

export default function UserProfile() {
  const { t } = useTranslation();
  const { username } = useParams();
  const { data: user, loading } = useFreelancerByUsername(username);
  const { data: userGigs } = useFreelancerGigs(user?.id);

  if (loading) return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Skeleton className="h-6 w-64 mb-8" />
      <div className="card p-8"><div className="flex gap-6"><Skeleton className="w-24 h-24 rounded-full" /><div className="flex-1"><Skeleton className="h-8 w-48 mb-2" /><Skeleton className="h-4 w-32 mb-4" /><Skeleton className="h-4 w-64" /></div></div></div>
    </div>
  );

  if (!user) return <div className="max-w-7xl mx-auto px-4 py-20 text-center"><p className="text-muted text-lg">Пользователь не найден</p></div>;

  const tabsData = [
    {
      id: 'gigs',
      label: `${t('profile.gigs')} (${(userGigs || []).length})`,
      content: (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {(userGigs || []).length > 0 ? (userGigs || []).map((gig, i) => <GigCard key={gig.id} gig={gig} index={i} />) : <p className="text-muted col-span-3">Нет активных услуг</p>}
        </div>
      ),
    },
    {
      id: 'portfolio',
      label: t('profile.portfolio'),
      content: <Portfolio userId={user.id} />,
    },
    {
      id: 'reviews',
      label: `${t('profile.reviews')} (${user.reviewCount})`,
      content: <ReviewsList userId={user.id} gigs={userGigs || []} />,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-8">
      <Breadcrumbs items={[{ label: t('profile.home'), href: '/' }, { label: t('profile.freelancers') }, { label: user.name }]} />
      <SEO title={`${user.name} — ${user.title}`} description={user.bio?.slice(0, 160) || `Профиль фрилансера ${user.name}`} />
      <div className="mt-8 card p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-neon-pink/5" />
        <div className="absolute inset-0 sacred-bg opacity-20" />
        <div className="relative z-10 flex flex-col sm:flex-row items-start gap-6">
          <Avatar src={user.avatar} alt={user.name} size="xl" isOnline={user.isOnline} />
          <div className="flex-1 space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-heading font-bold text-heading">{user.name}</h1>
              {user.level === 'pro' && <Badge variant="amber">PRO</Badge>}
              {user.level === 'verified' && <Badge variant="blue"><ShieldCheck size={12} className="mr-1" />{t('profile.verified')}</Badge>}
            </div>
            <p className="text-body">{user.title}</p>
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <StarRating rating={user.rating} count={user.reviewCount} />
              <span className="flex items-center gap-1 text-muted"><MapPin size={14} />{user.location}</span>
              <span className="flex items-center gap-1 text-muted"><Calendar size={14} />{t('profile.memberSince')} {user.memberSince}</span>
            </div>
          </div>
        </div>
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
          <div className="bg-gold/10 rounded-xl p-4 text-center border border-gold/30"><p className="text-2xl font-bold text-heading font-mono">{user.ordersCompleted}</p><p className="text-xs text-muted mt-1">{t('profile.ordersCompleted')}</p></div>
          <div className="bg-gold/10 rounded-xl p-4 text-center border border-gold/30"><p className="text-2xl font-bold text-neon-emerald font-mono">{user.successRate}%</p><p className="text-xs text-muted mt-1">{t('profile.successfulOrders')}</p></div>
          <div className="bg-gold/10 rounded-xl p-4 text-center border border-gold/30"><div className="flex items-center justify-center gap-1"><Clock size={16} className="text-gold" /><p className="text-lg font-bold text-heading">{user.responseTime}</p></div><p className="text-xs text-muted mt-1">{t('profile.responseTime')}</p></div>
          <div className="bg-gold/10 rounded-xl p-4 text-center border border-gold/30"><div className="flex items-center justify-center gap-1"><TrendingUp size={16} className="text-gold" /><p className="text-lg font-bold text-heading">{user.rating}</p></div><p className="text-xs text-muted mt-1">{t('profile.rating')}</p></div>
        </div>
      </div>
      <div className="mt-8 space-y-8">
        <div><h2 className="text-lg font-heading font-semibold text-heading mb-3">{t('profile.about')}</h2><p className="text-sm text-body leading-relaxed">{user.bio}</p></div>
        <div><h2 className="text-lg font-heading font-semibold text-heading mb-3">{t('profile.skills')}</h2><div className="flex flex-wrap gap-2">{user.skills.map((skill) => <span key={skill} className="px-3 py-1.5 text-sm bg-gold/10 text-body rounded-lg border border-gold/20">{skill}</span>)}</div></div>
        <Tabs tabs={tabsData} />
      </div>
    </div>
  );
}

function ReviewsList({ userId, gigs }: { userId: string; gigs: any[] }) {
  const firstGigId = gigs[0]?.id;
  const { data: reviews } = useGigReviews(firstGigId);
  
  return (
    <div className="space-y-6">
      {(reviews || []).map((review) => (
        <div key={review.id} className="card p-5 space-y-3">
          <div className="flex items-center gap-3">
            <Avatar src={review.avatar} alt={review.author} size="sm" />
            <div><p className="text-sm font-medium text-heading">{review.author}</p>
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5">{Array.from({ length: 5 }).map((_, i) => <Star key={i} size={12} className={i < review.rating ? 'fill-gold text-gold' : 'text-muted/30'} />)}</div>
                <span className="text-xs text-muted">{review.date}</span>
              </div>
            </div>
          </div>
          <p className="text-sm text-body leading-relaxed">{review.text}</p>
          {review.reply && (<div className="pl-4 border-l-2 border-gold/30"><p className="text-xs text-gold mb-1">Ответ фрилансера</p><p className="text-sm text-muted">{review.reply}</p></div>)}
        </div>
      ))}
      {(!reviews || reviews.length === 0) && <p className="text-sm text-muted">Пока нет отзывов</p>}
    </div>
  );
}

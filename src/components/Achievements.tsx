import { useState } from 'react';
import { Zap, Star, Clock, Award, Rocket, Shield, Bot, Target, Crown, Flame, Heart, MessageCircle } from 'lucide-react';

interface Achievement {
  id: string;
  icon: any;
  name: string;
  description: string;
  color: string;
  requirement: (stats: UserStats) => boolean;
}

interface UserStats {
  ordersCompleted: number;
  reviewCount: number;
  rating: number;
  gigsCount: number;
  memberDays: number;
  aiGigsCount: number;
  fastDeliveries: number;
  level: string;
}

const ACHIEVEMENTS: Achievement[] = [
  { id: 'first_gig', icon: Rocket, name: 'Первый шаг', description: 'Опубликовать первую услугу', color: 'text-neon-green', requirement: (s) => s.gigsCount >= 1 },
  { id: 'first_order', icon: Zap, name: 'Первый заказ', description: 'Получить первый заказ', color: 'text-[#00f5ff]', requirement: (s) => s.ordersCompleted >= 1 },
  { id: 'five_orders', icon: Star, name: 'В ритме', description: 'Выполнить 5 заказов', color: 'text-[#00f5ff]', requirement: (s) => s.ordersCompleted >= 5 },
  { id: 'twenty_orders', icon: Award, name: 'Профессионал', description: 'Выполнить 20 заказов', color: 'text-neon-cyan', requirement: (s) => s.ordersCompleted >= 20 },
  { id: 'fifty_orders', icon: Crown, name: 'Мастер', description: 'Выполнить 50 заказов', color: 'text-[#00f5ff]', requirement: (s) => s.ordersCompleted >= 50 },
  { id: 'hundred_orders', icon: Flame, name: 'Легенда', description: 'Выполнить 100 заказов', color: 'text-neon-rose', requirement: (s) => s.ordersCompleted >= 100 },
  { id: 'top_rating', icon: Star, name: 'Безупречный', description: 'Рейтинг 5.0', color: 'text-[#00f5ff]', requirement: (s) => s.rating >= 5.0 && s.reviewCount >= 3 },
  { id: 'high_rating', icon: Star, name: 'Высший класс', description: 'Рейтинг 4.8+', color: 'text-[#00f5ff]', requirement: (s) => s.rating >= 4.8 && s.reviewCount >= 5 },
  { id: 'ten_reviews', icon: MessageCircle, name: 'Народный выбор', description: 'Получить 10 отзывов', color: 'text-neon-cyan', requirement: (s) => s.reviewCount >= 10 },
  { id: 'ai_master', icon: Bot, name: 'AI-мастер', description: '5+ AI-услуг', color: 'text-accent-violet', requirement: (s) => s.aiGigsCount >= 5 },
  { id: 'ai_pioneer', icon: Bot, name: 'AI-пионер', description: 'Первая AI-услуга', color: 'text-neon-green', requirement: (s) => s.aiGigsCount >= 1 },
  { id: 'speed_demon', icon: Clock, name: 'Молниеносный', description: '3+ быстрых доставки', color: 'text-neon-cyan', requirement: (s) => s.fastDeliveries >= 3 },
  { id: 'verified', icon: Shield, name: 'Верифицирован', description: 'Пройти верификацию', color: 'text-neon-cyan', requirement: (s) => s.level === 'verified' || s.level === 'pro' },
  { id: 'pro', icon: Target, name: 'PRO статус', description: 'Достичь PRO уровня', color: 'text-[#00f5ff]', requirement: (s) => s.level === 'pro' },
  { id: 'veteran', icon: Heart, name: 'Ветеран', description: '6+ месяцев на платформе', color: 'text-neon-rose', requirement: (s) => s.memberDays >= 180 },
];

export function getUnlockedAchievements(stats: UserStats): Achievement[] {
  return ACHIEVEMENTS.filter(a => a.requirement(stats));
}

export function getAllAchievements(): Achievement[] {
  return ACHIEVEMENTS;
}

// Display component
interface Props {
  stats: UserStats;
  showLocked?: boolean;
  compact?: boolean;
}

export default function Achievements({ stats, showLocked = false, compact = false }: Props) {
  const [expanded, setExpanded] = useState(false);
  const unlocked = getUnlockedAchievements(stats);
  const all = showLocked ? ACHIEVEMENTS : unlocked;

  if (all.length === 0) return null;

  if (compact) {
    return (
      <div className="flex flex-wrap gap-1.5">
        {unlocked.slice(0, 6).map((a) => (
          <div key={a.id} className={`flex items-center gap-1 px-2 py-1 rounded-full bg-white/5 border border-white/10 ${a.color}`} title={`${a.name}: ${a.description}`}>
            <a.icon size={10} />
            <span className="text-[9px] font-bold">{a.name}</span>
          </div>
        ))}
        {unlocked.length > 6 && <span className="text-[10px] text-muted self-center">+{unlocked.length - 6}</span>}
      </div>
    );
  }

  const visible = expanded ? all : all.slice(0, 3);

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Award size={18} className="text-[#00f5ff]" />
        <h3 className="text-sm font-heading font-semibold text-heading">Достижения</h3>
        <span className="text-xs text-muted">{unlocked.length}/{ACHIEVEMENTS.length}</span>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {visible.map((a) => {
          const isUnlocked = unlocked.some(u => u.id === a.id);
          return (
            <div key={a.id} className={`p-3 rounded-xl border text-center transition-all ${isUnlocked ? 'bg-[#00f5ff]/5 border-[#00f5ff]/20' : 'bg-white/[0.02] border-white/5 opacity-40'}`}>
              <a.icon size={24} className={`mx-auto mb-1.5 ${isUnlocked ? a.color : 'text-muted/30'}`} />
              <p className={`text-xs font-medium ${isUnlocked ? 'text-heading' : 'text-muted'}`}>{a.name}</p>
              <p className="text-[10px] text-muted mt-0.5">{a.description}</p>
            </div>
          );
        })}
      </div>
      {all.length > 3 && (
        <button onClick={() => setExpanded(!expanded)} className="mt-3 text-xs text-[#00f5ff] hover:underline cursor-pointer">
          {expanded ? 'Свернуть' : `Показать все (${all.length})`}
        </button>
      )}
    </div>
  );
}

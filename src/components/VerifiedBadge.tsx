import { ShieldCheck, Crown, Sparkles } from 'lucide-react';

interface Props {
  level: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const LEVEL_CONFIG: Record<string, { icon: typeof ShieldCheck; label: string; color: string; bg: string; border: string; glow?: string }> = {
  verified: {
    icon: ShieldCheck,
    label: 'Верифицирован',
    color: 'text-[#00f5ff]',
    bg: 'bg-[rgba(0,245,255,0.08)]',
    border: 'border-[rgba(0,245,255,0.2)]',
    glow: 'shadow-[0_0_8px_rgba(0,245,255,0.15)]',
  },
  pro: {
    icon: Crown,
    label: 'PRO',
    color: 'text-[#ffd700]',
    bg: 'bg-[rgba(255,215,0,0.08)]',
    border: 'border-[rgba(255,215,0,0.2)]',
    glow: 'shadow-[0_0_10px_rgba(255,215,0,0.15)]',
  },
  moderator: {
    icon: ShieldCheck,
    label: 'Модератор',
    color: 'text-[#8b5cf6]',
    bg: 'bg-[rgba(139,92,246,0.08)]',
    border: 'border-[rgba(139,92,246,0.2)]',
  },
  admin: {
    icon: Sparkles,
    label: 'Админ',
    color: 'text-[#f953c6]',
    bg: 'bg-[rgba(249,83,198,0.08)]',
    border: 'border-[rgba(249,83,198,0.2)]',
    glow: 'shadow-[0_0_10px_rgba(249,83,198,0.15)]',
  },
};

export default function VerifiedBadge({ level, size = 'md', showLabel = true }: Props) {
  const config = LEVEL_CONFIG[level];
  if (!config) return null;

  const Icon = config.icon;
  const sizes = {
    sm: { icon: 12, text: 'text-[10px]', px: 'px-1.5 py-0.5', gap: 'gap-0.5' },
    md: { icon: 14, text: 'text-xs', px: 'px-2 py-0.5', gap: 'gap-1' },
    lg: { icon: 16, text: 'text-sm', px: 'px-3 py-1', gap: 'gap-1.5' },
  };
  const s = sizes[size];

  return (
    <span className={`inline-flex items-center ${s.gap} ${s.px} rounded ${config.bg} ${config.color} border ${config.border} ${config.glow || ''} font-medium ${s.text} tracking-wider`}>
      <Icon size={s.icon} />
      {showLabel && config.label}
    </span>
  );
}

export function VerifiedCheck({ level }: { level: string }) {
  if (level === 'new') return null;
  const config = LEVEL_CONFIG[level];
  if (!config) return null;
  const Icon = config.icon;
  return <Icon size={14} className={config.color} />;
}

import { ShieldCheck, Crown, Sparkles } from 'lucide-react';

interface Props {
  level: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const LEVEL_CONFIG: Record<string, { icon: any; label: string; color: string; bg: string; border: string; glow?: string }> = {
  verified: {
    icon: ShieldCheck,
    label: 'Верифицирован',
    color: 'text-neon-cyan',
    bg: 'bg-neon-cyan/15',
    border: 'border-neon-cyan/30',
    glow: 'shadow-[0_0_8px_rgba(0,255,249,0.2)]',
  },
  pro: {
    icon: Crown,
    label: 'PRO',
    color: 'text-gold',
    bg: 'bg-gold/15',
    border: 'border-gold/30',
    glow: 'shadow-[0_0_10px_rgba(212,175,55,0.3)]',
  },
  moderator: {
    icon: ShieldCheck,
    label: 'Модератор',
    color: 'text-accent-violet',
    bg: 'bg-accent-violet/15',
    border: 'border-accent-violet/30',
  },
  admin: {
    icon: Sparkles,
    label: 'Админ',
    color: 'text-neon-rose',
    bg: 'bg-neon-rose/15',
    border: 'border-neon-rose/30',
    glow: 'shadow-[0_0_10px_rgba(255,0,110,0.2)]',
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
    <span className={`inline-flex items-center ${s.gap} ${s.px} rounded-full ${config.bg} ${config.color} border ${config.border} ${config.glow || ''} font-bold ${s.text}`}>
      <Icon size={s.icon} />
      {showLabel && config.label}
    </span>
  );
}

// Inline checkmark for card/list usage
export function VerifiedCheck({ level }: { level: string }) {
  if (level === 'new') return null;
  const config = LEVEL_CONFIG[level];
  if (!config) return null;
  const Icon = config.icon;
  return <Icon size={14} className={config.color} />;
}

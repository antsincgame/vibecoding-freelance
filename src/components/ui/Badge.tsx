import { ReactNode } from 'react';

type BadgeVariant = 'default' | 'green' | 'blue' | 'amber' | 'rose' | 'violet' | 'emerald';

interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-[rgba(255,255,255,0.06)] text-[rgba(255,255,255,0.6)] border-[rgba(255,255,255,0.1)]',
  green: 'bg-[rgba(0,255,136,0.08)] text-[#00ff88] border-[rgba(0,255,136,0.2)]',
  blue: 'bg-[rgba(0,245,255,0.08)] text-[#00f5ff] border-[rgba(0,245,255,0.2)]',
  amber: 'bg-[rgba(255,215,0,0.08)] text-[#ffd700] border-[rgba(255,215,0,0.2)]',
  rose: 'bg-[rgba(249,83,198,0.08)] text-[#f953c6] border-[rgba(249,83,198,0.2)]',
  violet: 'bg-[rgba(139,92,246,0.08)] text-[#8b5cf6] border-[rgba(139,92,246,0.2)]',
  emerald: 'bg-[rgba(0,255,136,0.08)] text-[#00ff88] border-[rgba(0,255,136,0.2)]',
};

export default function Badge({ variant = 'default', children, className = '', onClick }: BadgeProps) {
  return (
    <span onClick={onClick} className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded border ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  );
}

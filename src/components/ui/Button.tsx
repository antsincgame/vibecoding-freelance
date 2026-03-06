import { ButtonHTMLAttributes, forwardRef } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'destructive' | 'ghost' | 'neon-cyan' | 'neon-violet';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  glow?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: [
    'relative overflow-hidden btn-sacred btn-sacred-border',
    'bg-[#00f5ff] text-[#050510] font-bold',
    'tracking-widest uppercase',
    'hover:bg-[#40ffff]',
    'hover:shadow-[0_0_30px_rgba(0,245,255,0.6),0_0_60px_rgba(0,245,255,0.25),0_0_100px_rgba(139,92,246,0.15)]',
    'active:scale-[0.97]',
    'transition-all duration-300',
  ].join(' '),
  secondary: [
    'border border-[rgba(0,245,255,0.3)] text-[rgba(200,220,255,0.8)] bg-transparent',
    'hover:border-[rgba(0,245,255,0.7)] hover:text-white',
    'hover:shadow-[0_0_25px_rgba(0,245,255,0.2),inset_0_0_20px_rgba(0,245,255,0.05)]',
    'active:scale-[0.97]',
    'transition-all duration-300',
  ].join(' '),
  destructive: [
    'bg-rose-900/30 text-rose-400 font-medium border border-rose-800/40',
    'hover:bg-rose-900/50 hover:shadow-[0_0_20px_rgba(225,29,72,0.25)]',
    'active:scale-[0.97]',
    'transition-all duration-300',
  ].join(' '),
  ghost: [
    'text-[rgba(200,220,255,0.45)] hover:text-[rgba(200,220,255,0.85)]',
    'hover:bg-[rgba(0,245,255,0.06)]',
    'transition-all duration-300',
  ].join(' '),
  'neon-cyan': [
    'relative overflow-hidden btn-sacred btn-sacred-border',
    'border border-[rgba(0,245,255,0.5)] text-[#00f5ff] bg-transparent font-bold',
    'tracking-widest uppercase',
    'hover:bg-[rgba(0,245,255,0.08)]',
    'hover:border-[rgba(0,245,255,0.8)]',
    'hover:shadow-[0_0_25px_rgba(0,245,255,0.4),0_0_60px_rgba(0,245,255,0.15),inset_0_0_25px_rgba(0,245,255,0.06)]',
    'active:scale-[0.97]',
    'transition-all duration-300',
  ].join(' '),
  'neon-violet': [
    'relative overflow-hidden btn-sacred btn-sacred-border',
    'border border-[rgba(139,92,246,0.5)] text-[#8b5cf6] bg-transparent font-bold',
    'tracking-widest uppercase',
    'hover:bg-[rgba(139,92,246,0.08)]',
    'hover:border-[rgba(139,92,246,0.8)]',
    'hover:shadow-[0_0_25px_rgba(139,92,246,0.4),0_0_60px_rgba(139,92,246,0.15),inset_0_0_25px_rgba(139,92,246,0.06)]',
    'active:scale-[0.97]',
    'transition-all duration-300',
  ].join(' '),
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-4 py-2.5 text-sm rounded',
  md: 'px-5 py-3.5 text-base rounded',
  lg: 'px-8 py-4 text-base rounded',
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className = '', children, ...props }, ref) => (
    <button
      ref={ref}
      className={`inline-flex items-center justify-center gap-2 font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
);

Button.displayName = 'Button';
export default Button;
